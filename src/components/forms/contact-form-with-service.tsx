"use client";
import { useSearchParams } from "next/navigation";
import { serviceSchema } from "@/features/leads/schema";
import type { PublicContactConfig } from "@/config/contact";
import { ContactForm } from "./contact-form";
export function ContactFormWithService({
  config,
}: {
  config: PublicContactConfig;
}) {
  const values = useSearchParams().getAll("servicio");
  const service = serviceSchema.safeParse(
    values.length === 1 ? values[0] : undefined,
  );
  return (
    <ContactForm
      config={config}
      initialService={service.success ? service.data : undefined}
    />
  );
}
