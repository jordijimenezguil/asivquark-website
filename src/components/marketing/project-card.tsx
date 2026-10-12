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
          className="mb-6 aspect-[4/3] w-full rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
      <p className="eyebrow text-violet">{project.category}</p>
      <h3 className="mt-4 text-2xl font-medium">{project.title}</h3>
      <p className="mt-4 leading-7 text-slate-600">{project.summary}</p>
    </Card>
  );
}
