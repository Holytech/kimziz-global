import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";

  return {
    rules: {
      userAgent: "*",
      allow: allowIndexing ? "/" : undefined,
      disallow: allowIndexing ? ["/admin/", "/api/"] : "/",
    },
    ...(allowIndexing
      ? {
          sitemap: `${siteUrl}/sitemap.xml`,
          host: siteUrl,
        }
      : {}),
  };
}
