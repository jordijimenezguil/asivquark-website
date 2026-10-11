import { Hero } from "@/components/marketing/hero";
import { ServicesOverview } from "@/components/marketing/services-overview";
import { ValueProposition } from "@/components/marketing/value-proposition";
import { ProjectsNote } from "@/components/marketing/projects-note";
import { ContactCta } from "@/components/marketing/contact-cta";
export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <ValueProposition />
      <ProjectsNote />
      <ContactCta />
    </>
  );
}
