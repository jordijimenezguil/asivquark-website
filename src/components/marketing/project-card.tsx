import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { PublicProject } from "@/content/projects";
export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <Card>
      {project.image && (
        <Image
          {...project.image}
          alt={project.image.alt}
          className="mb-6 h-auto w-full rounded-lg"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      <p className="eyebrow text-violet">{project.category}</p>
      <h3 className="mt-4 text-2xl font-medium">{project.title}</h3>
      <p className="mt-4 leading-7 text-slate-600">{project.summary}</p>
      <p className="mt-4 leading-7 text-slate-600">{project.description}</p>
      <ul aria-label="Tecnologías" className="mt-6 flex flex-wrap gap-2">
        {project.technologies.map((technology) => (
          <li key={technology} className="rounded bg-mist px-3 py-2 text-sm">
            {technology}
          </li>
        ))}
      </ul>
    </Card>
  );
}
