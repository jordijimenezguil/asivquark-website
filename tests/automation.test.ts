import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { automationService } from "../src/content/automation";
import { services } from "../src/content/services";
import { parseContactProjectType, projectTypeForContract } from "../src/content/project-type";
import { publicPaths, serviceNavigation } from "../src/config/navigation";
import { leadRequestSchema, serviceLabels, serviceSchema } from "../src/features/leads/schema";
import { createLead } from "../src/features/leads/repository";
import { createCrmData } from "../src/features/crm/store";
import { filtersSchema } from "../src/features/crm/schema";
import { newLeadEmail } from "../src/emails/lead-emails";
import { pageMetadata } from "../src/lib/seo/metadata";
import { resolveSite } from "../src/config/site";
import type { Lead, Prisma, PrismaClient } from "../src/generated/prisma/client";
const input = { name: "Prueba", email: "test@example.com", projectType: "automatizacion", description: "Conectar herramientas para evitar duplicar tareas.", privacy: true };
test("single canonical service route and ordered shared navigation", () => {
  assert.equal(services.length, 5);
  assert.equal(publicPaths.filter(path => path === automationService.href).length, 1);
  assert.deepEqual(serviceNavigation.map(item => item.label), ["Diseño web", "Software a medida", "Aplicaciones web", "Automatización e IA", "Desarrollo MVP"]);
  assert.equal(automationService.href, "/automatizacion-procesos-ia/");
  assert.equal(automationService.sections[1].items.length, 6);
  assert.equal(automationService.process.length, 5);
  assert.equal(automationService.faqs.length, 7);
});
test("contact query selects automation and preserves both UI and old contract values", () => {
  assert.equal(parseContactProjectType([], ["automatizacion"]), "automatizacion");
  assert.equal(parseContactProjectType(["automatizacion"], []), "automatizacion");
  assert.equal(projectTypeForContract(parseContactProjectType([], ["aplicacion"])), "aplicacion");
  assert.equal(projectTypeForContract(parseContactProjectType([], ["otro"])), "otro");
  for (const values of [["unknown"], ["automatizacion", "automatizacion"], ["<script>"]]) assert.equal(parseContactProjectType([], values), "web");
  assert.equal(parseContactProjectType(["web"], ["automatizacion"]), "web");
  assert.equal(leadRequestSchema.parse(input).projectType, "automatizacion");
  for (const value of ["web", "software", "aplicacion", "mvp", "otro"]) assert.equal(serviceSchema.parse(value), value);
  assert.equal(serviceSchema.safeParse("unknown").success, false);
});
test("automation persists through the existing transactional lead/outbox repository", async () => {
  let written = false;
  const tx = {
    $queryRaw: async () => [{ count: 1 }],
    lead: { create: async ({ data }: { data: Prisma.LeadCreateInput }) => {
      assert.equal(data.service, "automatizacion");
      assert.equal(data.status, "NEW");
      assert.deepEqual(data.emails, { create: [{ type: "NOTIFICATION", recipient: null }, { type: "CONFIRMATION", recipient: "test@example.com" }] });
      written = true; return { id: "saved" };
    } },
  };
  const db = { lead: { findUnique: async () => null }, $transaction: async (fn: (value: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient;
  const result = await createLead({ input: leadRequestSchema.parse(input), idempotencyKey: randomUUID(), requestHash: "a".repeat(64), clientKey: "test", secret: "s".repeat(32), noticeVersion: "test", notificationRecipient: null }, db);
  assert.equal(written, true); assert.deepEqual(result, { id: "saved", created: true });
});
test("CRM recognizes label, passes exact service filter and preserves grouped service counts", async () => {
  assert.equal(filtersSchema.parse({ service: "automatizacion" }).service, "automatizacion");
  assert.equal(serviceLabels.automatizacion, "Automatización e IA");
  assert.equal(serviceLabels.web, "Página web");
  const tx = { lead: {
    count: async ({ where }: { where: Prisma.LeadWhereInput }) => { assert.equal(where.service, "automatizacion"); return 2; },
    findMany: async () => [],
    groupBy: async (args: { by: string[]; where?: unknown }) => args.by[0] === "service" ? [{ service: "automatizacion", _count: 2 }, { service: "web", _count: 3 }] : [{ status: "NEW", _count: 5 }],
  } };
  const db = { ...tx, $transaction: async (fn: (value: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient;
  const crm = createCrmData(() => db, async () => ({ user: { id: "admin-test" } }));
  assert.equal((await crm.getLeads({ service: "automatizacion" })).total, 2);
  const stats = await crm.getDashboardStats();
  assert.deepEqual(stats.services, [{ service: "automatizacion", _count: 2 }, { service: "web", _count: 3 }]);
  assert.equal(stats.metrics.total, 5);
});
test("notification uses shared automation label without calling Resend", () => {
  const lead = { name: "Prueba", email: "test@example.com", service: "automatizacion", createdAt: new Date(), message: "Proceso de prueba" } as Lead;
  const email = newLeadEmail(lead);
  assert.equal(email.subject, "Nuevo lead ASIVQUARK — Automatización e IA");
  assert.ok(email.text.includes(serviceLabels.automatizacion)); assert.ok(email.html.includes("Automatización e IA"));
});
test("dedicated metadata and deployment domain rules stay intact", () => {
  const metadata = pageMetadata({ title: automationService.seoTitle, description: automationService.seoDescription, path: automationService.href });
  assert.equal(metadata.title, "Automatización de Procesos e IA en Barcelona | ASIVQUARK");
  assert.equal(metadata.description, automationService.seoDescription);
  const production = resolveSite({ VERCEL_ENV: "production", NEXT_PUBLIC_SITE_URL: "https://asivquark.com", BETTER_AUTH_URL: "https://asivquark.com" });
  assert.equal(`${production.origin}${automationService.href}`, "https://asivquark.com/automatizacion-procesos-ia/");
  assert.equal(resolveSite({ VERCEL_ENV: "preview", VERCEL_URL: "test.vercel.app" }).isProduction, false);
});
