import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { getArticles } from "../src/lib/blog/content";

const html = readFileSync(".next/server/app/blog.html", "utf8");
const listing = html.slice(html.indexOf('<div class="blog-page">'), html.indexOf('<footer', html.indexOf('<div class="blog-page">')));
const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8")) as { routes: Record<string, unknown> };

test("blog index is prerendered and lists each published article in the card grid", () => {
  assert.ok(Object.hasOwn(manifest.routes, "/blog"));
  assert.equal((listing.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((listing.match(/<article\b/g) ?? []).length, getArticles().length);
  assert.ok(listing.includes("sm:grid-cols-2 lg:grid-cols-3"));
  for (const article of getArticles()) {
    assert.ok(listing.includes(`href="${article.href}"`));
    assert.ok(listing.includes(article.title));
    assert.ok(listing.includes(article.description));
  }
});

test("blog index has no search, category filter, pagination or featured layout", () => {
  assert.ok(!listing.includes("<form"));
  assert.ok(!listing.includes("Filtrar por categoría"));
  assert.ok(!listing.includes("Paginación del blog"));
  assert.ok(!listing.includes("categoria="));
  assert.ok(!listing.includes("md:grid-cols-[1.2fr_1fr]"));
});
