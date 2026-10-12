import { principles } from "@/content/marketing";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
export function Principles() { return <Section className="bg-paper-soft"><Container><h2 className="section-title max-w-2xl">Tecnología que aporta valor a tu negocio</h2><div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{principles.map(item => <div key={item.title} className="border-t border-ink pt-5"><h3 className="text-lg font-bold">{item.title}</h3><p className="mt-3 text-[15px] leading-relaxed text-ink-500">{item.description}</p></div>)}</div></Container></Section>; }
