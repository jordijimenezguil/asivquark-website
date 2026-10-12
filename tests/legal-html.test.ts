import test from "node:test";
import assert from "node:assert/strict";
import { legalDocuments } from "../src/config/legal";
const base = process.env.LEGAL_TEST_URL;
for (const document of legalDocuments) test(`${document.path} responds with semantic initial HTML and draft metadata`, { skip: !base }, async () => {
  const response = await fetch(`${base}${document.path}`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes(`<title>${document.seoTitle} | ASIVQUARK</title>`));
  assert.ok(html.includes(document.description));
  assert.match(html, /name="robots" content="noindex/);
  assert.match(html, /Documento en preparación/);
  assert.match(html, /Índice de contenidos/);
  for (const target of legalDocuments) assert.ok(html.includes(`href="${target.path}"`));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `anchor ${match[1]} exists`);
  assert.doesNotMatch(html, /Empresa Ejemplo|Calle Falsa|B12345678|ASIVQUARK S\.L\./);
  if (document.id === "cookies") assert.match(html, /Configurar cookies/);
});
test("contact includes layered information and privacy route", { skip: !base }, async () => {
  const response = await fetch(`${base}/contacto/`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Información básica sobre protección de datos/);
  assert.match(html, /href="\/politica-privacidad\/"/);
  assert.match(html, /no autoriza publicidad/);
});
