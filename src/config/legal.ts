import { z } from "zod";

const optionalText = z.string().trim().min(1).max(1000).nullable();
const applicability = z.enum(["pending", "not-applicable", "applicable"]);
export const legalEntitySchema = z.object({
  brandName: z.string().min(1), website: z.url(), location: z.string().min(1),
  legalName: optionalText, taxId: optionalText, legalAddress: optionalText, postalAddress: optionalText,
  legalEmail: z.email().nullable(), privacyEmail: z.email().nullable(),
  registry: z.object({ status: applicability, information: optionalText }),
  authorization: z.object({ status: applicability, information: optionalText }),
  dpo: z.object({ status: applicability, information: optionalText }),
});
export type LegalEntity = z.infer<typeof legalEntitySchema>;
export const legalEntity: LegalEntity = legalEntitySchema.parse({
  brandName: "ASIVQUARK", website: "https://asivquark.com", location: "Barcelona, España",
  legalName: "ASIVQUARK", taxId: "47163794V", legalAddress: null,
  postalAddress: "Apartado de correos 12453, Sabadell",
  legalEmail: "hola@asivquark.com", privacyEmail: null,
  registry: { status: "pending", information: null },
  authorization: { status: "pending", information: null },
  dpo: { status: "pending", information: null },
});
export const legalDocuments = [
  { id: "notice", title: "Aviso legal", seoTitle: "Aviso Legal", path: "/aviso-legal/", description: "Información legal sobre la titularidad, actividad y condiciones generales del sitio web de ASIVQUARK." },
  { id: "privacy", title: "Política de privacidad", seoTitle: "Política de Privacidad", path: "/politica-privacidad/", description: "Consulta cómo ASIVQUARK trata los datos personales, para qué los utiliza y cómo ejercer tus derechos." },
  { id: "cookies", title: "Política de cookies", seoTitle: "Política de Cookies", path: "/politica-de-cookies/", description: "Información sobre las cookies y tecnologías similares utilizadas en ASIVQUARK y cómo gestionar tus preferencias." },
  { id: "terms", title: "Condiciones de uso", seoTitle: "Condiciones de Uso", path: "/condiciones-de-uso/", description: "Consulta las condiciones generales de utilización del sitio web de ASIVQUARK." },
].map(document => ({ ...document, version: "legal-draft-2026-10-12.1", technicalReview: "2026-10-12", effectiveAt: null as string | null, approvedAt: null as string | null, status: "draft" as "draft" | "approved" }));
export type LegalDocument = (typeof legalDocuments)[number];
export function legalReadiness(entity: LegalEntity = legalEntity, documents = legalDocuments) {
  const missing: string[] = [];
  for (const key of ["legalName", "taxId", "legalAddress", "legalEmail"] as const) if (!entity[key]) missing.push(key);
  for (const key of ["registry", "authorization", "dpo"] as const) {
    if (entity[key].status === "pending" || (entity[key].status === "applicable" && !entity[key].information)) missing.push(key);
  }
  for (const document of documents) if (document.status !== "approved" || !document.approvedAt || !document.effectiveAt) missing.push(`approval:${document.id}`);
  return { ready: missing.length === 0, missing };
}
