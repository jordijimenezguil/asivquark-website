// Small shared catalog: navigation and lead labels do not import landing copy.
export const serviceDefinitions = {
  web: { uiType: "web", query: "web", title: "Página web", navigationLabel: "Diseño web", footerLabel: "Diseño web", href: "/servicios/diseno-web-barcelona/" },
  software: { uiType: "software", query: "software", title: "Software a medida", navigationLabel: "Software a medida", footerLabel: "Software a medida", href: "/servicios/software-a-medida-barcelona/" },
  app: { uiType: "app", query: "aplicacion", title: "Aplicación web", navigationLabel: "Aplicaciones web", footerLabel: "Aplicaciones web", href: "/servicios/aplicaciones-web-barcelona/" },
  automatizacion: { uiType: "automatizacion", query: "automatizacion", title: "Automatización de procesos e IA", navigationLabel: "Automatización e IA", footerLabel: "Automatización de procesos e IA", href: "/automatizacion-procesos-ia/" },
  mvp: { uiType: "mvp", query: "mvp", title: "Desarrollo MVP", navigationLabel: "Desarrollo MVP", footerLabel: "Desarrollo MVP", href: "/servicios/desarrollo-mvp/" },
} as const;
