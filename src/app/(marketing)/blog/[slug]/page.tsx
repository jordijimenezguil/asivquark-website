import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/marketing/commercial";
import { ArticleLead, ArticleBody, KeyPoints, AsideCta, Sources, PostCard } from "@/components/marketing/blog/article-components";
import { TocDesktop, TocMobile } from "@/components/marketing/blog/toc";
import { getArticles, categories, formatDate, contactHref, relatedArticles } from "@/lib/blog/content";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";
export const dynamicParams = false;
export function generateStaticParams() { return getArticles().map(({ slug }) => ({ slug })); }
async function getArticle(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const article = getArticles().find(item => item.slug === slug);
  if (!article) notFound();
  return article;
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle(params);
  const metadata = pageMetadata({ title: article.seoTitle ?? `${article.title} | ASIVQUARK`, description: article.description, path: article.href });
  const image = article.cover ? { url: article.cover, width: 1200, height: 630, alt: article.coverAlt ?? article.title } : { url: "/opengraph-image", width: 1200, height: 630, alt: "ASIVQUARK" };
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" as const, publishedTime: article.publishedAt, modifiedTime: article.updatedAt ?? article.publishedAt, images: [image] }, twitter: { ...metadata.twitter, images: [image] } };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle(params);
  const related = relatedArticles(article, getArticles());
  const href = contactHref(article);
  const categoryHref = "/blog/";
  return <div className="blog-page">
    {site.isProduction && <><JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title, description: article.description, datePublished: article.publishedAt, dateModified: article.updatedAt ?? article.publishedAt, author: { "@type": "Organization", name: "ASIVQUARK", "@id": `${site.origin}/#organization` }, publisher: { "@id": `${site.origin}/#organization`, "@type": "Organization", name: "ASIVQUARK", logo: { "@type": "ImageObject", url: `${site.origin}/brand/asivquark-horizontal-dark.svg` } }, image: `${site.origin}${article.cover ?? "/opengraph-image"}`, mainEntityOfPage: `${site.origin}${article.href}`, url: `${site.origin}${article.href}`, inLanguage: "es-ES" }} /><JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: `${site.origin}/` }, { "@type": "ListItem", position: 2, name: "Blog", item: `${site.origin}/blog/` }, { "@type": "ListItem", position: 3, name: categories[article.category], item: `${site.origin}${categoryHref}` }] }} /></>}
    <header className="blog-hero bg-navy text-white"><Container className="flex flex-col gap-5 pt-10 pb-12 sm:pt-12 sm:pb-16 lg:gap-6 lg:pt-14 lg:pb-[72px]">
      <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2.5 text-sm text-mist-500"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><Link href="/blog/">Blog</Link><span aria-hidden="true">/</span><Link href={categoryHref} aria-current="page" className="text-[#D7DAE2]">{categories[article.category]}</Link></nav>
      <h1 className="max-w-[900px] text-article-h1 font-bold">{article.title}</h1>
      <p className="max-w-prose text-[17px] leading-relaxed text-blog-mist sm:text-xl">{article.description}</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm text-mist-500"><div className="flex basis-full items-center gap-2.5 sm:basis-auto"><span className="size-8 rounded-full bg-navy-700" aria-hidden="true" /><span className="font-semibold text-[#D7DAE2]">{article.authorName}</span></div><time dateTime={article.updatedAt ?? article.publishedAt}>{article.updatedAt ? "Actualizado " : ""}{formatDate(article.updatedAt ?? article.publishedAt)}</time><span aria-hidden="true">·</span><span>{article.readingMinutes} min de lectura</span></div>
      {article.headerImage && <Image src={article.headerImage.src} alt={article.headerImage.alt} width={article.headerImage.width} height={article.headerImage.height} loading="eager" fetchPriority="high" sizes="(min-width:1024px) 900px, (min-width:640px) calc(100vw - 64px), calc(100vw - 40px)" className="mt-2 h-auto w-full max-w-[900px] rounded-xl" />}
    </Container></header>
    <Container className="py-12 sm:py-16 lg:pt-20 lg:pb-[104px]"><div className="mx-auto max-w-prose lg:grid lg:max-w-none lg:grid-cols-[var(--spacing-toc)_minmax(0,1fr)] lg:items-start lg:gap-20">
      <aside className="sticky top-[114px] hidden max-h-[calc(100vh-138px)] flex-col gap-8 overflow-auto lg:flex"><TocDesktop items={article.toc} /><AsideCta href={href} slug={article.slug} ctaTitle={article.ctaTitle} /></aside>
      <article className="min-w-0 max-w-prose"><ArticleLead article={article} />{article.keyPoints && <KeyPoints items={article.keyPoints} />}<TocMobile items={article.toc} /><AsideCta href={href} slug={article.slug} ctaTitle={article.ctaTitle} variant="inline" /><ArticleBody article={article} />{article.sources && <Sources items={article.sources} />}</article>
    </div></Container>
    {related.length > 0 && <Container className="pb-16 lg:pb-[104px]"><div className="flex items-end justify-between gap-4 border-t-2 border-ink pt-7"><h2 className="text-2xl font-bold tracking-[-.025em] sm:text-[32px]">Sigue leyendo</h2><Link href="/blog/" className="inline-flex min-h-12 items-center text-sm font-semibold text-violet">Todo el blog →</Link></div><div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">{related.map(item => <PostCard key={item.slug} article={item} />)}</div></Container>}
    <SiteFooter ctaHref={href} ctaLocation="blog_footer" ctaSlug={article.slug} />
  </div>;
}
