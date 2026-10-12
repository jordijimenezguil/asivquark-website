import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/branding/brand-logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { NavigationLinks } from "./navigation-links";
import { MobileNavigation } from "./mobile-navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night text-white">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[90px]">
        <Link href="/" aria-label="ASIVQUARK, inicio">
          <BrandLogo />
        </Link>
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-5 lg:flex"
        >
          <NavigationLinks />
        </nav>
        <Button
          href="/contacto/"
          variant="primary"
          className="hidden min-h-10 px-4 lg:inline-flex"
        >
          Cuéntanos tu proyecto <ArrowUpRight size={16} aria-hidden="true" />
        </Button>
        <MobileNavigation />
      </Container>
    </header>
  );
}
