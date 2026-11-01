const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientAddress(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: windowMs };
  }

  current.count += 1;
  return {
    allowed: current.count <= limit,
    retryAfter: Math.max(0, current.resetAt - now),
  };
}
