import type { Lead } from "@/generated/prisma/client";
import { budgetLabels, serviceLabels } from "@/features/leads/schema";
export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
}
function emailLayout(title: string, body: string) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#F8F9FC;font-family:Arial,sans-serif;color:#111827"><table role="presentation" style="width:100%;border-spacing:0"><tr><td style="padding:24px 12px"><table role="presentation" style="width:100%;max-width:620px;margin:auto;background:#fff;border-spacing:0"><tr><td style="padding:32px;border-top:4px solid #7C3AED"><p style="font-size:20px;font-weight:bold">ASIV<span style="color:#7C3AED">QUARK</span></p><h1 style="font-size:24px;line-height:1.4">${escapeHtml(title)}</h1>${body}<p style="margin-top:32px;font-size:13px;color:#475569">ASIVQUARK · Software &amp; Digital Products<br>Barcelona<br><a href="https://asivquark.com/" style="color:#7C3AED">asivquark.com</a></p></td></tr></table></td></tr></table></body></html>`;
}
export function newLeadEmail(lead: Lead) {
  const service =
    serviceLabels[lead.service as keyof typeof serviceLabels] ??
    "Otro proyecto";
  const budget = lead.budget
    ? (budgetLabels[lead.budget as keyof typeof budgetLabels] ?? "Sin indicar")
    : "Sin indicar";
  const items = [
    ["Nombre", lead.name],
    ["Email", lead.email],
    ["Empresa", lead.company ?? "Sin indicar"],
    ["Teléfono", lead.phone ?? "Sin indicar"],
    ["Tipo de proyecto", service],
    ["Presupuesto orientativo", budget],
    ["Recepción", lead.createdAt.toISOString()],
    ["Landing", lead.landingPath ?? "Sin atribución"],
    ["Página de origen", lead.originPath ?? "Sin atribución"],
    ["Referente (solo origen)", lead.referrer ?? "Sin atribución"],
    ["UTM source", lead.utmSource],
    ["UTM medium", lead.utmMedium],
    ["UTM campaign", lead.utmCampaign],
    ["UTM content", lead.utmContent],
    ["UTM term", lead.utmTerm],
  ].filter((item): item is [string, string] => typeof item[1] === "string");
  const text =
    items.map(([label, value]) => `${label}: ${value}`).join("\n") +
    `\n\nDescripción del proyecto:\n${lead.message}`;
  const body =
    items
      .map(
        ([label, value]) =>
          `<p style="line-height:1.6;overflow-wrap:anywhere"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`,
      )
      .join("") +
    `<h2 style="font-size:18px">Descripción del proyecto</h2><p style="line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(lead.message)}</p>`;
  return {
    subject: `Nuevo lead ASIVQUARK — ${service}`,
    text,
    html: emailLayout("Nueva solicitud de proyecto", body),
    replyTo: lead.email,
  };
}
export function leadConfirmationEmail(lead: Pick<Lead, "name">) {
  const text = `Hola ${lead.name}:\n\nHemos recibido correctamente tu solicitud.\n\nGracias por contactar con ASIVQUARK.\n\nRevisaremos la información que nos has enviado para valorar cómo podemos ayudarte con tu proyecto.\n\nSi necesitamos más detalles, nos pondremos en contacto contigo a través del email facilitado.\n\nUn saludo,\n\nASIVQUARK\nSoftware & Digital Products\nBarcelona\nhttps://asivquark.com/`;
  const body = `<p style="line-height:1.7">Hola ${escapeHtml(lead.name)}:</p><p style="line-height:1.7">Hemos recibido correctamente tu solicitud. Gracias por contactar con ASIVQUARK.</p><p style="line-height:1.7">Revisaremos la información que nos has enviado para valorar cómo podemos ayudarte con tu proyecto.</p><p style="line-height:1.7">Si necesitamos más detalles, nos pondremos en contacto contigo a través del email facilitado.</p><p>Un saludo,</p>`;
  return {
    subject: "Hemos recibido tu proyecto | ASIVQUARK",
    text,
    html: emailLayout("Hemos recibido tu solicitud", body),
  };
}
