import type { ZodError } from "zod";

export function formatZodError(error: ZodError): string {
  return error.issues
    .map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message))
    .join("; ");
}

const ALLOWED_ORIGINS = [
  "https://skillshub.wtf",
  "https://www.skillshub.wtf",
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

const readCorsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function getWriteCorsHeaders(request?: Request): Record<string, string> {
  const origin = request?.headers.get("Origin") ?? "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
}

/** CORS response for read-only (GET) endpoints — open to all origins */
export function corsJson(data: unknown, init?: { status?: number }) {
  return Response.json(data, {
    status: init?.status,
    headers: readCorsHeaders,
  });
}

/** CORS response for write (POST/PUT/DELETE) endpoints — restricted origins */
export function writeCorsJson(data: unknown, request: Request, init?: { status?: number }) {
  return Response.json(data, {
    status: init?.status,
    headers: getWriteCorsHeaders(request),
  });
}

export function methodNotAllowed(allowed: string[]) {
  return corsJson(
    { error: { code: "METHOD_NOT_ALLOWED", message: `Method not allowed. Use ${allowed.join(", ")} for this endpoint.` } },
    { status: 405 }
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: readCorsHeaders });
}

/** OPTIONS preflight for write endpoints — restricted origins */
export function writeOPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: getWriteCorsHeaders(request) });
}
