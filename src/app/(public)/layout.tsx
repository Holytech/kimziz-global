import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { getSite } from "@/lib/data";
import { buildDynamicMetadata, buildJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return buildDynamicMetadata(site);
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSite();
  const jsonLd = buildJsonLd(site);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Shell site={site}>{children}</Shell>
    </>
  );
}
