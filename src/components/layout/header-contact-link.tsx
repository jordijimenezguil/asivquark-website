"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function HeaderContactLink() {
  const pathname = usePathname();
  if (pathname.replace(/\/$/, "") === "/contacto") return null;
  return <Link href="/contacto/" data-location="header" className="inline-flex h-10 shrink-0 items-center rounded-full bg-violet px-3.5 text-sm font-semibold whitespace-nowrap text-white hover:bg-violet-600 lg:h-auto lg:min-h-12 lg:rounded-[10px] lg:px-6 lg:py-3 lg:text-[15px]"><span className="lg:hidden">Contacto</span><span className="hidden lg:inline">Cuéntanos tu proyecto →</span></Link>;
}
