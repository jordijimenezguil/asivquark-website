"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  leadSchema,
  serviceLabels,
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
  initialService?: keyof typeof serviceLabels;
}) {
  const form = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const attempt = useRef<{ key: string; payload: string } | null>(null);
  const attribution = useRef<Attribution | null>(null);
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
      projectType: String(data.get("projectType") ?? ""),
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
      setMessage("Revisa los campos indicados antes de enviar.");
      const first = Object.keys(fields)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
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
      }
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
      setMessage(
        "No hemos podido confirmar el envío. Tus datos siguen aquí; puedes reintentar la misma solicitud.",
      );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  if (success) return <FormSuccess />;
  const props = (name: keyof FieldErrors) => ({
    id: name,
    name,
    className: "form-input",
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10">
      <h2 className="text-2xl font-medium tracking-tight">
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
        method="post"
        action="/api/leads/"
        noValidate
        aria-describedby="form-status"
        aria-busy={pending}
        className="mt-8"
      >
        <fieldset disabled={!config.enabled || pending}>
          <legend className="sr-only">Información de tu proyecto</legend>
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
              name="projectType"
              label="Tipo de proyecto"
              required
              error={errors.projectType}
            >
              <select
                {...props("projectType")}
                key={initialService ?? "empty"}
                defaultValue={initialService ?? ""}
                required
              >
                <option value="">Selecciona un tipo</option>
                {Object.entries(serviceLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField
              name="budget"
              label="Presupuesto orientativo (opcional)"
              error={errors.budget}
            >
              <select {...props("budget")} defaultValue="">
                <option value="">Sin indicar</option>
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
            <FormField
              name="description"
              label="Descripción del proyecto"
              required
              error={errors.description}
              className="sm:col-span-2"
            >
              <textarea
                {...props("description")}
                rows={6}
                required
                minLength={20}
                maxLength={5000}
                placeholder="Cuéntanos qué necesitas desarrollar, qué problema quieres resolver o en qué consiste tu idea."
              />
            </FormField>
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
          className="mt-8 w-full sm:w-auto"
        >
          {pending ? "Enviando solicitud..." : "Enviar solicitud"}
        </Button>
      </form>
    </div>
  );
}
