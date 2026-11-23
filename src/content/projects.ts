export type PublicProject = {
  slug: string;
  title: string;
  summary: string;
  tags: readonly string[];
  href?: string;
  automationHref?: string;
  category: "automatizacion" | "web" | "software" | "app" | "mvp";
  image: { src: string; alt: string; width: number; height: number } | null;
  published: boolean;
};
// Proyectos reales cuya incorporación al portfolio ha autorizado el propietario.
export const projects: readonly PublicProject[] = [
  {
    slug: "rutavana",
    tags: ["Automatización con IA", "Plataforma web", "SEO continuo"],
    title: "Rutavana",
    summary: "Automatización con IA de la publicación de anuncios en una plataforma de autocaravanas, campers y caravanas. Desarrollo del portal y SEO continuo, revisando indexación, búsquedas y contenidos para orientar el posicionamiento.",
    href: "https://rutavana.com/",
    automationHref: "https://rutavana.com/publicar/anuncio",
    category: "app",
    image: null,
    published: true,
  },
  {
    slug: "d7-tattoo",
    tags: ["Desarrollo web", "SEO continuo"],
    title: "D7 Tattoo",
    summary: "Web del estudio de tatuajes en Cerdanyola del Vallès, con artistas, galería y contacto. SEO local y posicionamiento continuo mediante revisión de indexación, búsquedas y contenidos sobre el estudio y sus estilos.",
    href: "https://d7tattoo.com/",
    category: "web",
    image: null,
    published: true,
  },
  {
    slug: "garraf-semsa",
    title: "Garraf Semsa",
    summary: "Automatización con inteligencia artificial de procesos relacionados con facturas para Garraf Semsa. Una aplicación de la IA a una tarea administrativa concreta de la empresa.",
    tags: ["Automatización con IA", "Facturas"],
    category: "automatizacion",
    image: null,
    published: true,
  },
  {
    slug: "startgamego",
    title: "Startgamego",
    summary: "Desarrollo de una aplicación de gamificación a medida. Startgamego aplica dinámicas de juego a la experiencia de uso, con un desarrollo adaptado a las necesidades del proyecto.",
    tags: ["App a medida", "Gamificación"],
    category: "app",
    image: null,
    published: true,
  },
  {
    slug: "gestion-almacen-pedidos",
    title: "Gestión interna de almacén y pedidos",
    summary: "Software a medida para la gestión interna de almacén y pedidos en varias empresas del Vallès. Soluciones adaptadas a la operativa de cada empresa para organizar su trabajo diario.",
    tags: ["Software a medida", "Almacén y pedidos"],
    category: "software",
    image: null,
    published: true,
  },
];
export const publishedProjects = projects.filter(
  (project) => project.published,
);
