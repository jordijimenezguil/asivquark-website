import { toNextJsHandler } from "better-auth/next-js";
import { getAuth, isAuthConfigured } from "@/lib/auth";
export const runtime = "nodejs";
async function handle(request: Request) {
  const unavailable = () => Response.json(
    { error: "Autenticación no disponible." },
    { status: 503, headers: { "Cache-Control": "private, no-store" } },
  );
  if (!isAuthConfigured()) return unavailable();
  try {
    const handlers = toNextJsHandler(getAuth());
    const response = await (request.method === "GET" ? handlers.GET(request) : handlers.POST(request));
    return response.status >= 500 ? unavailable() : response;
  } catch {
    console.error("auth_request_unavailable");
    return unavailable();
  }
}
export { handle as GET, handle as POST };
