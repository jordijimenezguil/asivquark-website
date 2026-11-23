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
test("selector remains a native GET form without JavaScript and shares consent-gated events", () => {
  const source = readFileSync("src/components/marketing/configurator.tsx", "utf8");
  assert.match(source, /method="get" action="\/contacto\/"/);
  assert.equal((source.match(/type: "/g) ?? []).length, 5);
  assert.match(source, /type="radio" name="tipo"/);
  assert.match(source, /location: "home_hero", tipo: type/);
  assert.match(source, /defaultChecked=\{option.type === "automatizacion"\}/);
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

test("initial hero HTML exposes automation, an illustrative workflow and preselected contact", async () => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createElement } = await import("react");
  const { HomeHero } = await import("../src/components/marketing/home-hero");
  const html = renderToStaticMarkup(createElement(HomeHero));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /Automatización con/);
  assert.match(html, /IA para empresas/);
  assert.match(html, /a precios populares/);
  assert.match(html, /href="\/contacto\/?\?tipo=automatizacion&amp;origen=\/"/);
  assert.match(html, /href="#automatizacion"/);
  assert.match(html, /Ejemplo ilustrativo/);
  assert.match(html, /Tu equipo revisa/);
  assert.equal((html.match(/<li>/g) ?? []).length, 4);
  assert.match(html, /sin compromiso/);
  assert.match(html, /Respuesta en 24 h/);
});
