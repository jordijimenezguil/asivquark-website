"use client";
import { useState } from "react";
import { services } from "@/content/services";
import { emitMarketingEvent } from "./events";
const options = [
  { type: "web", label: "Página web", short: "página web" },
  { type: "software", label: "Software a medida", short: "software" },
  { type: "app", label: "Aplicación web", short: "aplicación" },
  { type: "mvp", label: "Desarrollo MVP", short: "MVP" },
] as const;
export function Configurator() {
  const [type, setType] = useState<(typeof options)[number]["type"]>("web");
  const selected = options.find(option => option.type === type)!;
  const service = services.find(item => item.uiType === type)!;
  return <form method="get" action="/contacto/" onSubmit={() => emitMarketingEvent("cta_click", { location: "home_hero", tipo: type })} className="Configurator mx-3 flex max-w-[560px] min-w-0 flex-col gap-3 rounded-[18px] border border-white/10 bg-navy-800 p-4 sm:mx-8 sm:p-6 md:max-w-[600px] lg:mx-0 lg:max-w-none lg:gap-4 lg:rounded-2xl lg:p-7">
    <div className="flex items-center justify-between"><h2 id="configurator-title" className="text-[15px] font-bold lg:text-lg">¿Qué necesitas?</h2><span className="font-mono text-[11px] text-mist-500" aria-label="Paso 1 de 3">1 / 3</span></div>
    <fieldset className="grid grid-cols-2 gap-2 lg:gap-2.5"><legend className="sr-only">Tipo de proyecto</legend>{options.map((option, index) => <label key={option.type} className="configurator-option relative cursor-pointer"><input type="radio" name="tipo" value={option.type} defaultChecked={option.type === "web"} onChange={() => { setType(option.type); emitMarketingEvent("configurator_select", { tipo: option.type }); }} className="peer sr-only" /><span className="flex min-h-[52px] flex-col gap-0.5 rounded-xl border border-white/15 bg-transparent px-3 py-2.5 text-left text-sm font-semibold leading-tight text-white transition-colors hover:border-white/30 peer-checked:border-violet peer-checked:bg-violet peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-300 lg:min-h-16 lg:p-4 lg:text-[15px]"><span className="option-number font-mono text-[10px] text-violet-300 lg:text-[11px]">0{index + 1}</span>{option.label}</span></label>)}</fieldset>
    <div className="hidden border-t border-white/[.08] pt-4 lg:block" aria-live="polite"><p className="text-[15px] leading-relaxed text-secondary">{service.description}</p><ul className="mt-4 grid gap-3 text-sm text-secondary sm:grid-cols-2">{service.includes.map(item => <li key={item}><span className="mr-2 text-violet-300" aria-hidden="true">✓</span>{item}</li>)}</ul></div>
    <button type="submit" className="flex min-h-[50px] cursor-pointer items-center justify-between rounded-xl bg-white px-4 text-[15px] font-bold text-navy hover:bg-mist lg:min-h-12 lg:bg-violet lg:text-white lg:hover:bg-violet-600"><span className="whitespace-nowrap">Continuar con {selected.short}</span><span aria-hidden="true">→</span></button>
    <div className="flex gap-3.5 text-xs text-mist-500 lg:hidden"><span>✓ Sin compromiso</span><span>✓ Respuesta en 24 h</span></div>
    <noscript><p className="text-sm text-secondary">Selecciona el tipo y pulsa Continuar. Se enviará la opción marcada.</p></noscript>
  </form>;
}
