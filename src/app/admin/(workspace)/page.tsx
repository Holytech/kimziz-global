import Link from "next/link";
import { requireAdmin } from "@/lib/supabase";

export default async function Dashboard() {
  const { client } = await requireAdmin();
  const [
    { count: vehicles, error: e1 },
    { count: published, error: e2 },
    { count: media, error: e3 },
  ] = await Promise.all([
    client
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("kind", "vehicle"),
    client
      .from("publications")
      .select("id", { count: "exact", head: true })
      .eq("kind", "vehicle"),
    client.from("media").select("id", { count: "exact", head: true }),
  ]);
  if (e1 || e2 || e3) throw new Error("Database setup is incomplete.");

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-8">
        <div>
          <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-muted mb-2">
            YOUR WORKSPACE
          </span>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink m-0">
            A little upkeep. A big impression.
          </h1>
          <p className="text-sm text-muted mt-1">
            Keep the website current, one update at a time.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-surface border border-line p-6 rounded-[6px]">
          <strong className="block text-3xl font-semibold text-ink">
            {vehicles}
          </strong>
          <span className="text-xs text-muted mt-1 block">Vehicle records</span>
        </div>
        <div className="bg-surface border border-line p-6 rounded-[6px]">
          <strong className="block text-3xl font-semibold text-ink">
            {published}
          </strong>
          <span className="text-xs text-muted mt-1 block">
            Published vehicles
          </span>
        </div>
        <div className="bg-surface border border-line p-6 rounded-[6px]">
          <strong className="block text-3xl font-semibold text-ink">
            {media}
          </strong>
          <span className="text-xs text-muted mt-1 block">Media assets</span>
        </div>
      </div>
      <div className="p-4 sm:p-5 border border-[#b99756] bg-soft rounded-[6px] mb-8 text-sm text-ink">
        <strong>Draft first. Publish when ready.</strong>
        <p className="mt-1 text-xs text-muted">
          Saving a draft does not change the public website. Preview your edits
          before publishing.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="border-t border-line pt-5">
          <h2 className="text-lg font-medium tracking-tight text-ink mb-2">
            Website content
          </h2>
          <p className="text-sm text-muted mb-4">
            Edit your headlines, services, contact details and brand assets.
          </p>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold transition-colors"
            href="/admin/content"
          >
            Edit content →
          </Link>
        </div>
        <div className="border-t border-line pt-5">
          <h2 className="text-lg font-medium tracking-tight text-ink mb-2">
            Vehicle inventory
          </h2>
          <p className="text-sm text-muted mb-4">
            Add vehicles, update availability and manage publication.
          </p>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold transition-colors"
            href="/admin/inventory"
          >
            Manage vehicles →
          </Link>
        </div>
        <div className="border-t border-line pt-5">
          <h2 className="text-lg font-medium tracking-tight text-ink mb-2">
            Media library
          </h2>
          <p className="text-sm text-muted mb-4">
            Upload images, short videos and public documents.
          </p>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold transition-colors"
            href="/admin/media"
          >
            View media →
          </Link>
        </div>
      </div>
    </>
  );
}
