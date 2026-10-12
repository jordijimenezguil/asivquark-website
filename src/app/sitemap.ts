import type { MetadataRoute } from "next";
import { legalDocuments, legalReadiness } from "@/config/legal";
import { site } from "@/config/site";
import { publicPaths } from "@/config/navigation";
import { getArticles } from "@/lib/blog/content";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.isProduction) return [];

  const articles = getArticles();
  const paths = [...new Set([
    ...publicPaths,
    ...(legalReadiness().ready ? legalDocuments.map(document => document.path) : []),
    ...articles.map(article => article.href),
  ])];

  return paths.map(path => {
    const article = articles.find(article => article.href === path);
    const isService = path === "/servicios/" || path.startsWith("/servicios/") || path === "/automatizacion-procesos-ia/";
    return {
      url: `${site.origin}${path}`,
      ...(article ? { lastModified: article.updatedAt ?? article.publishedAt } : {}),
      changeFrequency: path === "/" || path === "/blog/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : isService ? 0.8 : article ? 0.6 : 0.5,
    };
  });
}
