import Link from "next/link";
import { services } from "@/content/services";
import { Principles } from "@/components/marketing/principles";
import { PageHero } from "@/components/marketing/commercial";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata({ title: "Servicios de desarrollo digital | ASIVQUARK", description: "Diseño web, software a medida, aplicaciones web y MVP. Encuentra el enfoque adecuado para tu proyecto.", path: "/servicios/" });
export default function Page() { return <><PageHero label="Servicios" path="/servicios/" title="Soluciones digitales adaptadas a cada proyecto" description="Cuatro formas de trabajar contigo, según lo que necesites resolver." /><Section><Container>{services.map((service, index) => <Link key={service.slug} href={`/servicios/${service.slug}/`} className="group grid gap-6 border-b border-line py-8 lg:grid-cols-[50px_1.2fr_1fr_1fr_24px] lg:gap-8 lg:py-10"><span className="font-mono text-sm text-violet">0{index+1}</span><div><h2 className="text-2xl font-bold group-hover:text-violet lg:text-3xl">{service.title}</h2><p className="mt-4 text-[15px] leading-relaxed text-ink-500">{service.description}</p></div><div><h3 className="eyebrow mb-4">Ideal para</h3><p className="text-[15px] leading-relaxed text-ink-500">{service.idealFor}</p></div><div><h3 className="eyebrow mb-4">Incluye</h3><ul className="space-y-2 text-sm text-ink-500">{service.includes.map(item => <li key={item}>✓ {item}</li>)}</ul></div><span aria-hidden="true" className="text-violet">↗</span></Link>)}<div className="mt-14 flex flex-col justify-between gap-6 rounded-2xl bg-violet-50 p-8 lg:flex-row lg:items-center lg:p-12"><div><h2 className="text-2xl font-bold">¿No sabes cuál encaja?</h2><p className="mt-3 text-ink-500">Cuéntanos el problema y te recomendamos el enfoque más sensato.</p></div><Button href="/contacto/">Pedir recomendación →</Button></div></Container></Section><Principles /><SiteFooter /></>; }
