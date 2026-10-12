import type { Attribution } from "./schema";
import { publicPaths } from "@/config/navigation";
export function allowedPath(
  value: string | null | undefined,
): string | undefined {
  if (!value || !publicPaths.includes(value)) return undefined;
  return value;
}
export function safeReferrer(
  value: string | null | undefined,
): string | undefined {
  if (!value || value.length > 2048) return undefined;
  try {
    const url = new URL(value);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return undefined;
    // Keep origin only: paths, query strings and fragments can contain personal data.
    return url.origin.length <= 300 ? url.origin : undefined;
  } catch {
    return undefined;
  }
}
export function sanitizeAttribution(input: Attribution = {}): Attribution {
  return {
    ...input,
    landingPath: allowedPath(input.landingPath),
    originPath: allowedPath(input.originPath),
    referrer: safeReferrer(input.referrer),
  };
}
export function attributionFromUrl(
  params: URLSearchParams,
  referrer?: string,
): Attribution {
  const get = (key: string) => {
    const values = params.getAll(key);
    if (values.length !== 1) return undefined;
    const value = values[0].trim();
    return value &&
      value.length <= 150 &&
      !/[<>\u0000-\u001F\u007F]/u.test(value)
      ? value
      : undefined;
  };
  return sanitizeAttribution({
    landingPath: allowedPath(params.get("landing")),
    originPath: allowedPath(params.get("origen")),
    referrer: safeReferrer(referrer),
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmContent: get("utm_content"),
    utmTerm: get("utm_term"),
  });
}
