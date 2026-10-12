"use client";
import { useEffect } from "react";
import { emitMarketingEvent } from "./events";
export function EventObserver() {
  useEffect(() => {
    const activatedQuestions = new WeakSet<HTMLDetailsElement>();
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const question = event.target.closest("summary")?.parentElement;
      if (question instanceof HTMLDetailsElement && question.dataset.question) {
        activatedQuestions.add(question);
      }
      const cta = event.target.closest<HTMLAnchorElement>('a[href^="/contacto/"]');
      if (cta) {
        emitMarketingEvent("cta_click", {
          slug: cta.dataset.slug,
          location: cta.dataset.location ?? (cta.closest("header") ? "header" : cta.closest("footer") ? "footer" : "service"),
        });
      }
    };
    const toggle = (event: Event) => {
      const question = event.target;
      if (!(question instanceof HTMLDetailsElement) || !activatedQuestions.has(question)) return;
      activatedQuestions.delete(question);
      if (question.open && question.dataset.question) {
        emitMarketingEvent("faq_open", { pregunta: question.dataset.question });
      }
    };
    document.addEventListener("click", click);
    document.addEventListener("toggle", toggle, true);
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("toggle", toggle, true);
    };
  }, []);
  return null;
}
