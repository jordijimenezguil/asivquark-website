import { SlidersHorizontal, Code2, MessagesSquare } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
const values = [
  {
    icon: SlidersHorizontal,
    title: "Desarrollo a medida",
    text: "Soluciones adaptadas a tus necesidades, sin complejidad innecesaria.",
  },
  {
    icon: Code2,
    title: "Calidad técnica",
    text: "Código mantenible, rendimiento y buenas prácticas de desarrollo.",
  },
  {
    icon: MessagesSquare,
    title: "Trato directo",
    text: "Comunicación clara y acompañamiento durante el proyecto.",
  },
];
export function ValueProposition() {
  return (
    <Section id="nosotros" aria-labelledby="value-title" className="bg-white">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-24">
        <div>
          <SectionHeading
            titleId="value-title"
            label="02 / CÓMO TRABAJAMOS"
            title="Tecnología pensada para resolver problemas reales"
            description="Cada proyecto es diferente. Por eso apostamos por soluciones personalizadas, tecnología adecuada y un proceso de desarrollo claro desde el primer día."
          />
        </div>
        <div>
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-5 border-b border-slate-200 py-6 first:pt-0 last:border-0"
            >
              <Icon
                size={22}
                strokeWidth={1.6}
                className="mt-1 shrink-0 text-violet"
                aria-hidden="true"
              />
              <div>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
