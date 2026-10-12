export const serviceNavigation = [
  { label: "Diseño web", href: "/diseno-web-barcelona/" },
  { label: "Software a medida", href: "/desarrollo-software-medida/" },
  { label: "Aplicaciones web", href: "/desarrollo-aplicaciones-web/" },
  { label: "Desarrollo MVP", href: "/desarrollo-mvp/" },
] as const;
export const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Proyectos", href: "/proyectos/" },
  { label: "Nosotros", href: "/nosotros/" },
  { label: "Contacto", href: "/contacto/" },
] as const;
export const publicPaths = [
  "/",
  ...serviceNavigation.map((item) => item.href),
  "/proyectos/",
  "/nosotros/",
  "/contacto/",
];
