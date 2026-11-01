import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { checkRateLimit, getClientAddress } from "@/lib/rate-limit";

const handler = toNextJsHandler(auth);

export const GET = handler.GET;

export async function POST(request: Request) {
  const result = checkRateLimit(`auth:${getClientAddress(request)}`, 30, 60 * 1000);
  if (!result.allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(result.retryAfter / 1000)) } },
    );
  }
  return handler.POST(request);
}
