import { ContactNextSteps } from "./contact-next-steps";
export function FormSuccess({ onRestart }: { onRestart: () => void }) {
  return <div role="status">
    <div aria-hidden="true" className="mb-4 flex size-11 items-center justify-center rounded-full bg-violet-50 text-violet">✓</div>
    <h2 id="lead-success" tabIndex={-1} className="text-[22px] font-bold">Solicitud enviada</h2>
    <p className="mt-3 text-[15px] text-ink-600">Te escribimos en 24 h laborables para agendar una llamada de 30 minutos.</p>
    <div className="text-ink-600 lg:hidden"><ContactNextSteps /></div>
    <button type="button" onClick={onRestart} className="mt-5 min-h-11 text-sm font-semibold text-violet">Enviar otra solicitud</button>
  </div>;
}
