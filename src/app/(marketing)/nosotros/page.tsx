import Link from "next/link";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Principles } from "@/components/marketing/principles";
import {
  PageHero,
} from "@/components/marketing/commercial";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({
  title: "Sobre ASIVQUARK | IA y Software en Barcelona",
  description:
    "Conoce ASIVQUARK, un estudio de desarrollo digital en Barcelona especializado en automatización con IA, páginas web, aplicaciones y software a medida.",
  path: "/nosotros/",
});
export default function Page() {
  return (
    <>
      <PageHero
        label="Nosotros"
        path="/nosotros/"
        title="Un estudio de desarrollo digital en Barcelona"
        description="ASIVQUARK desarrolla automatizaciones con IA, páginas web, aplicaciones y software a medida. Nos interesa construir herramientas que encajen con las personas y los procesos que las utilizan."
      />
      <Section className="surface-paper">
        <Container className="grid gap-10 lg:grid-cols-2">
          <h2 className="section-title">A tu medida</h2>
          <div className="space-y-5 text-lg leading-8 text-fg-muted">
            <p>Trabajamos <Link href="/automatizacion-procesos-ia/" className="text-violet underline underline-offset-4">automatización de procesos e IA</Link> a precios populares, para conectar herramientas y simplificar operaciones existentes.</p>
            <p>Desarrollamos automatizaciones con IA para empresas que necesitan clasificar solicitudes, preparar información de documentos o consultar conocimiento interno. Partimos de una tarea concreta y acordamos cómo revisar sus resultados, mantener el control de los datos y ampliar la solución cuando aporte utilidad.</p>
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
              href="/servicios/"
              variant="ghost"
              className="px-0 text-violet"
            >
              Explora nuestros servicios →
            </Button>
          </div>
        </Container>
      </Section>
      <Section className="bg-night text-white"><Container className="grid items-center gap-10 lg:grid-cols-[1fr_2fr]"><BrandLogo variant="compact" size="lg" className="h-24" /><div><h2 className="section-title">Software con propósito. Desde Barcelona.</h2><p className="mt-5 text-secondary">Trabajamos con proyectos de toda España.</p></div></Container></Section><div className="surface-paper"><Principles /></div>

    </>
  );
}
