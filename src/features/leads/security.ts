import "server-only";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";
export class LeadHttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    public retryAfter?: number,
  ) {
    super(code);
  }
}
export function hashValue(secret: string, value: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}
export function trustedClientKey(
  request: Request,
  vercel: boolean,
  production: boolean,
) {
  if (vercel) {
    const value = request.headers.get("x-vercel-forwarded-for")?.trim();
    if (!value || !isIP(value))
      throw new LeadHttpError(503, "CLIENT_ID_UNAVAILABLE");
    // Canonicalize IPv6 textual variants; no header is trusted outside Vercel.
    return isIP(value) === 6 ? new URL(`http://[${value}]/`).hostname : value;
  }
  if (production) throw new LeadHttpError(503, "UNSUPPORTED_DEPLOYMENT");
  return "local-development";
}
export function assertRequestOrigin(request: Request, origin: string) {
  if (
    request.headers.get("origin") !== origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new LeadHttpError(403, "ORIGIN_REJECTED");
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new LeadHttpError(415, "CONTENT_TYPE_REJECTED");
}
export async function readLimitedText(
  request: Request,
  maxBytes = 32768,
): Promise<string> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes))
    throw new LeadHttpError(413, "BODY_TOO_LARGE");
  if (!request.body) throw new LeadHttpError(400, "INVALID_JSON");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    void reader.cancel();
  }, 5000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        void reader.cancel();
        throw new LeadHttpError(413, "BODY_TOO_LARGE");
      }
      chunks.push(value);
    }
    if (timedOut) throw new LeadHttpError(408, "BODY_TIMEOUT");
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      throw new LeadHttpError(400, "INVALID_JSON");
    }
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}
export function isPrismaCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

export async function readLimitedJson(request: Request, maxBytes = 32768): Promise<unknown> {
  const text = await readLimitedText(request, maxBytes);
  try { return JSON.parse(text) as unknown; }
  catch { throw new LeadHttpError(400, "INVALID_JSON"); }
}
