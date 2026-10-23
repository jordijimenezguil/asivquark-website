import Link from "next/link";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/marketing/commercial";
import { PostCard } from "@/components/marketing/blog/article-components";
import { getArticles } from "@/lib/blog/content";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = { ...pageMetadata({ title: "Blog | ASIVQUARK", description: "Guías prácticas sobre diseño web, software a medida y producto digital.", path: "/blog/" }), alternates: { ...(site.isProduction ? { canonical: `${site.origin}/blog/` } : {}), types: { "application/rss+xml": `${site.origin}/blog/rss.xml` } } };
export default function BlogPage() {
  const all = getArticles();
  return <div className="blog-page">
    {site.isProduction && <><JsonLd data={{ "@context": "https://schema.org", "@type": "Blog", name: "Blog ASIVQUARK", url: `${site.origin}/blog/`, blogPost: all.map(article => ({ "@type": "BlogPosting", headline: article.title, description: article.description, url: `${site.origin}${article.href}`, datePublished: article.publishedAt })) }} /><JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Inicio", item: `${site.origin}/` }, { "@type": "ListItem", position: 2, name: "Blog", item: `${site.origin}/blog/` }] }} /></>}
    <header className="blog-hero bg-navy text-white"><Container className="flex flex-col gap-5 pt-10 pb-12 sm:pt-12 sm:pb-16 lg:gap-6 lg:pt-14 lg:pb-[72px]"><nav aria-label="Ruta de navegación" className="flex gap-2.5 text-sm text-mist-500"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span aria-current="page" className="text-fg-muted">Blog</span></nav><h1 className="text-article-h1 font-bold">Blog</h1><p className="max-w-prose text-[17px] leading-relaxed text-blog-mist sm:text-xl">Guías prácticas sobre diseño web, software a medida y producto digital.</p></Container></header>
    <Container className="py-12 sm:py-16 lg:pt-20 lg:pb-[104px]">
      {all.length > 0 ? <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">{all.map((article, index) => <PostCard key={article.slug} article={article} variant="boxed" priority={index === 0} />)}</div> : <p role="status" className="text-article-body text-fg-muted">Todavía no hay artículos publicados.</p>}
    </Container>
  </div>;
}
