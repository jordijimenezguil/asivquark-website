import { getArticles } from "@/lib/blog/content";
import { site } from "@/config/site";
export const dynamic = "force-static";
const escapeXml = (value: string) => value.replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]!);
export function GET() {
  const items = getArticles().map(article => `<item><title>${escapeXml(article.title)}</title><link>${site.origin}${article.href}</link><guid isPermaLink="true">${site.origin}${article.href}</guid><description>${escapeXml(article.excerpt ?? article.description)}</description><category>${escapeXml(article.category)}</category><pubDate>${new Date(`${article.publishedAt}T12:00:00Z`).toUTCString()}</pubDate></item>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Blog ASIVQUARK</title><link>${site.origin}/blog/</link><description>Guías prácticas sobre diseño web, software a medida y producto digital.</description><language>es</language><atom:link href="${site.origin}/blog/rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", ...(!site.isProduction ? { "X-Robots-Tag": "noindex, nofollow" } : {}) } });
}
