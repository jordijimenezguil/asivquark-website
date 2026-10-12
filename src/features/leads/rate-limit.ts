import "server-only";
import { getPrisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { hashValue, LeadHttpError } from "./security";
type Limit = { scope: string; value: string; max: number; seconds: number };
export async function consumeLimits(
  tx: Prisma.TransactionClient,
  secret: string,
  limits: Limit[],
  now = new Date(),
) {
  for (const limit of limits) {
    const window = Math.floor(now.getTime() / (limit.seconds * 1000));
    const expiry = new Date((window + 1) * limit.seconds * 1000);
    const key = hashValue(secret, `${limit.scope}:${window}:${limit.value}`);
    const rows = await tx.$queryRaw<{ count: number }[]>`
   INSERT INTO "lead_rate_bucket" ("key", "count", "expiresAt") VALUES (${key}, 1, ${expiry})
   ON CONFLICT ("key") DO UPDATE SET "count" = LEAST("lead_rate_bucket"."count" + 1, 1000000)
   RETURNING "count"`;
    if (rows[0].count > limit.max)
      throw new LeadHttpError(
        429,
        "RATE_LIMITED",
        Math.max(1, Math.ceil((expiry.getTime() - now.getTime()) / 1000)),
      );
  }
}
export function admissionLimit(client: string, secret: string) {
  return getPrisma().$transaction((tx) =>
    consumeLimits(tx, secret, [
      { scope: "request-ip", value: client, max: 30, seconds: 300 },
      { scope: "request-global", value: "all", max: 300, seconds: 300 },
    ]),
  );
}
