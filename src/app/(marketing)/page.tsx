import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import {
  PageHero,
  FeatureGrid,
  ProcessSteps,
  FAQAccordion,
  ContactCTA,
  ServiceCard,
  JsonLd,
} from "@/components/marketing/commercial";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/config/site";
export const metadata = pageMetadata();
export default function Home() {
  return (
    <>
      {site.isProduction && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${site.origin}/#organization`,
                name: "ASIVQUARK",
                url: `${site.origin}/`,
                location: { "@type": "Place", name: "Barcelona, España" },
              },
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
      <PageHero
        home
        label="ESTUDIO DE DESARROLLO DIGITAL · BARCELONA"
        title="Desarrollo de software y páginas web en Barcelona"
        description="En ASIVQUARK transformamos ideas en soluciones digitales. Creamos páginas web, aplicaciones y software a medida para empresas y emprendedores."
        cta="Cuéntanos tu proyecto"
        href="/contacto/"
      />
      <Section className="bg-white">
        <Container>
          <SectionHeading
            label="EL PUNTO DE PARTIDA"
            title="¿Qué necesitas desarrollar?"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Una página web para mi negocio",
                description:
                  "Creamos páginas web profesionales para empresas, autónomos y negocios que necesitan una presencia digital sólida.",
                href: "/diseno-web-barcelona/",
                cta: "Desarrollo web",
              },
              {
                title: "Software para mi empresa o proyecto",
                description:
                  "Diseñamos y desarrollamos aplicaciones, plataformas y herramientas digitales a medida.",
                href: "/desarrollo-software-medida/",
                cta: "Software a medida",
              },
            ].map((item, index) => (
              <Card
                key={item.href}
                className={
                  index ? "border-surface bg-surface text-white" : "bg-mist"
                }
              >
                <p
                  className={`eyebrow ${index ? "text-violet-soft" : "text-violet"}`}
                >
                  0{index + 1}
                </p>
                <h3 className="mt-6 max-w-sm text-3xl font-medium tracking-tight">
                  {item.title}
                </h3>
                <p
                  className={`mt-5 max-w-md leading-7 ${index ? "text-secondary" : "text-slate-600"}`}
                >
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className={`mt-8 inline-flex min-h-11 items-center gap-3 font-medium ${index ? "text-violet-soft" : "text-violet"}`}
                >
                  {item.cta}
                  <ArrowUpRight size={20} aria-hidden="true" />
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <Section id="servicios">
        <Container>
          <SectionHeading
            label="NUESTROS SERVICIOS"
            title="Soluciones digitales adaptadas a cada proyecto"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </Container>
      </Section>
      <FeatureGrid
        title="Tecnología que aporta valor a tu negocio"
        tinted
        items={[
          {
            title: "Soluciones a medida",
            description:
              "Partimos de tus objetivos y procesos para decidir qué solución tiene sentido.",
          },
          {
            title: "Calidad técnica",
            description:
              "Cuidamos estructura, accesibilidad y mantenimiento desde las primeras decisiones.",
          },
          {
            title: "Comunicación directa",
            description:
              "Compartimos prioridades, alcance y decisiones con un lenguaje claro.",
          },
          {
            title: "Desarrollo preparado para evolucionar",
            description:
              "Construimos una base mantenible y planificamos mejoras cuando sean necesarias.",
          },
        ]}
      />
      <ProcessSteps
        items={[
          {
            title: "Entendemos tu proyecto",
            description:
              "Escuchamos qué necesitas, para quién y qué dificultades quieres resolver.",
          },
          {
            title: "Definimos la solución",
            description:
              "Acordamos alcance, prioridades y criterios para revisar el resultado.",
          },
          {
            title: "Diseñamos y desarrollamos",
            description:
              "Convertimos la definición en una experiencia funcional y cuidada.",
          },
          {
            title: "Lanzamos y evolucionamos",
            description:
              "Preparamos la puesta en marcha y valoramos los siguientes pasos.",
          },
        ]}
      />
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <SectionHeading
              label="CRITERIO EN CADA DECISIÓN"
              title="Proyectos construidos con propósito"
            />
            <div>
              <p className="text-lg leading-8 text-slate-600">
                Una solución útil empieza por entender el problema. Definimos
                recorridos, organizamos la información y elegimos la tecnología
                según las necesidades del proyecto.
              </p>
              <p className="mt-5 leading-7 text-slate-600">
                Publicaremos casos reales cuando estén documentados y
                autorizados. Mientras tanto, puedes conocer qué aspectos guían
                nuestro trabajo.
              </p>
              <Link
                href="/proyectos/"
                className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-violet"
              >
                Conoce nuestro enfoque de proyectos
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
      <Section className="bg-white">
        <Container>
          <SectionHeading
            title="Desarrollo de software en Barcelona, para proyectos de cualquier lugar"
            description="ASIVQUARK tiene su base en Barcelona. Trabajamos también con empresas y emprendedores de toda España, organizando la comunicación y las revisiones según cada proyecto."
          />
          <Link
            href="/contacto/"
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-violet"
          >
            Hablemos de lo que necesitas
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </Container>
      </Section>
      <FAQAccordion
        items={[
          {
            question: "¿Qué tipo de proyectos desarrolla ASIVQUARK?",
            answer:
              "Páginas web profesionales, software a medida, aplicaciones web y MVP. El punto de partida es entender el problema y definir una solución con un alcance claro.",
          },
          {
            question: "¿Desarrolláis páginas web para pequeños negocios?",
            answer:
              "Sí. Diseñamos webs para autónomos, profesionales y pequeños negocios, con contenido claro y una experiencia adaptable al móvil.",
          },
          {
            question: "¿Podéis crear software totalmente personalizado?",
            answer:
              "Sí. Definimos flujos, reglas e integraciones según las necesidades de la empresa y revisamos la viabilidad antes de acordar el desarrollo.",
          },
          {
            question:
              "¿Trabajáis con emprendedores que todavía tienen una idea?",
            answer:
              "Sí. Podemos ayudar a concretar el recorrido principal y las funcionalidades de una primera versión para probar la propuesta.",
          },
          {
            question: "¿Cómo se prepara un presupuesto?",
            answer:
              "Revisamos objetivos, usuarios, funcionalidades, contenidos e integraciones. Con esa información definimos alcance y estimación; no hay un precio único para todos los proyectos.",
          },
          {
            question: "¿Trabajáis con clientes fuera de Barcelona?",
            answer:
              "Sí. Podemos trabajar con clientes de toda España mediante comunicación remota y revisiones organizadas.",
          },
        ]}
      />
      <ContactCTA />
    </>
  );
}
