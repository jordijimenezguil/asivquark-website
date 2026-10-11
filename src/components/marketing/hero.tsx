import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-night text-white">
      <Container className="pb-12 pt-16 sm:pt-24 lg:pt-28">
        <p className="eyebrow flex items-center gap-3 text-secondary">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-soft"
            aria-hidden="true"
          />
          ESTUDIO DE DESARROLLO DIGITAL · BARCELONA
        </p>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px] lg:items-end lg:gap-16">
          <div>
            <h1
              id="hero-title"
              className="max-w-4xl text-[clamp(2.65rem,5.6vw,5rem)] font-medium leading-[1.08] tracking-[-0.055em]"
            >
              Desarrollo de software y páginas web{" "}
              <span className="text-violet-soft">en Barcelona</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
              En ASIVQUARK transformamos ideas en soluciones digitales. Creamos
              páginas web, aplicaciones y software a medida para empresas y
              emprendedores.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/#contacto">
                Cuéntanos tu proyecto{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Button>
              <Button href="/#servicios" variant="outline">
                Explorar servicios <ArrowDown size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="hidden border-l border-white/15 pl-8 pb-2 lg:block"
          >
            <div className="mb-7 flex gap-2">
              <span className="h-12 w-12 rounded-lg border border-violet-soft/50 bg-violet/15" />
              <span className="mt-6 h-12 w-12 rounded-lg border border-white/15" />
            </div>
            <p className="font-mono text-xs leading-7 text-secondary">
              Ideas claras.
              <br />
              Código sólido.
              <br />
              <span className="text-white">Productos que avanzan.</span>
            </p>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-secondary sm:mt-20">
          <span>De la primera idea al producto digital.</span>
          <span className="font-mono">WEB / SOFTWARE / MVP</span>
        </div>
      </Container>
    </section>
  );
}
