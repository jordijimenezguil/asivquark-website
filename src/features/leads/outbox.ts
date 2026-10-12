import "server-only";
import { randomUUID } from "node:crypto";
import { Resend } from "resend";
import { getPrisma } from "@/lib/prisma";
import { getLeadEmailConfig } from "@/config/contact";
import { leadConfirmationEmail, newLeadEmail } from "@/emails/lead-emails";
import {
  deliveryDecision,
  nextDeliveryAttempt,
  providerFailure,
  type DeliveryError,
} from "./delivery";
import { leadLog } from "./log";
import type {
  PrismaClient,
  Lead,
  EmailOutbox,
} from "@/generated/prisma/client";
export type OutboxEmail = EmailOutbox & { lead: Lead };
export type EmailSender = (
  row: OutboxEmail,
  key: string,
) => Promise<{ id: string } | DeliveryError>;
export const sendOutboxEmail: EmailSender = async (row, key) => {
  const config = getLeadEmailConfig();
  if (!config.enabled || !config.key || !row.sender || !row.recipient)
    return { code: "EMAIL_NOT_CONFIGURED", retryable: true };
  const content =
    row.type === "NOTIFICATION"
      ? newLeadEmail(row.lead)
      : leadConfirmationEmail(row.lead);
  try {
    const response = await new Resend(config.key).emails.send(
      { from: row.sender, to: row.recipient, ...content },
      { idempotencyKey: key, signal: AbortSignal.timeout(10000) },
    );
    if (response.error)
      return providerFailure(
        response.error.name,
        response.error.statusCode ?? undefined,
      );
    return response.data?.id
      ? { id: response.data.id }
      : { code: "PROVIDER_AMBIGUOUS", retryable: true };
  } catch {
    return { code: "PROVIDER_AMBIGUOUS", retryable: true };
  }
};
export async function processLeadOutbox({
  leadId,
  limit = 10,
  send = sendOutboxEmail,
  db = getPrisma(),
  config = getLeadEmailConfig(),
}: {
  leadId?: string;
  limit?: number;
  send?: EmailSender;
  db?: PrismaClient;
  config?: ReturnType<typeof getLeadEmailConfig>;
} = {}) {
  const now = new Date();
  const candidates = await db.emailOutbox.findMany({
    where: {
      ...(leadId ? { leadId } : {}),
      lead: { expiresAt: { gt: now } },
      OR: [
        { status: "PENDING", nextAttemptAt: { lte: now } },
        { status: "SENDING", lockedUntil: { lte: now } },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: Math.min(20, Math.max(1, limit)),
    select: { id: true },
  });
  let processed = 0;
  for (const candidate of candidates) {
    const lockToken = randomUUID();
    const claimTime = new Date();
    const claimed = await db.emailOutbox.updateMany({
      where: {
        id: candidate.id,
        OR: [
          { status: "PENDING", nextAttemptAt: { lte: claimTime } },
          { status: "SENDING", lockedUntil: { lte: claimTime } },
        ],
      },
      data: {
        status: "SENDING",
        lockToken,
        lockedUntil: new Date(claimTime.getTime() + 120000),
      },
    });
    if (claimed.count !== 1) continue;
    let row = await db.emailOutbox.findUniqueOrThrow({
      where: { id: candidate.id },
      include: { lead: true },
    });
    const terminal = deliveryDecision(row, claimTime);
    if (terminal) {
      await complete(db, row, lockToken, { code: terminal, retryable: false });
      processed++;
      continue;
    }
    const recipient =
      row.recipient ??
      (row.type === "NOTIFICATION" ? config.recipient : row.lead.email);
    if (!config.enabled || !config.from || !recipient) {
      await db.emailOutbox.updateMany({
        where: { id: row.id, lockToken },
        data: {
          status: "PENDING",
          lockToken: null,
          lockedUntil: null,
          lastErrorCode: "EMAIL_NOT_CONFIGURED",
          nextAttemptAt: new Date(claimTime.getTime() + 3600000),
        },
      });
      continue;
    }
    // Freeze addressing on the first attempt so provider retries use identical payloads.
    const prepared = await db.emailOutbox.updateMany({
      where: { id: row.id, lockToken, lockedUntil: { gt: new Date() } },
      data: {
        recipient,
        sender: row.sender ?? config.from,
        firstAttemptAt: row.firstAttemptAt ?? claimTime,
        attempts: { increment: 1 },
      },
    });
    if (prepared.count !== 1) continue;
    row = await db.emailOutbox.findUniqueOrThrow({
      where: { id: row.id },
      include: { lead: true },
    });
    let result: { id: string } | DeliveryError;
    try {
      result = await send(row, `asivquark/lead-email/${row.id}`);
    } catch {
      result = { code: "PROVIDER_AMBIGUOUS", retryable: true };
    }
    await complete(db, row, lockToken, result);
    processed++;
  }
  return { processed, examined: candidates.length };
}
async function complete(
  db: PrismaClient,
  row: OutboxEmail,
  lockToken: string,
  result: { id: string } | DeliveryError,
) {
  const now = new Date();
  const success = "id" in result;
  await db.$transaction(async (tx) => {
    const changed = await tx.emailOutbox.updateMany({
      where: { id: row.id, lockToken },
      data: success
        ? {
            status: "SENT",
            sentAt: now,
            providerId: result.id,
            lastErrorCode: null,
            lockedUntil: null,
            lockToken: null,
          }
        : {
            status: result.retryable && row.attempts < 5 ? "PENDING" : "FAILED",
            lastErrorCode: result.code,
            nextAttemptAt: nextDeliveryAttempt(row.attempts, now),
            lockedUntil: null,
            lockToken: null,
          },
    });
    if (!changed.count) return;
    await tx.leadEvent.create({
      data: {
        leadId: row.leadId,
        type:
          row.type === "NOTIFICATION"
            ? success
              ? "NOTIFICATION_SENT"
              : "NOTIFICATION_FAILED"
            : success
              ? "CONFIRMATION_SENT"
              : "CONFIRMATION_FAILED",
        metadata: success
          ? { outboxId: row.id }
          : { outboxId: row.id, code: result.code },
      },
    });
  });
  leadLog(
    success ? "lead.notification_sent" : "lead.notification_failed",
    row.leadId,
    success ? undefined : result.code,
  );
}
