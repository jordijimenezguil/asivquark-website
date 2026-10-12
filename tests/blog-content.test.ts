import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { getArticles, parseArticle, relatedArticles } from "../src/lib/blog/content.ts";
const articles = getArticles();
const article = articles[0];
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
  assert.throws(() => parseArticle(source.replace('updatedAt: "2026-10-12"', 'updatedAt: "2026-10-11"'), article.slug));
  assert.throws(() => parseArticle(source + '\n<ServiceLink />', article.slug));
});
test("related posts exclude current post and prioritize category", () => {
  const other = { ...article, slug: "otra-guia", category: "mvp" as const };
  const same = { ...article, slug: "misma-categoria" };
  assert.deepEqual(relatedArticles(article, [article, other, same]).map(post => post.slug), [same.slug, other.slug]);
  assert.deepEqual(relatedArticles(article, articles), []);
});
