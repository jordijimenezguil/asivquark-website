import { hasConsent } from "@/features/cookies/consent";
export type MarketingEvent = "cta_click" | "configurator_select" | "form_start" | "form_optional_open" | "form_submit" | "form_success" | "form_error" | "faq_open" | "project_filter";
export function emitMarketingEvent(name: MarketingEvent, detail: { tipo?: "web" | "software" | "app" | "mvp" | "automatizacion" | "otro"; location?: string; has_budget?: boolean; pregunta?: string; cat?: string } = {}) {
 if (!hasConsent("analytics")) return;
 window.dispatchEvent(new CustomEvent("asivquark:marketing", { detail: { name, ...detail } }));
}
