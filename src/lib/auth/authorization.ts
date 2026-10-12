import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth, isAuthConfigured } from "./index";
import { isAdmin } from "@/features/crm/schema";
export class AccessError extends Error {
}
export async function getPrivateSession() {
    if (!isAuthConfigured())
        return null;
    try {
        return await getAuth().api.getSession({ headers: await headers(), query: { disableCookieCache: true } });
    } catch {
        console.error("auth_session_unavailable");
        throw new Error("Autenticación temporalmente no disponible.");
    }
}
export async function requireAdmin() {
    const session = await getPrivateSession();
    if (!session || !isAdmin(session.user))
        throw new AccessError("No tienes permisos para acceder.");
    return session;
}
export async function requireAdminPage(path = "/admin/") {
    const session = await getPrivateSession();
    if (!session)
        redirect(`/login/?returnTo=${encodeURIComponent(path)}`);
    if (!isAdmin(session.user))
        redirect("/login/?denied=1");
    return session;
}
