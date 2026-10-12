import assert from "node:assert/strict";
import { test } from "node:test";
import { COOKIE_CONSENT_MAX_AGE, COOKIE_CONSENT_VERSION } from "../src/config/cookies";
import { createConsent, parseConsent } from "../src/features/cookies/consent";
const encode = (value: unknown) => encodeURIComponent(JSON.stringify(value));
test("absence, malformed data, unknown fields and tampering deny consent", () => {
  for (const raw of [undefined, "%", "null", encode({ ...createConsent("accepted"), necessary: false }), encode({ ...createConsent("accepted"), extra: "identifier" }), encode({ ...createConsent("rejected"), analytics: true }), encode({ ...createConsent("accepted"), functional: true })]) assert.equal(parseConsent(raw), null);
});
test("accept activates only inventoried categories; reject and custom remain distinct", () => {
  const accepted = createConsent("accepted");
  assert.equal(accepted.analytics, true); assert.equal(accepted.functional, false); assert.equal(accepted.marketing, false);
  const rejected = createConsent("rejected");
  assert.equal(rejected.analytics, false); assert.equal(parseConsent(encode(rejected))?.status, "rejected");
  const custom = createConsent("custom", { analytics: true, functional: true, marketing: true });
  assert.equal(custom.analytics, true); assert.equal(custom.functional, false); assert.equal(custom.status, "custom");
});
test("expiry, future timestamps and material version changes deny; old rejection survives", () => {
  const value = createConsent("accepted"); const time = Date.parse(value.updatedAt);
  assert.equal(parseConsent(encode(value), time + COOKIE_CONSENT_MAX_AGE * 1000), null);
  assert.equal(parseConsent(encode(value), time - 1), null);
  assert.equal(parseConsent(encode({ ...value, version: "old" })), null);
  assert.equal(parseConsent(encode({ ...createConsent("rejected"), version: "old" }))?.analytics, false);
  assert.equal(value.version, COOKIE_CONSENT_VERSION);
});

test("actual attribution and local events stay blocked, activate explicitly and stop on withdrawal", async () => {
  const { browserAttribution, clearAttribution } = await import("../src/features/leads/client-attribution");
  const { emitMarketingEvent } = await import("../src/components/marketing/events");
  let emitted = 0;
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const doc = { cookie: "", referrer: "https://example.org/path" };
  const win = { location: { pathname: "/contacto/", search: "?utm_source=test" }, dispatchEvent: () => { emitted++; return true; } };
  Object.defineProperty(globalThis, "document", { configurable: true, value: doc });
  Object.defineProperty(globalThis, "window", { configurable: true, value: win });
  try {
    clearAttribution();
    assert.deepEqual(browserAttribution(), {});
    emitMarketingEvent("form_start"); assert.equal(emitted, 0);
    doc.cookie = `asivquark-consent=${encode(createConsent("accepted"))}`;
    assert.equal(browserAttribution().utmSource, "test");
    emitMarketingEvent("form_start"); assert.equal(emitted, 1);
    doc.cookie = `asivquark-consent=${encode(createConsent("rejected"))}`;
    assert.deepEqual(browserAttribution(), {});
    emitMarketingEvent("form_start"); assert.equal(emitted, 1);
    doc.cookie = `asivquark-consent=${encode({ ...createConsent("accepted"), updatedAt: "2000-01-01T00:00:00.000Z" })}`;
    assert.deepEqual(browserAttribution(), {});
  } finally {
    clearAttribution();
    if (previousDocument) Object.defineProperty(globalThis, "document", previousDocument); else Reflect.deleteProperty(globalThis, "document");
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow); else Reflect.deleteProperty(globalThis, "window");
  }
});
