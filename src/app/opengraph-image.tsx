import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
export const alt =
  "ASIVQUARK — Desarrollo de software y páginas web en Barcelona";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage() {
  const mark = await readFile(path.join(process.cwd(), "public/brand/asivquark-mark-dark.svg"));
  const markUrl = `data:image/svg+xml;base64,${mark.toString("base64")}`;
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
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 32 }}>
        {/* ImageResponse requires a native img for embedded SVG. */}
        <img src={markUrl} alt="" width={100} height={70} />
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
