import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { navigation } from "@/config/navigation";
import { MobileNavigation } from "./mobile-navigation";

export function SiteHeader() {
  return (
    <header className="relative z-30 border-b border-white/10 bg-night text-white">
      <Container className="flex h-20 items-center justify-between gap-6 sm:h-24">
        <Link href="/" aria-label="ASIVQUARK, inicio">
          <BrandLogo />
        </Link>
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-7 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-sm text-secondary transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button
          href="/#contacto"
          variant="outline"
          className="hidden min-h-10 px-4 md:inline-flex"
        >
          Hablemos <ArrowUpRight size={16} aria-hidden="true" />
        </Button>
        <MobileNavigation />
      </Container>
    </header>
  );
}
