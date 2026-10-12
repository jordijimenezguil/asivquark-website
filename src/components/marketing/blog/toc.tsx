"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TocItem } from "@/lib/blog/content";
export function TocDesktop({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const headings = items.map(item => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const visible = new Set<string>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      const first = headings.find(heading => visible.has(heading.id));
      if (first) setActive(first.id);
      else {
        const previous = [...headings].reverse().find(heading => heading.getBoundingClientRect().top <= 96);
        if (previous) setActive(previous.id);
      }
    }, { rootMargin: "-96px 0px -60% 0px" });
    headings.forEach(heading => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);
  return <nav aria-label="En este artículo"><p className="mb-3 font-mono text-xs uppercase tracking-[.14em] text-ink-500">En este artículo</p>{items.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined} onClick={() => setActive(item.id)} className={`flex gap-3 border-l-2 py-2 pl-3.5 text-[15px] leading-snug transition-colors ${active === item.id ? "border-violet font-bold text-ink" : "border-line font-medium text-ink-500 hover:text-ink"}`}><span className="pt-0.5 font-mono text-xs text-violet">{item.number}</span>{item.label}</a>)}</nav>;
}
export function TocMobile({ items }: { items: TocItem[] }) {
  const details = useRef<HTMLDetailsElement>(null);
  return <details ref={details} className="group mt-6 rounded-[14px] border border-line lg:hidden"><summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-5 text-[15px] font-semibold">En este artículo · {items.length} secciones<ChevronDown size={18} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180" /></summary><nav aria-label="En este artículo" className="flex flex-col px-5 pb-4">{items.map(item => <a key={item.id} href={`#${item.id}`} onClick={() => { if (details.current) details.current.open = false; }} className="flex min-h-12 gap-3 py-2.5 text-[15px] text-ink-600"><span className="pt-0.5 font-mono text-xs text-violet">{item.number}</span>{item.label}</a>)}</nav></details>;
}
