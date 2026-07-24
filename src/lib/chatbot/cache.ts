/**
 * Caches full LLM responses by a normalized cache key (intent + message).
 * In-memory, per server instance — swap for Redis/Vercel KV in a
 * multi-instance deployment without changing the call sites below.
 */

interface CacheEntry {
  response: string;
  createdAt: number;
}

const TTL_MS = 1000 * 60 * 60 * 6; // 6 hours
const cache = new Map<string, CacheEntry>();

function normalizeKey(intent: string, message: string): string {
  return `${intent}::${message.toLowerCase().trim().replace(/\s+/g, " ")}`;
}

export function getCachedResponse(intent: string, message: string): string | null {
  const key = normalizeKey(intent, message);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.response;
}

export function setCachedResponse(intent: string, message: string, response: string): void {
  const key = normalizeKey(intent, message);
  cache.set(key, { response, createdAt: Date.now() });
}
