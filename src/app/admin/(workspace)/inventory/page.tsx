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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-1">
            Vehicle inventory
          </h1>
          <p className="text-sm text-muted">
            Manage real vehicles and keep availability up to date.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 bg-gold text-navy border border-gold rounded-[3px] text-sm font-semibold hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer"
          href="/admin/inventory/new"
        >
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
