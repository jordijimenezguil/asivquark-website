import { toNextJsHandler } from "better-auth/next-js";
import { getAuth, isAuthConfigured } from "@/lib/auth";
export const runtime = "nodejs";
async function handle(request: Request) {
  if (!isAuthConfigured())
    return Response.json(
      { error: "Autenticación no disponible." },
      { status: 503 },
    );
  const handlers = toNextJsHandler(getAuth());
  return request.method === "GET"
    ? handlers.GET(request)
    : handlers.POST(request);
}
export { handle as GET, handle as POST };
