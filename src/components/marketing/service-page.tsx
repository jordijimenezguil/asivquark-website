import Link from "next/link";
import { Fragment } from "react";
import { services, type Service } from "@/content/services";
import {
  ContactCTA,
  FAQAccordion,
  FeatureGrid,
  ProcessSteps,
  ServiceHero,
} from "./commercial";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
export function ServicePage({ service }: { service: Service }) {
  const related = services.find((item) => item.slug === service.related)!;
  const processAfter = { web: 3, software: 2, aplicacion: 3, mvp: 3 }[
    service.query
  ];
  return (
    <>
      <ServiceHero service={service} />
      {service.sections.map((section, index) => (
        <Fragment key={section.title}>
          <FeatureGrid {...section} tinted={index % 2 === 0} />
          {index === processAfter && <ProcessSteps items={service.process} />}
        </Fragment>
      ))}
      <FAQAccordion items={service.faqs} />
      <Section space="sm" className="border-t border-slate-200">
        <Container>
          <p className="max-w-3xl leading-7 text-slate-600">
            {service.query === "web"
              ? "Si tu proyecto necesita usuarios, datos y operaciones desde el navegador, conoce nuestro "
              : service.query === "mvp"
                ? "Para dar forma a la plataforma de tu producto, descubre el "
                : "Explora también nuestro enfoque de "}
            <Link
              className="font-medium text-violet underline underline-offset-4"
              href={`/${related.slug}/`}
            >
              {related.title.toLowerCase()}
            </Link>
            .
          </p>
        </Container>
      </Section>
      <ContactCTA
        label={service.cta}
        href={`/contacto/?servicio=${service.query}&origen=/${service.slug}/`}
      />
    </>
  );
}
