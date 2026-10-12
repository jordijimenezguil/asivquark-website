import assert from "node:assert/strict";
import { test } from "node:test";
import {
  contactSchema,
  parseProjectType,
} from "../src/lib/validations/contact.ts";
import { resolveSite } from "../src/config/site.ts";

test("local builds do not become indexable merely because NODE_ENV is production", () => {
  assert.equal(resolveSite({}).origin, "http://localhost:3000");
  assert.equal(resolveSite({}).isProduction, false);
});
test("production requires the official non-www origin", () => {
  assert.equal(
    resolveSite({
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://asivquark.com",
    }).isProduction,
    true,
  );
  for (const url of [
    undefined,
    "http://localhost:3000",
    "https://www.asivquark.com",
    "https://asivquark.com/path",
    "https://asivquark.com/?a=b",
  ]) {
    assert.throws(() =>
      resolveSite({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: url }),
    );
  }
});
test("preview uses its deployment URL even when production values are inherited", () => {
  const result = resolveSite({
    VERCEL_ENV: "preview",
    VERCEL_URL: "asivquark-preview.vercel.app",
    NEXT_PUBLIC_SITE_URL: "https://asivquark.com",
    BETTER_AUTH_URL: "https://asivquark.com",
  });
  assert.equal(result.origin, "https://asivquark-preview.vercel.app");
  assert.equal(result.authOrigin, result.origin);
  assert.equal(result.isProduction, false);
  assert.throws(() => resolveSite({ VERCEL_ENV: "preview" }));
  assert.throws(() =>
    resolveSite({ VERCEL_ENV: "preview", VERCEL_URL: "asivquark.com" }),
  );
});
test("auth origin cannot silently diverge from the public site", () => {
  assert.throws(() =>
    resolveSite({ BETTER_AUTH_URL: "https://asivquark.com" }),
  );
  assert.throws(() =>
    resolveSite({ NEXT_PUBLIC_SITE_URL: "ftp://localhost:3000" }),
  );
});

// URL parameters are untrusted: reject repeated and unexpected values.
test("contact service selection rejects malformed URL parameters", () => {
  assert.equal(parseProjectType("aplicacion"), "aplicacion");
  for (const input of [undefined, "", "admin", "<script>", ["web", "mvp"]]) {
    assert.equal(parseProjectType(input), undefined);
  }
});
test("future contact contract requires valid email, description and consent", () => {
  const input = {
    name: "Empresa de prueba",
    email: "test@example.com",
    projectType: "web",
    description: "Necesitamos una web corporativa accesible.",
    privacy: true,
  };
  assert.equal(contactSchema.safeParse(input).success, true);
  for (const invalid of [
    { ...input, email: "email inválido" },
    { ...input, privacy: false },
    { ...input, description: "" },
    { ...input, projectType: "admin" },
  ])
    assert.equal(contactSchema.safeParse(invalid).success, false);
});
