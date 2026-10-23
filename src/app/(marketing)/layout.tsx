import { CookieConsentProvider } from "@/components/cookies/cookie-consent-provider";
import { JsonLd } from "@/components/marketing/commercial";
import { site } from "@/config/site";
import { EventObserver } from "@/components/marketing/event-observer";
import { AttributionTracker } from "@/components/forms/attribution-tracker";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="marketing">
      <CookieConsentProvider>
      <AttributionTracker />
      <EventObserver />
      {site.isProduction && <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", "@id": `${site.origin}/#organization`, name: site.name, url: `${site.origin}/`, email: site.email, logo: `${site.origin}/brand/asivquark-horizontal-dark.svg`, location: { "@type": "Place", name: "Barcelona, España" } }} />}
      <SiteHeader />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      </CookieConsentProvider>

    </div>
  );
}
