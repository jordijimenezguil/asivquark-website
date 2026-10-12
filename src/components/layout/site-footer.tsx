import { legalDocuments } from "@/config/legal";
import { CookiePreferencesTrigger } from "@/components/cookies/cookie-preferences-trigger";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Container } from "@/components/ui/container";
import { serviceNavigation } from "@/config/navigation";
export function SiteFooter({ cta = true, ctaHref = "/contacto/", ctaLocation = "footer", ctaSlug }: { cta?: boolean; ctaHref?: string; ctaLocation?: string; ctaSlug?: string }) {
  return (
    <footer role="contentinfo" className="bg-night text-white">
      {cta && <div className="border-b border-white/10 py-16 lg:py-20"><Container className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]"><div><h2 className="text-4xl font-bold leading-[1.02] tracking-[-.035em] sm:text-5xl lg:text-[56px]">¿Tienes un proyecto en mente?</h2><p className="mt-5 text-secondary">Cuéntanoslo y te respondemos en 24 h laborables.</p></div><div className="flex flex-col gap-3 xl:flex-row xl:items-center"><Button href={ctaHref} data-location={ctaLocation} data-slug={ctaSlug}>Cuéntanos tu proyecto →</Button><a href="mailto:proyectos@asivquark.com" className="rounded-[10px] border border-white/20 px-5 py-4 text-center text-sm text-white">proyectos@asivquark.com ↗</a></div></Container></div>}
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label="ASIVQUARK, inicio">
              <BrandLogo size="lg" />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-secondary">
              Estudio de desarrollo de software y productos digitales en
              Barcelona.
            </p>
          </div>
          <nav aria-label="Servicios del pie">
            <h2 className="mb-4 text-sm font-medium">Servicios</h2>
            {serviceNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block min-h-11 py-3 text-sm text-secondary hover:text-white"
              >
                {item.footerLabel}
              </Link>
            ))}
          </nav>
          <nav aria-label="Empresa">
            <h2 className="mb-4 text-sm font-medium">Empresa</h2>
            {[
              { label: "Nosotros", href: "/nosotros/" },
              { label: "Proyectos", href: "/proyectos/" },
              { label: "Blog", href: "/blog/" },
              { label: "Contacto", href: "/contacto/" },
              { label: "Cómo trabajamos", href: "/#proceso" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block min-h-11 py-3 text-sm text-secondary hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Legal"><h2 className="mb-4 text-sm font-medium">Legal</h2>{legalDocuments.map(document => <Link key={document.id} href={document.path} className="block min-h-11 py-3 text-sm text-secondary hover:text-white">{document.title}</Link>)}<CookiePreferencesTrigger /></nav>
          <div>
            <h2 className="mb-4 text-sm font-medium">Contacto</h2>
            <a href="mailto:proyectos@asivquark.com" className="mb-3 block break-all text-sm text-secondary hover:text-white">proyectos@asivquark.com</a>
            <p className="text-sm leading-7 text-secondary">
              Barcelona, España.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p>
            © {new Date().getFullYear()} ASIVQUARK. Todos los derechos
            reservados.
          </p>

        </div>
      </Container>
    </footer>
  );
}
