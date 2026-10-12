import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import {
  handleLead,
  type LeadHandlerDependencies,
} from "../src/features/leads/handler";
import {
  LeadHttpError,
  readLimitedJson,
  trustedClientKey,
} from "../src/features/leads/security";
const input = {
  name: "Prueba funcional",
  email: "test@example.com",
  projectType: "web",
  description: "Queremos una web corporativa accesible de prueba.",
  privacy: true,
  website: "",
  attribution: { originPath: "/diseno-web-barcelona/", utmSource: "test" },
};
function request(
  data: unknown = input,
  key: string = randomUUID(),
  headers: Record<string, string> = {},
) {
  return new Request("http://localhost:3000/api/leads/", {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      "content-type": "application/json",
      "idempotency-key": key,
      ...headers,
    },
    body: JSON.stringify(data),
  });
}
function dependencies(): LeadHandlerDependencies {
  return {
    origin: "http://localhost:3000",
    production: false,
    vercel: false,
    config: {
      enabled: true,
      testMode: true,
      noticeUrl: null,
      noticeVersion: "test",
      retentionDays: 90,
      secret: "s".repeat(32),
    },
    notificationRecipient: null,
    rateLimit: async () => {},
    create: async () => ({ id: randomUUID(), created: true }),
    schedule: () => {},
  };
}
test("valid payload receives 201 only after persistence and no personal data in response", async () => {
  const deps = dependencies();
  let committed = false;
  deps.create = async (command) => {
    assert.equal(command.input.projectType, "web");
    assert.equal(
      command.input.attribution?.originPath,
      "/diseno-web-barcelona/",
    );
    assert.equal(command.noticeVersion, "test");
    committed = true;
    return { id: randomUUID(), created: true };
  };
  deps.schedule = () => {
    assert.ok(committed);
  };
  const response = await handleLead(request(), deps);
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    success: true,
    message: "Hemos recibido tu solicitud correctamente.",
  });
});
test("server rejects invalid data, administrative fields and honeypot", async () => {
  for (const data of [
    { ...input, email: "invalid" },
    { ...input, status: "WON" },
    { ...input, website: "https://spam.example" },
  ]) {
    const deps = dependencies();
    deps.create = async () => {
      assert.fail("Must not persist");
    };
    assert.equal((await handleLead(request(data), deps)).status, 422);
  }
});
test("DB errors never become success and email scheduling errors preserve committed leads", async () => {
  const deps = dependencies();
  deps.create = async () => {
    throw new Error("Private infrastructure detail");
  };
  const response = await handleLead(request(), deps);
  assert.equal(response.status, 503);
  assert.ok(!(await response.text()).includes("Private infrastructure"));
  const second = dependencies();
  second.schedule = () => {
    throw new Error("Resend unavailable");
  };
  assert.equal((await handleLead(request(), second)).status, 201);
});
test("rate limit returns 429 with Retry-After and never persists", async () => {
  const deps = dependencies();
  deps.rateLimit = async () => {
    throw new LeadHttpError(429, "RATE_LIMITED", 180);
  };
  deps.create = async () => {
    assert.fail("Must not persist");
  };
  const response = await handleLead(request(), deps);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "180");
});
test("origin, content type, key and missing configuration fail closed", async () => {
  assert.equal(
    (
      await handleLead(
        request(input, randomUUID(), { origin: "https://untrusted.example" }),
        dependencies(),
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleLead(
        request(input, randomUUID(), { "content-type": "text/plain" }),
        dependencies(),
      )
    ).status,
    415,
  );
  assert.equal(
    (await handleLead(request(input, "arbitrary-key"), dependencies())).status,
    400,
  );
  const deps = dependencies();
  deps.config = null;
  assert.equal((await handleLead(request(), deps)).status, 503);
});
test("body size is limited by bytes even when Content-Length is absent or lies", async () => {
  const req = request({ message: "x".repeat(33000) });
  await assert.rejects(
    readLimitedJson(req),
    (error: unknown) => error instanceof LeadHttpError && error.status === 413,
  );
  const malformed = new Request("http://localhost", {
    method: "POST",
    body: "not json",
  });
  await assert.rejects(
    readLimitedJson(malformed),
    (error: unknown) => error instanceof LeadHttpError && error.status === 400,
  );
});
test("client-provided forwarded headers are ignored outside Vercel", () => {
  const req = request(input, randomUUID(), {
    "x-forwarded-for": "1.2.3.4",
    "x-vercel-forwarded-for": "1.2.3.4",
  });
  assert.equal(trustedClientKey(req, false, false), "local-development");
  assert.throws(() => trustedClientKey(req, false, true));
  assert.equal(trustedClientKey(req, true, true), "1.2.3.4");
  assert.throws(() => trustedClientKey(request(), true, true));
});
