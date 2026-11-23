import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { PublicProject } from "@/content/projects";
export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <Card className="flex h-full flex-col">
      {project.image && (
        <Image
          {...project.image}
          alt={project.image.alt}
          className="mb-6 aspect-[4/3] w-full rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
      <p className="eyebrow text-violet md:min-h-10">{project.tags.join(" · ")}</p>
      <h3 className="mt-4 text-2xl font-medium md:min-h-[2.8em]">{project.title}</h3>
      <p className="mt-4 leading-7 text-fg-muted">{project.summary}</p>
      {(project.automationHref || project.href) && <div className="mt-auto flex flex-wrap gap-x-5 pt-6">
      {project.automationHref && <a href={project.automationHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center self-start font-semibold text-brand-300 underline underline-offset-4">Ver publicación con IA<span className="sr-only"> (se abre en una pestaña nueva)</span></a>}
      {project.href && <a href={project.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center self-start font-semibold text-brand-300 underline underline-offset-4">Visitar {project.title}<span className="sr-only"> (se abre en una pestaña nueva)</span></a>}
      </div>}
    </Card>
  );
}
