import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
export function FormSuccess({ type, onRestart }: { type: string; onRestart: () => void }) {
  return (
    <div
      role="status"
      tabIndex={-1}
      id="lead-success"
      className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12"
    >
      <p className="mb-4 font-mono text-xs text-ink-500">Paso 3 de 3 · Confirmación</p>
      <CheckCircle2 className="mb-6 text-violet" aria-hidden="true" />
      <h2 className="text-3xl font-medium tracking-tight">
        Solicitud recibida
      </h2>
      <p className="mt-5 leading-8 text-slate-600">
        Gracias por contactar con ASIVQUARK. Hemos recibido la información de tu
        proyecto de {type.toLowerCase()}. Te respondemos en 24 h laborables.
      </p>
      <Button onClick={onRestart} variant="ghost" className="mt-8 text-violet">← Volver al formulario</Button>
    </div>
  );
}
