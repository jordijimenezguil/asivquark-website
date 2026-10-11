import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";
import { databaseUrl } from "@/lib/validations/server-env";

const globalForPrisma = globalThis as typeof globalThis & {
  asivquarkPrisma?: PrismaClient;
};
let client: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  if (client) return client;
  if (
    process.env.NODE_ENV !== "production" &&
    globalForPrisma.asivquarkPrisma
  ) {
    return (client = globalForPrisma.asivquarkPrisma);
  }
  const adapter = new PrismaNeon({ connectionString: databaseUrl() });
  client = new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.asivquarkPrisma = client;
  }
  return client;
}
