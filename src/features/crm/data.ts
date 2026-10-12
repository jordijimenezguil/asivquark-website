import "server-only";
import { getPrisma } from "@/lib/prisma";
import { AccessError, requireAdmin } from "@/lib/auth/authorization";
import { createCrmData } from "./store";
export { ConflictError } from "./store";
const store = createCrmData(getPrisma, requireAdmin);
// Never let database errors reach Next's error logger with query inputs attached.
async function privateQuery<T>(operation: () => Promise<T>): Promise<T> {
  try { return await operation(); }
  catch (error) {
    if (error instanceof AccessError) throw error;
    console.error("crm_query_failed", { category: error instanceof Error ? error.name : "unknown" });
    throw new Error("Ha ocurrido un error al cargar los datos.");
  }
}
export function getDashboardStats() { return privateQuery(() => store.getDashboardStats()); }
export function getLeads(raw: Record<string, unknown>) { return privateQuery(() => store.getLeads(raw)); }
export function getLeadById(id: string) { return privateQuery(() => store.getLeadById(id)); }
export const updateLeadStatus = store.updateLeadStatus;
export const createLeadNote = store.createLeadNote;
