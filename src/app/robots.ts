import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const enabled = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    url = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    rules: {
      userAgent: "*",
      allow: enabled ? "/" : undefined,
      disallow: enabled ? ["/admin/", "/api/"] : "/",
    },
    ...(enabled && url ? { sitemap: `${url}/sitemap.xml` } : {}),
  };
}
