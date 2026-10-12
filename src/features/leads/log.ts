import "server-only";
type LeadLogEvent =
  | "lead.received"
  | "lead.validation_failed"
  | "lead.created"
  | "lead.notification_sent"
  | "lead.notification_failed"
  | "lead.rate_limited"
  | "lead.unavailable";
export function leadLog(event: LeadLogEvent, id: string, code?: string) {
  // Only controlled codes and generated identifiers, never error objects or payloads.
  console.info(JSON.stringify({ event, id, ...(code ? { code } : {}) }));
}
