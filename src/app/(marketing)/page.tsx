import { ServiceExplorer } from "@/components/marketing/foco-interactions";
import { ServiceBanner } from "@/components/marketing/service-banner";
import { HomeHero } from "@/components/marketing/home-hero";
import { process } from "@/content/marketing";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import {
  ProcessSteps,
  FAQAccordion,

  JsonLd,
} from "@/components/marketing/commercial";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
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
            title="¿Qué necesitas desarrollar?"
            href="/servicios/"
            linkLabel="Todos los servicios →"
          />
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-500">En ASIVQUARK transformamos ideas en soluciones digitales. Creamos páginas web, aplicaciones y software a medida para empresas y emprendedores.</p>
          <ServiceExplorer services={services} />
          <div className="mt-10 flex flex-wrap items-center gap-5 rounded-2xl border border-dashed border-white/20 p-6"><h3 className="font-bold">Proyectos recientes</h3><p className="flex-1 text-sm text-fg-muted">Publicaremos proyectos reales cuando estén documentados y autorizados.</p><Link href="/proyectos/" className="text-brand-300">Ver todos →</Link></div>
        </Container>
      </Section>
      <ProcessSteps items={process} />
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <SectionHeading
              label="CRITERIO EN CADA DECISIÓN"
              title="Proyectos construidos con propósito"
            />
            <div>
              <p className="text-lg leading-8 text-fg-muted">
                Una solución útil empieza por entender el problema. Definimos
                recorridos, organizamos la información y elegimos la tecnología
                según las necesidades del proyecto.
              </p>
              <p className="mt-5 leading-7 text-fg-muted">
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
      <FAQAccordion
        items={[
          {
            question: "¿Qué tipo de proyectos desarrolla ASIVQUARK?",
            answer:
              "Páginas web profesionales y corporativas, software a medida, aplicaciones web, MVP y automatización de procesos e IA. El punto de partida es entender el problema y definir una solución con un alcance claro.",
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


    </>
  );
}
