import type { MetadataRoute } from "next";
import { site } from "@/config/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return site.isProduction ? [{ url: `${site.origin}/` }] : [];
}
