import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";
import { categories, formatDate, spanishSlugger, type BlogArticle, type ArticleFrontmatter } from "@/lib/blog/content";

export function Lead({ children }: { children: ReactNode }) {
  return <div className="article-lead text-article-lead text-ink-700">{children}</div>;
}
export function KeyPoints({ items }: { items: string[] }) {
  return <div className="mt-7 flex flex-col gap-4 rounded-[14px] border border-line p-5 sm:px-8 sm:py-7"><p className="font-mono text-xs uppercase tracking-[.14em] text-violet">Lo que vas a revisar</p><ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-7">{items.map(item => <li key={item} className="flex gap-2.5 text-base leading-snug text-ink-700"><span aria-hidden="true" className="font-bold text-violet">✓</span>{item}</li>)}</ul></div>;
}
export function AsideCta({ href, slug, ctaTitle = "¿Quieres que revisemos tu web con estos criterios?", variant = "aside" }: { href: string; slug: string; ctaTitle?: string; variant?: "aside" | "inline" }) {
  return <div data-blog-inline={variant === "inline" ? "true" : undefined} className={`flex flex-col gap-3 rounded-xl bg-violet-50 p-5 ${variant === "inline" ? "mt-6 sm:flex-row sm:items-center sm:justify-between sm:p-6 lg:hidden" : ""}`}><div><p className="text-base font-bold leading-snug text-ink">{ctaTitle}</p><p className="mt-3 text-sm text-ink-500">Respuesta en 24 h laborables.</p></div><Link href={href} data-slug={slug} data-location={variant === "inline" ? "blog_inline" : "blog_aside"} className={`flex min-h-12 items-center justify-between gap-4 rounded-lg bg-violet px-3.5 text-sm font-semibold text-white hover:bg-violet-600 ${variant === "inline" ? "shrink-0 sm:w-auto" : "w-full"}`}>Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link></div>;
}
export function ServiceLink({ label, href }: NonNullable<ArticleFrontmatter["serviceLink"]>) {
  return <Link href={href} className="not-prose inline-flex min-h-12 items-center gap-1.5 text-[17px] font-semibold text-violet hover:text-violet-800">{label}<span aria-hidden="true">→</span></Link>;
}
export function Sources({ items }: { items: NonNullable<ArticleFrontmatter["sources"]> }) {
  return <section className="not-prose mt-14 flex flex-col gap-4 border-t border-line pt-10" aria-labelledby="article-sources"><h2 id="article-sources" className="text-lg font-bold text-ink">Fuentes para ampliar</h2><div className="grid gap-3 sm:grid-cols-2">{items.map(item => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1 rounded-[10px] border border-line px-[18px] py-4 transition-colors hover:border-violet"><span className="text-[13px] text-ink-500">{item.org}</span><span className="text-[15px] font-semibold leading-snug text-ink">{item.title} <span aria-hidden="true">↗</span></span><span className="sr-only">(se abre en una pestaña nueva)</span></a>)}</div></section>;
}
export function SectionHeading({ number, children, ...props }: ComponentProps<"h2"> & { number?: string }) {
  return <div className="article-section-heading">{number && <span className="mb-2 block font-mono text-[13px] font-normal text-violet" aria-hidden="true">{number}</span>}<h2 {...props}>{children}</h2></div>;
}
function spanishHeadingIds() {
  return (tree: Root) => {
    const slug = spanishSlugger();
    visit(tree, "heading", node => {
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: slug(toString(node)) } };
    });
  };
}
export async function ArticleBody({ article }: { article: BlogArticle }) {
  const { content } = await compileMDX({ source: article.body, options: { mdxOptions: { remarkPlugins: [spanishHeadingIds], rehypePlugins: [rehypeSlug] } }, components: {
    h2: ({ id, children, ...props }: ComponentProps<"h2">) => <SectionHeading {...props} id={id} number={article.toc.find(item => item.id === id)?.number}>{children}</SectionHeading>,
    Lead,
    ServiceLink: () => article.serviceLink ? <ServiceLink {...article.serviceLink} /> : null,
  } });
  return <div className="prose prose-asiv mt-14">{content}</div>;
}
export async function ArticleLead({ article }: { article: BlogArticle }) {
  const { content } = await compileMDX({ source: article.lead, components: { Lead: ({ children }: { children: ReactNode }) => <>{children}</> } });
  return <Lead>{content}</Lead>;
}
export function PostImage({ article, priority = false }: { article: BlogArticle; priority?: boolean }) {
  return <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[#EEF0F4]">{article.cover && <Image src={article.cover} alt={article.coverAlt ?? ""} width={1200} height={630} priority={priority} loading={priority ? undefined : "lazy"} sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw" className="size-full object-cover transition-transform group-hover:scale-[1.02] motion-reduce:transform-none" />}</div>;
}
export function PostMeta({ article }: { article: BlogArticle }) {
  return <p className="text-sm text-ink-500"><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {article.readingMinutes} min de lectura</p>;
}
export function PostCard({ article, variant = "plain", priority = false }: { article: BlogArticle; variant?: "plain" | "boxed"; priority?: boolean }) {
  const boxed = variant === "boxed";
  const Heading = boxed ? "h2" : "h3";
  return <article className="min-w-0"><Link href={article.href} className={`group flex h-full flex-col ${boxed ? "gap-4 rounded-2xl border border-line p-5 hover:border-violet" : "gap-3"}`}><PostImage article={article} priority={priority} /><p className="text-[13px] font-semibold text-violet">{categories[article.category]}</p><Heading className="text-[19px] font-bold leading-snug group-hover:text-violet-800">{article.title}</Heading>{boxed && <p className="text-base leading-relaxed text-ink-600">{article.description}</p>}<div className={boxed ? "mt-auto" : undefined}><PostMeta article={article} /></div></Link></article>;
}
