import { Configurator } from "./configurator";
import { Spotlight } from "./spotlight";
import { Container } from "@/components/ui/container";
export function HomeHero() {
  return <section className="bg-ink-950 text-white"><Spotlight className="bg-hero-dots"><Container className="pb-20 pt-16 md:pt-24 lg:pb-28"><p className="eyebrow mb-9 flex items-center gap-3"><span className="size-2 rounded-full bg-brand-500 motion-safe:animate-pulse-dot" />Estudio de desarrollo digital · Barcelona</p><h1 className="max-w-6xl text-display font-extrabold">Desarrollo de software y <span className="text-outline">páginas web</span> en Barcelona</h1><div className="mt-12 grid items-end gap-9 lg:grid-cols-[.8fr_1.2fr] lg:gap-14"><div><p className="max-w-prose text-body leading-relaxed text-fg-muted">En ASIVQUARK transformamos ideas en soluciones digitales. Creamos páginas web, aplicaciones y software a medida para empresas y emprendedores.</p><div className="mt-6 flex flex-wrap gap-6 font-mono text-[11px] text-fg-muted"><span>✓ Sin compromiso</span><span>✓ Respuesta en 24 h</span></div></div><Configurator /></div></Container></Spotlight></section>;
}
