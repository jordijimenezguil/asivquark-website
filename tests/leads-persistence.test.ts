import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import type { Prisma, PrismaClient } from "../src/generated/prisma/client";
import {
  createLead,
  type CreateLeadCommand,
} from "../src/features/leads/repository";
import { consumeLimits } from "../src/features/leads/rate-limit";
import { leadRequestSchema } from "../src/features/leads/schema";
import { LeadHttpError } from "../src/features/leads/security";
const command: CreateLeadCommand = {
  input: leadRequestSchema.parse({
    name: "Prueba",
    email: "test@example.com",
    projectType: "mvp",
    description: "Una aplicación para validar una idea de prueba.",
    privacy: true,
    attribution: { landingPath: "/desarrollo-mvp/", utmSource: "test" },
  }),
  idempotencyKey: randomUUID(),
  requestHash: "a".repeat(64),
  clientKey: "test-client",
  secret: "s".repeat(32),
  noticeVersion: "test",
  retentionDays: 90,
  notificationRecipient: null,
};
test("lead, creation events and two outbox rows are created in the same transaction", async () => {
  let inside = false;
  let creations = 0;
  const tx = {
    $queryRaw: async () => [{ count: 1 }],
    lead: {
      create: async ({ data }: { data: Prisma.LeadCreateInput }) => {
        assert.ok(inside);
        creations++;
        assert.equal(data.status, "NEW");
        assert.equal(data.company, null);
        assert.equal(data.phone, null);
        assert.equal(data.landingPath, "/desarrollo-mvp/");
        assert.equal(data.utmSource, "test");
        assert.ok(data.privacyAcknowledgedAt instanceof Date);
        assert.ok(data.expiresAt instanceof Date);
        assert.deepEqual(data.events, {
          create: [{ type: "LEAD_CREATED" }, { type: "NOTIFICATION_QUEUED" }],
        });
        assert.deepEqual(data.emails, {
          create: [
            { type: "NOTIFICATION", recipient: null },
            { type: "CONFIRMATION", recipient: "test@example.com" },
          ],
        });
        return { id: "persisted-id" };
      },
    },
  };
  const db = {
    lead: { findUnique: async () => null },
    $transaction: async (fn: (transaction: typeof tx) => Promise<unknown>) => {
      inside = true;
      try {
        return await fn(tx);
      } finally {
        inside = false;
      }
    },
  } as unknown as PrismaClient;
  assert.deepEqual(await createLead(command, db), {
    id: "persisted-id",
    created: true,
  });
  assert.equal(creations, 1);
});
test("same key and hash returns existing lead without another transaction or email queue", async () => {
  const db = {
    lead: {
      findUnique: async () => ({
        id: "existing",
        requestHash: command.requestHash,
      }),
    },
    $transaction: async () => assert.fail("Duplicate must not write"),
  } as unknown as PrismaClient;
  assert.deepEqual(await createLead(command, db), {
    id: "existing",
    created: false,
  });
  await assert.rejects(
    createLead({ ...command, requestHash: "b".repeat(64) }, db),
    (error: unknown) => error instanceof LeadHttpError && error.status === 409,
  );
});
test("concurrent unique-constraint collision resolves to committed existing lead", async () => {
  let lookups = 0;
  const db = {
    lead: {
      findUnique: async () =>
        ++lookups === 1
          ? null
          : { id: "winner", requestHash: command.requestHash },
    },
    $transaction: async () => {
      throw { code: "P2002" };
    },
  } as unknown as PrismaClient;
  assert.deepEqual(await createLead(command, db), {
    id: "winner",
    created: false,
  });
  assert.equal(lookups, 2);
});
test("transaction failures propagate and never return a persisted result", async () => {
  const db = {
    lead: { findUnique: async () => null },
    $transaction: async () => {
      throw new Error("DB unavailable");
    },
  } as unknown as PrismaClient;
  await assert.rejects(createLead(command, db), /DB unavailable/);
});
test("PostgreSQL limiter uses a parameterized upsert, temporal hash and fails on quota", async () => {
  const seen: unknown[] = [];
  const tx = {
    $queryRaw: async (strings: TemplateStringsArray, ...values: unknown[]) => {
      assert.ok(strings.join("?").includes("ON CONFLICT"));
      seen.push(...values);
      return [{ count: 6 }];
    },
  } as unknown as Prisma.TransactionClient;
  await assert.rejects(
    consumeLimits(tx, command.secret, [
      { scope: "test", value: "private-IP", max: 5, seconds: 900 },
    ]),
    (error: unknown) => error instanceof LeadHttpError && error.status === 429,
  );
  assert.ok(!seen.includes("private-IP"));
  assert.match(String(seen[0]), /^[a-f0-9]{64}$/);
});
