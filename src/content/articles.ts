// Compatibility exports for existing service/blog integrations. MDX is the source.
import { getArticles } from "../lib/blog/content.ts";
export const articles = getArticles();
export const professionalWebArticle = articles.find(article => article.slug === "que-debe-tener-una-pagina-web-profesional")!;
