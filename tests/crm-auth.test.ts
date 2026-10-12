import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { memoryAdapter } from "better-auth/adapters/memory";
import { hashPassword } from "better-auth/crypto";
import { createAuthForDatabase } from "../src/lib/auth/index";
import { isAdmin } from "../src/features/crm/schema";
test("Better Auth login, private role, cookies, expired session, logout and signup rejection", async () => {
    const password = randomUUID();
    const userId = randomUUID();
    const now = new Date();
    const memory: Record<string, Record<string, unknown>[]> = {
        user: [{ id: userId, name: "Test administrator", email: "admin@example.test", emailVerified: false, role: "admin", createdAt: now, updatedAt: now }],
        account: [{ id: randomUUID(), userId, accountId: userId, providerId: "credential", password: await hashPassword(password), createdAt: now, updatedAt: now }],
        session: [], verification: [], rateLimit: [],
    };
    const auth = createAuthForDatabase(memoryAdapter(memory), randomUUID() + randomUUID());
    const request = (path: string, body: unknown, cookie = "") => new Request(`http://localhost:3000/api/auth/${path}`, { method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:3000", Cookie: cookie }, body: JSON.stringify(body) });
    assert.equal(await auth.api.getSession({ headers: new Headers() }), null);
    const wrong = await auth.handler(request("sign-in/email/", { email: "admin@example.test", password: "wrong-password" }));
    assert.equal(wrong.status, 401);
    const signup = await auth.handler(request("sign-up/email", { email: "new@example.test", password, name: "New", role: "admin" }));
    assert.ok(signup.status >= 400);
    assert.equal(memory.user.length, 1);
    const login = await auth.handler(request("sign-in/email/", { email: "admin@example.test", password, role: "admin" }));
    assert.equal(login.status, 200);
    const setCookies = login.headers.getSetCookie();
    assert.ok(setCookies.some(c => /httponly/i.test(c)));
    assert.ok(setCookies.some(c => /samesite=lax/i.test(c)));
    const cookie = setCookies.map(c => c.split(";")[0]).join("; ");
    const headers = new Headers({ Cookie: cookie });
    const session = await auth.api.getSession({ headers });
    assert.ok(session);
    assert.ok(isAdmin(session.user));
    memory.user[0].role = "user";
    const ordinary = await auth.api.getSession({ headers, query: { disableCookieCache: true } });
    assert.ok(ordinary);
    assert.equal(isAdmin(ordinary.user), false);
    memory.user[0].role = "admin";
    const logout = await auth.handler(request("sign-out/", {}, cookie));
    assert.equal(logout.status, 200);
    assert.equal(await auth.api.getSession({ headers }), null);
    const login2 = await auth.handler(request("sign-in/email", { email: "admin@example.test", password }));
    assert.equal(login2.status, 200);
    const cookie2 = login2.headers.getSetCookie().map(c => c.split(";")[0]).join("; ");
    memory.session.forEach(s => { s.expiresAt = new Date(0); });
    assert.equal(await auth.api.getSession({ headers: new Headers({ Cookie: cookie2 }) }), null);
    for (let attempt = 0; attempt < 3; attempt++) {
        const response = await auth.handler(request("sign-in/email", { email: "admin@example.test", password: "wrong-password" }));
        if (attempt === 2)
            assert.equal(response.status, 429);
    }
});
