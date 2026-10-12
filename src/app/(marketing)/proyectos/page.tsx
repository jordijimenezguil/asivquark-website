import {
  PageHero,
  FeatureGrid,
  ContactCTA,
} from "@/components/marketing/commercial";
import { ProjectCard } from "@/components/marketing/project-card";
import { publishedProjects } from "@/content/projects";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({
  title: "Proyectos de Desarrollo Web y Software | ASIVQUARK",
  description:
    "Conoce el enfoque de ASIVQUARK para crear páginas web, aplicaciones y software a medida.",
  path: "/proyectos/",
});
export default function Page() {
  return (
    <>
      <PageHero
        label="Proyectos"
        path="/proyectos/"
        title="Nuestros proyectos"
        description="Cada proyecto parte de una necesidad concreta. Este espacio reunirá trabajos reales, con contexto sobre el problema, las decisiones y la solución desarrollada."
      />
      <Section>
        <Container>
          {publishedProjects.length ? (
            <div className="grid gap-6 md:grid-cols-2">
              {publishedProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 sm:p-14">
              <p className="eyebrow text-violet">EL TRABAJO, CON CONTEXTO</p>
              <h2 className="mt-5 text-3xl font-medium tracking-tight">
                Casos reales, cuando podamos contarlos bien
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-slate-600">
                Todavía no hay proyectos publicados en este portfolio.
                Incorporaremos casos documentados y autorizados, explicando qué
                necesidad resolvían y cómo se abordó el desarrollo.
              </p>
            </div>
          )}
        </Container>
      </Section>
      <FeatureGrid
        title="Qué guía nuestro trabajo"
        items={[
          {
            title: "El problema primero",
            description:
              "Antes de elegir herramientas, definimos qué necesita hacer el usuario y qué debe resolver la solución.",
          },
          {
            title: "Decisiones explícitas",
            description:
              "Acordamos alcance y prioridades para poder revisar el resultado con criterios claros.",
          },
          {
            title: "Una base mantenible",
            description:
              "Cuidamos la estructura, los recorridos y la documentación necesaria para evolucionar.",
          },
        ]}
      />
      <ContactCTA />
    </>
  );
}
