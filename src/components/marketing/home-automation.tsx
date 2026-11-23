import { Mail, Sparkles, UserCheck, Database, ChevronDown } from "lucide-react";
import { Spotlight } from "./spotlight";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const workflow = [
  { icon: Mail, title: "Llega una solicitud", detail: "Desde un formulario o correo" },
  { icon: Sparkles, title: "La IA clasifica", detail: "Organiza la información y prepara los datos" },
  { icon: UserCheck, title: "Tu equipo revisa", detail: "Valida el resultado y gestiona excepciones" },
  { icon: Database, title: "Se registra en tu CRM", detail: "La información llega a su destino" },
];

export function HomeAutomation() {
  return (
    <section id="automatizacion" className="overflow-hidden bg-ink-950 text-white">
      <Spotlight className="bg-hero-dots">
        <Container className="pb-20 pt-16 md:pt-24 lg:pb-28">
          <p className="eyebrow mb-9">AUTOMATIZACIÓN EMPRESARIAL · BARCELONA</p>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div className="min-w-0">
              <h2 className="text-h1 font-extrabold">Automatización con <span className="text-brand-400">IA para empresas</span></h2>
              <p className="mt-6 text-lead font-semibold text-brand-300">Soluciones a medida a precios populares.</p>
              <p className="mt-5 max-w-prose text-lead leading-relaxed text-fg-muted">Conectamos tus herramientas y automatizamos tareas repetitivas para que tu equipo pueda centrarse en el trabajo que necesita su atención.</p>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap">
                <Button href="/contacto/?tipo=automatizacion&origen=/" data-location="home_hero" data-conversion="project-contact">Quiero automatizar un proceso</Button>
                <Button href="/automatizacion-procesos-ia/" variant="outline">Descubre qué podemos automatizar</Button>
              </div>
              <p className="mt-6 text-sm text-fg-muted">Primera conversación sin compromiso · Respuesta en 24 h laborables</p>
            </div>
            <figure className="min-w-0 rounded-3xl border border-white/10 bg-ink-900 p-5 sm:p-8">
              <figcaption className="mb-6 flex flex-wrap items-center justify-between gap-3"><span className="font-bold">De la solicitud al CRM</span><span className="rounded-full border border-brand-400/30 px-3 py-1 text-sm text-brand-300">Ejemplo ilustrativo</span></figcaption>
              <ol>{workflow.map(({ icon: Icon, title, detail }, index) => <li key={title}>
                {index > 0 && <div className="ml-6 flex h-7 items-center border-l border-brand-400/30 pl-3"><ChevronDown size={16} className="text-brand-400" aria-hidden="true" /></div>}
                <div className={`flex items-start gap-4 rounded-2xl border p-4 ${index === 1 ? "border-brand-400/40 bg-brand-600/15" : "border-white/10 bg-ink-950"}`}><Icon className="mt-1 shrink-0 text-brand-400" size={22} aria-hidden="true" /><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-relaxed text-fg-muted">{detail}</p></div></div>
              </li>)}</ol>
              <p className="mt-6 text-sm leading-relaxed text-fg-muted">Un posible flujo, adaptado a tus herramientas y con revisión humana donde hace falta.</p>
            </figure>
          </div>
        </Container>
      </Spotlight>
    </section>
  );
}
