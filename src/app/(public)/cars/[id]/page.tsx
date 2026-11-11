import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListings, getSite } from "@/lib/data";
import { VehicleDetail } from "@/components/public/cars";
import { buildVehicleMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [site, listings] = await Promise.all([getSite(), getListings()]);
  const vehicle = listings.find((v) => v.id === id);
  if (!vehicle) {
    return { title: "Vehicle Not Found" };
  }
  return buildVehicleMetadata(vehicle, id, site);
}

export default async function Car({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [site, listings] = await Promise.all([getSite(), getListings()]);
  const vehicle = listings.find((v) => v.id === id);
  if (!vehicle) notFound();
  return <VehicleDetail site={site} vehicle={vehicle} />;
}
