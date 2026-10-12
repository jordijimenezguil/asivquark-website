import { after } from "next/server";
import { site } from "@/config/site";
import { getLeadRuntimeConfig, getLeadEmailConfig } from "@/config/contact";
import { handleLead } from "@/features/leads/handler";
import { createLead } from "@/features/leads/repository";
import { admissionLimit } from "@/features/leads/rate-limit";
import { processLeadOutbox } from "@/features/leads/outbox";
import { leadLog } from "@/features/leads/log";
export const runtime = "nodejs";
export const maxDuration = 60;
export function POST(request: Request) {
  return handleLead(request, {
    origin: site.origin,
    production: site.isProduction,
    vercel: process.env.VERCEL === "1",
    config: getLeadRuntimeConfig(),
    notificationRecipient: getLeadEmailConfig().recipient,
    rateLimit: admissionLimit,
    create: createLead,
    schedule: (leadId) =>
      after(async () => {
        try {
          await processLeadOutbox({ leadId, limit: 2 });
        } catch {
          leadLog("lead.notification_failed", leadId, "PROCESSOR_FAILED");
        }
      }),
  });
}
