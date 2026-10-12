import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createCrmData, ConflictError } from "../src/features/crm/store";
import { filtersSchema, isAdmin, metrics, noteInput, safeReturnPath, statusInput } from "../src/features/crm/schema";
import type { PrismaClient } from "../src/generated/prisma/client";
const id = "12345678-1234-4234-8234-123456789012";
function fixture({ allowed = true, found = true, conflict = false, status = "NEW", version = 0, total = 21 } = {}) {
    const calls: {
        name: string;
        args: unknown;
    }[] = [];
    const record = (name: string, args: unknown) => calls.push({ name, args });
    const tx = {
        lead: {
            count: async (args: unknown) => { record("count", args); return total; },
            findMany: async (args: unknown) => { record("findMany", args); return total ? [{ id }] : []; },
            findUnique: async (args: unknown) => { record("findUnique", args); return found ? { id, status, version } : null; },
            updateMany: async (args: unknown) => { record("updateMany", args); return { count: conflict ? 0 : 1 }; },
        },
        leadNote: { create: async (args: unknown) => { record("note", args); return { id: "note-id" }; } },
        leadEvent: { create: async (args: unknown) => { record("event", args); } },
    };
    const db = { ...tx, $transaction: async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient;
    const data = createCrmData(() => db, async () => { if (!allowed)
        throw new Error("DENIED"); return { user: { id: "trusted-admin" } }; });
    return { data, calls };
}
test("roles and return URLs fail closed", () => {
    for (const user of [null, undefined, {}, { role: "user" }, { role: "ADMIN" }])
        assert.equal(isAdmin(user), false);
    assert.equal(isAdmin({ role: "admin" }), true);
    for (const url of ["https://evil.test", "//evil.test", "/admin/../api", "/admin/?next=https://evil.test", "/admin/\\evil"])
        assert.equal(safeReturnPath(url), "/admin/");
    assert.equal(safeReturnPath(`/admin/leads/${id}/`), `/admin/leads/${id}/`);
});
test("invalid filters are safely normalized; search capped", () => {
    assert.deepEqual(filtersSchema.parse({ status: "invalid", service: "invalid", period: "forever", page: -1, sort: "SQL", q: "  Ana   Pérez  " }), { q: "Ana Pérez", status: undefined, service: undefined, period: undefined, page: 1, sort: "newest" });
    assert.equal(filtersSchema.parse({ q: "x".repeat(101) }).q, "");
});
test("metrics use commercial states and explicitly separate spam", () => {
    assert.deepEqual(metrics([]), { total: 0, opportunities: 0, new: 0, following: 0, proposals: 0, won: 0 });
    assert.deepEqual(metrics([{ status: "NEW", count: 2 }, { status: "CONTACTED", count: 3 }, { status: "QUALIFIED", count: 4 }, { status: "PROPOSAL_SENT", count: 5 }, { status: "WON", count: 6 }, { status: "SPAM", count: 10 }]), { total: 30, opportunities: 20, new: 2, following: 7, proposals: 5, won: 6 });
});
test("every sensitive operation authorizes before any database access", async () => {
    const { data, calls } = fixture({ allowed: false });
    for (const operation of [() => data.getDashboardStats(), () => data.getLeads({}), () => data.getLeadById(id), () => data.updateLeadStatus({ id, status: "WON", version: 0 }), () => data.createLeadNote({ id, content: "Private" })])
        await assert.rejects(operation, /DENIED/);
    assert.equal(calls.length, 0);
});
test("server listing combines filters, search, deterministic sort and pagination", async () => {
    const { data, calls } = fixture();
    const result = await data.getLeads({ q: "Ana", status: "NEW", service: "web", period: "7", sort: "oldest", page: 2 });
    assert.equal(result.total, 21);
    assert.equal(result.page, 2);
    const args = calls.find(c => c.name === "findMany")?.args as {
        take: number;
        skip: number;
        orderBy: unknown;
        where: {
            status: string;
            service: string;
            OR: unknown[];
            createdAt: unknown;
        };
    };
    assert.equal(args.take, 20);
    assert.equal(args.skip, 20);
    assert.deepEqual(args.orderBy, [{ createdAt: "asc" }, { id: "asc" }]);
    assert.equal(args.where.status, "NEW");
    assert.equal(args.where.service, "web");
    assert.equal(args.where.OR.length, 3);
    assert.ok(args.where.createdAt);
});
test("empty listing and out of range pagination", async () => {
    const { data } = fixture({ total: 0 });
    const result = await data.getLeads({ page: 5 });
    assert.deepEqual(result.leads, []);
    assert.equal(result.page, 1);
});
test("valid state change records actor and previous/new state with optimistic version", async () => {
    const { data, calls } = fixture();
    await data.updateLeadStatus({ id, status: "WON", version: 0 });
    assert.deepEqual(calls.find(c => c.name === "updateMany")?.args, { where: { id, version: 0 }, data: { status: "WON", version: { increment: 1 } } });
    assert.deepEqual(calls.find(c => c.name === "event")?.args, { data: { leadId: id, type: "STATUS_CHANGED", actorId: "trusted-admin", metadata: { previous: "NEW", next: "WON" } } });
});
test("unchanged status does not create activity", async () => { const { data, calls } = fixture(); await data.updateLeadStatus({ id, status: "NEW", version: 0 }); assert.ok(!calls.some(c => c.name === "event")); });
test("missing lead, stale snapshot and racing update are rejected", async () => {
    await assert.rejects(fixture({ found: false }).data.updateLeadStatus({ id, status: "WON", version: 0 }), /NOT_FOUND/);
    for (const f of [fixture({ version: 1 }), fixture({ conflict: true })]) {
        await assert.rejects(f.data.updateLeadStatus({ id, status: "WON", version: 0 }), ConflictError);
        assert.ok(!f.calls.some(c => c.name === "event"));
    }
});
test("status and notes reject tampered actor, invalid ids and invalid content", () => {
    assert.equal(statusInput.safeParse({ id, status: "INVALID", version: 0 }).success, false);
    for (const version of [null, "", -1, "bad"]) assert.equal(statusInput.safeParse({id, status: "WON", version}).success, false);
    assert.equal(statusInput.safeParse({ id, status: "WON", version: 0, actorId: "evil" }).success, false);
    for (const content of ["", " ", "a".repeat(5001), "<script>alert(1)</script>"])
        assert.equal(noteInput.safeParse({ id, content }).success, false);
    assert.equal(noteInput.safeParse({ id: "bad", content: "Note" }).success, false);
});
test("notes store server actor and minimal activity, no note content in event", async () => {
    const { data, calls } = fixture();
    await data.createLeadNote({ id, content: "  Private note  " });
    assert.deepEqual(calls.find(c => c.name === "note")?.args, { data: { leadId: id, authorId: "trusted-admin", content: "Private note" } });
    assert.deepEqual(calls.find(c => c.name === "event")?.args, { data: { leadId: id, actorId: "trusted-admin", type: "NOTE_ADDED", metadata: { noteId: "note-id" } } });
    await assert.rejects(fixture({ found: false }).data.createLeadNote({ id, content: "Note" }), /NOT_FOUND/);
});
test("additive migration and auth retain safe defaults", () => {
    const sql = readFileSync("prisma/migrations/20261012120000_crm/migration.sql", "utf8");
    assert.ok(!/^\s*(DROP|TRUNCATE|DELETE)\b/im.test(sql));
    const auth = readFileSync("src/lib/auth/index.ts", "utf8");
    assert.ok(auth.includes("disableSignUp: true"));
    assert.ok(auth.includes("input: false"));
    assert.ok(auth.includes('storage: "database"'));
});
