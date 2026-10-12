"use client";
import { useSearchParams } from "next/navigation";
import { parseContactProjectType, projectTypeForContract } from "@/content/project-type";
import type { PublicContactConfig } from "@/config/contact";
import { ContactForm } from "./contact-form";
export function ContactFormWithService({
  config,
}: {
  config: PublicContactConfig;
}) {
  const params = useSearchParams();
  const service = parseContactProjectType(params.getAll("tipo"), params.getAll("servicio"));
  return (
    <ContactForm
      key={service}
      config={config}
      initialService={projectTypeForContract(service)}
    />
  );
}
