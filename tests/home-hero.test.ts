import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseContactProjectType, projectTypeForContract } from "../src/content/project-type";
import { publishedProjects } from "../src/content/projects";
test("four hero choices preserve contact contracts including app", () => {
  for (const [type, contract] of [["web", "web"], ["software", "software"], ["app", "aplicacion"], ["mvp", "mvp"]]) {
    assert.equal(projectTypeForContract(parseContactProjectType([type], [])), contract);
  }
  assert.equal(parseContactProjectType(["app", "web"], []), "web");
});
test("selector remains a native GET form without JavaScript and shares consent-gated events", () => {
  const source = readFileSync("src/components/marketing/configurator.tsx", "utf8");
  assert.match(source, /method="get" action="\/contacto\/"/);
  assert.equal((source.match(/type: "/g) ?? []).length, 4);
  assert.match(source, /type="radio" name="tipo"/);
  assert.match(source, /location: "home_hero", tipo: type/);
  assert.match(source, /defaultChecked=\{option.type === "web"\}/);
});
test("portfolio uses authorized published content and global header keeps contact hidden on contact", () => {
  assert.equal(publishedProjects.length, 0);
  const home = readFileSync("src/app/(marketing)/page.tsx", "utf8");
  assert.match(home, /Publicaremos proyectos reales/);
  assert.match(readFileSync("src/components/layout/header-contact-link.tsx", "utf8"), /=== "\/contacto"\) return null/);
});

test("initial hero HTML has one H1, four native choices and a real contact action", async () => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createElement } = await import("react");
  const { HomeHero } = await import("../src/components/marketing/home-hero");
  const html = renderToStaticMarkup(createElement(HomeHero));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((html.match(/type="radio"/g) ?? []).length, 4);
  assert.match(html, /<form[^>]*action="\/contacto\/"[^>]*method="get"/);
  assert.match(html, /Continuar con página web/);
  for (const type of ["web", "software", "app", "mvp"]) assert.ok(html.includes(`value="${type}"`));
  assert.match(html, /Sin compromiso/);
  assert.match(html, /Respuesta en 24 h/);
});
