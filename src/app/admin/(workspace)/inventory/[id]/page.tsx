import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase";
import { emptyVehicle, vehicleSchema } from "@/lib/model";
import { VehicleEditor } from "@/components/vehicle-editor";

export default async function EditVehicle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  const { id } = await params;
  const { client } = await requireAdmin();
  if (id === "new") redirect(`/admin/inventory/${crypto.randomUUID()}?new=1`);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
  )
    notFound();
  const { data, error } = await client
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("kind", "vehicle")
    .maybeSingle();
  if (error) throw new Error("Unable to load vehicle.");
  if (!data && (await searchParams).new !== "1") notFound();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-1">
          {data ? "Edit vehicle" : "Add a vehicle"}
        </h1>
        <p className="text-xs text-muted font-mono">Reference: {id}</p>
      </div>
      <VehicleEditor
        key={id}
        initial={data ? vehicleSchema.parse(data.draft) : emptyVehicle}
        revision={data?.revision ?? 0}
        id={id}
      />
    </>
  );
}
