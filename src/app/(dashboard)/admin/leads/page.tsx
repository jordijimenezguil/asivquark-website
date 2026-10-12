import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth/authorization";
import { applyFilters, clearFilters } from "@/features/crm/actions";
import Link from "next/link";
import { getLeads } from "@/features/crm/data";
import { statusLabels } from "@/features/crm/schema";
import { serviceLabels } from "@/features/leads/schema";
import { LeadsTable } from "@/components/dashboard/display";
export default async function Leads({ searchParams }: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const session = await requireAdmin();
    const raw = await searchParams;
    let q = "";
    try {
        const saved: unknown = JSON.parse((await cookies()).get("crm-search")?.value ?? "null");
        if (saved && typeof saved === "object" && "actorId" in saved && saved.actorId === session.user.id && "q" in saved && typeof saved.q === "string" && raw.clear !== "1")
            q = saved.q;
    }
    catch { }
    const { leads, total, page, filters } = await getLeads({ ...raw, q });
    function url(next: number) { const params = new URLSearchParams(); for (const [key, value] of Object.entries(filters))
        if (value && key !== "page" && key !== "q")
            params.set(key, String(value)); params.set("page", String(next)); return `/admin/leads/?${params}`; }
    return <><h1 className="text-3xl font-semibold">Solicitudes recibidas</h1><form className="crm-card grid gap-4 sm:grid-cols-2 lg:grid-cols-3" action={applyFilters}><label>Buscar por nombre, email o empresa<input className="form-input mt-2" name="q" defaultValue={filters.q} maxLength={100}/></label><label>Estado<select className="form-input mt-2" name="status" defaultValue={filters.status ?? ""}><option value="">Todos</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>Servicio<select className="form-input mt-2" name="service" defaultValue={filters.service ?? ""}><option value="">Todos</option>{Object.entries(serviceLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>Período<select className="form-input mt-2" name="period" defaultValue={filters.period ?? ""}><option value="">Todos</option>{[7, 30, 90].map(n => <option value={n} key={n}>Últimos {n} días</option>)}</select></label><label>Orden<select name="sort" className="form-input mt-2" defaultValue={filters.sort}><option value="newest">Más recientes primero</option><option value="oldest">Más antiguos primero</option></select></label><div className="flex items-end gap-4"><button className="crm-button">Aplicar filtros</button><button type="submit" className="crm-link py-3" formAction={clearFilters}>Limpiar</button></div></form><p className="text-sm text-slate-600">Filtros activos: {filters.status ? statusLabels[filters.status] : "Todos los estados"} · {filters.service ? serviceLabels[filters.service] : "Todos los servicios"} · {filters.period ? `Últimos ${filters.period} días` : "Cualquier fecha"}{filters.q && " · Búsqueda aplicada"}</p><section className="crm-card"><LeadsTable leads={leads}/></section><nav aria-label="Paginación" className="flex flex-wrap items-center justify-between gap-4"><p>{total} resultados · Página {page} de {Math.max(1, Math.ceil(total / 20))}</p><div className="flex gap-5">{page > 1 && <Link className="crm-link min-h-11 py-3" href={url(page - 1)}>Anterior</Link>}{page * 20 < total && <Link className="crm-link min-h-11 py-3" href={url(page + 1)}>Siguiente</Link>}</div></nav></>;
}
