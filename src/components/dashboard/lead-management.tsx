"use client";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { addNote, changeStatus } from "@/features/crm/actions";
import { statusLabels } from "@/features/crm/schema";
export function LeadStatusSelect({ id, status, version }: {
    id: string;
    status: keyof typeof statusLabels;
    version: number;
}) {
    const [state, action, pending] = useActionState(changeStatus, { message: "" });
    const router = useRouter();
    return <form action={action} className="space-y-3"><input type="hidden" name="id" value={id}/><input type="hidden" name="version" value={version}/><label className="form-label" htmlFor="lead-status">Estado comercial</label><select key={`${status}-${version}`} id="lead-status" name="status" defaultValue={status} className="form-input">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className="crm-button" disabled={pending}>{pending ? "Actualizando…" : "Guardar estado"}</button><p role="status">{state.message}</p>{state.conflict && <button type="button" className="underline min-h-11" onClick={() => router.refresh()}>Recargar estado</button>}</form>;
}
export function LeadNotes({ id }: {
    id: string;
}) {
    const [state, action, pending] = useActionState(addNote, { message: "" });
    return <form action={action} className="space-y-3"><input type="hidden" name="id" value={id}/><label htmlFor="note" className="form-label">Nueva nota interna</label><textarea id="note" name="content" className="form-input" rows={5} required maxLength={5000}/><p className="text-sm text-slate-600">Texto privado. Máximo 5.000 caracteres.</p><button className="crm-button" disabled={pending}>{pending ? "Guardando nota…" : "Añadir nota"}</button><p role="status">{state.message}</p></form>;
}
