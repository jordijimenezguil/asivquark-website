"use client";
import { useCookieConsent } from "@/components/cookies/cookie-consent-provider";
import { useSearchParams } from "next/navigation";
import { parseContactProjectType, projectTypeForContract } from "@/content/project-type";
import type { PublicContactConfig } from "@/config/contact";
import { ContactForm } from "./contact-form";
export function ContactFormWithService({
  config,
}: {
  config: PublicContactConfig;
}) {
  const { consent } = useCookieConsent();
  const params = useSearchParams();
  const service = parseContactProjectType(params.getAll("tipo"), params.getAll("servicio"));
  return (
    <ContactForm
      key={service}
      config={config}
      trackingFields={consent?.analytics ? Object.fromEntries(["origen", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].map(name => [name, params.get(name) ?? ""])) : {}}
      initialService={projectTypeForContract(service)}
    />
  );
}
