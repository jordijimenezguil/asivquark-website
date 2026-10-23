import "server-only";
import { z } from "zod";
import { legalDocuments, legalEntity } from "@/config/legal";
import { site } from "@/config/site";

export function getContactConfig(
  environment: Record<string, string | undefined> = process.env,
  mode: string = site.mode,
) {
  const privacy = legalDocuments.find(document => document.id === "privacy");
  const noticeUrl = z
    .url()
    .max(300)
    .safeParse(environment.LEADS_PRIVACY_NOTICE_URL?.trim() || `${legalEntity.website}/politica-privacidad/`);
  const noticeVersion = z
    .string()
    .trim()
    .min(1)
    .max(100)
    .safeParse(environment.LEADS_PRIVACY_NOTICE_VERSION?.trim() || privacy?.version);
  const noticeConfigured =
    noticeUrl.success &&
    new URL(noticeUrl.data).protocol === "https:" &&
    !new URL(noticeUrl.data).username &&
    !new URL(noticeUrl.data).password &&
    noticeVersion.success &&
    noticeUrl.data === `${legalEntity.website}/politica-privacidad/` &&
    noticeVersion.data === privacy?.version;
  const testMode = mode === "development";
  const enabled =
    testMode ||
    (noticeConfigured &&
      environment.VERCEL === "1" &&
      Boolean(environment.DATABASE_URL) &&
      (environment.LEADS_SECURITY_SECRET?.length ?? 0) >= 32);
  return {
    enabled,
    testMode,
    noticeUrl: noticeConfigured ? noticeUrl.data : null,
    noticeVersion: noticeConfigured
      ? noticeVersion.data
      : testMode
        ? "development-test-only"
        : null,
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
    !contact.noticeVersion ||
    !process.env.DATABASE_URL ||
    !secret.success
  )
    return null;
  return {
    ...contact,
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
