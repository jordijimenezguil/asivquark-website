import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdminPage } from "@/lib/auth/authorization";
import { DashboardSidebar } from "@/components/dashboard/navigation";
import { LogoutButton } from "@/components/dashboard/auth-controls";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata: Metadata = { title: "Administración", robots: { index: false, follow: false }, alternates: { canonical: null }, openGraph: { title: "Administración", description: "Área privada de ASIVQUARK" } };
export default async function AdminLayout({ children }: {
    children: ReactNode;
}) {
    const session = await requireAdminPage();
    return <div className="min-h-screen md:flex"><DashboardSidebar /><div className="min-w-0 flex-1"><header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:px-8"><p className="text-sm font-medium">CRM · ASIVQUARK</p><div className="flex flex-wrap items-center gap-5 text-sm"><span>{session.user.name}</span><LogoutButton /></div></header><main id="contenido" className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">{children}</main></div></div>;
}
