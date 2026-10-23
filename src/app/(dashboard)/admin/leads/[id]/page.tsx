import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeadById } from "@/features/crm/data";
import { ActivityTimeline, formatDate, labelService, LeadStatusBadge } from "@/components/dashboard/display";
import { LeadNotes, LeadStatusSelect } from "@/components/dashboard/lead-management";
import { budgetLabels } from "@/features/leads/schema";
export default async function LeadDetail({ params }: {
    params: Promise<{
        id: string;
    }>;
}) {
    const { id } = await params;
    const lead = await getLeadById(id);
    if (!lead)
        notFound();
    return <><Link className="crm-link" href="/admin/leads/">← Volver al listado</Link><div className="flex flex-wrap items-center gap-4"><h1 className="text-3xl font-semibold break-words">{lead.name}</h1><LeadStatusBadge status={lead.status}/></div><div className="grid gap-5 lg:grid-cols-3"><div className="min-w-0 space-y-5 lg:col-span-2"><section className="crm-card"><h2 className="mb-5 text-xl font-semibold">Datos de contacto</h2><dl className="grid gap-4 sm:grid-cols-2">{[["Nombre", lead.name], ["Email", lead.email], ["Empresa", lead.company], ["Teléfono", lead.phone], ["Recepción", formatDate(lead.createdAt)]].map(([label, value]) => <div key={label}><dt className="text-sm text-fg-muted">{label}</dt><dd className="mt-1 break-words">{value ?? "—"}</dd></div>)}</dl></section><section className="crm-card"><h2 className="mb-4 text-xl font-semibold">Proyecto</h2><p>{labelService(lead.service)}</p><p className="my-3 text-sm text-fg-muted">Presupuesto orientativo: {lead.budget ? budgetLabels[lead.budget as keyof typeof budgetLabels] ?? lead.budget : "Sin indicar"}</p><p className="whitespace-pre-wrap break-words">{lead.message}</p></section><section className="crm-card"><h2 className="mb-5 text-xl font-semibold">Atribución</h2><dl className="grid gap-4 sm:grid-cols-2">{[["Landing", lead.landingPath], ["Página de origen", lead.originPath], ["Referer", lead.referrer], ["UTM source", lead.utmSource], ["UTM medium", lead.utmMedium], ["UTM campaign", lead.utmCampaign], ["UTM content", lead.utmContent], ["UTM term", lead.utmTerm]].map(([label, value]) => <div key={label}><dt className="text-sm text-fg-muted">{label}</dt><dd className="break-words">{value ?? "—"}</dd></div>)}</dl></section><section className="crm-card"><h2 className="mb-5 text-xl font-semibold">Notas internas</h2><LeadNotes id={id}/><ul className="mt-6 space-y-5">{lead.notes.map(note => <li key={note.id} className="border-t border-white/10 pt-4"><p className="whitespace-pre-wrap break-words">{note.content}</p><p className="mt-2 text-sm text-fg-muted">{note.author.name} · {formatDate(note.createdAt)}</p></li>)}</ul>{!lead.notes.length && <p className="mt-4 text-fg-muted">Todavía no hay notas.</p>}<p className="mt-4 text-xs text-fg-muted">Se muestran las últimas 100 notas.</p></section></div><div className="space-y-5"><section className="crm-card"><LeadStatusSelect id={id} status={lead.status} version={lead.version}/></section><section className="crm-card"><h2 className="mb-5 text-xl font-semibold">Actividad</h2><ActivityTimeline events={lead.events}/><p className="mt-4 text-xs text-fg-muted">Últimos 100 eventos, más recientes primero.</p></section></div></div></>;
}
