export type MarketingEvent = "cta_click" | "configurator_select" | "form_start" | "form_optional_open" | "form_submit" | "form_success" | "form_error" | "faq_open" | "project_filter";
export function emitMarketingEvent(name: MarketingEvent, detail: { tipo?: "web" | "software" | "app" | "mvp"; location?: string; has_budget?: boolean; pregunta?: string; cat?: string } = {}) {
 window.dispatchEvent(new CustomEvent("asivquark:marketing", { detail: { name, ...detail } }));
}
