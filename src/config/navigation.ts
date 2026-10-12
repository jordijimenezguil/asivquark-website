export const serviceNavigation = [
  { label: "Diseño web", href: "/servicios/diseno-web-barcelona/" },
  { label: "Software a medida", href: "/servicios/software-a-medida-barcelona/" },
  { label: "Aplicaciones web", href: "/servicios/aplicaciones-web-barcelona/" },
  { label: "Desarrollo MVP", href: "/servicios/desarrollo-mvp/" },
] as const;
export const navigation = [
    { label: "Servicios", href: "/servicios/" },
  { label: "Proyectos", href: "/proyectos/" },
  { label: "Nosotros", href: "/nosotros/" },
  { label: "Cómo trabajamos", href: "/#proceso" },
] as const;
export const publicPaths = [
  "/",
  "/servicios/",
  ...serviceNavigation.map((item) => item.href),
  "/proyectos/",
  "/nosotros/",
  "/contacto/",
];
