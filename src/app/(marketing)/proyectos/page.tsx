import { SiteFooter } from "@/components/layout/site-footer";
import {
  PageHero,
} from "@/components/marketing/commercial";
import { Suspense } from "react";
import { ProjectList } from "@/components/marketing/project-list";
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
        title="Proyectos"
        description="Cada proyecto parte de una necesidad concreta. Este espacio reunirá trabajos reales, con contexto sobre el problema, las decisiones y la solución desarrollada."
      />
      <Section><Container><Suspense fallback={<p className="text-ink-500">Aún no hay proyectos publicados. Publicaremos trabajos reales y autorizados.</p>}><ProjectList projects={publishedProjects} /></Suspense></Container></Section>
      <SiteFooter />
    </>
  );
}
