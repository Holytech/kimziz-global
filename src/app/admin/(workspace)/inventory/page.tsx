import Link from "next/link";
import { requireAdmin } from "@/lib/supabase";
import { InventoryTable } from "@/components/inventory-table";
import { vehicleSchema } from "@/lib/model";
export default async function Inventory() {
  const { client } = await requireAdmin();
  const [{ data, error }, { data: pub, error: pubError }] = await Promise.all([
    client
      .from("documents")
      .select("*")
      .eq("kind", "vehicle")
      .order("updated_at", { ascending: false }),
    client.from("publications").select("id").eq("kind", "vehicle"),
  ]);
  if (error || pubError) throw new Error("Unable to load inventory.");
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Vehicle inventory</h1>
          <p>Manage real vehicles and keep availability up to date.</p>
        </div>
        <Link className="button" href="/admin/inventory/new">
          Add vehicle +
        </Link>
      </div>
      <InventoryTable
        rows={(data ?? []).map((d) => ({
          ...vehicleSchema.parse(d.draft),
          id: d.id,
          published: (pub ?? []).some((p) => p.id === d.id),
        }))}
      />
    </>
  );
}
