import Link from "next/link";
import { statusLabels } from "@/features/crm/schema";
import { serviceLabels } from "@/features/leads/schema";
export function labelService(value: string) { return serviceLabels[value as keyof typeof serviceLabels] ?? value; }
export function formatDate(value: Date) { return new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Madrid" }).format(value); }
export function LeadStatusBadge({ status }: {
    status: keyof typeof statusLabels;
}) {
    const colors = { NEW: "bg-violet-100 text-violet-900", CONTACTED: "bg-blue-100 text-blue-900", QUALIFIED: "bg-cyan-100 text-cyan-900", PROPOSAL_SENT: "bg-amber-100 text-amber-900", WON: "bg-emerald-100 text-emerald-900", LOST: "bg-slate-200 text-slate-800", SPAM: "bg-red-100 text-red-900" };
    return <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colors[status]}`}>{statusLabels[status]}</span>;
}
export function EmptyState({ message = "Todavía no has recibido solicitudes." }: {
    message?: string;
}) { return <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">{message}</p>; }
export function StatCard({ label, value }: {
    label: string;
    value: number;
}) { return <div className="crm-card"><p className="text-sm text-slate-600">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p></div>; }
type Row = {
    id: string;
    name: string;
    company: string | null;
    service: string;
    status: keyof typeof statusLabels;
    createdAt: Date;
    source: string;
};
export function LeadsTable({ leads }: {
    leads: Row[];
}) {
    if (!leads.length)
        return <EmptyState message="No hay solicitudes para mostrar con estos filtros."/>;
    return <><div className="hidden md:block"><table className="w-full text-left text-sm"><caption className="sr-only">Solicitudes comerciales recibidas</caption><thead><tr>{["Nombre / empresa", "Servicio", "Estado", "Entrada", "Origen", "Detalle"].map(label => <th scope="col" className="border-b p-3 font-medium text-slate-600" key={label}>{label}</th>)}</tr></thead><tbody>{leads.map(lead => <tr key={lead.id} className="border-b border-slate-100"><td className="p-3"><span className="font-medium">{lead.name}</span><span className="block text-slate-600">{lead.company ?? "—"}</span></td><td className="p-3">{labelService(lead.service)}</td><td className="p-3"><LeadStatusBadge status={lead.status}/></td><td className="p-3">{formatDate(lead.createdAt)}</td><td className="p-3">{lead.source === "contact_form" ? "Formulario web" : lead.source}</td><td className="p-3"><Link className="crm-link" href={`/admin/leads/${lead.id}/`} aria-label={`Abrir solicitud de ${lead.name}`}>Abrir</Link></td></tr>)}</tbody></table></div><ul className="space-y-3 md:hidden">{leads.map(lead => <li className="rounded-lg border border-slate-200 p-4" key={lead.id}><div className="flex flex-wrap justify-between gap-2"><h3 className="font-medium">{lead.name}</h3><LeadStatusBadge status={lead.status}/></div><p className="mt-2">{lead.company ?? "Sin empresa"} · {labelService(lead.service)}</p><p className="my-2 text-sm text-slate-600">{formatDate(lead.createdAt)}</p><Link className="crm-link inline-flex min-h-11 items-center" href={`/admin/leads/${lead.id}/`}>Abrir solicitud</Link></li>)}</ul></>;
}
export function ActivityTimeline({ events }: {
    events: {
        id: string;
        type: string;
        createdAt: Date;
        actor: {
            name: string;
        } | null;
        metadata: unknown;
    }[];
}) {
    const labels: Record<string, string> = { LEAD_CREATED: "Solicitud recibida", NOTE_ADDED: "Nota interna añadida", STATUS_CHANGED: "Estado actualizado", NOTIFICATION_QUEUED: "Notificación pendiente", NOTIFICATION_SENT: "Notificación enviada", NOTIFICATION_FAILED: "Notificación fallida", CONFIRMATION_SENT: "Confirmación enviada", CONFIRMATION_FAILED: "Confirmación fallida" };
    return <ol className="space-y-4">{events.map(event => {
            const m = event.metadata && typeof event.metadata === "object" ? event.metadata as Record<string, unknown> : {};
            const statusLabel = (v: unknown) => typeof v === "string" && v in statusLabels ? statusLabels[v as keyof typeof statusLabels] : "";
            return <li key={event.id} className="border-l-2 border-violet-200 pl-4"><p className="font-medium">{labels[event.type] ?? "Actividad"}</p>{event.type === "STATUS_CHANGED" && <p>{statusLabel(m.previous)} → {statusLabel(m.next)}</p>}<p className="text-sm text-slate-600">{formatDate(event.createdAt)}{event.actor && ` · ${event.actor.name}`}</p></li>;
        })}</ol>;
}
