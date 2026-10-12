import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { professionalWebArticle } from "../src/content/articles";
const html = readFileSync(`.next/server/app/blog/${professionalWebArticle.slug}.html`, "utf8");
test("public static article has independent metadata, one H1 and all educational sections", () => {
  assert.ok(html.includes(`<title>${`${professionalWebArticle.title} | ASIVQUARK`}</title>`));
  assert.ok(html.includes(`name="description" content="${professionalWebArticle.description}"`));
  assert.ok(html.includes(`rel="canonical" href="https://asivquark.com${professionalWebArticle.href}"`));
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes('property="og:type" content="article"'));
  for (const section of professionalWebArticle.toc) assert.ok(html.includes(section.title));
  assert.ok(html.includes('href="/servicios/diseno-web-barcelona/"'));
});
test("article JSON-LD reflects the approved author and dates", () => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]) as Record<string, unknown>);
  const article = blocks.find(block => block["@type"] === "BlogPosting");
  assert.ok(article);
  assert.equal(article.headline, professionalWebArticle.title);
  assert.equal((article.author as { name: string }).name, "ASIVQUARK"); assert.equal(article.datePublished, "2026-10-12"); assert.equal(article.dateModified, "2026-10-12");
  assert.equal((article.publisher as Record<string, unknown>)["@id"], "https://asivquark.com/#organization");
  assert.equal(blocks.filter(block => block["@type"] === "Organization").length, 1);
  assert.equal(blocks.filter(block => block["@type"] === "BreadcrumbList").length, 1);
});
test("blog index, header/footer and sitemap link to public article", () => {
  const rss = readFileSync(".next/server/app/blog/rss.xml.body", "utf8");
  assert.ok(rss.includes(`https://asivquark.com${professionalWebArticle.href}`));
  const home = readFileSync(".next/server/app/index.html", "utf8");
  assert.ok(home.includes('href="/blog/"'));
  const sitemap = readFileSync(".next/server/app/sitemap.xml.body", "utf8");
  assert.ok(sitemap.includes(`<loc>https://asivquark.com${professionalWebArticle.href}</loc>`));
  assert.ok(sitemap.includes("<loc>https://asivquark.com/blog/</loc>"));
});

test("article has Spanish anchors, category breadcrumb and contact CTAs", () => {
  for (const section of professionalWebArticle.toc) {
    assert.ok(html.includes(`id="${section.id}"`));
    assert.ok(html.includes(`href="#${section.id}"`));
  }
  assert.ok(html.includes('href="/blog/"'));
  assert.ok(!html.includes('/blog/?categoria='));
  assert.ok(html.includes('data-location="blog_footer"'));
  assert.ok(html.includes('/contacto/?tipo=web&amp;origen=blog-que-debe-tener-una-pagina-web-profesional'));
});
