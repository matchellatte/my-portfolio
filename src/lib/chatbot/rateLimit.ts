/**
 * In-memory rate limiter. Good enough for a single-instance deployment
 * (e.g. one Vercel serverless region with a warm lambda) or local dev.
 *
 * For a multi-region or multi-instance production deployment, swap this
 * module's internals for a shared store (Upstash Redis, Vercel KV, etc.)
 * behind the same `checkRateLimit` function signature — nothing else in
 * the app needs to change.
 */

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 12;

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

// Periodically clear stale buckets so the map doesn't grow unbounded
// on a long-lived server process.
let lastSweep = Date.now();
function sweep() {
  const now = Date.now();
  if (now - lastSweep < WINDOW_MS * 5) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS * 2) {
      buckets.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs?: number;
}

export function checkRateLimit(identifier: string): RateLimitResult {
  sweep();
  const now = Date.now();
  const existing = buckets.get(identifier);

  if (!existing || now - existing.windowStart > WINDOW_MS) {
    buckets.set(identifier, { count: 1, windowStart: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: WINDOW_MS - (now - existing.windowStart),
    };
  }

  existing.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - existing.count };
}

export function getClientIdentifier(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  return headers.get("x-real-ip") ?? "unknown";
}
