import { requireAdmin } from "@/lib/supabase";
import { defaultSite } from "@/lib/defaults";
import { siteSchema } from "@/lib/model";
import { ContentEditor } from "@/components/content-editor";

export default async function Content() {
  const { client } = await requireAdmin();
  const { data, error } = await client
    .from("documents")
    .select("*")
    .eq("id", "site")
    .maybeSingle();
  if (error) throw new Error("Unable to load draft.");

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-1">
          Website content
        </h1>
        <p className="text-sm text-muted">
          Change your words, business details and services. Save a draft before
          previewing.
        </p>
      </div>
      <ContentEditor
        initial={data ? siteSchema.parse(data.draft) : defaultSite}
        revision={data?.revision ?? 0}
      />
    </>
  );
}
