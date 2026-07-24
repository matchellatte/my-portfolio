/**
 * Anonymous, in-process analytics. No visitor identifiers, IPs, or message
 * content are stored — only aggregate counts and timings, matching the
 * "no personal visitor data" requirement.
 *
 * Swap `emit()` for a call to your analytics provider (PostHog, Vercel
 * Analytics, etc.) to persist this beyond a single server instance.
 */

export interface AnalyticsSnapshot {
  totalMessages: number;
  intentCounts: Record<string, number>;
  languageCounts: Record<string, number>;
  projectClicks: Record<string, number>;
  fallbacks: number;
  avgResponseTimeMs: number;
}

const state = {
  totalMessages: 0,
  intentCounts: new Map<string, number>(),
  languageCounts: new Map<string, number>(),
  projectClicks: new Map<string, number>(),
  fallbacks: 0,
  totalResponseTimeMs: 0,
  timedResponses: 0,
};

function bump(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function emit(event: string, payload: Record<string, unknown>) {
  // Replace with a real sink in production. Kept as a no-op-friendly log
  // so local/dev runs don't spam stdout unless DEBUG_ANALYTICS is set.
  if (process.env.DEBUG_ANALYTICS === "true") {
    console.log(`[analytics] ${event}`, payload);
  }
}

export function trackMessage(intent: string, language?: string) {
  state.totalMessages += 1;
  bump(state.intentCounts, intent);
  if (language) bump(state.languageCounts, language);
  emit("message", { intent, language });
}

export function trackFallback(intent: string) {
  state.fallbacks += 1;
  emit("fallback", { intent });
}

export function trackProjectClick(slug: string) {
  bump(state.projectClicks, slug);
  emit("project_click", { slug });
}

export function trackResponseTime(ms: number) {
  state.totalResponseTimeMs += ms;
  state.timedResponses += 1;
  emit("response_time", { ms });
}

export function getAnalyticsSnapshot(): AnalyticsSnapshot {
  return {
    totalMessages: state.totalMessages,
    intentCounts: Object.fromEntries(state.intentCounts),
    languageCounts: Object.fromEntries(state.languageCounts),
    projectClicks: Object.fromEntries(state.projectClicks),
    fallbacks: state.fallbacks,
    avgResponseTimeMs:
      state.timedResponses === 0 ? 0 : Math.round(state.totalResponseTimeMs / state.timedResponses),
  };
}
