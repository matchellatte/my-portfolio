import { NextResponse } from "next/server";
import { getAnalyticsSnapshot } from "../../../../lib/chatbot/analytics";

export const runtime = "nodejs";

/**
 * Returns aggregate, anonymous chatbot analytics. No message content or
 * visitor identifiers are ever stored, so this is safe to expose behind
 * light protection. For production, gate this behind an admin auth check
 * or simply don't route to it publicly.
 */
export async function GET() {
  return NextResponse.json(getAnalyticsSnapshot());
}
