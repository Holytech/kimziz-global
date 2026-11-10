import "server-only";
import { cache } from "react";
import { configured, publicClient } from "./supabase";
import { defaultSite } from "./defaults";
import { siteSchema, vehicleSchema, Listing } from "./model";
export const getSite = cache(async () => {
  if (!configured()) return defaultSite;
  const { data, error } = await publicClient()
    .from("publications")
    .select("data")
    .eq("id", "site")
    .maybeSingle();
  if (error) throw new Error("Unable to load website content.");
  return data ? siteSchema.parse(data.data) : defaultSite;
});
export const getListings = cache(async (): Promise<Listing[]> => {
  if (!configured()) return [];
  const { data, error } = await publicClient()
    .from("publications")
    .select("id,data")
    .eq("kind", "vehicle");
  if (error) throw new Error("Unable to load vehicle inventory.");
  return (data ?? [])
    .map((row) => ({ ...vehicleSchema.parse(row.data), id: row.id }))
    .sort((a, b) => a.order - b.order);
});
