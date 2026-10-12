import {
  PageHero,
  FeatureGrid,
  ProcessSteps,
  ContactCTA,
} from "@/components/marketing/commercial";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({
  title: "Sobre ASIVQUARK | Estudio de Software en Barcelona",
  description:
    "Conoce ASIVQUARK, un estudio de desarrollo digital en Barcelona especializado en páginas web, aplicaciones y software a medida.",
  path: "/nosotros/",
});
export default function Page() {
  return (
    <>
      <PageHero
        label="Nosotros"
        path="/nosotros/"
        title="Un estudio de desarrollo digital en Barcelona"
        description="ASIVQUARK desarrolla páginas web, aplicaciones y software a medida. Nos interesa construir herramientas que encajen con las personas y los procesos que las utilizan."
      />
      <Section className="bg-white">
        <Container className="grid gap-10 lg:grid-cols-2">
          <h2 className="section-title">Entender antes de construir</h2>
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              La tecnología es una parte de la solución. La otra es comprender
              qué necesita el negocio, quién va a utilizar el producto y qué
              decisiones deben facilitarse.
            </p>
            <p>
              Trabajamos con profesionales y pequeñas empresas que necesitan una
              web, con empresas que buscan herramientas propias y con
              emprendedores que quieren dar forma a una primera versión.
            </p>
            <Button
              href="/#servicios"
              variant="ghost"
              className="px-0 text-violet"
            >
              Explora nuestros servicios →
            </Button>
          </div>
        </Container>
      </Section>
      <FeatureGrid
        title="Cómo entendemos el desarrollo"
        items={[
          {
            title: "Claridad",
            description:
              "Explicamos opciones y límites para que puedas tomar decisiones informadas.",
          },
          {
            title: "Calidad",
            description:
              "Cuidamos legibilidad, accesibilidad y mantenimiento, además del resultado visual.",
          },
          {
            title: "Proporción",
            description:
              "Ajustamos la solución al problema y evitamos añadir complejidad sin utilidad.",
          },
        ]}
      />
      <ProcessSteps
        items={[
          {
            title: "Escuchar",
            description:
              "Empezamos por tus necesidades y por el contexto del proyecto.",
          },
          {
            title: "Acordar",
            description:
              "Definimos entregables, prioridades y criterios de revisión.",
          },
          {
            title: "Compartir",
            description:
              "Hacemos visibles las decisiones y revisamos el trabajo contigo.",
          },
          {
            title: "Evolucionar",
            description:
              "Valoramos mejoras según necesidades reales y un alcance acordado.",
          },
        ]}
      />
      <Section>
        <Container>
          <h2 className="section-title">Desde Barcelona</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Nuestra base está en Barcelona y podemos colaborar con clientes de
            toda España. Organizamos la comunicación y las revisiones para
            mantener un contexto compartido durante el desarrollo.
          </p>
        </Container>
      </Section>
      <ContactCTA />
    </>
  );
}
