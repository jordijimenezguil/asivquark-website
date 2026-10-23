"use client";
import { hasConsent } from "@/features/cookies/consent";
import { projectTypeForContract, type PublicProjectType } from "@/content/project-type";
import { services, type Service } from "@/content/services";
import { emitMarketingEvent } from "@/components/marketing/events";
import { useEffect, useRef, useState, type FormEvent } from "react";

import {
  leadSchema,
  budgetLabels,
  type FieldErrors,
  type Attribution,
} from "@/features/leads/schema";
import { browserAttribution } from "@/features/leads/client-attribution";
import type { PublicContactConfig } from "@/config/contact";


import { Input } from "@/components/ui/input";
import { FormSuccess } from "./form-success";
export function ContactForm({
  config,
  initialService,
  trackingFields = {},
}: {
  config: PublicContactConfig;
  initialService?: Service["query"] | "otro";
  trackingFields?: Record<string, string>;
}) {
  const form = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const attempt = useRef<{ key: string; payload: string } | null>(null);
  const attribution = useRef<Attribution | null>(null);
  const [optional, setOptional] = useState(false);
  const [selected, setSelected] = useState<PublicProjectType>(initialService === "otro" ? "otro" : services.find(item => item.query === initialService)?.uiType ?? "web");
  const chips = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = chips.current;
    const active = row?.querySelector<HTMLInputElement>("input:checked")?.parentElement;
    if (row && active) row.scrollLeft = Math.max(0, active.offsetLeft - row.offsetLeft - 20);
  }, [selected]);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [retryUntil, setRetryUntil] = useState(0);
  const [retrySeconds, setRetrySeconds] = useState(0);
  useEffect(() => {
    if (!retryUntil) return;
    const update = () =>
      setRetrySeconds(Math.max(0, Math.ceil((retryUntil - Date.now()) / 1000)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [retryUntil]);
  useEffect(() => {
    if (success) document.getElementById("lead-success")?.focus();
  }, [success]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !config.enabled || retrySeconds) return;
    setMessage("");
    setErrors({});
    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get("nombre") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("empresa") ?? ""),
      phone: String(data.get("telefono") ?? ""),
      projectType: projectTypeForContract(selected),
      budget: String(data.get("presupuesto") ?? ""),
      description: String(data.get("mensaje") ?? ""),
      privacy: true,
    };
    const parsed = leadSchema.safeParse(input);
    if (!parsed.success) {
      const fields: FieldErrors = {};
      for (const issue of parsed.error.issues)
        fields[issue.path[0] as keyof FieldErrors] ??= issue.message;
      setErrors(fields);
      if(fields.company || fields.phone || fields.budget) setOptional(true);
      emitMarketingEvent("form_error", { campo: Object.keys(fields)[0] });

      const first = Object.keys(fields)[0];
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[id="${first}"]`)?.focus());
      return;
    }
    if (!hasConsent("analytics")) attribution.current = null;
    attribution.current ??= browserAttribution();
    const payload = JSON.stringify({
      ...parsed.data,
      website: String(data.get("website") ?? ""),
      attribution: attribution.current,
    });
    if (!attempt.current || attempt.current.payload !== payload)
      attempt.current = { key: crypto.randomUUID(), payload };
    const type = selected;
    emitMarketingEvent("form_submit", { tipo: type, has_budget: Boolean(parsed.data.budget) });
    submitting.current = true;
    setPending(true);
    try {
      const response = await fetch("/api/leads/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": attempt.current.key,
        },
        body: payload,
        signal: AbortSignal.timeout(20000),
      });
      const result: unknown = await response.json();
      if (
        typeof result !== "object" ||
        result === null ||
        !("success" in result)
      )
        throw new Error("INVALID_RESPONSE");
      if (response.status === 201 && result.success === true) {

        emitMarketingEvent("generate_lead", { tipo: type, origen: attribution.current?.originPath, presupuesto: parsed.data.budget });
        setSuccess(true);
        return;
      }
      if (
        "fieldErrors" in result &&
        typeof result.fieldErrors === "object" &&
        result.fieldErrors !== null
      ) {
        const fields: FieldErrors = {};
        for (const [key, value] of Object.entries(result.fieldErrors))
          if (key in input && typeof value === "string")
            fields[key as keyof FieldErrors] = value;
        setErrors(fields);
        if(fields.company || fields.phone || fields.budget) setOptional(true);
        const first = Object.keys(fields)[0];
        requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[id="${first}"]`)?.focus());
      }
      emitMarketingEvent("form_error", { campo: "servidor" });
      if (response.status === 409) attempt.current = null;
      if (response.status === 429) {
        const seconds = Number(response.headers.get("retry-after"));
        setRetryUntil(
          Date.now() +
            (Number.isFinite(seconds) && seconds > 0
              ? Math.min(seconds, 3600)
              : 60) *
              1000,
        );
      }
      setMessage(
        "No hemos podido enviar la solicitud. Inténtalo de nuevo o escríbenos a hola@asivquark.com.",
      );
    } catch {
      emitMarketingEvent("form_error", { campo: "servidor" });
      setMessage(
        "No hemos podido enviar la solicitud. Inténtalo de nuevo o escríbenos a hola@asivquark.com.",
      );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  const names = { name: "nombre", email: "email", company: "empresa", phone: "telefono", description: "mensaje", budget: "presupuesto", projectType: "tipo", privacy: "privacy" };
  const inputClass = "w-full h-[50px] rounded-xl border border-line-strong bg-ink-900 px-3.5 text-base font-normal text-ink placeholder:text-ink-500 focus:border-violet focus:outline-none focus:ring-2 focus:ring-violet/25";
  const props = (name: keyof FieldErrors) => ({ id: name, name: names[name], className: `${inputClass} ${errors[name] ? "border-red-600" : ""}`, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });
  const field = (name: keyof FieldErrors, label: string, control: React.ReactNode) => <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink" htmlFor={name}>{label}{control}{errors[name] && <span id={`${name}-error`} className="mt-1 text-[13px] font-normal text-red-300">{errors[name]}</span>}</label>;
  const email = <div className="flex items-center justify-between gap-3 border-t border-line pt-3.5 text-sm"><span className="text-ink-500">¿Prefieres escribir?</span><a href={`mailto:hola@asivquark.com?subject=${encodeURIComponent(`Proyecto: ${selected}`)}`} className="inline-flex min-h-11 items-center font-semibold text-violet">hola@asivquark.com</a></div>;
  return <div className="contact-sheet min-w-0 min-h-[60vh] rounded-t-[20px] bg-ink-900 px-5 pb-7 pt-5 text-ink sm:mx-auto sm:max-w-[640px] sm:px-8 sm:pt-7 md:mx-8 md:mb-12 md:rounded-[20px] md:shadow-card lg:sticky lg:top-[114px] lg:mx-0 lg:mb-0 lg:min-h-0 lg:w-full lg:rounded-2xl lg:p-8">
    {!config.enabled ? email : success ? <FormSuccess onRestart={() => { attempt.current = null; attribution.current = null; setErrors({}); setMessage(""); setSuccess(false); }} /> : <form ref={form} onSubmit={submit} method="post" action="/api/contacto/" noValidate aria-busy={pending} className="flex min-w-0 flex-col gap-3.5"
      onBlur={event => { const key = Object.entries(names).find(([, value]) => value === event.target.getAttribute("name"))?.[0] as keyof FieldErrors | undefined; if (!key || key === "privacy" || key === "projectType") return; const result = leadSchema.shape[key].safeParse(event.target.value); setErrors(previous => ({ ...previous, [key]: result.success ? undefined : result.error.issues[0]?.message })); if (!result.success) emitMarketingEvent("form_error", { campo: key }); }}>
      <div className="flex items-center justify-between gap-2"><h2 className="text-[17px] font-bold sm:text-xl">Cuéntanos lo que necesitas</h2><span className="shrink-0 font-mono text-[11px] text-ink-500" aria-hidden="true">2 / 3</span><span className="sr-only">Paso 2 de 3</span></div>
      <div role="progressbar" aria-label="Paso 2 de 3" aria-valuemin={1} aria-valuemax={3} aria-valuenow={2} className="h-1 overflow-hidden rounded-full bg-ink-800"><div className="h-full w-2/3 bg-brand-600" /></div>
      <fieldset className="min-w-0" disabled={pending}><legend className="sr-only">Tipo de proyecto</legend><div ref={chips} className="relative -mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 pt-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">{[
        { value: "web", label: "Página web" }, { value: "software", label: "Software a medida" }, { value: "app", label: "Aplicación web" }, { value: "mvp", label: "Desarrollo MVP" },
        ...(selected === "automatizacion" || selected === "otro" ? [{ value: selected, label: selected === "otro" ? "Otro proyecto" : "Automatización" }] : []),
      ].map(option => <label key={option.value} className="shrink-0"><input type="radio" name="tipo" value={option.value === "software" ? "soft" : option.value} checked={selected === option.value} onChange={() => setSelected(option.value as PublicProjectType)} className="peer sr-only" /><span className="inline-flex h-10 cursor-pointer items-center whitespace-nowrap rounded-xl border border-line-strong bg-ink-900 px-3.5 text-sm font-semibold text-ink peer-checked:border-brand-500 peer-checked:bg-brand-600 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet">{option.label}</span></label>)}</div></fieldset>
      <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-3">
        {field("name", "Nombre", <Input {...props("name")} autoComplete="name" required maxLength={100} placeholder="Cómo te llamas" />)}
        {field("email", "Email", <Input {...props("email")} type="email" inputMode="email" autoComplete="email" required maxLength={254} placeholder="tu@empresa.com" />)}
      </div>
      {field("description", "¿Qué quieres resolver?", <textarea {...props("description")} className={`${props("description").className} min-h-[96px] resize-y py-3`} rows={3} required minLength={10} maxLength={2000} placeholder="Ej.: necesito una web para mostrar mis servicios y recibir solicitudes" />)}
      <details id="optional-fields" open={optional} onToggle={event => setOptional(event.currentTarget.open)}><summary className="flex min-h-11 cursor-pointer items-center text-left text-sm font-semibold text-violet" aria-controls="optional-content" aria-expanded={optional}>{optional ? "− Ocultar datos opcionales" : "+ Añadir empresa o teléfono (opcional)"}</summary><div id="optional-content" className="grid gap-3.5 pt-3 sm:grid-cols-2">
        {field("company", "Empresa", <Input {...props("company")} autoComplete="organization" maxLength={150} />)}
        {field("phone", "Teléfono", <Input {...props("phone")} type="tel" autoComplete="tel" maxLength={40} />)}
        {field("budget", "Presupuesto orientativo", <select {...props("budget")} defaultValue=""><option value="">Sin indicar</option>{Object.entries(budgetLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>)}
      </div></details>
      {Object.entries(trackingFields).map(([name, value]) => <input key={name} name={name} value={value} type="hidden" />)}
      <input name="privacy" type="hidden" value="on" />
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      {message && <div role="alert" className="rounded-xl border border-red-400/40 bg-red-950 p-3 text-sm text-red-200">{message}{retrySeconds > 0 && <p>Podrás volver a intentarlo en {retrySeconds} segundos.</p>}</div>}
      <button type="submit" disabled={pending || retrySeconds > 0} aria-busy={pending} className="flex min-h-[54px] items-center justify-between rounded-xl bg-brand-600 px-[18px] text-base font-bold text-white hover:bg-violet-600 disabled:opacity-60"><span>{pending ? "Enviando…" : "Enviar solicitud"}</span><span aria-hidden="true">→</span></button>
      <p className="text-xs leading-normal text-ink-500">Al enviar aceptas la <a href={config.noticeUrl ?? "/politica-privacidad/"} className="text-violet underline">política de privacidad</a>.</p>
      {email}
    </form>}
  </div>;
}
