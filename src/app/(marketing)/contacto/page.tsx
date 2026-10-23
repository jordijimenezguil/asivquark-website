import Link from "next/link";
import { Suspense } from "react";
import { JsonLd } from "@/components/marketing/commercial";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactNextSteps } from "@/components/forms/contact-next-steps";
import { ContactFormWithService } from "@/components/forms/contact-form-with-service";
import { getContactConfig } from "@/config/contact";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({
  title: "Contacto | ASIVQUARK — Desarrollo web y software en Barcelona",
  description: "Cuéntanos tu proyecto de web, aplicación o software a medida. Respuesta en 24 h laborables, sin compromiso.",
  path: "/contacto/",
});
export default function Page() {
  const { enabled, testMode, noticeUrl } = getContactConfig();
  const config = { enabled, testMode, noticeUrl };
  return <>
    {site.isProduction && <><JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", "@id": `${site.origin}/contacto/#page`, url: `${site.origin}/contacto/`, name: "Contacto | ASIVQUARK", mainEntity: { "@type": "Organization", "@id": `${site.origin}/#organization`, name: site.name, email: "hola@asivquark.com", areaServed: "Barcelona" } }} /><JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: `${site.origin}/` }, { "@type": "ListItem", position: 2, name: "Contacto", item: `${site.origin}/contacto/` }] }} /></>}
    <div className="bg-navy lg:bg-ink-900"><div className="contact-layout lg:mx-auto lg:grid lg:max-w-[1280px] lg:grid-cols-[1fr_520px] lg:items-start lg:gap-16 lg:px-16 lg:py-20">
      <section className="contact-intro bg-hero-grid bg-grid-28 flex flex-col gap-2 px-5 pb-[22px] pt-5 text-white sm:px-8 sm:pb-10 sm:pt-8 lg:px-0 lg:py-0">
        <nav aria-label="Ruta de navegación" className="flex gap-2 text-xs text-secondary sm:text-sm"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page" className="text-mist">Contacto</span></nav>
        <h1 className="contact-title text-h1 font-extrabold">Hablemos de tu proyecto</h1>
        <p className="max-w-[520px] text-[15px] leading-normal text-secondary sm:text-lg lg:hidden">Te respondemos en 24 h laborables, sin compromiso.</p>
        <p className="hidden max-w-[520px] text-lg leading-normal text-secondary lg:block">Una página web, una herramienta para tu empresa o una idea que quieres probar. El primer paso es aclarar qué necesitas y qué debe resolver.</p>
        <div className="hidden flex-col lg:flex"><ContactNextSteps /><div className="mt-8 border-t border-white/10 pt-5"><p className="text-sm text-secondary">¿Prefieres escribir?</p><a className="inline-flex min-h-11 items-center font-semibold text-violet-200" href="mailto:hola@asivquark.com">hola@asivquark.com</a></div></div>
      </section>
      <Suspense fallback={<ContactForm config={config} />}><ContactFormWithService config={config} /></Suspense>
    </div></div>

  </>;
}
