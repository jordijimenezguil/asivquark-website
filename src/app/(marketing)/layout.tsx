import { AttributionTracker } from "@/components/forms/attribution-tracker";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AttributionTracker />
      <SiteHeader />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
