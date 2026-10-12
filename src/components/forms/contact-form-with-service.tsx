"use client";
import { useSearchParams } from "next/navigation";
import { parsePublicProjectType, projectTypeForContract } from "@/content/project-type";
import type { PublicContactConfig } from "@/config/contact";
import { ContactForm } from "./contact-form";
export function ContactFormWithService({
  config,
}: {
  config: PublicContactConfig;
}) {
  const values = useSearchParams().getAll("tipo");
  const service = parsePublicProjectType(values);
  return (
    <ContactForm
      config={config}
      initialService={projectTypeForContract(service)}
    />
  );
}
