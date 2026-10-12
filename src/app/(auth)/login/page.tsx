import type { Metadata } from "next";
import { BrandLogo } from "@/components/branding/brand-logo";
import { LoginForm, LogoutButton } from "@/components/dashboard/auth-controls";
import { getPrivateSession } from "@/lib/auth/authorization";
import { isAdmin, safeReturnPath } from "@/features/crm/schema";
import { redirect } from "next/navigation";
export const metadata: Metadata = { title: "Acceso privado", robots: { index: false, follow: false }, alternates: { canonical: null }, openGraph: { title: "Acceso privado", description: "Administración de ASIVQUARK" } };
export const dynamic = "force-dynamic";
export default async function Login({ searchParams }: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const params = await searchParams;
    const session = await getPrivateSession();
    const returnTo = safeReturnPath(params.returnTo);
    if (session && isAdmin(session.user))
        redirect(returnTo);
    return <main id="contenido" className="flex min-h-screen items-center justify-center bg-night px-5 py-12 text-white"><div className="w-full max-w-md space-y-8"><BrandLogo size="lg"/><div className="rounded-2xl border border-slate-700 bg-surface p-6 sm:p-8"><h1 className="text-2xl font-semibold">Acceso privado</h1><p className="mb-7 mt-2 text-secondary">Administración de ASIVQUARK</p>{session && <p role="alert" className="mb-5">No tienes permisos para acceder.</p>}{session && <LogoutButton/>}<LoginForm returnTo={returnTo} expired={params.expired === "1"}/></div></div></main>;
}
