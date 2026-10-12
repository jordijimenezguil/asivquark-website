import "server-only";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { filtersSchema, metrics, noteInput, statusInput } from "./schema";
export class ConflictError extends Error {
}
export function createCrmData(getPrisma: () => ReturnType<typeof import("@/lib/prisma").getPrisma>, requireAdmin: () => Promise<{
    user: {
        id: string;
    };
}>) {
    const summary = { id: true, name: true, company: true, service: true, status: true, createdAt: true, source: true } satisfies Prisma.LeadSelect;
    async function getDashboardStats() {
        await requireAdmin();
        const db = getPrisma();
        const [states, services, recent] = await Promise.all([
            db.lead.groupBy({ by: ["status"], _count: true }),
            db.lead.groupBy({ by: ["service"], where: { status: { not: "SPAM" } }, _count: true }),
            db.lead.findMany({ take: 5, orderBy: [{ createdAt: "desc" }, { id: "desc" }], select: summary }),
        ]);
        return { metrics: metrics(states.map(s => ({ status: s.status, count: s._count }))), states, services, recent };
    }
    async function getLeads(raw: Record<string, unknown>) {
        await requireAdmin();
        const filters = filtersSchema.parse(raw);
        const where: Prisma.LeadWhereInput = {
            ...(filters.status && { status: filters.status }), ...(filters.service && { service: filters.service }),
            ...(filters.period && { createdAt: { gte: new Date(Date.now() - Number(filters.period) * 86400000) } }),
            ...(filters.q && { OR: ["name", "email", "company"].map(field => ({ [field]: { contains: filters.q, mode: "insensitive" } })) }),
        };
        const db = getPrisma();
        return db.$transaction(async (tx) => {
            const total = await tx.lead.count({ where });
            const page = Math.min(filters.page, Math.max(1, Math.ceil(total / 20)));
            const direction = filters.sort === "oldest" ? "asc" : "desc";
            const leads = await tx.lead.findMany({ where, skip: (page - 1) * 20, take: 20, orderBy: [{ createdAt: direction }, { id: direction }], select: summary });
            return { leads, total, page, filters };
        }, { isolationLevel: "RepeatableRead" });
    }
    async function getLeadById(id: string) {
        await requireAdmin();
        if (!z.uuid().safeParse(id).success)
            return null;
        return getPrisma().lead.findUnique({ where: { id }, select: {
                ...summary, email: true, phone: true, budget: true, message: true, version: true,
                landingPath: true, originPath: true, referrer: true, utmSource: true, utmMedium: true, utmCampaign: true, utmContent: true, utmTerm: true,
                notes: { take: 100, orderBy: [{ createdAt: "desc" }, { id: "desc" }], select: { id: true, content: true, createdAt: true, author: { select: { name: true } } } },
                events: { take: 100, orderBy: [{ createdAt: "desc" }, { id: "desc" }], select: { id: true, type: true, createdAt: true, actor: { select: { name: true } }, metadata: true } },
            } });
    }
    async function updateLeadStatus(raw: unknown) {
        const session = await requireAdmin();
        const input = statusInput.parse(raw);
        return getPrisma().$transaction(async (tx) => {
            const lead = await tx.lead.findUnique({ where: { id: input.id }, select: { status: true, version: true } });
            if (!lead)
                throw new Error("NOT_FOUND");
            if (lead.version !== input.version)
                throw new ConflictError();
            if (lead.status === input.status)
                return;
            const changed = await tx.lead.updateMany({ where: { id: input.id, version: input.version }, data: { status: input.status, version: { increment: 1 } } });
            if (changed.count !== 1)
                throw new ConflictError();
            await tx.leadEvent.create({ data: { leadId: input.id, type: "STATUS_CHANGED", actorId: session.user.id, metadata: { previous: lead.status, next: input.status } } });
        });
    }
    async function createLeadNote(raw: unknown) {
        const session = await requireAdmin();
        const input = noteInput.parse(raw);
        return getPrisma().$transaction(async (tx) => {
            if (!await tx.lead.findUnique({ where: { id: input.id }, select: { id: true } }))
                throw new Error("NOT_FOUND");
            const note = await tx.leadNote.create({ data: { leadId: input.id, authorId: session.user.id, content: input.content } });
            await tx.leadEvent.create({ data: { leadId: input.id, actorId: session.user.id, type: "NOTE_ADDED", metadata: { noteId: note.id } } });
        });
    }
    return { getDashboardStats, getLeads, getLeadById, updateLeadStatus, createLeadNote };
}
