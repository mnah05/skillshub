import type { ZodError } from "zod";

export function formatZodError(error: ZodError): string {
  return error.issues
    .map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message))
    .join("; ");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function corsJson(data: unknown, init?: { status?: number }) {
  return Response.json(data, {
    status: init?.status,
    headers: corsHeaders,
  });
}

export function methodNotAllowed(allowed: string[]) {
  return corsJson(
    { error: { code: "METHOD_NOT_ALLOWED", message: `Method not allowed. Use ${allowed.join(", ")} for this endpoint.` } },
    { status: 405 }
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
