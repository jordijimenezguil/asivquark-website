import { Globe2, Blocks, Layers3, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
const services = [
  {
    icon: Globe2,
    title: "Páginas web",
    text: "Diseñamos y desarrollamos páginas web modernas, rápidas y profesionales para negocios que quieren destacar online.",
    tag: "TU NEGOCIO, ONLINE",
  },
  {
    icon: Blocks,
    title: "Software a medida",
    text: "Creamos herramientas, plataformas y aplicaciones adaptadas a las necesidades reales de cada empresa.",
    tag: "TECNOLOGÍA QUE ENCAJA",
  },
  {
    icon: Layers3,
    title: "MVP y productos digitales",
    text: "Transformamos ideas en productos digitales funcionales, preparados para validar, evolucionar y crecer.",
    tag: "DE IDEA A PRODUCTO",
  },
];
export function ServicesOverview() {
  return (
    <Section
      id="servicios"
      aria-labelledby="services-title"
      className="bg-mist"
    >
      <Container>
        <div>
          <SectionHeading
            titleId="services-title"
            label="01 / QUÉ HACEMOS"
            title="Soluciones digitales para cada proyecto"
            description="Desde una página web profesional hasta una plataforma desarrollada completamente a medida."
          />
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, text, tag }, index) => (
            <Card key={title} className="flex flex-col">
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet/8 text-violet">
                  <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="font-mono text-xs text-slate-400">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-9 text-xl font-medium tracking-tight">
                {title}
              </h3>
              <p className="mt-4 grow text-sm leading-7 text-slate-600">
                {text}
              </p>
              <div className="mt-9 flex items-center justify-between border-t border-slate-100 pt-5">
                <span className="font-mono text-[10px] tracking-wider text-slate-500">
                  {tag}
                </span>
                <ArrowUpRight
                  size={17}
                  className="text-violet"
                  aria-hidden="true"
                />
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
