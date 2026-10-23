import { ProcessPanels } from "./foco-interactions";
import { Configurator } from "./configurator";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Workflow,
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
  const parent = path.startsWith("/servicios/") && path !== "/servicios/" ? { name: "Servicios", href: "/servicios/" } : path.startsWith("/blog/") && path !== "/blog/" ? { name: "Blog", href: "/blog/" } : null;
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
          {parent && <><li><Link href={parent.href}>{parent.name}</Link></li><li aria-hidden="true">/</li></>}
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
              ...(parent ? [{ "@type": "ListItem", position: 2, name: parent.name, item: `${site.origin}${parent.href}` }] : []),
              {
                "@type": "ListItem",
                position: parent ? 3 : 2,
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
    <section className="bg-ink-950 bg-hero-dots pb-16 pt-28 text-white md:pb-24 md:pt-36">
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
            <h1 className="max-w-4xl text-h1 font-extrabold">
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
export function ServiceHero({ service, label, contactHref, secondaryHref = "/proyectos/", secondaryLabel = "Ver proyectos", showDetails = true }: { service: Service; label?: string; contactHref?: string; secondaryHref?: string; secondaryLabel?: string; showDetails?: boolean }) {
 return <section className="bg-ink-950 bg-hero-dots pb-16 pt-28 text-white md:pb-24 md:pt-36"><Container><Breadcrumbs label={service.title} path={service.href} /><div className={showDetails ? "grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14" : "max-w-4xl"}><div>{label && <p className="eyebrow mb-7 text-violet-soft">{label}</p>}<h1 className="text-h1 font-extrabold">{service.h1}</h1><p className="mt-7 text-lg leading-relaxed text-secondary">{service.intro}</p><div className="mt-8 flex flex-wrap gap-4"><Button href={contactHref ?? `/contacto/?tipo=${service.uiType}&origen=/servicios/${service.slug}/`} data-location="service">{service.cta} →</Button><Button href={secondaryHref} variant="outline">{secondaryLabel}</Button></div></div>{showDetails && <div className="rounded-2xl border border-white/10 bg-navy-800 p-7"><h2 className="eyebrow text-violet-200">Ideal para</h2><p className="mt-3 leading-relaxed text-secondary">{service.idealFor}</p><h2 className="eyebrow mt-7 text-violet-200">Forma de trabajo</h2><p className="mt-3 leading-relaxed text-secondary">Fases con precio cerrado y entregas cada dos semanas.</p><h2 className="eyebrow mt-7 text-violet-200">Primer paso</h2><p className="mt-3 leading-relaxed text-secondary">Llamada de 30 minutos, sin compromiso.</p></div>}</div></Container></section>;
}
export function BenefitCard({ item }: { item: ContentItem }) {
  return (
    <Card>
      <Check className="mb-6 text-violet" size={22} aria-hidden="true" />
      <h3 className="text-xl font-medium tracking-tight">{item.title}</h3>
      <p className="mt-4 leading-7 text-fg-muted">{item.description}</p>
    </Card>
  );
}
export function FeatureGrid({
  title,
  intro,
  items,
  tinted = false,
  id,
}: {
  title: string;
  intro?: string;
  items: ContentItem[];
  tinted?: boolean;
  id?: string;
}) {
  return (
    <Section id={id} className={tinted ? "bg-ink-900" : undefined}>
      <Container>
        <SectionHeading title={title} description={intro} />
        <div className={`mt-10 grid gap-5 md:grid-cols-2 ${items.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}>
          {items.map((item) => (
            <BenefitCard key={item.title} item={item} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
export function ProcessSteps({ items, title = "De la primera llamada al lanzamiento" }: { items: ContentItem[]; title?: string }) {
  return (
    <Section id="proceso" className="bg-ink-900">
      <Container>
        <SectionHeading label="CÓMO TRABAJAMOS" title={title} />
        <ProcessPanels items={items} />
      </Container>
    </Section>
  );
}
export function FAQAccordion({ items, structuredData = true, title = "Preguntas frecuentes" }: { items: FAQ[]; structuredData?: boolean; title?: string }) {
  return (
    <Section className="bg-paper-soft">
      <Container>
        {site.isProduction && structuredData && <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }} />}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeading
            label="RESOLVEMOS DUDAS"
            title={title}
          />
          <div>
            {items.map((item, index) => (
              <details
                key={item.question}
                name="faq"
                open={index === 0}
                data-question={item.question}
                className="group border-b border-white/10 py-2"
              >
                <summary className="cursor-pointer py-5 pr-4 text-lg font-medium">
                  {item.question}
                </summary>
                <p className="max-w-2xl pb-6 leading-7 text-fg-muted">
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
    <Section className="bg-ink-800">
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
    <Link href={service.href} className={`group flex min-w-0 flex-col rounded-[14px] border border-line p-6 transition-colors hover:border-violet hover:bg-violet-25 lg:min-h-[250px] lg:p-7 ${service.uiType === "automatizacion" ? "md:col-span-2 lg:col-span-2" : ""}`}>
      <span className="mb-5 font-mono text-xs text-violet">0{index + 1}</span>
      {service.uiType === "automatizacion" && <Workflow className="mb-4 text-violet" size={24} aria-hidden="true" />}
      <h3 className="text-lg font-bold">{service.title}</h3>
      <p className="mb-7 mt-4 text-[15px] leading-relaxed text-ink-500">{service.description}</p>
      <span className="mt-auto text-sm font-semibold text-violet">Ver servicio →</span>
    </Link>
  );
}
