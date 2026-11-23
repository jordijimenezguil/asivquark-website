import type { PublicProject } from "@/content/projects";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";

export function ProjectList({ projects }: { projects: readonly PublicProject[] }) {
  return (
    <div className="grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:grid-cols-3">
      {projects.filter(project => project.published).map(project => (
        <ProjectCard key={project.slug} project={project} />
      ))}
      <div className="flex flex-col justify-between rounded-[14px] bg-brand-600 p-8 text-white">
        <h2 className="text-3xl font-bold">¿El siguiente es el tuyo?</h2>
        <Button href="/contacto/" variant="secondary" className="mt-8" data-location="project_card">Cuéntanos tu proyecto →</Button>
      </div>
    </div>
  );
}
