import "server-only";
import { z } from "zod";
import { site } from "@/config/site";

export function getContactConfig(
  environment: Record<string, string | undefined> = process.env,
  mode: string = site.mode,
) {
  const noticeUrl = z
    .url()
    .max(300)
    .safeParse(environment.LEADS_PRIVACY_NOTICE_URL);
  const noticeVersion = z
    .string()
    .trim()
    .min(1)
    .max(100)
    .safeParse(environment.LEADS_PRIVACY_NOTICE_VERSION);
  const legalReady =
    noticeUrl.success &&
    new URL(noticeUrl.data).protocol === "https:" &&
    !new URL(noticeUrl.data).username &&
    !new URL(noticeUrl.data).password &&
    noticeVersion.success;
  const testMode = mode === "development";
  const retention = z.coerce
    .number()
    .int()
    .min(1)
    .max(730)
    .safeParse(environment.LEADS_RETENTION_DAYS || (testMode ? 90 : undefined));
  const enabled =
    testMode ||
    (environment.LEADS_ENABLED === "true" &&
      legalReady &&
      retention.success &&
      environment.VERCEL === "1" &&
      Boolean(environment.DATABASE_URL) &&
      (environment.LEADS_SECURITY_SECRET?.length ?? 0) >= 32);
  return {
    enabled,
    testMode,
    noticeUrl: legalReady ? noticeUrl.data : null,
    noticeVersion: legalReady
      ? noticeVersion.data
      : testMode
        ? "development-test-only"
        : null,
    retentionDays: retention.success ? retention.data : null,
  };
}
export type PublicContactConfig = Pick<
  ReturnType<typeof getContactConfig>,
  "enabled" | "testMode" | "noticeUrl"
>;

export function getLeadRuntimeConfig() {
  const contact = getContactConfig();
  const secret = z
    .string()
    .min(32)
    .safeParse(process.env.LEADS_SECURITY_SECRET);
  if (
    !contact.enabled ||
    !contact.retentionDays ||
    !contact.noticeVersion ||
    !process.env.DATABASE_URL ||
    !secret.success
  )
    return null;
  return {
    ...contact,
    retentionDays: contact.retentionDays,
    noticeVersion: contact.noticeVersion,
    secret: secret.data,
  };
}
export function getLeadEmailConfig() {
  const key = z
    .string()
    .startsWith("re_")
    .min(6)
    .safeParse(process.env.RESEND_API_KEY);
  const from = z.email().max(254).safeParse(process.env.RESEND_FROM_EMAIL);
  const recipient = z
    .email()
    .max(254)
    .safeParse(process.env.LEADS_NOTIFICATION_EMAIL);
  return {
    enabled:
      process.env.LEADS_EMAIL_ENABLED === "true" && key.success && from.success,
    key: key.success ? key.data : null,
    from: from.success ? from.data : null,
    recipient: recipient.success ? recipient.data : null,
  };
}
