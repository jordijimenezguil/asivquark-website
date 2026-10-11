import "server-only";
import { headers } from "next/headers";
import { getAuth } from "./index";

// Call inside every future protected server page, action and API handler.
export async function requireAdmin() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin")
    throw new Error("Acceso no autorizado.");
  return session;
}
