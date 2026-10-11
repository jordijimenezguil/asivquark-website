import assert from "node:assert/strict";
import { test } from "node:test";
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
