import { site } from "@/config/site";
import { ContactTestBanner } from "./contact-test-banner";
import Link from "next/link";
import { BrandLogo } from "@/components/branding/brand-logo";
import { NavigationLinks } from "./navigation-links";
import { MobileNavigation } from "./mobile-navigation";
import { HeaderContactLink } from "./header-contact-link";
export function SiteHeader() {
  return <>{!site.isProduction && process.env.NEXT_PUBLIC_ENV !== "production" && <ContactTestBanner />}<header className="sticky top-0 z-50 border-b border-white/10 bg-night text-white"><div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 pl-5 pr-4 lg:h-[90px] lg:gap-6 lg:px-16"><Link href="/" aria-label="ASIVQUARK, inicio" className="min-w-0 flex-1"><BrandLogo className="header-logo" /></Link><nav aria-label="Navegación principal" className="hidden items-center gap-5 lg:flex"><NavigationLinks /></nav><div className="flex shrink-0 items-center gap-2"><HeaderContactLink /><MobileNavigation /></div></div></header></>;
}
