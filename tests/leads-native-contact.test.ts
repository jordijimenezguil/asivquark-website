import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "../src/app/api/contacto/route";
import { site } from "../src/config/site";

test("native contact rejects foreign origin and unsupported content before capture", async () => {
  assert.equal((await POST(new Request(`${site.origin}/api/contacto/`, { method: "POST", headers: { origin: "https://other.example", "content-type": "application/x-www-form-urlencoded" }, body: "nombre=Prueba" }))).status, 403);
  assert.equal((await POST(new Request(`${site.origin}/api/contacto/`, { method: "POST", headers: { origin: site.origin, "content-type": "application/json" }, body: "{}" }))).status, 415);
});

test("native contact limits body bytes even with no declared content length", async () => {
  const response = await POST(new Request(`${site.origin}/api/contacto/`, { method: "POST", headers: { origin: site.origin, "content-type": "application/x-www-form-urlencoded" }, body: `mensaje=${"x".repeat(32769)}` }));
  assert.equal(response.status, 413);
});
