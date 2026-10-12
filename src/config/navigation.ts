import { serviceDefinitions } from "./services.ts";
export const serviceNavigation = Object.values(serviceDefinitions).map(service => ({ label: service.navigationLabel, footerLabel: service.footerLabel, href: service.href }));
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
