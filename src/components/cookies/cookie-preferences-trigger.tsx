"use client";
import { useCookieConsent } from "./cookie-consent-provider";
export function CookiePreferencesTrigger() {
  const { openPreferences } = useCookieConsent();
  return <button type="button" className="min-h-11 py-3 text-sm underline underline-offset-4" onClick={openPreferences}>Configurar cookies</button>;
}
