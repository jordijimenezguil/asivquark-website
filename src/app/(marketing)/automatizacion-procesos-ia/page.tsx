import Link from "next/link";
import { Workflow } from "lucide-react";
import { automationService as service } from "@/content/automation";
import { Breadcrumbs, ContactCTA, FAQAccordion, FeatureGrid, JsonLd, ProcessSteps } from "@/components/marketing/commercial";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/config/site";
const contactHref = "/contacto/?servicio=automatizacion";
export const metadata = pageMetadata({ title: service.seoTitle, description: service.seoDescription, path: service.href });
export default function AutomationPage() {
  return <>
    {site.isProduction && <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", "@id": `${site.origin}${service.href}#service`, name: service.title, serviceType: "Automatización de procesos e inteligencia artificial para empresas", description: service.description, url: `${site.origin}${service.href}`, areaServed: "España", provider: { "@id": `${site.origin}/#organization` } }} />}
    <section className="bg-night pb-16 pt-12 text-white lg:pb-24 lg:pt-16"><Container>
      <Breadcrumbs label={service.navigationLabel} path={service.href} />
      <div className="max-w-4xl"><Workflow className="mb-6 text-violet-soft" size={32} aria-hidden="true" /><p className="eyebrow mb-7 text-violet-soft">AUTOMATIZACIÓN EMPRESARIAL · INTELIGENCIA ARTIFICIAL</p>
        <h1 className="text-[36px] font-bold leading-[1.05] tracking-[-.035em] sm:text-5xl lg:text-[64px]">{service.h1}</h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-secondary">{service.intro}</p>
        <div className="mt-8 flex flex-wrap gap-4"><Button href={contactHref} data-location="service">{service.cta} →</Button><Button href="#soluciones" variant="outline">Descubre qué podemos automatizar</Button></div>
      </div>
    </Container></section>
    {service.sections.slice(0, 5).map((section, index) => <FeatureGrid key={section.title} id={index === 1 ? "soluciones" : undefined} title={section.title} intro={section.intro} items={section.items} tinted={index % 2 === 1} />)}
    <ProcessSteps items={service.process} title="Así automatizamos tus procesos" />
    {service.sections.slice(5).map(section => <FeatureGrid key={section.title} title={section.title} intro={section.intro} items={section.items} />)}
    <FAQAccordion items={service.faqs} structuredData={false} />
    <Section space="sm"><Container><p className="max-w-2xl leading-7 text-ink-500">Para valorar tu proyecto, cuéntanos qué tarea se repite, qué herramientas utilizas, con qué frecuencia y dónde necesitas revisión humana. No incluyas documentos ni información empresarial confidencial en el formulario.</p></Container></Section>
    <ContactCTA title="¿Qué proceso te gustaría automatizar?" description="Cuéntanos qué tareas consumen tiempo en tu empresa. Analizaremos contigo qué opciones técnicas pueden ayudarte a simplificarlas." label={service.cta} href={contactHref} />
    <Section space="sm"><Container><Link href="/servicios/software-a-medida-barcelona/" className="inline-flex min-h-11 items-center font-semibold text-violet underline underline-offset-4">Ver desarrollo de software a medida →</Link></Container></Section>
    <SiteFooter cta={false} />
  </>;
}
