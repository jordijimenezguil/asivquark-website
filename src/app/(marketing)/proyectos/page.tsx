import { AutomationContext } from "@/components/marketing/automation-context";
import {
  PageHero,
} from "@/components/marketing/commercial";
import { ProjectList } from "@/components/marketing/project-list";
import { publishedProjects } from "@/content/projects";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({
  title: "Proyectos de Desarrollo Web y Software | ASIVQUARK",
  description:
    "Proyectos de automatización con IA, gestión de almacén y pedidos, gamificación, desarrollo web y SEO continuo. Conoce ASIVQUARK.",
  path: "/proyectos/",
});
export default function Page() {
  return (
    <>
      <PageHero
        label="Proyectos"
        path="/proyectos/"
        title="Proyectos"
        description="Proyectos reales de automatización con IA, aplicaciones a medida y desarrollo web. Desde procesos de facturación hasta gamificación y plataformas digitales, con trabajo SEO y posicionamiento continuo en los proyectos que lo requieren."
      />
      <AutomationContext context="projects" />
      <Section><Container><ProjectList projects={publishedProjects} /></Container></Section>

    </>
  );
}
