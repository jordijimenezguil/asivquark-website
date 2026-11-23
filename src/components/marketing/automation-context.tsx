import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

const contexts = {
  web: {
    title: "Automatizaciones con IA conectadas a tu web",
    description: "Trabajamos automatizaciones con IA para empresas, conectadas al desarrollo de tu web. Podemos valorar un flujo que clasifique las solicitudes de tu web, prepare información para revisión y la conecte con tu CRM, según las herramientas que utilices.",
  },
  software: {
    title: "Automatizaciones con IA para tu software a medida",
    description: "Con automatizaciones e IA podemos ampliar tu herramienta para clasificar documentos, preparar borradores o facilitar consultas sobre información interna autorizada. Definimos qué tareas automatizar, los permisos y la revisión que necesita cada resultado antes de integrarlo en la operativa.",
  },
  app: {
    title: "Automatización con IA integrada en tu aplicación",
    description: "Desarrollamos automatizaciones con IA integradas en tu aplicación web para organizar solicitudes, extraer información o preparar respuestas que revise tu equipo. Valoramos cada función según sus datos, costes, accesos y utilidad para las personas que la utilizan.",
  },
  mvp: {
    title: "Automatizaciones con IA desde tu primera versión",
    description: "Desarrollamos automatizaciones e IA en primeras versiones de producto. Podemos acotar una función, como clasificar solicitudes o consultar documentos autorizados, y definir cómo comprobar su utilidad con usuarios antes de ampliar el producto.",
  },
  projects: {
    title: "Automatizaciones con IA para empresas",
    description: "Trabajamos automatizaciones con IA para conectar herramientas, clasificar solicitudes o preparar información documental. Nuestra oferta incluye también desarrollo y SEO, como muestran los proyectos de este portfolio. Analizamos tu proceso para proponer un alcance concreto y acordar cómo validar los resultados.",
  },
} as const;

export function AutomationContext({ context }: { context: keyof typeof contexts }) {
  const { title, description } = contexts[context];
  return (
    <Section className="bg-ink-900">
      <Container>
        <p className="eyebrow mb-5 text-brand-400">AUTOMATIZACIÓN E INTELIGENCIA ARTIFICIAL</p>
        <h2 className="section-title max-w-4xl">{title}</h2>
        <p className="mt-6 max-w-prose text-lg leading-8 text-fg-muted">{description}</p>
        <Link href="/automatizacion-procesos-ia/" className="mt-6 inline-flex min-h-12 items-center font-semibold text-brand-300 underline underline-offset-4">Explora nuestras soluciones de automatización con IA</Link>
      </Container>
    </Section>
  );
}
