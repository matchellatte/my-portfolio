import { ImageResponse } from "next/og";
import { siteConfig } from "../lib/data";

export const runtime = "edge";

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #08080a 0%, #111114 55%, #1a0f15 100%)",
          color: "#f4f4f5",
          fontFamily: "Inter, Arial, sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-18% auto auto -10%",
            width: 460,
            height: 460,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(194,66,125,0.34), transparent 68%)",
            filter: "blur(12px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -120,
            bottom: -140,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(244,114,182,0.18), transparent 70%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20, zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              width: 132,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 9999,
              padding: "10px 16px",
              color: "#f9a8d4",
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Portfolio
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 820 }}>
            <div style={{ fontSize: 88, lineHeight: 0.95, fontWeight: 700 }}>
              {siteConfig.name}
            </div>
            <div style={{ fontSize: 38, lineHeight: 1.15, color: "#f9a8d4" }}>
              {siteConfig.role}
            </div>
            <div style={{ fontSize: 28, lineHeight: 1.4, color: "#d4d4d8" }}>
              {siteConfig.description}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
            fontSize: 22,
            color: "#a1a1aa",
          }}
        >
          <span>{siteConfig.url}</span>
          <span>Next.js • TypeScript • AI</span>
        </div>
      </div>
    ),
    size,
  );
}