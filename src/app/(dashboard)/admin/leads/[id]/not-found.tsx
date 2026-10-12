import Link from "next/link";
export default function NotFound() { return <section className="crm-card"><h1 className="text-xl">El registro solicitado no existe.</h1><Link className="crm-link mt-4 inline-block" href="/admin/leads/">Volver al listado</Link></section>; }
