import { SiteFooter } from "@/components/layout/site-footer";
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
      <div className="bg-night pb-24 lg:pb-32"><PageHero
        label="Contacto"
        path="/contacto/"
        title="Hablemos de tu proyecto"
        description="Una página web, una herramienta para tu empresa o una idea que quieres probar. El primer paso es aclarar qué necesitas y qué debe resolver."
      />
      </div>
      <Section className="relative -mt-24 pt-0 lg:-mt-32">
        <Container className="grid items-start gap-12 lg:grid-cols-[1fr_1.5fr]">
          <aside className="order-2 lg:order-1 lg:pt-[150px]">
            <h2 className="text-2xl font-bold">Qué pasa después</h2>
            <ol className="mt-8 space-y-8">{[
              ["Te respondemos", "En 24 h laborables por email."],
              ["Llamada de 30 minutos", "Hablamos del problema, los usuarios y la primera necesidad."],
              ["Propuesta por escrito", "Alcance, fases y presupuesto cerrado."],
            ].map(([title, description], index) => <li key={title} className="grid grid-cols-[40px_1fr] gap-4"><span className="font-mono text-sm text-violet">0{index + 1}</span><div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-ink-500">{description}</p></div></li>)}</ol><div className="mt-10 border-t border-line pt-8"><h3 className="font-bold">¿Prefieres escribirnos?</h3><a href="mailto:hola@asivquark.com" className="mt-3 block break-all text-violet">hola@asivquark.com ↗</a><p className="mt-4 text-sm text-ink-500">Barcelona, España</p></div>
          </aside>
          <div className="order-1 min-w-0 lg:order-2"><Suspense fallback={<ContactForm config={config} />}>
            <ContactFormWithService config={config} />
          </Suspense></div>
        </Container>
      </Section>
      <SiteFooter cta={false} />
    </>
  );
}
