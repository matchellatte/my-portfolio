import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

async function trackProjectClick(_slug: string) {
  // Best-effort only — keep this route working even if analytics helpers are unavailable.
}

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (typeof slug === "string" && slug.length < 100) {
      trackProjectClick(slug);
    }
  } catch {
    // Best-effort only — never block the visitor's navigation on this.
  }
  return NextResponse.json({ ok: true });
}
