import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseContactProjectType, projectTypeForContract } from "../src/content/project-type";
import { publishedProjects } from "../src/content/projects";
test("five project choices preserve contact contracts including app", () => {
  for (const [type, contract] of [["automatizacion", "automatizacion"], ["web", "web"], ["software", "software"], ["app", "aplicacion"], ["mvp", "mvp"]]) {
    assert.equal(projectTypeForContract(parseContactProjectType([type], [])), contract);
  }
  assert.equal(parseContactProjectType(["app", "web"], []), "web");
});
test("selector keeps GET contact contract and consent-gated events", () => {
  const source = readFileSync("src/components/marketing/configurator.tsx", "utf8");
  assert.match(source, /method="get" action="\/contacto\/"/);
  assert.equal((source.match(/type: "/g) ?? []).length, 5);
  assert.match(source, /type="hidden" name="tipo" value=\{type\}/);
  assert.match(source, /aria-pressed=\{type === option.type\}/);
  assert.match(source, /location: "home_hero", tipo: type/);
  assert.match(source, /useState<.*>\("web"\)/);
});
test("portfolio uses authorized published content and global header keeps contact hidden on contact", () => {
  assert.deepEqual(publishedProjects.flatMap(project => project.href ? [project.href] : []), ["https://rutavana.com/", "https://d7tattoo.com/"]);
  assert.ok(publishedProjects.some(project => project.slug === "garraf-semsa" && project.category === "automatizacion"));
  assert.ok(publishedProjects.some(project => project.slug === "startgamego" && project.category === "app"));
  const home = readFileSync("src/app/(marketing)/page.tsx", "utf8");
  assert.doesNotMatch(home, /Rutavana|D7 Tattoo|Garraf Semsa|Startgamego|ProjectCard|publishedProjects/);
  assert.match(home, /href="\/proyectos\/"/);
  assert.match(readFileSync("src/components/layout/header-contact-link.tsx", "utf8"), /=== "\/contacto"\) return null/);
});

test("initial hero presents all services and automation follows the service overview", async () => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createElement } = await import("react");
  const { HomeHero } = await import("../src/components/marketing/home-hero");
  const html = renderToStaticMarkup(createElement(HomeHero));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /Desarrollo de software y/);
  for (const label of ["Página web", "Software a medida", "Aplicación web", "Desarrollo MVP", "Automatización con IA"]) assert.ok(html.includes(label));
  assert.match(html, /<input(?=[^>]*type="hidden")(?=[^>]*name="tipo")(?=[^>]*value="web")[^>]*>/);
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /Ejemplo ilustrativo/);
  const home = readFileSync("src/app/(marketing)/page.tsx", "utf8");
  assert.ok(home.indexOf('id="servicios"') < home.indexOf("<HomeAutomation />"));
  const { HomeAutomation } = await import("../src/components/marketing/home-automation");
  const automation = renderToStaticMarkup(createElement(HomeAutomation));
  assert.match(automation, /id="automatizacion"/);
  assert.doesNotMatch(automation, /<h1\b/);
  assert.match(automation, /Tu equipo revisa/);
});
