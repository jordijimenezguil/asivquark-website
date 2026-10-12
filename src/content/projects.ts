export type PublicProject = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  description: string;
  technologies: readonly string[];
  image: { src: string; alt: string; width: number; height: number } | null;
  published: boolean;
};
// Incorporar únicamente proyectos reales, documentados y autorizados para publicación.
export const projects: readonly PublicProject[] = [];
export const publishedProjects = projects.filter(
  (project) => project.published,
);
