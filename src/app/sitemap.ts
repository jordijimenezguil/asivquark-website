import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { publicPaths } from "@/config/navigation";
export default function sitemap(): MetadataRoute.Sitemap {
  return site.isProduction
    ? publicPaths.map((path) => ({ url: `${site.origin}${path}` }))
    : [];
}
