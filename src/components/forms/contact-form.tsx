"use client";
import { projectTypeForContract } from "@/content/project-type";
import { services, type Service } from "@/content/services";
import { emitMarketingEvent } from "@/components/marketing/events";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  leadSchema,
  budgetLabels,
  type FieldErrors,
  type Attribution,
} from "@/features/leads/schema";
import { browserAttribution } from "@/features/leads/client-attribution";
import type { PublicContactConfig } from "@/config/contact";
import { FormField } from "./form-field";
import { FormSuccess } from "./form-success";
export function ContactForm({
  config,
  initialService,
}: {
  config: PublicContactConfig;
  initialService?: Service["query"];
}) {
  const form = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const attempt = useRef<{ key: string; payload: string } | null>(null);
  const attribution = useRef<Attribution | null>(null);
  const [optional, setOptional] = useState(false);
  const started = useRef(false);
  const [selected, setSelected] = useState<Service["uiType"]>(services.find(item => item.query === initialService)?.uiType ?? "web");
  const [confirmed, setConfirmed] = useState("web");
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
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      phone: String(data.get("phone") ?? ""),
      projectType: projectTypeForContract(selected),
      budget: String(data.get("budget") ?? ""),
      description: String(data.get("description") ?? ""),
      privacy: data.get("privacy") === "on",
    };
    const parsed = leadSchema.safeParse(input);
    if (!parsed.success) {
      const fields: FieldErrors = {};
      for (const issue of parsed.error.issues)
        fields[issue.path[0] as keyof FieldErrors] ??= issue.message;
      setErrors(fields);
      if(fields.company || fields.phone || fields.budget) setOptional(true);
      emitMarketingEvent("form_error");
      setMessage("Revisa los campos indicados antes de enviar.");
      const first = Object.keys(fields)[0];
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
      return;
    }
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
        setConfirmed(services.find(item => item.uiType === selected)!.title);
        emitMarketingEvent("form_success");
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
        requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
      }
      emitMarketingEvent("form_error");
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
        "message" in result && typeof result.message === "string"
          ? result.message
          : "No hemos podido procesar la solicitud. Inténtalo de nuevo.",
      );
    } catch {
      emitMarketingEvent("form_error");
      setMessage(
        "No hemos podido confirmar el envío. Tus datos siguen aquí; puedes reintentar la misma solicitud.",
      );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  if (success) return <FormSuccess type={confirmed} onRestart={() => { attempt.current = null; attribution.current = null; setErrors({}); setMessage(""); setSuccess(false); }} />;
  const props = (name: keyof FieldErrors) => ({
    id: name,
    name,
    className: "form-input",
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_30px_60px_-30px_rgba(11,15,23,.3)] sm:p-10">
      <h2 className="text-2xl font-bold tracking-tight">
        Cuéntanos lo que necesitas
      </h2>
      <p id="form-status" className="mt-4 leading-7 text-slate-600">
        {!config.enabled
          ? "La captación está pendiente de activación y de la información de privacidad aprobada. No se pueden enviar solicitudes en este entorno."
          : config.testMode && !config.noticeUrl
            ? "Modo de desarrollo: utiliza solo datos de prueba. Falta la información de privacidad aprobada para publicar el formulario."
            : "Los campos marcados con * son obligatorios. No incluyas información sensible en la descripción."}
      </p>
      <form
        ref={form}
        onSubmit={submit}
        onFocus={() => { if(!started.current) { started.current = true; emitMarketingEvent("form_start"); } }}
        onBlur={(event) => { const name = event.target.getAttribute("name") as keyof FieldErrors | null; if(!name || !(name in leadSchema.shape)) return; const value = name === "projectType" ? projectTypeForContract(selected) : event.target instanceof HTMLInputElement && event.target.type === "checkbox" ? event.target.checked : event.target.value; const result = leadSchema.shape[name].safeParse(value); setErrors(previous => ({ ...previous, [name]: result.success ? undefined : result.error.issues[0]?.message })); }}
        method="post"
        action="/api/leads/"
        noValidate
        aria-describedby="form-status"
        aria-busy={pending}
        className="mt-8"
      >
        <fieldset disabled={!config.enabled || pending}>
          <legend className="sr-only">Información de tu proyecto</legend>
          <fieldset className="mb-7"><legend className="form-label">¿Qué quieres desarrollar? *</legend><div className="grid grid-cols-2 gap-2">{services.map(service => <label key={service.uiType} className={`relative flex min-h-12 cursor-pointer items-center gap-2 rounded-[10px] border px-3 py-3 text-sm font-semibold ${selected === service.uiType ? "border-violet bg-violet text-white" : "border-line-strong"}`}><input type="radio" name="projectType" value={service.uiType} aria-describedby={errors.projectType ? "projectType-error" : undefined} checked={selected === service.uiType} onChange={() => setSelected(service.uiType)} className="h-4 w-4 accent-violet" />{service.title}</label>)}</div>{errors.projectType && <p id="projectType-error" className="mt-2 text-sm text-red-700">{errors.projectType}</p>}</fieldset>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField name="name" label="Nombre" required error={errors.name}>
              <input
                {...props("name")}
                type="text"
                autoComplete="name"
                required
                maxLength={100}
              />
            </FormField>
            <FormField name="email" label="Email" required error={errors.email}>
              <input
                {...props("email")}
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </FormField>
            <FormField
              name="description"
              label="¿Qué quieres resolver?"
              required
              error={errors.description}
              className="sm:col-span-2"
            >
              <textarea
                {...props("description")}
                rows={4}
                required
                minLength={20}
                maxLength={5000}
                placeholder="Cuéntanos qué necesitas desarrollar, qué problema quieres resolver o en qué consiste tu idea."
              />
            </FormField>
            <div className="sm:col-span-2"><button type="button" aria-expanded={optional} aria-controls="optional-fields" className="min-h-12 text-left text-sm font-semibold text-violet" onClick={() => { if(!optional) emitMarketingEvent("form_optional_open"); setOptional(!optional); }}>{optional ? "− Ocultar detalles opcionales" : "+ Añadir empresa, teléfono o presupuesto (opcional)"}</button><div id="optional-fields" hidden={!optional}><div className="grid gap-6 pt-4 sm:grid-cols-2">            <FormField
              name="company"
              label="Empresa (opcional)"
              error={errors.company}
            >
              <input
                {...props("company")}
                autoComplete="organization"
                maxLength={150}
              />
            </FormField>
            <FormField
              name="phone"
              label="Teléfono (opcional)"
              error={errors.phone}
            >
              <input
                {...props("phone")}
                type="tel"
                autoComplete="tel"
                maxLength={40}
              />
            </FormField>
            <FormField
              name="budget"
              label="Presupuesto orientativo (opcional)"
              error={errors.budget}
            >
              <select {...props("budget")} defaultValue="">
                <option value="" key="budget-placeholder">Sin indicar</option>
                {Object.entries(budgetLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                Sirve para orientar el alcance; no son precios oficiales.
              </p>
            </FormField>
</div></div></div>
            <div className="sm:col-span-2">
              <label
                htmlFor="privacy"
                className="flex items-start gap-3 text-sm leading-6"
              >
                <input
                  {...props("privacy")}
                  className="mt-1 h-5 w-5 shrink-0 accent-violet"
                  type="checkbox"
                  required
                />
                <span>
                  {config.noticeUrl ? (
                    <>
                      He leído la{" "}
                      <a
                        href={config.noticeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet underline underline-offset-4"
                      >
                        información sobre el tratamiento de mis datos (nueva
                        pestaña)
                      </a>
                      .
                    </>
                  ) : config.testMode ? (
                    "He leído el aviso del modo de desarrollo y utilizaré solo datos de prueba."
                  ) : (
                    "Información sobre el tratamiento de datos pendiente de publicación."
                  )}
                </span>
              </label>
              {errors.privacy && (
                <p id="privacy-error" className="mt-2 text-sm text-red-700">
                  {errors.privacy}
                </p>
              )}
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute -left-[10000px] h-px w-px overflow-hidden"
          >
            <label htmlFor="website">No rellenes este campo</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        </fieldset>
        {message && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
          >
            {message}
            {retrySeconds > 0 && (
              <p aria-live="off">
                Podrás volver a intentarlo en {retrySeconds} segundos.
              </p>
            )}
          </div>
        )}
        <Button
          type="submit"
          disabled={!config.enabled || pending || retrySeconds > 0}
          className="mt-8 w-full"
        >
          {pending ? "Enviando solicitud..." : "Enviar solicitud"}
        </Button>
      </form>
    </div>
  );
}
