import { corsJson, OPTIONS as corsOptions } from "@/lib/api-cors";

export async function GET() {
  return corsJson({ status: "ok", timestamp: new Date().toISOString() });
}

export { corsOptions as OPTIONS };
