import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { getArticles, parseArticle, relatedArticles } from "../src/lib/blog/content.ts";
const articles = getArticles();
const article = articles.find(post => post.slug === "que-debe-tener-una-pagina-web-profesional")!;
const source = readFileSync(`content/blog/${article.slug}.mdx`, "utf8");
test("MDX produces Spanish, numbered h2 anchors and calculates reading time", () => {
  assert.equal(article.toc.length, 7);
  assert.equal(article.toc[0].number, "01");
  assert.equal(article.toc[6].id, "conclusion");
  assert.ok(article.readingMinutes >= 1);
  assert.equal(article.body.includes("<ServiceLink />"), true);
  assert.ok(!article.body.includes(article.lead));
});
test("duplicate headings have unique Spanish anchors shared by the TOC", () => {
  const duplicate = parseArticle(source.replace("## Conclusión", "## Accesibilidad"), article.slug);
  assert.equal(duplicate.toc[6].id, "accesibilidad-1");
});
test("invalid metadata, dates and duplicate contextual links fail before publication", () => {
  assert.throws(() => parseArticle(source.replace('category: diseno-web', 'category: desconocida'), article.slug));
  assert.throws(() => parseArticle(source.replace(`updatedAt: "${article.updatedAt}"`, 'updatedAt: "2026-01-01"'), article.slug));
  assert.throws(() => parseArticle(source + '\n<ServiceLink />', article.slug));
});
test("related posts exclude current post and prioritize category", () => {
  const other = { ...article, slug: "otra-guia", category: "mvp" as const };
  const same = { ...article, slug: "misma-categoria" };
  assert.deepEqual(relatedArticles(article, [article, other, same]).map(post => post.slug), [same.slug, other.slug]);
  assert.ok(relatedArticles(article, articles).every(post => post.slug !== article.slug));
});


test("digitalization article preserves concise structure, SEO and selected header", () => {
  const post = articles.find(item => item.slug === "digitalizacion-empresas");
  assert.ok(post);
  assert.equal(post.toc.length, 5);
  assert.equal(post.seoTitle, "Digitalización de Empresas: Guía y Ejemplos | ASIVQUARK");
  assert.equal(post.category, "automatizacion-ia");
  assert.equal(post.headerImage?.width, 1440);
  assert.equal(post.headerImage?.height, 810);
  assert.ok(post.body.includes("/servicios/software-a-medida-barcelona/"));
  assert.ok(post.body.includes("/automatizacion-procesos-ia/"));
  assert.ok(post.body.includes("/contacto/?servicio=automatizacion"));
  assert.equal([post.lead, ...post.body.split(/\n\s*\n/).filter(block => !block.startsWith("## "))].length, 6);
});
