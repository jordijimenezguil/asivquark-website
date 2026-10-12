import Link from "next/link";
import Image from "next/image";
import { Configurator } from "./configurator";
import { services } from "@/content/services";
import { publishedProjects } from "@/content/projects";
export function HomeHero() {
  const recent = publishedProjects.slice(0, 4);
  return <section className="bg-navy text-white lg:bg-hero-grid lg:bg-grid-40">
    <div className="mx-auto max-w-[1280px] lg:grid lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:px-16 lg:pt-16 lg:pb-24">
      <div className="flex flex-col gap-3.5 bg-hero-grid bg-grid-28 px-5 pt-6 pb-7 sm:px-8 sm:pt-10 sm:pb-9 lg:gap-7 lg:bg-none lg:p-0">
        <p className="font-mono text-[11px] tracking-[0.16em] text-violet-200 uppercase lg:text-xs"><span className="lg:hidden">Estudio digital · Barcelona</span><span className="hidden lg:inline">Estudio de desarrollo digital · Barcelona</span></p>
        <h1 className="text-hero-m font-bold tracking-[-0.035em] text-balance max-[374px]:text-[28px] sm:text-5xl lg:text-[64px] lg:leading-[1.02]">Desarrollo de software y páginas web en Barcelona</h1>
        <p className="max-w-[520px] text-[15px] leading-normal text-mist text-pretty sm:text-lg lg:text-[19px] lg:leading-relaxed"><span className="lg:hidden">Webs, aplicaciones y software a medida para empresas y emprendedores.</span><span className="hidden lg:inline">En ASIVQUARK transformamos ideas en soluciones digitales. Creamos páginas web, aplicaciones y software a medida para empresas y emprendedores.</span></p>
        <div className="hidden gap-7 text-sm text-mist-500 lg:flex"><span>✓ Sin compromiso</span><span>✓ Respuesta en 24 h</span></div>
      </div>
      <Configurator />
    </div>
    <div className="flex flex-col gap-3.5 pt-9 pb-8 lg:hidden"><div className="flex items-baseline justify-between px-5 sm:px-8"><h2 className="text-lg font-bold">Proyectos recientes</h2><Link href="/proyectos/" className="inline-flex min-h-11 items-center text-sm font-semibold text-violet-200">Ver todos</Link></div>
    {recent.length ? <div role="region" aria-label="Proyectos recientes" tabIndex={0} className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 scroll-px-5 [scrollbar-width:none] sm:px-8">{recent.map(project => <Link href={`/proyectos/?cat=${project.category}`} key={project.slug} className="flex flex-[0_0_240px] snap-start flex-col gap-2 sm:flex-[0_0_280px]">{project.image ? <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(min-width: 640px) 280px, 240px" loading="lazy" className="aspect-[4/3] rounded-xl object-cover" /> : <div className="project-image-pending flex aspect-[4/3] items-center justify-center rounded-xl p-4 font-mono text-xs">{project.title} · Imagen pendiente</div>}<span className="text-xs font-semibold text-violet-200">{services.find(service => service.uiType === project.category)?.title}</span><p className="text-sm leading-snug text-secondary">{project.summary}</p></Link>)}</div> : <p className="px-5 text-sm leading-6 text-secondary sm:px-8">Publicaremos proyectos reales cuando estén documentados y autorizados.</p>}</div>
  </section>;
}
