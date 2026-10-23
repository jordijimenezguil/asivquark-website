import assert from "node:assert/strict";
import { test } from "node:test";
import {
  leadSchema,
  leadRequestSchema,
  serviceSchema,
} from "../src/features/leads/schema";
import {
  attributionFromUrl,
  sanitizeAttribution,
  safeReferrer,
} from "../src/features/leads/attribution";
import { getContactConfig } from "../src/config/contact";
const valid = {
  name: "  Empresa   de prueba  ",
  email: "Nombre.Tag+proyecto@EXAMPLE.COM",
  projectType: "web",
  description: "Una web corporativa para un negocio de prueba.",
  privacy: true,
};
test("lead validation normalizes names and only the email domain", () => {
  const result = leadSchema.parse(valid);
  assert.equal(result.name, "Empresa de prueba");
  assert.equal(result.email, "Nombre.Tag+proyecto@example.com");
});
test("rejects invalid required fields, long messages, HTML and administrative inputs", () => {
  for (const data of [
    { ...valid, name: " " },
    { ...valid, name: "x".repeat(101) },
    { ...valid, email: "no-email" },
    { ...valid, projectType: "admin" },
    { ...valid, description: "corto" },
    { ...valid, description: "x".repeat(5001) },
    { ...valid, description: "<script>alert(1)</script>" },
    { ...valid, privacy: false },
    { ...valid, status: "WON" },
    { ...valid, source: "trusted" },
  ])
    assert.equal(leadRequestSchema.safeParse(data).success, false);
});
test("optional fields permit omission, empty values and international phones", () => {
  assert.equal(leadSchema.safeParse(valid).success, true);
  const result = leadSchema.parse({
    ...valid,
    company: "  ",
    phone: "+1 (212) 555-0123",
    budget: "",
  });
  assert.equal(result.company, undefined);
  assert.equal(result.budget, undefined);
  assert.equal(result.phone, "+1 (212) 555-0123");
  assert.equal(
    leadSchema.safeParse({ ...valid, phone: "invalid" }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({ ...valid, budget: "guaranteed" }).success,
    false,
  );
});
test("URL service values are validated, including the four landing selections", () => {
  for (const value of ["web", "software", "aplicacion", "mvp"])
    assert.equal(serviceSchema.safeParse(value).success, true);
  for (const value of [undefined, "unknown", ["web", "mvp"]])
    assert.equal(serviceSchema.safeParse(value).success, false);
});
test("attribution strips untrusted paths and referrer queries without inventing sources", () => {
  assert.equal(
    safeReferrer("https://search.example/path?email=private#token"),
    "https://search.example",
  );
  assert.equal(safeReferrer("https://user:password@example.com"), undefined);
  assert.equal(safeReferrer("javascript:alert(1)"), undefined);
  const data = attributionFromUrl(
    new URLSearchParams(
      "origen=/servicios/diseno-web-barcelona/&utm_source=campaign&utm_medium=one&utm_medium=two",
    ),
  );
  assert.equal(data.originPath, "/servicios/diseno-web-barcelona/");
  assert.equal(data.utmSource, "campaign");
  assert.equal(data.utmMedium, undefined);
  assert.equal(
    sanitizeAttribution({ landingPath: "/admin/" }).landingPath,
    undefined,
  );
  assert.equal(
    attributionFromUrl(new URLSearchParams()).landingPath,
    undefined,
  );
});
test("public capture uses the current notice and rejects mismatched notice configuration", () => {
  const environment = {
    LEADS_ENABLED: "true",
    VERCEL: "1",
    DATABASE_URL: "postgresql://configured-test-only",
    LEADS_SECURITY_SECRET: "s".repeat(32),
    LEADS_RETENTION_DAYS: "90",
  };
  assert.equal(getContactConfig(environment, "production").enabled, true);
  for (const key of ["DATABASE_URL", "LEADS_SECURITY_SECRET", "LEADS_RETENTION_DAYS", "LEADS_ENABLED", "VERCEL"]) {
    assert.equal(getContactConfig({ ...environment, [key]: "" }, "production").enabled, false);
  }
  assert.equal(
    getContactConfig(
      {
        ...environment,
        LEADS_PRIVACY_NOTICE_URL: "https://asivquark.com/politica-confirmada/",
        LEADS_PRIVACY_NOTICE_VERSION: "test-version",
      },
      "production",
    ).enabled,
    false,
  );
  assert.equal(
    getContactConfig(
      {
        ...environment,
        LEADS_PRIVACY_NOTICE_URL: "http://insecure.example/privacy",
        LEADS_PRIVACY_NOTICE_VERSION: "test",
      },
      "production",
    ).enabled,
    false,
  );
  assert.equal(getContactConfig({}, "development").testMode, true);
  assert.equal(getContactConfig({}, "preview").enabled, false);
});

test("contact message accepts 10–2000 characters with the compact-form errors", () => {
  assert.equal(leadSchema.safeParse({ ...valid, description: "x".repeat(10) }).success, true);
  assert.equal(leadSchema.safeParse({ ...valid, description: "x".repeat(2000) }).success, true);
  assert.equal(leadSchema.safeParse({ ...valid, description: "x".repeat(2001) }).success, false);
  const result = leadSchema.safeParse({ ...valid, name: "", email: "", description: "" });
  assert.equal(result.success, false);
  if (!result.success) assert.deepEqual(result.error.issues.map(issue => issue.message), ["Escribe tu nombre.", "Revisa el email; parece incompleto.", "Cuéntanos en una frase qué necesitas."]);
});

test("compact software URL alias preserves the existing contact contract", async () => {
  const { parseContactProjectType, projectTypeForContract } = await import("../src/content/project-type");
  assert.equal(projectTypeForContract(parseContactProjectType(["soft"], [])), "software");
  assert.equal(projectTypeForContract(parseContactProjectType(["app"], [])), "aplicacion");
  assert.equal(parseContactProjectType(["app", "web"], []), "web");
});
