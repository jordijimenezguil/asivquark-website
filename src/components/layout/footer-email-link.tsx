"use client";

import { usePathname } from "next/navigation";
import { legalDocuments, legalEntity } from "@/config/legal";

export function FooterEmailLink({ className, arrow = false }: { className?: string; arrow?: boolean }) {
  const pathname = usePathname();
  const isLegal = legalDocuments.some(document => document.path.replace(/\/$/, "") === pathname.replace(/\/$/, ""));
  const email = isLegal ? legalEntity.legalEmail! : "proyectos@asivquark.com";
  return <a href={`mailto:${email}`} className={className}>{email}{arrow && " ↗"}</a>;
}
