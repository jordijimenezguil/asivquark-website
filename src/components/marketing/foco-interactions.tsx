"use client";
import { useEffect, useRef, useState, useId } from "react";
import Link from "next/link";
import type { ContentItem, Service } from "@/content/services";
export function Marquee({ labels }: { labels: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} aria-hidden="true" className="my-6 -rotate-[1.5deg] overflow-hidden bg-brand-600 py-4 text-2xl font-extrabold text-white shadow-glow"><div className={`flex w-max motion-safe:animate-marquee ${visible ? "[animation-play-state:running]" : "[animation-play-state:paused]"}`}>{[0, 1].map(copy => <span key={copy} className="shrink-0">{labels.map(label => <span key={label} className="px-2">{label} ✦</span>)}</span>)}</div></div>;
}
export function ServiceExplorer({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const service = services[active];
  return <div className="mt-12">
    <div className="space-y-3 lg:hidden">{services.map((item, index) => <details key={item.slug} name={`${id}-mobile`} open={index === 0} className="rounded-2xl border border-white/10 bg-ink-900 p-5"><summary className="cursor-pointer text-xl font-bold"><span className="mr-4 font-mono text-xs text-brand-400">0{index + 1}</span>{item.title}</summary><p className="mt-5 leading-relaxed text-fg-muted">{item.description}</p><Link href={item.href} className="link-arrow mt-4">Ver servicio →</Link></details>)}</div>
    <div className="hidden gap-10 lg:grid lg:grid-cols-2">
      <div role="tablist" aria-label="Servicios" aria-orientation="vertical">{services.map((item, index) => <button key={item.slug} id={`${id}-tab-${index}`} role="tab" aria-selected={active === index} aria-controls={`${id}-panel`} tabIndex={active === index ? 0 : -1} onFocus={() => setActive(index)} onClick={() => setActive(index)} onMouseEnter={() => { if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) { setActive(index); } }} onKeyDown={event => { const next = event.key === "ArrowDown" ? (index + 1) % services.length : event.key === "ArrowUp" ? (index + services.length - 1) % services.length : event.key === "Home" ? 0 : event.key === "End" ? services.length - 1 : null; if (next !== null) { event.preventDefault(); setActive(next); document.getElementById(`${id}-tab-${next}`)?.focus(); } }} className={`flex min-h-20 w-full items-center gap-5 border-b border-white/10 text-left text-h3 font-bold transition duration-300 ${active === index ? "text-white motion-safe:translate-x-3" : "text-fg-subtle hover:text-white"}`}><span className="font-mono text-xs text-brand-400">0{index + 1}</span>{item.title}</button>)}</div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className="relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-3xl bg-brand-600 p-10 text-white"><span aria-hidden="true" className="absolute -top-12 right-0 text-[240px] font-extrabold leading-none text-white/15">0{active + 1}</span><span className="absolute top-10 font-mono text-xs tracking-[.25em]">SERVICIO 0{active + 1}</span><h3 className="relative text-h3 font-extrabold">{service.title}</h3><p className="relative mt-4 leading-relaxed">{service.description}</p><Link href={service.href} className="mt-7 flex min-h-12 items-center justify-between rounded-xl bg-ink-950 px-6 font-semibold">Ver servicio <span>→</span></Link></div>
    </div>
  </div>;
}
export function ProcessPanels({ items }: { items: ContentItem[] }) {
  const [active, setActive] = useState(items.length - 1);
  const id = useId();
  return <ol className="mt-12 flex flex-col gap-3 lg:h-[420px] lg:flex-row">{items.map((item, index) => <li key={item.title} className={`min-w-0 overflow-hidden rounded-3xl border border-white/10 transition-[flex-grow] duration-500 motion-reduce:transition-none ${active === index ? "bg-brand-600 lg:flex-[3.2]" : "bg-ink-900 lg:flex-1"}`}><button type="button" aria-expanded={active === index} aria-controls={`${id}-${index}`} onClick={() => setActive(index)} onFocus={() => setActive(index)} onMouseEnter={() => { if (window.matchMedia("(min-width:1024px) and (hover:hover) and (pointer:fine)").matches) setActive(index); }} className="flex min-h-24 w-full flex-col items-start p-6 text-left lg:h-full lg:p-8"><span className={`text-5xl font-extrabold lg:text-7xl ${active === index ? "text-white" : "[-webkit-text-stroke:1px_white] text-transparent"}`}>0{index + 1}</span><span className={`mt-5 font-bold lg:mt-auto ${active === index ? "text-h3" : "text-lg lg:[writing-mode:vertical-rl] lg:rotate-180"}`}>{item.title}</span><span id={`${id}-${index}`} hidden={active !== index} className="mt-3 text-sm leading-relaxed text-white">{item.description}</span></button></li>)}</ol>;
}
