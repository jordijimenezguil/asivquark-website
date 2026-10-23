"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Inbox, Menu } from "lucide-react";
import { BrandLogo } from "@/components/branding/brand-logo";
import { LogoutButton } from "./auth-controls";
export function DashboardSidebar() {
    const [open, setOpen] = useState(false);
    const path = usePathname();
    return <aside className="bg-night text-white md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0"><div className="flex items-center justify-between p-6"><BrandLogo size="sm"/><button type="button" className="min-h-11 min-w-11 md:hidden" aria-label="Menú administrativo" aria-expanded={open} aria-controls="admin-navigation" onClick={() => setOpen(!open)}><Menu aria-hidden="true"/></button></div><nav id="admin-navigation" aria-label="Administración" className={`${open ? "block" : "hidden"} space-y-3 p-6 pt-0 md:block`} onKeyDown={e => { if (e.key === "Escape") {
        setOpen(false);
        document.querySelector<HTMLButtonElement>('[aria-controls="admin-navigation"]')?.focus();
    } }}>{[{ href: "/admin/", label: "Dashboard", Icon: LayoutDashboard }, { href: "/admin/leads/", label: "Leads", Icon: Inbox }].map(({ href, label, Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={(href === "/admin/" ? path === href || path === "/admin" : path.startsWith("/admin/leads")) ? "page" : undefined} className="flex min-h-12 items-center gap-3 rounded-lg px-3 hover:bg-surface"><Icon size={18} aria-hidden="true"/>{label}</Link>)}<div className="border-t border-white/10 pt-4"><LogoutButton /></div></nav></aside>;
}
