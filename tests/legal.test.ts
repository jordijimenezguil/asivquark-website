import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { legalEntitySchema, legalEntity, legalDocuments, legalReadiness } from "../src/config/legal";
import { getContactConfig } from "../src/config/contact";

test("legal readiness reports identity, applicability and approval independently from build", () => {
  assert.equal(legalReadiness().ready, false);
  assert.ok(legalReadiness().missing.includes("legalAddress"));
  assert.ok(legalReadiness().missing.includes("approval:privacy"));
  assert.equal(legalEntitySchema.safeParse({ ...legalEntity, legalEmail: "invalid" }).success, false);
});
test("capture can use the current notice independently of editorial approval", () => {
  const config = getContactConfig({ VERCEL: "1", DATABASE_URL: "test-only", LEADS_SECURITY_SECRET: "x".repeat(32) }, "production");
  assert.equal(config.enabled, true);
  assert.equal(config.noticeUrl, "https://asivquark.com/politica-privacidad/");
  assert.equal(config.noticeVersion, legalDocuments[1].version);
  assert.equal(getContactConfig({}, "development").testMode, true);
});
test("four canonical routes, shared layout and cookie manager are connected", () => {
  assert.equal(new Set(legalDocuments.map(item => item.path)).size, 4);
  for (const document of legalDocuments) {
    const source = readFileSync(`src/app/(marketing)${document.path}page.tsx`, "utf8");
    assert.ok(source.includes("LegalPageLayout"));
    assert.ok(source.includes(`legalMetadata("${document.id}")`));
    assert.doesNotMatch(source, /Empresa Ejemplo|Calle Falsa|B12345678|ASIVQUARK S\.L\./);
  }
  assert.match(readFileSync("src/components/layout/site-footer.tsx", "utf8"), /legalDocuments\.map/);
  assert.match(readFileSync("src/app/(marketing)/politica-de-cookies/page.tsx", "utf8"), /CookiePreferencesTrigger/);
  assert.match(readFileSync("src/components/forms/contact-form.tsx", "utf8"), /política de privacidad/);
});

test("production metadata retains official canonicals but drafts stay noindex", async () => {
  const { execFileSync } = await import("node:child_process");
  const result = execFileSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", `import { legalMetadata } from './src/components/legal/legal-page-layout.tsx'; console.log(JSON.stringify(['notice','privacy','cookies','terms'].map(legalMetadata)));`], { encoding: "utf8", env: { ...process.env, VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://asivquark.com", BETTER_AUTH_URL: "https://asivquark.com" } });
  const metadata: { title: string; description: string; alternates: { canonical: string }; robots: { index: boolean } }[] = JSON.parse(result);
  for (const [index, item] of metadata.entries()) {
    assert.equal(item.title, `${legalDocuments[index].seoTitle} | ASIVQUARK`);
    assert.equal(item.description, legalDocuments[index].description);
    assert.equal(item.alternates.canonical, `https://asivquark.com${legalDocuments[index].path}`);
    assert.equal(item.robots.index, false);
  }
});
