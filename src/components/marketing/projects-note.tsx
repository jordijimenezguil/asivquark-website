import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
export function ProjectsNote() {
  return (
    <Section
      id="proyectos"
      aria-labelledby="projects-title"
      space="sm"
      className="border-t border-slate-200 bg-mist"
    >
      <Container className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow text-violet">03 / PROYECTOS</p>
          <h2
            id="projects-title"
            className="mt-3 text-2xl font-medium tracking-tight"
          >
            Un espacio para el trabajo que viene.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-slate-600">
          Estamos preparando nuestra selección de proyectos. Publicaremos casos
          reales con su contexto, proceso y resultados.
        </p>
      </Container>
    </Section>
  );
}
