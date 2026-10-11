import "server-only";
import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { site } from "@/config/site";
import { getPrisma } from "@/lib/prisma";
import { authSecret } from "@/lib/validations/server-env";

function createAuth() {
  const secret = authSecret();
  return betterAuth({
    appName: site.name,
    baseURL: site.authOrigin,
    secret,
    trustedOrigins: [site.authOrigin],
    database: prismaAdapter(getPrisma(), {
      provider: "postgresql",
      transaction: false,
    }),
    emailAndPassword: { enabled: true, disableSignUp: true },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false,
        },
      },
    },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
    advanced: {
      useSecureCookies: new URL(site.authOrigin).protocol === "https:",
    },
  });
}
let auth: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  return (auth ??= createAuth());
}
export function isAuthConfigured() {
  return Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET);
}
