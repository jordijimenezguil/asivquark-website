import nextEnv from "@next/env";
import { defineConfig } from "prisma/config";

// Same .env.local precedence as Next.js; no dotenv dependency or fake URL.
nextEnv.loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Empty is intentional: generate/validate work offline, database commands
  // fail until a real direct Neon URL is explicitly configured.
  datasource: { url: process.env.DIRECT_URL || "" },
});
