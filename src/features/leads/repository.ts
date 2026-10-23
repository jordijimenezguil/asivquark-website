import "server-only";
import { getPrisma } from "@/lib/prisma";
import { consumeLimits } from "./rate-limit";
import { isPrismaCode, LeadHttpError } from "./security";
import type { PrismaClient } from "@/generated/prisma/client";
import type { LeadRequest } from "./schema";
export type CreateLeadCommand = {
  input: LeadRequest;
  idempotencyKey: string;
  requestHash: string;
  clientKey: string;
  secret: string;
  noticeVersion: string;
  notificationRecipient: string | null;
};
export async function createLead(
  command: CreateLeadCommand,
  db: PrismaClient = getPrisma(),
): Promise<{ id: string; created: boolean }> {
  const previous = await db.lead.findUnique({
    where: { idempotencyKey: command.idempotencyKey },
    select: { id: true, requestHash: true },
  });
  if (previous) {
    if (previous.requestHash !== command.requestHash)
      throw new LeadHttpError(409, "IDEMPOTENCY_CONFLICT");
    return { id: previous.id, created: false };
  }
  try {
    const lead = await db.$transaction(
      async (tx) => {
        await consumeLimits(tx, command.secret, [
          { scope: "lead-ip", value: command.clientKey, max: 5, seconds: 900 },
          {
            scope: "lead-email",
            value: command.input.email.toLowerCase(),
            max: 3,
            seconds: 3600,
          },
          { scope: "lead-global", value: "all", max: 100, seconds: 3600 },
        ]);
        const now = new Date();
        const { input } = command;
        return tx.lead.create({
          data: {
            idempotencyKey: command.idempotencyKey,
            requestHash: command.requestHash,
            name: input.name,
            email: input.email,
            company: input.company ?? null,
            phone: input.phone ?? null,
            service: input.projectType,
            budget: input.budget ?? null,
            message: input.description,
            status: "NEW",
            source: "contact_form",
            ...input.attribution,
            privacyNoticeVersion: command.noticeVersion,
            privacyAcknowledgedAt: now,
            events: {
              create: [
                { type: "LEAD_CREATED" },
                { type: "NOTIFICATION_QUEUED" },
              ],
            },
            emails: {
              create: [
                {
                  type: "NOTIFICATION",
                  recipient: command.notificationRecipient,
                },
                { type: "CONFIRMATION", recipient: input.email },
              ],
            },
          },
          select: { id: true },
        });
      },
      { timeout: 10000 },
    );
    return { id: lead.id, created: true };
  } catch (error) {
    if (!isPrismaCode(error, "P2002")) throw error;
    // The unique constraint arbitrates simultaneous submissions across instances.
    const existing = await db.lead.findUnique({
      where: { idempotencyKey: command.idempotencyKey },
      select: { id: true, requestHash: true },
    });
    if (!existing || existing.requestHash !== command.requestHash)
      throw new LeadHttpError(409, "IDEMPOTENCY_CONFLICT");
    return { id: existing.id, created: false };
  }
}
