"use client";
import { useState } from "react";
import { services, type Service } from "@/content/services";
import { Button } from "@/components/ui/button";
import { emitMarketingEvent } from "./events";
export function Configurator() {
 const [type, setType] = useState<Service["uiType"]>("web");
 const service = services.find(item => item.uiType === type)!;
 const labels = { web: "Empezar con una web", software: "Empezar con software a medida", app: "Empezar con una aplicación", mvp: "Empezar con un MVP" };
 return <div className="min-w-0 rounded-2xl border border-white/10 bg-navy-800 p-5 sm:p-7">
 <h2 className="mb-5 text-[15px] font-semibold">¿Qué necesitas?</h2>
 <div className="grid grid-cols-2 gap-2">{services.map(item => <button key={item.uiType} type="button" aria-pressed={type === item.uiType} onClick={() => { if(type !== item.uiType) { setType(item.uiType); emitMarketingEvent("configurator_select", { tipo: item.uiType }); } }} className={`min-h-12 rounded-[10px] border px-3 py-3 text-left text-sm font-semibold transition-colors ${type === item.uiType ? "border-violet bg-violet text-white" : "border-white/15 text-secondary hover:border-violet-300"}`}>{item.title}</button>)}</div>
 <div className="mt-5 border-t border-white/10 pt-5" aria-live="polite"><p className="text-[15px] leading-relaxed text-secondary">{service.description}</p><ul className="my-5 grid gap-3 text-sm text-secondary sm:grid-cols-2">{service.includes.map(item => <li key={item}><span className="mr-2 text-violet-300" aria-hidden="true">✓</span>{item}</li>)}</ul></div>
 <Button href={`/contacto/?tipo=${type}`} className="w-full justify-between" data-location="configurator">{labels[type]} <span aria-hidden="true">→</span></Button></div>;
}
