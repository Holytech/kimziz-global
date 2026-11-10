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
      <div className="admin-heading">
        <div>
          <span className="eyebrow">YOUR WORKSPACE</span>
          <h1>A little upkeep. A big impression.</h1>
          <p>Keep the website current, one update at a time.</p>
        </div>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <strong>{vehicles}</strong>
          <span>Vehicle records</span>
        </div>
        <div className="stat-card">
          <strong>{published}</strong>
          <span>Published vehicles</span>
        </div>
        <div className="stat-card">
          <strong>{media}</strong>
          <span>Media assets</span>
        </div>
      </div>
      <div className="notice">
        <strong>Draft first. Publish when ready.</strong>
        <p>
          Saving a draft does not change the public website. Preview your edits
          before publishing.
        </p>
      </div>
      <div className="steps">
        <div>
          <h2>Website content</h2>
          <p>
            Edit your headlines, services, contact details and brand assets.
          </p>
          <Link className="text-link" href="/admin/content">
            Edit content →
          </Link>
        </div>
        <div>
          <h2>Vehicle inventory</h2>
          <p>Add vehicles, update availability and manage publication.</p>
          <Link className="text-link" href="/admin/inventory">
            Manage vehicles →
          </Link>
        </div>
        <div>
          <h2>Media library</h2>
          <p>Upload images, short videos and public documents.</p>
          <Link className="text-link" href="/admin/media">
            Manage media →
          </Link>
        </div>
      </div>
    </>
  );
}
