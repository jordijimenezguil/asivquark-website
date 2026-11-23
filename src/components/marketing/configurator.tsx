"use client";
import { useState } from "react";
import { services } from "@/content/services";
import { emitMarketingEvent } from "./events";
const options = [
  { type: "automatizacion", label: "Automatización con IA", short: "automatización con IA" },
  { type: "web", label: "Página web", short: "página web" },
  { type: "software", label: "Software a medida", short: "software" },
  { type: "app", label: "Aplicación web", short: "aplicación" },
  { type: "mvp", label: "Desarrollo MVP", short: "MVP" },
] as const;
export function Configurator() {
  const [type, setType] = useState<(typeof options)[number]["type"]>("web");
  const selected = options.find(option => option.type === type)!;
  const service = services.find(item => item.uiType === type)!;
  return <form method="get" action="/contacto/" onSubmit={() => emitMarketingEvent("cta_click", { location: "home_hero", tipo: type })} className="Configurator mx-0 flex w-full min-w-0 flex-col gap-3 rounded-[18px] border border-white/10 bg-white/[.04] backdrop-blur p-4 sm:mx-0 sm:p-6 md:max-w-[600px] lg:mx-0 lg:max-w-none lg:gap-4 lg:rounded-2xl lg:p-7">
    <div className="flex items-center justify-between"><h2 id="configurator-title" className="text-[15px] font-bold lg:text-lg">¿Qué necesitas?</h2><span className="font-mono text-[11px] text-mist-500" aria-label="Paso 1 de 3">1 / 3</span></div>
    <fieldset className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-2.5"><legend className="sr-only">Tipo de proyecto</legend>{options.map((option, index) => <button key={option.type} type="button" aria-pressed={type === option.type} onClick={() => { setType(option.type); emitMarketingEvent("configurator_select", { tipo: option.type }); }} className={`min-h-11 min-w-0 rounded-xl border px-2 py-3 text-left text-xs font-semibold ${type === option.type ? "border-brand-500 bg-brand-600 text-white" : "border-white/16 bg-transparent text-[#D6D8E2]"}`}><span className="mb-1 block font-mono text-[10px]">0{index + 1}</span>{option.label}</button>)}<input type="hidden" name="tipo" value={type} /></fieldset>
    <div className="configurator-summary"><div className="border-t border-white/[.08] pt-4" aria-live="polite"><p className="text-[15px] leading-relaxed text-secondary">{service.description}</p><ul className="sr-only">{service.includes.map(item => <li key={item}><span className="mr-2 text-violet-300" aria-hidden="true">✓</span>{item}</li>)}</ul></div>
    <button type="submit" className="flex min-h-[50px] cursor-pointer items-center justify-between rounded-xl bg-brand-600 px-4 text-[15px] font-bold text-white hover:bg-brand-700 lg:min-h-12 lg:bg-brand-600 lg:text-white lg:hover:bg-violet-600"><span className="text-pretty">Continuar con {selected.short}</span><span aria-hidden="true">→</span></button>
    </div><div className="flex gap-3.5 text-xs text-mist-500 lg:hidden"><span>✓ Sin compromiso</span><span>✓ Respuesta en 24 h</span></div>
    <noscript><p className="text-sm text-secondary">Selecciona el tipo y pulsa Continuar. Se enviará la opción marcada.</p></noscript>
  </form>;
}
