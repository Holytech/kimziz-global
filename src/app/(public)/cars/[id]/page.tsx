import { notFound } from "next/navigation";
import { getListings, getSite } from "@/lib/data";
import { VehicleDetail } from "@/components/public-content";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const v = (await getListings()).find((v) => v.id === id);
  return { title: v?.title ?? "Vehicle not found" };
}
export default async function Car({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = (await getListings()).find((v) => v.id === id);
  if (!vehicle) notFound();
  return <VehicleDetail site={await getSite()} vehicle={vehicle} />;
}
