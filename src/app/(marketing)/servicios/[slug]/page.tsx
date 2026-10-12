import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { ServicePage } from "@/components/marketing/service-page";
import { pageMetadata } from "@/lib/seo/metadata";
export const dynamicParams = false;
export function generateStaticParams() { return services.filter(service => service.href.startsWith("/servicios/")).map(({ slug }) => ({ slug })); }
async function getService(params: Promise<{ slug: string }>) {
 const { slug } = await params;
 const service = services.find(item => item.slug === slug && item.href.startsWith("/servicios/"));
 if (!service) notFound();
 return service;
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
 const service = await getService(params);
 return pageMetadata({ title: service.seoTitle, description: service.seoDescription, path: `/servicios/${service.slug}/` });
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <ServicePage service={await getService(params)} />; }
