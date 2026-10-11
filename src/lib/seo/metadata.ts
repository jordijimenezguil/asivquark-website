import type { Metadata } from "next";
import { site } from "@/config/site";

export function pageMetadata({
  title = site.title,
  description = site.description,
  path = "/",
}: { title?: string; description?: string; path?: string } = {}): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(site.origin),
    alternates: site.isProduction
      ? { canonical: new URL(path, site.origin).href }
      : undefined,
    robots: { index: site.isProduction, follow: site.isProduction },
    openGraph: {
      title,
      description,
      siteName: site.name,
      locale: "es_ES",
      type: "website",
      url: new URL(path, site.origin).href,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
