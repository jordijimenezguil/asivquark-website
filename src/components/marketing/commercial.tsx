import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Code2,
  Globe,
  Layers,
  Rocket,
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
              {
                "@type": "ListItem",
                position: 2,
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
    <section className="bg-night pb-20 pt-10 text-white sm:pb-28 sm:pt-16">
      <Container>
        {path && <Breadcrumbs label={label} path={path} />}
        <div
          className={
            home
              ? "grid gap-12 lg:grid-cols-[1fr_220px] lg:items-end"
              : "max-w-4xl"
          }
        >
          <div>
            <p className="eyebrow mb-7 text-violet-soft">{label}</p>
            <h1 className="max-w-4xl text-[clamp(2.5rem,5.6vw,5rem)] font-medium leading-[1.06] tracking-[-0.05em]">
              {title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-secondary sm:text-xl">
              {description}
            </p>
            {cta && href && (
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
          {home && (
            <div className="hidden border-l border-white/20 pl-7 lg:block">
              <p className="eyebrow text-violet-soft">IDEA → PRODUCTO</p>
              <p className="mt-4 text-sm leading-7 text-secondary">
                Estrategia de producto.
                <br />
                Diseño con intención.
                <br />
                Desarrollo con criterio.
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
export function ServiceHero({ service }: { service: Service }) {
  return (
    <PageHero
      label={service.title}
      path={`/${service.slug}/`}
      title={service.h1}
      description={service.intro}
      cta={service.cta}
      href={`/contacto/?servicio=${service.query}&origen=/${service.slug}/`}
    />
  );
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
    <Section className="bg-night text-white">
      <Container>
        <SectionHeading title="Así trabajamos" />
        <ol className="mt-12 grid gap-9 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <li key={item.title} className="border-t border-white/20 pt-6">
              <span className="font-mono text-sm text-violet-soft">
                0{index + 1}
              </span>
              <h3 className="mt-6 text-xl font-medium">{item.title}</h3>
              <p className="mt-4 leading-7 text-secondary">
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
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeading
            label="RESOLVEMOS DUDAS"
            title="Preguntas frecuentes"
          />
          <div>
            {items.map((item) => (
              <details
                key={item.question}
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
const icons = [Globe, Code2, Layers, Rocket];
export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const Icon = icons[index % icons.length];
  return (
    <Card className="flex flex-col">
      <Icon className="mb-7 text-violet" aria-hidden="true" />
      <h3 className="text-xl font-medium">{service.title}</h3>
      <p className="mb-7 mt-4 leading-7 text-slate-600">
        {service.description}
      </p>
      <Link
        href={`/${service.slug}/`}
        className="mt-auto inline-flex min-h-11 items-center gap-2 font-medium text-violet"
      >
        Explorar {service.title.toLowerCase()}
        <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
    </Card>
  );
}
