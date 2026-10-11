import { ImageResponse } from "next/og";
export const alt =
  "ASIVQUARK — Desarrollo de software y páginas web en Barcelona";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#0B0F17",
        color: "white",
        width: "100%",
        height: "100%",
        padding: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", fontSize: 32 }}>
        ASIV<span style={{ color: "#A78BFA" }}>QUARK</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 64,
          letterSpacing: "-2px",
        }}
      >
        <div>Software y páginas web.</div>
        <div style={{ color: "#A78BFA" }}>Desde Barcelona.</div>
      </div>
      <div style={{ fontSize: 20, color: "#AEB6C7" }}>
        SOFTWARE & DIGITAL PRODUCTS
      </div>
    </div>,
    size,
  );
}
