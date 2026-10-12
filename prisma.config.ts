import nextEnv from "@next/env";
import { defineConfig } from "prisma/config";

// Same .env.local precedence as Next.js; no dotenv dependency or fake URL.
nextEnv.loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Neon supports migrations over pooled connections. A separate direct URL
  // remains an optional override; generate/validate also work without a URL.
  datasource: { url: process.env.DIRECT_URL || process.env.DATABASE_URL || "" },
});
