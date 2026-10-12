import { services } from "@/content/services";
import { ServicePage } from "@/components/marketing/service-page";
import { pageMetadata } from "@/lib/seo/metadata";
const service = services.find((item) => item.slug === "desarrollo-mvp")!;
export const metadata = pageMetadata({
  title: service.seoTitle,
  description: service.seoDescription,
  path: `/${service.slug}/`,
});
export default function Page() {
  return <ServicePage service={service} />;
}
