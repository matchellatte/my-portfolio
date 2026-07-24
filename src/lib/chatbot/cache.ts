/**
 * Caches full LLM responses by a normalized cache key (intent + message,
 * plus an optional scope for context-dependent replies). In-memory,
 * per server instance — swap for Redis/Vercel KV in a multi-instance
 * deployment without changing the call sites below.
 */

interface CacheEntry {
  response: string;
  createdAt: number;
}

const TTL_MS = 1000 * 60 * 60 * 6; // 6 hours
const cache = new Map<string, CacheEntry>();

function normalizeKey(intent: string, message: string, scope?: string): string {
  const base = `${intent}::${message.toLowerCase().trim().replace(/\s+/g, " ")}`;
  // A bare follow-up like "link" resolves to whatever project was recently
  // discussed in *that* conversation — without a scope, caching it by
  // message text alone would leak one visitor's project into another
  // visitor's unrelated conversation that happens to send the same word.
  return scope ? `${base}::${scope}` : base;
}

export function getCachedResponse(intent: string, message: string, scope?: string): string | null {
  const key = normalizeKey(intent, message, scope);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.response;
}

export function setCachedResponse(intent: string, message: string, response: string, scope?: string): void {
  const key = normalizeKey(intent, message, scope);
  cache.set(key, { response, createdAt: Date.now() });
}