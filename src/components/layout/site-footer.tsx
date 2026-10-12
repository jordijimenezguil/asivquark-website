import Link from "next/link";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Container } from "@/components/ui/container";
import { serviceNavigation } from "@/config/navigation";
export function SiteFooter() {
  return (
    <footer className="bg-night py-16 text-white">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="ASIVQUARK, inicio">
              <BrandLogo />
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
                {item.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Empresa">
            <h2 className="mb-4 text-sm font-medium">Empresa</h2>
            {[
              { label: "Nosotros", href: "/nosotros/" },
              { label: "Proyectos", href: "/proyectos/" },
              { label: "Contacto", href: "/contacto/" },
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
          <div>
            <h2 className="mb-4 text-sm font-medium">Ubicación</h2>
            <p className="text-sm leading-7 text-secondary">
              Barcelona, España.
            </p>
            <p className="mt-5 text-sm leading-7 text-secondary">
              Software con propósito.
              <br />
              Desde Barcelona.
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-secondary">
          <p>
            © {new Date().getFullYear()} ASIVQUARK. Todos los derechos
            reservados.
          </p>
          {/* Incorporar enlaces legales solo cuando existan contenidos aprobados. */}
        </div>
      </Container>
    </footer>
  );
}
