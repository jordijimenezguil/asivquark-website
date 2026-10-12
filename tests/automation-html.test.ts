import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { automationService } from "../src/content/automation";
const html = readFileSync(".next/server/app/automatizacion-procesos-ia.html", "utf8");
const origin = "https://asivquark.com";
test("production artifact has exact metadata, canonical, one H1 and initial landing content", () => {
  assert.ok(html.includes(`<title>${automationService.seoTitle}</title>`));
  assert.ok(html.includes(`name="description" content="${automationService.seoDescription}"`));
  assert.ok(html.includes(`rel="canonical" href="${origin}${automationService.href}"`));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes(automationService.h1));
  for (const section of automationService.sections) assert.ok(html.includes(section.title), section.title);
  for (const question of automationService.faqs) assert.ok(html.includes(question.question));
  assert.ok(html.includes('id="soluciones"'));
  assert.ok(html.includes('href="/contacto/?servicio=automatizacion"'));
  assert.ok(html.includes('href="/servicios/software-a-medida-barcelona/"'));
  assert.ok(html.includes('/automatizacion-procesos-ia/opengraph-image'));
});
test("JSON-LD is valid, refers to the shared Organization and has no fabricated offers or FAQ rich-result claim", () => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]) as Record<string, unknown>);
  const service = blocks.find(block => block["@type"] === "Service");
  assert.ok(service);
  assert.equal(service.url, `${origin}${automationService.href}`);
  assert.deepEqual(service.provider, { "@id": `${origin}/#organization` });
  assert.equal(service.offers, undefined); assert.equal(service.aggregateRating, undefined);
  assert.equal(blocks.filter(block => block["@type"] === "Organization").length, 1);
  assert.equal(blocks.filter(block => block["@type"] === "FAQPage").length, 0);
  assert.equal(blocks.filter(block => block["@type"] === "BreadcrumbList").length, 1);
});
test("production sitemap and public HTML link to the single service route", () => {
  const sitemap = readFileSync(".next/server/app/sitemap.xml.body", "utf8");
  assert.ok(sitemap.includes(`<loc>${origin}${automationService.href}</loc>`));
  assert.ok(!sitemap.includes("/servicios/automatizacion-procesos-ia/"));
  for (const path of ["index", "servicios", "nosotros", "servicios/software-a-medida-barcelona", "servicios/aplicaciones-web-barcelona"]) {
    const page = readFileSync(`.next/server/app/${path}.html`, "utf8");
    assert.ok(page.includes(`href="${automationService.href}"`), path);
  }
});
