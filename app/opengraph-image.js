import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f6f8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            background: "#fff",
            borderRadius: 24,
            padding: "40px 56px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 20,
              background: "#7c3aed",
              color: "#fff",
              fontSize: 44,
            }}
          >
            ▶
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 56, fontWeight: 700, color: "#111827" }}>
              My Store
            </div>
            <div style={{ fontSize: 28, color: "#6b7280" }}>
              Daily Video Access — $50.00
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
