"use client";
import { usePathname } from "next/navigation";
export function ContactTestBanner() {
  const pathname = usePathname();
  return pathname.replace(/\/$/, "") === "/contacto" ? <div className="bg-amber-100 px-5 py-2 text-center text-xs text-amber-900">Entorno de pruebas: usa solo datos ficticios.</div> : null;
}
