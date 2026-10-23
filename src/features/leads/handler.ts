import "server-only";
import { randomUUID, createHash } from "node:crypto";
import { z } from "zod";
import {
  leadRequestSchema,
  type LeadResponse,
  type FieldErrors,
} from "./schema";
import { sanitizeAttribution, safeReferrer } from "./attribution";
import {
  assertRequestOrigin,
  LeadHttpError,
  readLimitedJson,
  trustedClientKey,
} from "./security";
import type { CreateLeadCommand } from "./repository";
import type { getLeadRuntimeConfig } from "@/config/contact";
import { leadLog } from "./log";
export type LeadHandlerDependencies = {
  origin: string;
  vercel: boolean;
  production: boolean;
  config: ReturnType<typeof getLeadRuntimeConfig>;
  notificationRecipient: string | null;
  rateLimit: (clientKey: string, secret: string) => Promise<unknown>;
  create: (
    command: CreateLeadCommand,
  ) => Promise<{ id: string; created: boolean }>;
  schedule: (leadId: string) => void;
};
function respond(data: LeadResponse, status: number, retryAfter?: number) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
    },
  });
}
export async function handleLead(
  request: Request,
  deps: LeadHandlerDependencies,
) {
  const requestId = randomUUID();
  leadLog("lead.received", requestId);
  try {
    assertRequestOrigin(request, deps.origin);
    const key = z.uuid().safeParse(request.headers.get("idempotency-key"));
    if (!key.success) throw new LeadHttpError(400, "INVALID_IDEMPOTENCY_KEY");
    const config = deps.config;
    if (!config) throw new LeadHttpError(503, "CAPTURE_NOT_CONFIGURED");
    const clientKey = trustedClientKey(request, deps.vercel, deps.production);
    // Admission counters are shared across instances and include invalid submissions.
    await deps.rateLimit(clientKey, config.secret);
    const parsed = leadRequestSchema.safeParse(await readLimitedJson(request));
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (
          [
            "name",
            "email",
            "company",
            "phone",
            "projectType",
            "budget",
            "description",
            "privacy",
          ].includes(String(field))
        )
          fieldErrors[field] ??= issue.message;
      }
      leadLog("lead.validation_failed", requestId);
      return respond(
        {
          success: false,
          message: "Revisa los campos de la solicitud.",
          fieldErrors,
        },
        422,
      );
    }
    if (parsed.data.website?.trim())
      throw new LeadHttpError(422, "SPAM_REJECTED");
    const input = {
      ...parsed.data,
      attribution: sanitizeAttribution(parsed.data.attribution),
    };
    // Hash only normalized client data. Server-derived Referer/notice may vary on retry.
    const requestHash = createHash("sha256")
      .update(JSON.stringify(input))
      .digest("hex");
    if (!input.attribution.referrer)
      input.attribution.referrer = safeReferrer(request.headers.get("referer"));
    const result = await deps.create({
      input,
      idempotencyKey: key.data,
      requestHash,
      clientKey,
      secret: config.secret,
      noticeVersion: config.noticeVersion,
      notificationRecipient: deps.notificationRecipient,
    });
    if (result.created) leadLog("lead.created", result.id);
    // Scheduling errors must never undo an already committed lead.
    try {
      deps.schedule(result.id);
    } catch {
      leadLog("lead.notification_failed", result.id, "SCHEDULE_FAILED");
    }
    return respond(
      { success: true, message: "Hemos recibido tu solicitud correctamente." },
      201,
    );
  } catch (error) {
    if (error instanceof LeadHttpError) {
      leadLog(
        error.status === 429 ? "lead.rate_limited" : "lead.unavailable",
        requestId,
        error.code,
      );
      return respond(
        {
          success: false,
          message:
            error.status === 429
              ? "Has realizado demasiados intentos. Inténtalo más tarde."
              : error.status === 409
                ? "Esta solicitud ha cambiado. Vuelve a enviarla con los datos actuales."
                : error.status === 422
                  ? "No hemos podido validar la solicitud."
                  : error.status === 403
                    ? "No se permite esta solicitud desde ese origen."
                    : error.status === 413
                      ? "La solicitud supera el tamaño permitido."
                      : error.status === 400 || error.status === 415
                        ? "El formato de la solicitud no es válido."
                        : "El envío no está disponible en este momento. Inténtalo de nuevo más tarde.",
        },
        error.status,
        error.retryAfter,
      );
    }
    leadLog("lead.unavailable", requestId, "PERSISTENCE_FAILED");
    return respond(
      {
        success: false,
        message:
          "No hemos podido procesar tu solicitud. Inténtalo de nuevo más tarde.",
      },
      503,
    );
  }
}
