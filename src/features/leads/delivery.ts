import type { EmailOutbox } from "@/generated/prisma/client";
// Resend retains idempotency keys for 24h. Stop sooner when acceptance is ambiguous.
export const deliveryWindowMs = 20 * 3600000;
export function deliveryDecision(
  row: Pick<EmailOutbox, "firstAttemptAt" | "attempts">,
  now: Date,
) {
  if (
    row.firstAttemptAt &&
    now.getTime() - row.firstAttemptAt.getTime() >= deliveryWindowMs
  )
    return "EXPIRED_IDEMPOTENCY_WINDOW";
  if (row.attempts >= 5) return "ATTEMPTS_EXHAUSTED";
  return null;
}
export function nextDeliveryAttempt(attempts: number, now: Date) {
  return new Date(
    now.getTime() + Math.min(3600, 60 * 2 ** Math.max(0, attempts - 1)) * 1000,
  );
}
export type DeliveryError = { code: string; retryable: boolean };
export function providerFailure(name?: string, status?: number): DeliveryError {
  if (
    status === 429 ||
    (status !== undefined && status >= 500) ||
    name === "concurrent_idempotent_requests"
  )
    return { code: "PROVIDER_TEMPORARY", retryable: true };
  if (status === undefined)
    return { code: "PROVIDER_AMBIGUOUS", retryable: true };
  return { code: "PROVIDER_REJECTED", retryable: false };
}
