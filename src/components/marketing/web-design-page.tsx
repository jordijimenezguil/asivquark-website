import { blogArticles } from "@/config/blog";
import Link from "next/link";
import { webDesignService as service, webDesignComparison } from "@/content/web-design";
import { ContactCTA, FAQAccordion, FeatureGrid, JsonLd, ProcessSteps, ServiceHero } from "./commercial";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { site } from "@/config/site";
const contactHref = "/contacto/?servicio=web";
export function WebDesignPage() {
  return <>
    {site.isProduction && <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", "@id": `${site.origin}${service.href}#service`, name: "Diseño web profesional", serviceType: "Diseño y desarrollo de páginas web para empresas", description: service.description, url: `${site.origin}${service.href}`, areaServed: "España", provider: { "@id": `${site.origin}/#organization` } }} />}
    <ServiceHero service={service} label="DISEÑO Y DESARROLLO WEB · BARCELONA" contactHref={contactHref} secondaryHref="#servicio-diseno-web" secondaryLabel="Descubre nuestro servicio" showDetails={false} />
    {service.sections.slice(0, 3).map((section, index) => <FeatureGrid key={section.title} id={index === 1 ? "servicio-diseno-web" : undefined} title={section.title} intro={section.intro} items={section.items} tinted={index === 1} />)}
    <Section><Container><h2 className="section-title">¿Qué diferencia una página web profesional de una web básica?</h2><p className="mt-6 max-w-3xl leading-7 text-ink-500">Una solución sencilla puede ser adecuada para una necesidad concreta. El carácter profesional depende de cómo se define, adapta y verifica la web, no solo de usar una plantilla o desarrollar desde cero. Esta comparación ayuda a valorar el alcance y la calidad; ninguna opción garantiza conversiones.</p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-line" role="region" aria-label="Comparación de alcances web, desplazable horizontalmente" tabIndex={0}><table className="w-full min-w-[640px] text-left text-sm"><caption className="p-4 text-left font-semibold">Criterios para comparar propuestas de diseño web</caption><thead><tr>{["Aspecto", "Alcance básico", "Enfoque profesional"].map(label => <th key={label} scope="col" className="border-b border-line bg-paper-soft p-4">{label}</th>)}</tr></thead><tbody>{webDesignComparison.map(row => <tr key={row.factor}><th scope="row" className="border-b border-line p-4 font-semibold">{row.factor}</th><td className="border-b border-line p-4 leading-6 text-ink-500">{row.basic}</td><td className="border-b border-line p-4 leading-6 text-ink-500">{row.professional}</td></tr>)}</tbody></table></div>
      <p className="mt-7 leading-7 text-ink-500">Para revisar estos criterios con más detalle, <Link href={blogArticles[0].href} className="font-semibold text-violet underline underline-offset-4">descubre qué debe tener una página web profesional</Link>.</p>
    </Container></Section>
    <FeatureGrid {...service.sections[3]} />
    <ProcessSteps items={service.process} title="Cómo desarrollamos tu página web" />
    <FeatureGrid {...service.sections[4]} />
    <Section space="sm"><Container><Button href={contactHref} data-location="service">Solicitar presupuesto personalizado →</Button></Container></Section>
    <FeatureGrid {...service.sections[5]} />
    <FAQAccordion items={service.faqs} title="Preguntas frecuentes sobre diseño web profesional" structuredData={false} />
    <ContactCTA title="Hablemos de tu nueva página web" description="Si necesitas una página web profesional para tu negocio, cuéntanos tu proyecto. Podemos ayudarte a definir una solución adaptada a tus necesidades." label={service.cta} href={contactHref} />
    <Section space="sm"><Container><p className="leading-7 text-ink-500">Si necesitas que los usuarios realicen operaciones desde el navegador, explora también nuestro <Link href="/servicios/aplicaciones-web-barcelona/" className="font-semibold text-violet underline underline-offset-4">servicio de desarrollo de aplicaciones web</Link>.</p></Container></Section>
    <SiteFooter cta={false} />
  </>;
}
