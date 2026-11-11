import { redirect, notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase";
import { siteSchema, vehicleSchema } from "@/lib/model";
import { getSite, getListings } from "@/lib/data";
import { Shell } from "@/components/shell";
import {
  HomeContent,
  AboutContent,
  ServicesContent,
  ContactContent,
  VehicleDetail,
} from "@/components/public-content";

export default async function Preview({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  let context;
  try {
    context = await requireAdmin();
  } catch {
    redirect("/admin/login");
  }
  const { id } = await params;
  const { data, error } = await context.client
    .from("documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Unable to load preview.");
  if (!data) notFound();
  const site =
    data.kind === "site" ? siteSchema.parse(data.draft) : await getSite();
  const { page } = await searchParams;
  return (
    <>
      <div className="bg-gold text-navy text-center py-3.5 px-6 text-sm font-medium">
        Private draft preview · Not published{" "}
        {data.kind === "site" && (
          <span>
            {" "}
            ·{" "}
            <a href="?page=home" className="underline hover:opacity-80">
              Home
            </a>{" "}
            /{" "}
            <a href="?page=about" className="underline hover:opacity-80">
              About
            </a>{" "}
            /{" "}
            <a href="?page=services" className="underline hover:opacity-80">
              Services
            </a>{" "}
            /{" "}
            <a href="?page=contact" className="underline hover:opacity-80">
              Contact
            </a>
          </span>
        )}
      </div>
      <Shell site={site}>
        {data.kind === "site" ? (
          page === "about" ? (
            <AboutContent site={site} />
          ) : page === "services" ? (
            <ServicesContent site={site} />
          ) : page === "contact" ? (
            <ContactContent site={site} />
          ) : (
            <HomeContent site={site} listings={await getListings()} />
          )
        ) : (
          <VehicleDetail
            site={site}
            vehicle={{ ...vehicleSchema.parse(data.draft), id }}
          />
        )}
      </Shell>
    </>
  );
}
