import Link from "next/link";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Container } from "@/components/ui/container";
import { navigation } from "@/config/navigation";
export function SiteFooter() {
  return (
    <footer className="bg-night py-12 text-white">
      <Container>
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div>
            <Link href="/" aria-label="ASIVQUARK, inicio">
              <BrandLogo />
            </Link>
            <p className="mt-3 text-xs tracking-widest text-secondary">
              Software &amp; Digital Products
            </p>
            <p className="mt-6 text-sm text-secondary">
              Estudio de desarrollo digital en Barcelona
            </p>
          </div>
          <nav
            aria-label="Navegación del pie"
            className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm sm:content-start"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-1 text-secondary hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-secondary sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} ASIVQUARK. Todos los derechos
            reservados.
          </p>
          <p>Software con propósito. Desde Barcelona.</p>
        </div>
      </Container>
    </footer>
  );
}
