import { Suspense } from "react";
import { PageHero } from "@/components/marketing/commercial";
import { ContactForm } from "@/components/forms/contact-form";
import { getContactConfig } from "@/config/contact";
import { ContactFormWithService } from "@/components/forms/contact-form-with-service";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({
  title: "Contacto y Presupuestos de Desarrollo | ASIVQUARK",
  description:
    "¿Necesitas una página web, software a medida o desarrollar una idea? Contacta con ASIVQUARK y cuéntanos tu proyecto.",
  path: "/contacto/",
});
export default function Page() {
  const { enabled, testMode, noticeUrl } = getContactConfig();
  const config = { enabled, testMode, noticeUrl };
  return (
    <>
      <PageHero
        label="Contacto"
        path="/contacto/"
        title="Hablemos de tu proyecto"
        description="Una página web, una herramienta para tu empresa o una idea que quieres probar. El primer paso es aclarar qué necesitas y qué debe resolver."
      />
      <Section>
        <Container className="grid items-start gap-12 lg:grid-cols-[1fr_1.6fr]">
          <aside>
            <p className="eyebrow text-violet">ANTES DE EMPEZAR</p>
            <h2 className="mt-5 text-3xl font-medium tracking-tight">
              Un buen punto de partida
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              Para valorar un proyecto, conviene conocer el contexto, los
              usuarios y las funcionalidades principales.
            </p>
            <ul className="mt-7 space-y-4 border-t border-slate-200 pt-7 text-slate-600">
              <li>Qué problema quieres resolver.</li>
              <li>Quién utilizará la solución.</li>
              <li>Qué necesitas en la primera versión.</li>
              <li>Si hay sistemas o contenidos existentes.</li>
            </ul>
            <p className="mt-8 text-sm leading-7 text-slate-600">
              Barcelona, España. Podemos trabajar con proyectos de toda España.
              El envío solo se confirma cuando el servidor ha registrado tu
              solicitud.
            </p>
          </aside>
          <Suspense fallback={<ContactForm config={config} />}>
            <ContactFormWithService config={config} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
