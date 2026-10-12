import "server-only";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { site } from "@/config/site";
import { getPrisma } from "@/lib/prisma";
import { authSecret } from "@/lib/validations/server-env";
export function createAuthForDatabase(database: BetterAuthOptions["database"], secret: string) {
    return betterAuth({
        appName: site.name,
        logger: { disabled: true },
        baseURL: site.authOrigin,
        secret,
        trustedOrigins: [site.authOrigin],
        database,
        emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12, maxPasswordLength: 128 },
        rateLimit: { enabled: true, storage: "database", window: 60, max: 60, customRules: { "/sign-in/email": { window: 300, max: 5 } } },
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
            ipAddress: { ipAddressHeaders: process.env.VERCEL === "1" ? ["x-vercel-forwarded-for"] : ["x-asivquark-client-ip"] },
            defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
            useSecureCookies: new URL(site.authOrigin).protocol === "https:",
        },
    });
}
function createAuth() {
    return createAuthForDatabase(prismaAdapter(getPrisma(), { provider: "postgresql", transaction: false }), authSecret());
}
let auth: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
    return (auth ??= createAuth());
}
export function isAuthConfigured() {
    return Boolean(process.env.DATABASE_URL && process.env.BETTER_AUTH_SECRET);
}
