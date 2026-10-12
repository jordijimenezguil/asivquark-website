import { parseConsent } from "@/features/cookies/consent";
import { COOKIE_CONSENT_NAME } from "@/config/cookies";
import { randomUUID } from "node:crypto";
import { POST as submitLead } from "@/app/api/leads/route";
import { readLimitedText } from "@/features/leads/security";
import { projectTypeForContract, parseContactProjectType } from "@/content/project-type";
import { site } from "@/config/site";
import { getContactConfig } from "@/config/contact";
import { attributionFromUrl } from "@/features/leads/attribution";
export const runtime = "nodejs";
export const maxDuration = 60;
const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
export async function POST(request: Request) {
  if (request.headers.get("origin") !== site.origin || request.headers.get("sec-fetch-site") === "cross-site") return new Response("Origen no permitido.", { status: 403 });
  if (request.headers.get("content-type")?.split(";")[0] !== "application/x-www-form-urlencoded") return new Response("Formato no permitido.", { status: 415 });
  let data: URLSearchParams;
  try { data = new URLSearchParams(await readLimitedText(request)); }
  catch { return new Response("La solicitud supera el tamaño permitido o no es válida.", { status: 413 }); }
  const consent = parseConsent(request.headers.get("cookie")?.split("; ").find(value => value.startsWith(`${COOKIE_CONSENT_NAME}=`))?.slice(COOKIE_CONSENT_NAME.length + 1));
  const type = parseContactProjectType(data.getAll("tipo"), []);
  const headers = new Headers(request.headers);
  headers.set("content-type", "application/json");
  headers.delete("content-length");
  headers.set("idempotency-key", data.get("submission_key") || randomUUID());
  const response = await submitLead(new Request(request.url, { method: "POST", headers, body: JSON.stringify({
    name: data.get("nombre") ?? "", email: data.get("email") ?? "", company: data.get("empresa") ?? "", phone: data.get("telefono") ?? "", description: data.get("mensaje") ?? "", budget: data.get("presupuesto") ?? "", projectType: projectTypeForContract(type), privacy: data.get("privacy") === "on", website: data.get("website") ?? "", attribution: consent?.analytics ? attributionFromUrl(data) : {},
  }) }));
  const success = response.status === 201;
  const config = getContactConfig();
  const fields = [["nombre", "Nombre"], ["email", "Email"], ["mensaje", "¿Qué quieres resolver?"], ["empresa", "Empresa"], ["telefono", "Teléfono"], ["presupuesto", "Presupuesto orientativo"]];
  const result: { message?: string; fieldErrors?: Record<string, string> } = await response.json();
  const errors = Object.values(result.fieldErrors ?? {}).map(value => `<p>${escape(value)}</p>`).join("");
  const form = !config.enabled ? "" : `<form method="post" action="/api/contacto/">${fields.map(([name, label]) => `<label>${label}${name === "mensaje" ? `<textarea name="${name}" rows="3">${escape(data.get(name) ?? "")}</textarea>` : `<input name="${name}" value="${escape(data.get(name) ?? "")}" type="${name === "email" ? "email" : "text"}">`}</label>`).join("")}<input type="hidden" name="tipo" value="${escape(data.get("tipo") ?? "web")}"><input type="hidden" name="privacy" value="on"><input type="hidden" name="submission_key" value="${escape(headers.get("idempotency-key")!)}">${["origen", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].map(name => `<input type="hidden" name="${name}" value="${escape(data.get(name) ?? "")}">`).join("")}<button>Enviar solicitud →</button><p>Al enviar aceptas la <a href="/politica-privacidad/">política de privacidad</a>.</p></form>`;
  return new Response(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Contacto | ASIVQUARK</title><style>body{font:16px system-ui;background:#0b0f17;padding:20px;color:#111827}main{max-width:520px;margin:auto;background:white;padding:24px;border-radius:20px}label{display:grid;gap:6px;margin:14px 0}input,textarea,button{font:inherit;padding:14px;border:1px solid #dadde4;border-radius:10px}button{background:#7c3aed;color:white}a{color:#6d28d9}</style><main><h1>${success ? "Solicitud enviada" : "No hemos podido enviar la solicitud"}</h1>${success ? "<p>Te escribimos en 24 h laborables para agendar una llamada de 30 minutos.</p><h2>Qué pasa después</h2><ol><li>Respuesta en 24 h — Te escribimos para agendar una conversación.</li><li>Llamada de 30 min — Entendemos el problema y el contexto.</li><li>Propuesta por escrito — Alcance, fases y presupuesto en lenguaje claro.</li></ol><a href='/contacto/'>Enviar otra solicitud</a>" : `${errors}<p>Inténtalo de nuevo o escríbenos a <a href="mailto:hola@asivquark.com">hola@asivquark.com</a>.</p>${form}`}</main></html>`, { status: response.status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", ...(response.headers.has("retry-after") ? { "Retry-After": response.headers.get("retry-after")! } : {}) } });
}
