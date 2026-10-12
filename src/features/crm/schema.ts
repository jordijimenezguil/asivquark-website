import { z } from "zod";
import { serviceSchema } from "@/features/leads/schema";
export const statusLabels = { NEW: "Nuevo", CONTACTED: "Contactado", QUALIFIED: "Cualificado", PROPOSAL_SENT: "Propuesta enviada", WON: "Ganado", LOST: "Perdido", SPAM: "Spam" } as const;
export const statusSchema = z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST", "SPAM"]);
export const filtersSchema = z.object({
    q: z.string().trim().transform(s => s.replace(/\s+/g, " ")).pipe(z.string().max(100)).catch(""),
    status: statusSchema.optional().catch(undefined), service: serviceSchema.optional().catch(undefined),
    period: z.enum(["7", "30", "90"]).optional().catch(undefined),
    sort: z.enum(["newest", "oldest"]).catch("newest"),
    page: z.coerce.number().int().min(1).max(10000).catch(1),
});
export const statusInput = z.strictObject({ id: z.uuid(), status: statusSchema, version: z.preprocess(value => typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value, z.number().int().nonnegative()) });
export const noteInput = z.strictObject({ id: z.uuid(), content: z.string().trim().min(1).max(5000).refine(s => !/[<>\u0000]/u.test(s)) });
export function safeReturnPath(value: unknown) {
    return typeof value === "string" && /^\/admin(?:\/leads(?:\/[a-f0-9-]{36})?)?\/?$/i.test(value) ? value : "/admin/";
}
export function isAdmin(user: {
    role?: string | null;
} | null | undefined) { return user?.role === "admin"; }
export function metrics(counts: {
    status: keyof typeof statusLabels;
    count: number;
}[]) {
    const n = (states: string[]) => counts.filter(c => states.includes(c.status)).reduce((sum, c) => sum + c.count, 0);
    return { total: n(Object.keys(statusLabels)), opportunities: n(Object.keys(statusLabels).filter(s => s !== "SPAM")), new: n(["NEW"]), following: n(["CONTACTED", "QUALIFIED"]), proposals: n(["PROPOSAL_SENT"]), won: n(["WON"]) };
}
