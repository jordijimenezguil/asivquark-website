import type { MetadataRoute } from "next";
import { site } from "@/config/site";
export default function robots(): MetadataRoute.Robots {
  return site.isProduction
    ? {
        rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/login/"] },
        sitemap: `${site.origin}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
