import { ServiceExplorer } from "@/components/marketing/foco-interactions";
import { ServiceBanner } from "@/components/marketing/service-banner";
import { HomeHero } from "@/components/marketing/home-hero";
import { automationService } from "@/content/automation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import {
  ProcessSteps,
  FAQAccordion,

  JsonLd,
  ContactCTA,
  FeatureGrid,
} from "@/components/marketing/commercial";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/config/site";
export const metadata = pageMetadata({
  title: "Automatización con IA para Empresas en Barcelona | ASIVQUARK",
  description: "Automatizamos tareas repetitivas, conectamos herramientas e integramos IA en los procesos de tu empresa. Desarrollo web y software a medida desde Barcelona.",
});
export default function Home() {
  return (
    <>
      {site.isProduction && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${site.origin}/#website`,
                name: "ASIVQUARK",
                url: `${site.origin}/`,
                inLanguage: "es-ES",
                publisher: { "@id": `${site.origin}/#organization` },
              },
            ],
          }}
        />
      )}
      <HomeHero />
      <FeatureGrid
        id="automatizacion"
        title="¿Qué tarea se repite cada día en tu empresa?"
        intro="Empezamos por un proceso concreto. Estos son ejemplos de lo que podemos ayudarte a automatizar, según tus herramientas y las necesidades de tu equipo."
        items={[
          { title: "Clasificar correos y solicitudes", description: "Organizar las entradas por contenido y dirigirlas al equipo adecuado, con revisión de los casos que lo necesiten." },
          { title: "Extraer datos de documentos", description: "Preparar información de facturas y otros documentos para que tu equipo la valide antes de registrarla." },
          { title: "Conectar tus herramientas", description: "Sincronizar información entre formularios, CRM y sistemas de gestión mediante las conexiones disponibles." },
          { title: "Preparar respuestas con IA", description: "Generar borradores a partir de información autorizada para que una persona los revise antes de enviarlos." },
        ]}
      />
      <Container className="pb-16"><Button href="/automatizacion-procesos-ia/" variant="outline">Conoce el servicio de automatización e IA</Button></Container>
      <ServiceBanner labels={services.map(service => service.title)} />
      <div className="bg-ink-950 py-16"><Container className="grid gap-4 sm:grid-cols-3">{[
        ["Precio cerrado por fase", "Cada fase se aprueba antes de empezar. Sin sorpresas."],
        ["Entregas cada dos semanas", "Ves el avance real y ajustas prioridades."],
        ["El código es tuyo", "Repositorio y accesos a tu nombre desde el primer día."],
      ].map(([title, text], index) => <div key={title} className="card"><span className="mb-6 block text-5xl font-extrabold text-brand-500">0{index + 1}</span><h2 className="font-bold">{title}</h2><p className="mt-3 text-sm leading-relaxed text-ink-500">{text}</p></div>)}</Container></div>
      <Section id="servicios">
        <Container>
          <SectionHeading
            label="NUESTROS SERVICIOS"
            title="Herramientas para tu negocio a precios populares"
            href="/servicios/"
            linkLabel="Todos los servicios →"
          />
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-500">Completamos tus procesos con páginas web, software a medida, aplicaciones y MVP. Definimos cada solución según las necesidades de tu negocio.</p>
          <ServiceExplorer services={services.filter(service => service.uiType !== "automatizacion")} />

        </Container>
      </Section>
      <ProcessSteps items={automationService.process} title="De una tarea repetitiva a un proceso conectado" />
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <SectionHeading
              label="CRITERIO EN CADA DECISIÓN"
              title="IA, desarrollo y SEO con continuidad"
            />
            <div>
              <p className="text-lg leading-8 text-fg-muted">
                Automatizamos la publicación de contenidos con IA, conectamos herramientas y desarrollamos plataformas y webs adaptadas a cada negocio. Combinamos estos procesos con una estructura pensada para facilitar el uso y la visibilidad en buscadores.
              </p>
              <p className="mt-5 leading-7 text-fg-muted">
                El SEO forma parte del proyecto y continúa después del lanzamiento: revisar indexación, analizar búsquedas y mejorar contenidos permite orientar los siguientes pasos del posicionamiento.
              </p>
              <Link
                href="/proyectos/"
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-violet"
              >
                Ver todos los proyectos
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
      <FAQAccordion
        items={[
          ...automationService.faqs.slice(0, 5),
          { question: "¿También desarrolláis webs y software a medida?", answer: "Sí. Creamos páginas web, software a medida, aplicaciones web y MVP. Podemos abordar un proyecto independiente o valorar su integración con los procesos de tu empresa." },
        ]}
      />
      <ContactCTA title="¿Qué tarea se repite cada día en tu empresa?" description="Cuéntanos cómo la resolvéis hoy y qué herramientas utilizáis. Valoraremos contigo qué partes conviene automatizar." label="Hablemos de tu proceso" href="/contacto/?tipo=automatizacion&origen=/" />
    </>
  );
}
