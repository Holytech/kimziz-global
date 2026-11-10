import type { MetadataRoute } from "next";
import { getListings } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url || process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") return [];
  return [
    ...["", "/about", "/services", "/cars", "/contact"],
    ...(await getListings()).map((v) => `/cars/${v.id}`),
  ].map((path) => ({ url: `${url}${path}` }));
}
