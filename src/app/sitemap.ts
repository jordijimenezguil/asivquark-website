import type { MetadataRoute } from "next";
import { legalDocuments, legalReadiness } from "@/config/legal";
import { site } from "@/config/site";
import { publicPaths } from "@/config/navigation";
import { getArticles } from "@/lib/blog/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return site.isProduction
    ? [...new Set([...publicPaths, ...(legalReadiness().ready ? legalDocuments.map(document => document.path) : []), ...getArticles().map(article => article.href)])].map((path) => ({ url: `${site.origin}${path}` }))
    : [];
}
