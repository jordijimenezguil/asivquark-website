import { legalDocuments } from "@/config/legal";
import { CookiePreferencesTrigger } from "@/components/cookies/cookie-preferences-trigger";
import { CTASection } from "@/components/marketing/cta-section";
import Link from "next/link";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Container } from "@/components/ui/container";
import { serviceNavigation } from "@/config/navigation";
export function SiteFooter({ cta = true, ctaHref = "/contacto/", ctaLocation = "footer", ctaSlug, minimal = false }: { minimal?: boolean; cta?: boolean; ctaHref?: string; ctaLocation?: string; ctaSlug?: string }) {
  if (minimal) return <footer className="bg-night px-5 py-7 text-secondary"><nav aria-label="Legal" className="mx-auto flex max-w-[1152px] flex-wrap items-center gap-x-5 gap-y-1 text-xs">{legalDocuments.map(document => <Link className="inline-flex min-h-11 items-center hover:text-white" key={document.id} href={document.path}>{document.title}</Link>)}<CookiePreferencesTrigger /><span>© {new Date().getFullYear()} ASIVQUARK</span></nav></footer>;
  return (
    <footer role="contentinfo" className="bg-night text-white">
      {cta && <CTASection href={ctaHref} location={ctaLocation} slug={ctaSlug} />}
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div className="min-w-0">
            <Link href="/" aria-label="ASIVQUARK, inicio">
              <BrandLogo size="lg" />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-secondary">
              Estudio de desarrollo de software y productos digitales en
              Barcelona.
            </p>
          </div>
          <nav aria-label="Servicios del pie">
            <details open className="group border-b border-white/10 pb-4 lg:border-0"><summary className="flex min-h-11 cursor-pointer items-center font-bold lg:pointer-events-none">Servicios</summary>
            {serviceNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block min-h-11 py-3 text-sm text-secondary hover:text-white"
              >
                {item.footerLabel}
              </Link>
            ))}
            </details>
          </nav>
          <nav aria-label="Empresa">
            <details open className="group border-b border-white/10 pb-4 lg:border-0"><summary className="flex min-h-11 cursor-pointer items-center font-bold lg:pointer-events-none">Empresa</summary>
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
            </details>
          </nav>
          <nav aria-label="Legal"><details open className="border-b border-white/10 pb-4 lg:border-0"><summary className="flex min-h-11 cursor-pointer items-center font-bold lg:pointer-events-none">Legal</summary>{legalDocuments.map(document => <Link key={document.id} href={document.path} className="block min-h-11 py-3 text-sm text-secondary hover:text-white">{document.title}</Link>)}<CookiePreferencesTrigger /></details></nav>
          <div>
            <details open><summary className="flex min-h-11 cursor-pointer items-center font-bold lg:pointer-events-none">Contacto</summary>
            <a href="mailto:proyectos@asivquark.com" className="mb-3 block break-all text-sm text-secondary hover:text-white">proyectos@asivquark.com</a>
            <p className="text-sm leading-7 text-secondary">
              Barcelona, España.
            </p></details>
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
