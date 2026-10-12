import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import { serviceDefinitions } from "../../config/services.ts";

export const categories = {
  "diseno-web": "Diseño web", "software-a-medida": "Software a medida",
  apps: "Aplicaciones web", mvp: "MVP", mantenimiento: "Mantenimiento",
  "automatizacion-ia": "Automatización e IA",
} as const;
const date = z.iso.date();
const localImage = z.string().regex(/^\/blog\/[a-z0-9/-]+\.(avif|webp|jpg|png)$/);
const schema = z.object({
  title: z.string().min(1).max(70), description: z.string().min(1).max(160),
  seoTitle: z.string().min(1).max(70).optional(),
  excerpt: z.string().min(1).max(300).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(["diseno-web", "software-a-medida", "apps", "mvp", "mantenimiento", "automatizacion-ia"]),
  author: z.string(), publishedAt: date, updatedAt: date.optional(),
  keyPoints: z.array(z.string().min(1)).min(3).max(6).optional(),
  tocLabel: z.record(z.string(), z.string().min(1).max(40)).optional(),
  serviceLink: z.object({ label: z.string().min(1), href: z.string().refine(href => Object.values(serviceDefinitions).some(service => service.href === href), "Servicio inexistente") }).optional(),
  sources: z.array(z.object({ org: z.string().min(1), title: z.string().min(1), url: z.url().startsWith("https://") })).optional(),
  cover: localImage.optional(), coverAlt: z.string().optional(),
  headerImage: z.object({ src: localImage, alt: z.string().min(1), width: z.number().int().positive().max(1440), height: z.number().int().positive() }).optional(),
  contactType: z.enum(["web", "software", "app", "mvp", "automatizacion", "otro"]),
  ctaTitle: z.string().min(1).optional(),
});
export type ArticleFrontmatter = z.infer<typeof schema>;
export type TocItem = { id: string; title: string; label: string; number: string };
const authors = z.record(z.string(), z.object({ name: z.string().min(1) })).parse(JSON.parse(readFileSync(path.join(process.cwd(), "content/authors.json"), "utf8")));
export function spanishSlugger() {
  const slugger = new GithubSlugger();
  return (text: string) => slugger.slug(text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
}
export function parseArticle(source: string, filename: string) {
  const parsed = matter(source);
  const data = schema.parse(parsed.data);
  if (data.slug !== filename) throw new Error(`Slug distinto del archivo: ${filename}`);
  if (!authors[data.author]) throw new Error(`Autor desconocido: ${data.author}`);
  if (data.updatedAt && data.updatedAt < data.publishedAt) throw new Error(`Fecha de actualización anterior: ${filename}`);
  if (data.cover && !existsSync(path.join(process.cwd(), "public", data.cover))) throw new Error(`Cover inexistente: ${data.cover}`);
  if (data.headerImage && !existsSync(path.join(process.cwd(), "public", data.headerImage.src))) throw new Error(`Cabecera inexistente: ${data.headerImage.src}`);
  const tree = unified().use(remarkParse).use(remarkMdx).parse(parsed.content);
  const slug = spanishSlugger();
  const toc: TocItem[] = [];
  visit(tree, "heading", node => {
    const title = toString(node);
    const id = slug(title);
    if (node.depth === 1) throw new Error(`No escribir H1 en MDX: ${filename}`);
    if (node.depth === 2) {
      if (title.length > 100) throw new Error(`H2 supera 100 caracteres: ${title}`);
      const label = data.tocLabel?.[id] ?? title.split(":")[0];
      if (label.length > 40) throw new Error(`Añade tocLabel para ${id}`);
      toc.push({ id, title, label, number: String(toc.length + 1).padStart(2, "0") });
    }
  });
  if (toc.length < 4 || toc.length > 12) throw new Error(`Usar 4–12 secciones: ${filename}`);
  const first = tree.children.find(node => node.type !== "mdxFlowExpression");
  if (!first || !(first.type === "paragraph" || (first.type === "mdxJsxFlowElement" && first.name === "Lead"))) throw new Error(`Comenzar con párrafo o Lead: ${filename}`);
  const end = first.position?.end.offset ?? 0;
  const start = first.position?.start.offset ?? 0;
  const lead = parsed.content.slice(start, end);
  const body = parsed.content.slice(end).trim();
  let serviceLinks = 0;
  visit(tree, "mdxJsxFlowElement", node => { if (node.name === "ServiceLink") serviceLinks++; });
  if (serviceLinks > 1 || (serviceLinks > 0 && !data.serviceLink)) throw new Error(`ServiceLink inválido: ${filename}`);
  const words = toString(tree).trim().split(/\s+/u).filter(Boolean).length;
  return { ...data, href: `/blog/${data.slug}/`, authorName: authors[data.author].name, lead, body, toc, readingMinutes: Math.max(1, Math.round(words / 220)) };
}
export type BlogArticle = ReturnType<typeof parseArticle>;
export function getArticles() {
  const directory = path.join(process.cwd(), "content/blog");
  return readdirSync(directory).filter(file => file.endsWith(".mdx")).map(file => parseArticle(readFileSync(path.join(directory, file), "utf8"), file.slice(0, -4))).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));
}
export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)).replaceAll(" de ", " ").replaceAll(".", "");
}
export function contactHref(article: Pick<BlogArticle, "slug" | "contactType">) {
  return `/contacto/?tipo=${article.contactType}&origen=blog-${article.slug}`;
}
export function relatedArticles(article: BlogArticle, all: BlogArticle[]) {
  const others = all.filter(item => item.slug !== article.slug);
  return [...others.filter(item => item.category === article.category), ...others.filter(item => item.category !== article.category)].slice(0, 3);
}
