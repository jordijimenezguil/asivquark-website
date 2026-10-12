import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { legalDocuments, legalReadiness, type LegalDocument } from "@/config/legal";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";
export type LegalSection = { id: string; title: string; content: ReactNode };
export function legalMetadata(id: string) {
  const document = legalDocuments.find(item => item.id === id)!;
  const metadata = pageMetadata({ title: `${document.seoTitle} | ASIVQUARK`, description: document.description, path: document.path });
  return { ...metadata, robots: { index: site.isProduction && legalReadiness().ready, follow: site.isProduction } };
}
export function LegalTableOfContents({ sections }: { sections: LegalSection[] }) {
  return <nav aria-label="Índice del documento"><ul>{sections.map(section => <li key={section.id}><a className="block min-h-11 py-3 text-sm leading-6" href={`#${section.id}`}>{section.title}</a></li>)}</ul></nav>;
}
export function LegalPageLayout({ document, sections }: { document: LegalDocument; sections: LegalSection[] }) {
  const readiness = legalReadiness();
  return <div className="legal-page"><header className="bg-night py-12 text-white sm:py-16"><Container><p className="mb-4 text-sm text-violet-soft">ASIVQUARK · Información legal</p><h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{document.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-secondary">{document.description}</p><p className="mt-6 text-sm text-secondary">Revisión técnica: <time dateTime={document.technicalReview}>12 de octubre de 2026</time> · Versión {document.version}</p></Container></header><Container className="py-10 sm:py-14">
    {!readiness.ready && <aside className="mb-10 rounded-xl border border-violet/30 bg-white p-5 leading-7" aria-label="Estado del documento"><strong>Documento en preparación · pendiente de aprobación jurídica</strong><p>La identificación del titular y la información de los tratamientos todavía no han sido confirmadas. Esta página permite consultar la estructura y la información técnica disponible; no es un documento legal definitivo.</p>{!site.isProduction && <p className="mt-3 break-words text-sm">Pendientes de configuración: {readiness.missing.join(", ")}.</p>}</aside>}
    <div className="grid min-w-0 gap-10 lg:grid-cols-[240px_minmax(0,1fr)]"><aside><details className="rounded-xl border border-line p-4 lg:hidden"><summary className="min-h-11 cursor-pointer py-2 font-semibold">Índice de contenidos</summary><LegalTableOfContents sections={sections} /></details><div className="sticky top-28 hidden lg:block"><h2 className="mb-3 font-semibold">En este documento</h2><LegalTableOfContents sections={sections} /></div></aside><article className="min-w-0 max-w-[72ch] space-y-10">{sections.map(section => <section id={section.id} key={section.id} className="legal-section"><h2 className="mb-4 text-2xl font-semibold leading-snug">{section.title}</h2><div className="space-y-4 text-base leading-8">{section.content}</div></section>)}<nav aria-label="Otros documentos legales" className="border-t border-line pt-8"><h2 className="mb-4 text-xl font-semibold">Otros documentos</h2><ul>{legalDocuments.filter(item => item.id !== document.id).map(item => <li key={item.id}><Link className="inline-flex min-h-11 items-center py-2" href={item.path}>{item.title}</Link></li>)}</ul></nav></article></div></Container><SiteFooter cta={false} /></div>;
}
