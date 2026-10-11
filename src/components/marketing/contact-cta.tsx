import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
export function ContactCta() {
  return (
    <Section
      id="contacto"
      aria-labelledby="contact-title"
      className="bg-surface text-white"
    >
      <Container>
        <p className="eyebrow text-violet-soft">04 / EL SIGUIENTE PASO</p>
        <div className="mt-6 grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 id="contact-title" className="section-title">
              ¿Tienes un proyecto en mente?
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-secondary">
              Hablemos de lo que necesitas y encontremos la mejor forma de
              hacerlo realidad.
            </p>
          </div>
          <Button href="/#canal-contacto">
            Cuéntanos tu idea <ArrowUpRight size={18} aria-hidden="true" />
          </Button>
        </div>
        <div
          id="canal-contacto"
          className="mt-12 max-w-2xl border-t border-white/15 pt-6"
        >
          <h3 className="text-sm font-medium">
            Estamos preparando nuestro canal de contacto.
          </h3>
          <p className="mt-2 text-sm leading-6 text-secondary">
            Próximamente podrás compartir tu idea y solicitar un presupuesto
            directamente desde esta web.
          </p>
        </div>
      </Container>
    </Section>
  );
}
