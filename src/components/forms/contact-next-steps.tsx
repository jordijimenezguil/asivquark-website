export function ContactNextSteps() {
  return <div className="mt-5"><h3 className="text-[17px] font-bold">Qué pasa después</h3><ol className="mt-5 flex flex-col gap-3.5">{[
    ["Respuesta en 24 h", "Te escribimos para agendar una conversación."],
    ["Llamada de 30 min", "Entendemos el problema y el contexto."],
    ["Propuesta por escrito", "Alcance, fases y presupuesto en lenguaje claro."],
  ].map(([title, description], index) => <li key={title} className="flex gap-3"><span className="pt-0.5 font-mono text-xs text-violet">0{index + 1}</span><div><p className="text-[15px] font-bold">{title}</p><p className="mt-1 text-sm opacity-80">{description}</p></div></li>)}</ol></div>;
}
