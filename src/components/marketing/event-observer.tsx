"use client";
import { useEffect } from "react";
import { emitMarketingEvent } from "./events";
export function EventObserver() {
 useEffect(() => {
 const initiallyOpen = new WeakSet<HTMLDetailsElement>();
 document.querySelectorAll<HTMLDetailsElement>("details[open][data-question]").forEach(element => initiallyOpen.add(element));
 const click = (event: MouseEvent) => { const element = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="/contacto/"]') : null; if(element) emitMarketingEvent("cta_click", { location: element.dataset.location ?? (element.closest("header") ? "header" : element.closest("footer") ? "footer" : "service") }); };
 const toggle = (event: Event) => { if(event.target instanceof HTMLDetailsElement && event.target.dataset.question) { if(initiallyOpen.has(event.target)) { initiallyOpen.delete(event.target); return; } if(event.target.open) emitMarketingEvent("faq_open", { pregunta: event.target.dataset.question }); } };
 document.addEventListener("click", click); document.addEventListener("toggle", toggle, true);
 return () => { document.removeEventListener("click", click); document.removeEventListener("toggle", toggle, true); };
 }, []); return null;
}
