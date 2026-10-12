import { Configurator } from "./configurator";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ContentItem, FAQ, Service } from "@/content/services";
import { site } from "@/config/site";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
export function Breadcrumbs({ label, path }: { label: string; path: string }) {
  return (
    <>
      <nav
        aria-label="Ruta de navegación"
        className="mb-10 text-sm text-secondary"
      >
        <ol className="flex flex-wrap gap-3">
          <li>
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          {path.startsWith("/servicios/") && path !== "/servicios/" && <><li><Link href="/servicios/">Servicios</Link></li><li aria-hidden="true">/</li></>}
          <li aria-current="page">{label}</li>
        </ol>
      </nav>
      {site.isProduction && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Inicio",
                item: `${site.origin}/`,
              },
              ...(path.startsWith("/servicios/") && path !== "/servicios/" ? [{ "@type": "ListItem", position: 2, name: "Servicios", item: `${site.origin}/servicios/` }] : []),
              {
                "@type": "ListItem",
                position: path.startsWith("/servicios/") && path !== "/servicios/" ? 3 : 2,
                name: label,
                item: `${site.origin}${path}`,
              },
            ],
          }}
        />
      )}
    </>
  );
}
export function PageHero({
  label,
  title,
  description,
  path,
  cta,
  href,
  home = false,
}: {
  label: string;
  title: string;
  description: string;
  path?: string;
  cta?: string;
  href?: string;
  home?: boolean;
}) {
  return (
    <section className="bg-night pb-16 pt-12 text-white lg:pb-24 lg:pt-16">
      <Container>
        {path && <Breadcrumbs label={label} path={path} />}
        <div
          className={
            home
              ? "grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14"
              : "max-w-4xl"
          }
        >
          <div>
            {home && <p className="eyebrow mb-7 text-violet-soft">{label}</p>}
            <h1 className="max-w-4xl text-[36px] font-bold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[64px]">
              {title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-secondary sm:text-xl">
              {description}
            </p>
            {home && <div className="mt-7 flex flex-wrap gap-5 text-xs text-secondary"><span>• Primera llamada sin compromiso</span><span>• Respuesta en 24 h laborables</span></div>}
            {cta && href && !home && (
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href={href} data-conversion="project-contact">
                  {cta}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Button>
                {home && (
                  <Button href="#servicios" variant="outline">
                    Descubre nuestros servicios
                  </Button>
                )}
              </div>
            )}
          </div>
          {home && <Configurator />}
        </div>
      </Container>
    </section>
  );
}
export function ServiceHero({ service }: { service: Service }) {
 return <section className="bg-night pb-16 pt-12 text-white lg:pb-24 lg:pt-16"><Container><Breadcrumbs label={service.title} path={`/servicios/${service.slug}/`} /><div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14"><div><h1 className="text-[36px] font-bold leading-[1.05] tracking-[-.035em] sm:text-5xl lg:text-[64px]">{service.h1}</h1><p className="mt-7 text-lg leading-relaxed text-secondary">{service.intro}</p><div className="mt-8 flex flex-wrap gap-4"><Button href={`/contacto/?tipo=${service.uiType}&origen=/servicios/${service.slug}/`} data-location="service">{service.cta} →</Button><Button href="/proyectos/" variant="outline">Ver proyectos</Button></div></div><div className="rounded-2xl border border-white/10 bg-navy-800 p-7"><h2 className="eyebrow text-violet-200">Ideal para</h2><p className="mt-3 leading-relaxed text-secondary">{service.idealFor}</p><h2 className="eyebrow mt-7 text-violet-200">Forma de trabajo</h2><p className="mt-3 leading-relaxed text-secondary">Fases con precio cerrado y entregas cada dos semanas.</p><h2 className="eyebrow mt-7 text-violet-200">Primer paso</h2><p className="mt-3 leading-relaxed text-secondary">Llamada de 30 minutos, sin compromiso.</p></div></div></Container></section>;
}
export function BenefitCard({ item }: { item: ContentItem }) {
  return (
    <Card>
      <Check className="mb-6 text-violet" size={22} aria-hidden="true" />
      <h3 className="text-xl font-medium tracking-tight">{item.title}</h3>
      <p className="mt-4 leading-7 text-slate-600">{item.description}</p>
    </Card>
  );
}
export function FeatureGrid({
  title,
  intro,
  items,
  tinted = false,
}: {
  title: string;
  intro?: string;
  items: ContentItem[];
  tinted?: boolean;
}) {
  return (
    <Section className={tinted ? "bg-white" : undefined}>
      <Container>
        <SectionHeading title={title} description={intro} />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <BenefitCard key={item.title} item={item} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
export function ProcessSteps({ items }: { items: ContentItem[] }) {
  return (
    <Section id="proceso" className="bg-white">
      <Container>
        <SectionHeading label="CÓMO TRABAJAMOS" title="De la primera llamada al lanzamiento" />
        <ol className="mt-12 grid gap-9 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <li key={item.title} className="border-t border-line pt-6">
              <span className="font-mono text-sm text-violet">
                0{index + 1}
              </span>
              <h3 className="mt-6 text-xl font-medium">{item.title}</h3>
              <p className="mt-4 leading-7 text-ink-500">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
export function FAQAccordion({ items }: { items: FAQ[] }) {
  return (
    <Section className="bg-paper-soft">
      <Container>
        {site.isProduction && <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} />}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeading
            label="RESOLVEMOS DUDAS"
            title="Preguntas frecuentes"
          />
          <div>
            {items.map((item, index) => (
              <details
                key={item.question}
                name="faq"
                open={index === 0}
                data-question={item.question}
                className="group border-b border-slate-300 py-2"
              >
                <summary className="cursor-pointer py-5 pr-4 text-lg font-medium">
                  {item.question}
                </summary>
                <p className="max-w-2xl pb-6 leading-7 text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
export function ContactCTA({
  title = "¿Tienes un proyecto en mente?",
  description = "Cuéntanos qué necesitas. Podemos ayudarte a definir la solución y valorar cómo llevarla a cabo.",
  label = "Hablemos de tu proyecto",
  href = "/contacto/",
}: {
  title?: string;
  description?: string;
  label?: string;
  href?: string;
}) {
  return (
    <Section className="bg-[#eee9fa]">
      <Container className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <SectionHeading title={title} description={description} />
        <Button
          href={href}
          className="shrink-0 self-start lg:self-center"
          data-conversion="project-contact"
        >
          {label}
          <ArrowUpRight size={18} aria-hidden="true" />
        </Button>
      </Container>
    </Section>
  );
}

export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  return (
    <Link href={`/servicios/${service.slug}/`} className="group flex min-w-0 flex-col rounded-[14px] border border-line p-6 transition-colors hover:border-violet hover:bg-violet-25 lg:min-h-[250px] lg:p-7">
      <span className="mb-5 font-mono text-xs text-violet">0{index + 1}</span>
      <h3 className="text-lg font-bold">{service.title}</h3>
      <p className="mb-7 mt-4 text-[15px] leading-relaxed text-ink-500">{service.description}</p>
      <span className="mt-auto text-sm font-semibold text-violet">Ver servicio →</span>
    </Link>
  );
}
