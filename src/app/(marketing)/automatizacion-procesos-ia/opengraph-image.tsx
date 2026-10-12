import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
export const alt = "ASIVQUARK — Automatización de procesos e IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage() {
  const mark = await readFile(path.join(process.cwd(), "public/brand/asivquark-mark-dark.svg"));
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 80, background: "#0B0F17", color: "white" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 32 }}><img src={`data:image/svg+xml;base64,${mark.toString("base64")}`} width={100} height={70} alt="" />ASIV<span style={{ color: "#A78BFA" }}>QUARK</span></div>
    <div style={{ display: "flex", flexDirection: "column", fontSize: 60, letterSpacing: "-2px" }}><div>Automatización de procesos.</div><div style={{ color: "#A78BFA" }}>IA cuando aporta valor.</div></div>
    <div style={{ fontSize: 22, color: "#AEB6C7" }}>Conectar herramientas. Simplificar operaciones.</div>
  </div>, size);
}
