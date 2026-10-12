import { z } from "zod";
import { COOKIE_CONSENT_MAX_AGE, COOKIE_CONSENT_NAME, COOKIE_CONSENT_VERSION, optionalCategories, type OptionalCategory } from "../../config/cookies";
export const consentSchema = z.object({ necessary: z.literal(true), analytics: z.boolean(), functional: z.boolean(), marketing: z.boolean(), status: z.enum(["accepted", "rejected", "custom"]), version: z.string().max(32), updatedAt: z.iso.datetime() }).strict();
export type CookieConsent = z.infer<typeof consentSchema>;
export type Preferences = Pick<CookieConsent, OptionalCategory>;
export const denied: Preferences = { analytics: false, functional: false, marketing: false };
export function parseConsent(raw: string | undefined, now = Date.now()): CookieConsent | null {
  try {
    if (!raw || raw.length > 2048) return null;
    const result = consentSchema.safeParse(JSON.parse(decodeURIComponent(raw)));
    if (!result.success) return null;
    const value = result.data;
    const age = now - Date.parse(value.updatedAt);
    if (age < 0 || age >= COOKIE_CONSENT_MAX_AGE * 1000) return null;
    if (value.status === "rejected" && (value.analytics || value.functional || value.marketing)) return null;
    // A previous explicit rejection stays denied across material version changes.
    if (value.version !== COOKIE_CONSENT_VERSION && value.status !== "rejected") return null;
    if (value.status === "rejected") return { ...value, ...denied };
    if (value.functional || value.marketing) return null; // No such services currently exist.
    if (value.status === "accepted" && !value.analytics) return null;
    return value;
  } catch { return null; }
}
export function getCookieConsent(): CookieConsent | null {
  if (typeof document === "undefined") return null;
  return parseConsent(document.cookie.split("; ").find(value => value.startsWith(`${COOKIE_CONSENT_NAME}=`))?.slice(COOKIE_CONSENT_NAME.length + 1));
}
export function hasConsent(category: OptionalCategory): boolean { return getCookieConsent()?.[category] === true; }
export function createConsent(status: CookieConsent["status"], preferences: Preferences = denied): CookieConsent {
  const selected = { ...denied };
  for (const { id } of optionalCategories) selected[id] = status === "accepted" || (status === "custom" && preferences[id]);
  return { necessary: true, ...selected, status, version: COOKIE_CONSENT_VERSION, updatedAt: new Date().toISOString() };
}
export function saveCookieConsent(value: CookieConsent): boolean {
  try {
    const encoded = encodeURIComponent(JSON.stringify(value));
    document.cookie = `${COOKIE_CONSENT_NAME}=${encoded}; Path=/; Max-Age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    window.dispatchEvent(new Event("asivquark:consent"));
    return getCookieConsent()?.updatedAt === value.updatedAt;
  } catch { return false; }
}
export function revokeConsent(): boolean { return saveCookieConsent(createConsent("rejected")); }
export function getConsentVersion() { return COOKIE_CONSENT_VERSION; }
