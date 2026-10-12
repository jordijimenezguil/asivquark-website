import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import type {
  PrismaClient,
  Lead,
  Prisma,
} from "../src/generated/prisma/client";
import { newLeadEmail, leadConfirmationEmail } from "../src/emails/lead-emails";
import {
  processLeadOutbox,
  type OutboxEmail,
} from "../src/features/leads/outbox";
import {
  deliveryDecision,
  nextDeliveryAttempt,
  providerFailure,
} from "../src/features/leads/delivery";
const lead = {
  id: randomUUID(),
  name: 'Nombre <img src=x onerror="alert(1)">',
  email: "test@example.com",
  company: null,
  phone: null,
  service: "web",
  budget: null,
  message: "Mensaje <script>alert(1)</script>\nSegunda línea",
  createdAt: new Date("2026-10-12T08:00:00Z"),
  landingPath: "/servicios/diseno-web-barcelona/",
  originPath: null,
  referrer: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  utmContent: null,
  utmTerm: null,
} as Lead;
test("email templates escape user content, preserve newlines and offer plain text", () => {
  const email = newLeadEmail(lead);
  assert.ok(email.html.includes("&lt;script&gt;"));
  assert.ok(!email.html.includes("<script>"));
  assert.ok(email.text.includes("\nSegunda línea"));
  assert.equal(email.replyTo, "test@example.com");
  assert.equal(email.subject, "Nuevo lead ASIVQUARK — Página web");
  const confirmation = leadConfirmationEmail(lead);
  assert.ok(!confirmation.html.includes("<img"));
  assert.ok(
    confirmation.text.includes("Hemos recibido correctamente tu solicitud"),
  );
  assert.ok(!confirmation.text.includes("24 horas"));
});
test("ambiguous attempts stop before provider idempotency expires", () => {
  const now = new Date();
  assert.equal(
    deliveryDecision(
      { firstAttemptAt: new Date(now.getTime() - 21 * 3600000), attempts: 1 },
      now,
    ),
    "EXPIRED_IDEMPOTENCY_WINDOW",
  );
  assert.equal(
    deliveryDecision({ firstAttemptAt: null, attempts: 5 }, now),
    "ATTEMPTS_EXHAUSTED",
  );
  assert.equal(nextDeliveryAttempt(3, now).getTime() - now.getTime(), 240000);
  assert.equal(providerFailure("rate_limit_exceeded", 429).retryable, true);
  assert.equal(providerFailure("validation_error", 422).retryable, false);
});
function outboxDb() {
  let row = {
    id: randomUUID(),
    leadId: lead.id,
    type: "NOTIFICATION",
    status: "PENDING",
    recipient: "internal@example.com",
    sender: null,
    attempts: 0,
    firstAttemptAt: null,
    nextAttemptAt: new Date(0),
    lockedUntil: null,
    lockToken: null,
    lastErrorCode: null,
    lead,
  } as OutboxEmail;
  const events: Prisma.LeadEventCreateInput[] = [];
  const dbObject = {
    emailOutbox: {
      findMany: async () =>
        row.status === "SENT" ||
        row.status === "FAILED" ||
        row.nextAttemptAt > new Date()
          ? []
          : [{ id: row.id }],
      updateMany: async ({
        where,
        data,
      }: {
        where: { lockToken?: string };
        data: Partial<Omit<OutboxEmail, "attempts">> & {
          attempts?: { increment: number };
        };
      }) => {
        if (
          data.status === "SENDING" &&
          row.status === "SENDING" &&
          row.lockedUntil &&
          row.lockedUntil > new Date()
        )
          return { count: 0 };
        if (where.lockToken && where.lockToken !== row.lockToken)
          return { count: 0 };
        row = {
          ...row,
          ...data,
          attempts: row.attempts + (data.attempts?.increment ?? 0),
        };
        return { count: 1 };
      },
      findUniqueOrThrow: async () => ({ ...row }),
      update: async ({
        data,
      }: {
        data: Partial<Omit<OutboxEmail, "attempts">> & {
          attempts: { increment: number };
        };
      }) => {
        row = {
          ...row,
          ...data,
          attempts: row.attempts + data.attempts.increment,
        };
        return { ...row };
      },
    },
    leadEvent: {
      create: async ({ data }: { data: Prisma.LeadEventCreateInput }) => {
        events.push(data);
      },
    },
    $transaction: async (fn: (tx: unknown) => Promise<unknown>) => fn(dbObject),
  };
  return {
    db: dbObject as unknown as PrismaClient,
    events,
    get: () => row,
    due: () => {
      row.nextAttemptAt = new Date(0);
    },
  };
}
const config = {
  enabled: true,
  key: "re_test_not_real",
  from: "sender@example.com",
  recipient: "internal@example.com",
};
test("provider failure preserves pending email and retries with the exact same idempotency key", async () => {
  const fixture = outboxDb();
  const keys: string[] = [];
  let sends = 0;
  const send = async (_row: OutboxEmail, key: string) => {
    keys.push(key);
    sends++;
    return sends === 1
      ? { code: "PROVIDER_TEMPORARY", retryable: true }
      : { id: "provider-test-id" };
  };
  await processLeadOutbox({ db: fixture.db, config, send });
  assert.equal(fixture.get().status, "PENDING");
  assert.equal(fixture.events[0].type, "NOTIFICATION_FAILED");
  fixture.due();
  await processLeadOutbox({ db: fixture.db, config, send });
  assert.equal(fixture.get().status, "SENT");
  assert.equal(keys[0], keys[1]);
  assert.equal(fixture.get().attempts, 2);
  await processLeadOutbox({ db: fixture.db, config, send });
  assert.equal(sends, 2);
  assert.equal(fixture.events[1].type, "NOTIFICATION_SENT");
});
test("unconfigured email stays pending without making provider calls", async () => {
  const fixture = outboxDb();
  await processLeadOutbox({
    db: fixture.db,
    config: { ...config, enabled: false },
    send: async () => assert.fail("Must not send"),
  });
  assert.equal(fixture.get().status, "PENDING");
  assert.equal(fixture.get().attempts, 0);
  assert.equal(fixture.get().lastErrorCode, "EMAIL_NOT_CONFIGURED");
});
test("unexpected provider exceptions become recoverable failures", async () => {
  const fixture = outboxDb();
  await processLeadOutbox({
    db: fixture.db,
    config,
    send: async () => {
      throw new Error("Private provider error");
    },
  });
  assert.equal(fixture.get().status, "PENDING");
  assert.equal(fixture.get().lastErrorCode, "PROVIDER_AMBIGUOUS");
});

test("parallel processors cannot both claim the same pending notification", async () => {
  const fixture = outboxDb();
  let sends = 0;
  const send = async () => {
    sends++;
    return { id: "one-provider-id" };
  };
  await Promise.all([
    processLeadOutbox({ db: fixture.db, config, send }),
    processLeadOutbox({ db: fixture.db, config, send }),
  ]);
  assert.equal(sends, 1);
  assert.equal(fixture.get().status, "SENT");
});
