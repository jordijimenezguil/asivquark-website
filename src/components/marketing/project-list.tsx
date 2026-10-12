"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { services } from "@/content/services";
import type { PublicProject } from "@/content/projects";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";
import { emitMarketingEvent } from "./events";
export function ProjectList({ projects, useQuery = true }: { projects: readonly PublicProject[]; useQuery?: boolean }) {
 const search = useSearchParams(); const pathname = usePathname(); const router = useRouter();
 const values = search.getAll("cat"); const selected = useQuery && values.length === 1 && services.some(item => item.uiType === values[0]) ? values[0] : "all";
 const visible = projects.filter(project => project.published && (selected === "all" || project.category === selected));
 const categories = [{ uiType: "all", title: "Todos" }, ...services];
 return <><div aria-label="Filtrar proyectos" className="mb-10 flex gap-2 overflow-x-auto pb-3">{categories.map(item => <button type="button" key={item.uiType} aria-pressed={selected === item.uiType} onClick={() => { if(selected === item.uiType) return; const params = new URLSearchParams(search.toString()); if(item.uiType === "all") params.delete("cat"); else params.set("cat", item.uiType); router.push(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false }); emitMarketingEvent("project_filter", { cat: item.uiType }); }} className={`min-h-12 shrink-0 rounded-full border px-5 text-sm font-semibold ${selected === item.uiType ? "border-ink bg-ink text-white" : "border-line hover:border-violet"}`}>{item.title}</button>)}</div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visible.length ? visible.map(project => <ProjectCard key={project.slug} project={project} />) : <div className="rounded-[14px] border border-line p-8 md:col-span-2"><h2 className="text-2xl font-bold">Aún no hay proyectos publicados en esta categoría</h2><p className="mt-4 leading-relaxed text-ink-500">Publicaremos únicamente trabajos reales, documentados y autorizados.</p></div>}<div className="flex flex-col justify-between rounded-[14px] bg-violet p-8 text-white"><h2 className="text-3xl font-bold">¿El siguiente es el tuyo?</h2><Button href="/contacto/" variant="secondary" className="mt-8" data-location="project_card">Cuéntanos tu proyecto →</Button></div></div></>;
}
