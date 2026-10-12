import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/marketing/commercial";
import { PostCard, PostImage, PostMeta } from "@/components/marketing/blog/article-components";
import { categories, getArticles } from "@/lib/blog/content";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = { ...pageMetadata({ title: "Blog | ASIVQUARK", description: "Guías prácticas sobre diseño web, software a medida y producto digital.", path: "/blog/" }), alternates: { ...(site.isProduction ? { canonical: `${site.origin}/blog/` } : {}), types: { "application/rss+xml": `${site.origin}/blog/rss.xml` } } };
export default async function BlogPage({ searchParams }: { searchParams: Promise<{ categoria?: string; pagina?: string }> }) {
  const query = await searchParams;
  const all = getArticles();
  const category = query.categoria && Object.hasOwn(categories, query.categoria) ? query.categoria as keyof typeof categories : undefined;
  const filtered = category ? all.filter(article => article.category === category) : all;
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const requested = Number(query.pagina);
  const page = Number.isSafeInteger(requested) && requested > 0 ? Math.min(requested, pages) : 1;
  const posts = filtered.slice((page - 1) * 12, page * 12);
  const featured = page === 1 ? posts[0] : undefined;
  const rest = featured ? posts.slice(1) : posts;
  const pageHref = (number: number) => `/blog/?${new URLSearchParams({ ...(category ? { categoria: category } : {}), pagina: String(number) })}`;
  return <div className="blog-page">
    {site.isProduction && <><JsonLd data={{ "@context": "https://schema.org", "@type": "Blog", name: "Blog ASIVQUARK", url: `${site.origin}/blog/`, blogPost: all.map(article => ({ "@type": "BlogPosting", headline: article.title, description: article.description, url: `${site.origin}${article.href}`, datePublished: article.publishedAt })) }} /><JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: `${site.origin}/` }, { "@type": "ListItem", position: 2, name: "Blog", item: `${site.origin}/blog/` }] }} /></>}
    <header className="blog-hero bg-navy text-white"><Container className="flex flex-col gap-5 pt-10 pb-12 sm:pt-12 sm:pb-16 lg:gap-6 lg:pt-14 lg:pb-[72px]"><nav aria-label="Ruta de navegación" className="flex gap-2.5 text-sm text-mist-500"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page" className="text-[#D7DAE2]">Blog</span></nav><h1 className="text-article-h1 font-bold">Blog</h1><p className="max-w-prose text-[17px] leading-relaxed text-blog-mist sm:text-xl">Guías prácticas sobre diseño web, software a medida y producto digital.</p></Container></header>
    <Container className="py-12 sm:py-16 lg:pt-20 lg:pb-[104px]"><form action="/blog/" method="get" aria-label="Filtrar por categoría" className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0">{[["", "Todos"], ...Object.entries(categories)].map(([value, label]) => <button key={value} type="submit" name="categoria" value={value} aria-pressed={(category ?? "") === value} className={`min-h-12 shrink-0 snap-start cursor-pointer rounded-full border px-4 text-[15px] font-semibold ${(category ?? "") === value ? "border-ink bg-ink text-white" : "border-line-strong text-ink-600 hover:border-violet"}`}>{label}</button>)}</form>
    {featured && <article className="mt-10 overflow-hidden rounded-2xl border border-line"><Link href={featured.href} className="group grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center"><PostImage article={featured} priority /><div className="flex flex-col gap-4 px-6 pb-8 md:py-8 md:pr-8 md:pl-0"><p className="text-[13px] font-semibold text-violet">{categories[featured.category]}</p><h2 className="text-2xl font-bold leading-snug tracking-[-.025em] group-hover:text-violet-800 lg:text-[32px]">{featured.title}</h2><p className="text-base leading-relaxed text-ink-600">{featured.description}</p><PostMeta article={featured} /><span className="font-semibold text-violet">Leer la guía →</span></div></Link></article>}
    {rest.length > 0 && <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3">{rest.map(article => <PostCard key={article.slug} article={article} />)}</div>}
    {filtered.length === 0 && <p role="status" className="py-16 text-article-body text-ink-600">Todavía no hay artículos publicados en esta categoría. <Link href="/blog/" className="font-semibold text-violet underline">Ver todos los artículos</Link>.</p>}
    {pages > 1 && <nav aria-label="Paginación del blog" className="mt-12 flex items-center justify-between gap-4">{page > 1 ? <Link href={pageHref(page - 1)} rel="prev" className="flex min-h-12 items-center rounded-lg border border-line-strong px-5 font-semibold">Anteriores</Link> : <span />}<span className="text-sm text-ink-500">{page} / {pages}</span>{page < pages ? <Link href={pageHref(page + 1)} rel="next" className="flex min-h-12 items-center rounded-lg border border-line-strong px-5 font-semibold">Siguientes</Link> : <span />}</nav>}
    </Container><SiteFooter ctaLocation="blog_footer" />
  </div>;
}
