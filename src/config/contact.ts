import "server-only";
import { z } from "zod";
import { legalDocuments, legalEntity } from "@/config/legal";
import { site } from "@/config/site";

export function getContactConfig(
  environment: Record<string, string | undefined> = process.env,
  mode: string = site.mode,
) {
  const privacy = legalDocuments.find(document => document.id === "privacy");
  if (!privacy) throw new Error("Falta el documento de privacidad en la configuración legal.");
  const testMode = mode === "development";
  const enabled =
    testMode ||
    (environment.VERCEL === "1" &&
      Boolean(environment.DATABASE_URL) &&
      (environment.LEADS_SECURITY_SECRET?.length ?? 0) >= 32);
  return {
    enabled,
    testMode,
    noticeUrl: `${legalEntity.website}${privacy.path}`,
    noticeVersion: privacy.version,
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
export function getLeadEmailConfig(
  environment: Record<string, string | undefined> = process.env,
) {
  const key = z
    .string()
    .startsWith("re_")
    .min(6)
    .safeParse(environment.RESEND_API_KEY);
  const from = z.email().max(254).safeParse(environment.RESEND_FROM_EMAIL);
  const recipient = z
    .email()
    .max(254)
    .safeParse(environment.LEADS_NOTIFICATION_EMAIL);
  return {
    enabled: key.success && from.success,
    key: key.success ? key.data : null,
    from: from.success ? from.data : null,
    recipient: recipient.success ? recipient.data : null,
  };
}
