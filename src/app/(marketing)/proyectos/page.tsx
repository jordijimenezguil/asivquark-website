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
    "Proyectos de automatización con IA, software a medida, aplicaciones y desarrollo web, con SEO y posicionamiento continuo. Conoce ASIVQUARK.",
  path: "/proyectos/",
});
export default function Page() {
  return (
    <>
      <PageHero
        label="Proyectos"
        path="/proyectos/"
        title="Proyectos"
        description="Una selección de proyectos de automatización con IA, software a medida, aplicaciones y desarrollo web. Soluciones adaptadas a cada negocio, con SEO y posicionamiento continuo en los proyectos que lo requieren."
      />
      <AutomationContext context="projects" />
      <Section><Container><ProjectList projects={publishedProjects} /></Container></Section>

    </>
  );
}
