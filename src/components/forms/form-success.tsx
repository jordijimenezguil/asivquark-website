import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
export function FormSuccess() {
  return (
    <div
      role="status"
      tabIndex={-1}
      id="lead-success"
      className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12"
    >
      <CheckCircle2 className="mb-6 text-violet" aria-hidden="true" />
      <h2 className="text-3xl font-medium tracking-tight">
        ¡Solicitud recibida!
      </h2>
      <p className="mt-5 leading-8 text-slate-600">
        Gracias por contactar con ASIVQUARK. Hemos recibido la información de tu
        proyecto.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center font-medium text-violet"
      >
        Volver al inicio →
      </Link>
    </div>
  );
}
