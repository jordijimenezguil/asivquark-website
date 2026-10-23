import { Spotlight } from "./spotlight";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
export function CTASection({ href = "/contacto/", location = "footer", slug }: { href?: string; location?: string; slug?: string }) {
  return <Container className="py-12"><Spotlight className="rounded-[28px] bg-[radial-gradient(ellipse_at_center,var(--color-brand-500),var(--color-brand-800))] px-6 py-20 text-center text-white md:px-12 md:py-28"><h2 className="mx-auto max-w-5xl text-h1 font-extrabold">¿Tienes un proyecto en mente?</h2><p className="mt-6">Cuéntanoslo y te respondemos en 24 h laborables.</p><div className="mt-9 flex flex-col items-center justify-center gap-5 sm:flex-row"><Button variant="secondary" href={href} data-location={location} data-slug={slug}>Cuéntanos tu proyecto →</Button><a href="mailto:proyectos@asivquark.com" className="inline-flex min-h-11 items-center break-all font-mono text-xs text-white">proyectos@asivquark.com ↗</a></div></Spotlight></Container>;
}
