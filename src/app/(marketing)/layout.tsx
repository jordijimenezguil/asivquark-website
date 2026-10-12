import { EventObserver } from "@/components/marketing/event-observer";
import { AttributionTracker } from "@/components/forms/attribution-tracker";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { Manrope, Montserrat, JetBrains_Mono } from "next/font/google";
const sans = Manrope({ subsets: ["latin"], display: "swap", variable: "--font-marketing" });
const brand = Montserrat({ subsets: ["latin"], weight: "600", display: "swap", variable: "--font-brand" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--font-label" });
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`marketing ${sans.variable} ${brand.variable} ${mono.variable}`}>
      <AttributionTracker />
      <EventObserver />
      <SiteHeader />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>

    </div>
  );
}
