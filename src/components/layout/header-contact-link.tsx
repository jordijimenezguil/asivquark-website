"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function HeaderContactLink() {
  const pathname = usePathname();
  if (pathname.replace(/\/$/, "") === "/contacto") return null;
  return <Link href="/contacto/" data-location="header" className="btn-primary shrink-0 px-3.5 text-sm lg:px-6"><span className="lg:hidden">Contacto</span><span className="hidden lg:inline">Cuéntanos tu proyecto →</span></Link>;
}
