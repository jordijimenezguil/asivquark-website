import assert from "node:assert/strict";
import test from "node:test";
import { webDesignService, webDesignComparison } from "../src/content/web-design";
import { services } from "../src/content/services";
import { publicPaths, serviceNavigation } from "../src/config/navigation";
import { parseContactProjectType, projectTypeForContract } from "../src/content/project-type";
test("web design keeps its established service URL and commercial metadata", () => {
  assert.equal(webDesignService.href, "/servicios/diseno-web-barcelona/");
  assert.equal(webDesignService.seoTitle, "Diseño Web Profesional en Barcelona | ASIVQUARK");
  assert.equal(webDesignService.seoDescription, "Creamos páginas web profesionales en Barcelona, rápidas, adaptadas a móviles y diseñadas para las necesidades de tu negocio.");
  assert.equal(webDesignService.h1, "Diseño web profesional en Barcelona para empresas");
  assert.equal(publicPaths.filter(path => path === webDesignService.href).length, 1);
  assert.ok(!publicPaths.includes("/diseno-web-barcelona/"));
  assert.ok(serviceNavigation.some(link => link.href === webDesignService.href));
  assert.equal(services.find(service => service.uiType === "web"), webDesignService);
});
test("commercial content has a complete scope, a qualified comparison and eight FAQ", () => {
  assert.equal(webDesignService.sections[1].items.length, 8);
  assert.equal(webDesignService.sections[2].items.length, 5);
  assert.equal(webDesignService.process.length, 5);
  assert.equal(webDesignService.faqs.length, 8);
  assert.equal(webDesignComparison.length, 8);
  assert.ok(webDesignService.sections[1].items.some(item => item.description.includes("no equivale a una campaña continuada")));
  assert.ok(webDesignService.faqs.some(item => item.answer.includes("Una plantilla puede ser una base adecuada")));
});
test("budget CTA query selects the existing web contract", () => {
  assert.equal(projectTypeForContract(parseContactProjectType([], ["web"])), "web");
});

test("static blog has one educational article and no publication-state mechanism", async () => {
  const { blogArticles } = await import("../src/config/blog");
  const { professionalWebArticle, articles } = await import("../src/content/articles");
  assert.equal(articles.length, 1);
  assert.equal(blogArticles[0].href, "/blog/que-debe-tener-una-pagina-web-profesional/");
  assert.equal(professionalWebArticle.toc.length, 7);
  assert.notEqual(professionalWebArticle.title, webDesignService.h1);
  assert.ok(!("status" in professionalWebArticle));
  assert.equal(professionalWebArticle.authorName, "Equipo ASIVQUARK");
  assert.equal(professionalWebArticle.publishedAt, "2026-10-12");
  assert.ok(publicPaths.includes(blogArticles[0].href));
  assert.ok(publicPaths.includes("/blog/"));
  assert.ok(professionalWebArticle.serviceLink?.href === webDesignService.href);
  const landingParagraphs = webDesignService.sections.flatMap(section => section.items.map(item => item.description));
  for (const paragraph of professionalWebArticle.body.split("\n\n")) assert.ok(!landingParagraphs.includes(paragraph));
});
