import { Shell } from "@/components/shell";
import { getSite } from "@/lib/data";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const site = await getSite();
  return {
    title: { absolute: site.seoTitle },
    description: site.seoDescription,
    openGraph: {
      title: site.seoTitle,
      description: site.seoDescription,
      ...(site.socialImage ? { images: [site.socialImage] } : {}),
    },
  };
}
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell site={await getSite()}>{children}</Shell>;
}
