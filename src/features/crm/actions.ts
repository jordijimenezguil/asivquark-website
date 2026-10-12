"use server";
import { revalidatePath } from "next/cache";
import { AccessError } from "@/lib/auth/authorization";
import { ConflictError, createLeadNote, updateLeadStatus } from "./data";
export type ActionState = {
    message: string;
    success?: boolean;
    conflict?: boolean;
};
async function mutate(form: FormData, kind: "status" | "note"): Promise<ActionState> {
    try {
        const id = form.get("id");
        if (kind === "status")
            await updateLeadStatus({ id, status: form.get("status"), version: form.get("version") });
        else
            await createLeadNote({ id, content: form.get("content") });
        revalidatePath("/admin", "layout");
        return { message: kind === "status" ? "Estado actualizado." : "Nota guardada.", success: true };
    }
    catch (error) {
        if (error instanceof ConflictError)
            return { message: "Otro administrador ha actualizado este lead. Recarga para consultar el estado actual.", conflict: true };
        if (error instanceof AccessError)
            return { message: "No tienes permisos para acceder. Vuelve a iniciar sesión." };
        console.error("crm_mutation_failed", { kind, category: error instanceof Error ? error.name : "unknown" });
        return { message: "No hemos podido guardar los cambios. Comprueba los datos y vuelve a intentarlo." };
    }
}
export async function changeStatus(_previous: ActionState, form: FormData) { return mutate(form, "status"); }
export async function addNote(_previous: ActionState, form: FormData) { return mutate(form, "note"); }
export async function applyFilters(form: FormData) {
    const { requireAdmin } = await import("@/lib/auth/authorization");
    const { cookies } = await import("next/headers");
    const { redirect } = await import("next/navigation");
    const { filtersSchema } = await import("./schema");
    const { site } = await import("@/config/site");
    const session = await requireAdmin();
    const filters = filtersSchema.parse(Object.fromEntries(form));
    (await cookies()).set("crm-search", JSON.stringify({ actorId: session.user.id, q: filters.q }), { httpOnly: true, secure: site.authOrigin.startsWith("https:"), sameSite: "strict", path: "/admin/leads", maxAge: 3600 });
    const params = new URLSearchParams();
    for (const key of ["status", "service", "period", "sort"] as const)
        if (filters[key])
            params.set(key, filters[key]);
    redirect(`/admin/leads/?${params}`);
}

export async function clearFilters() {
  await applyFilters(new FormData());
}
