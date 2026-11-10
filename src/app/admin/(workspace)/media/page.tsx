import { requireAdmin } from "@/lib/supabase";
import { MediaLibrary } from "@/components/media-library";
export default async function Media() {
  const { client } = await requireAdmin();
  const { data, error } = await client
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Unable to load media library.");
  return (
    <>
      <div className="admin-heading">
        <div>
          <h1>Media library</h1>
          <p>
            Upload public marketing assets. Customer documents do not belong
            here.
          </p>
        </div>
      </div>
      <MediaLibrary
        initial={data ?? []}
        enabled={Boolean(
          process.env.CLOUDINARY_API_SECRET &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_CLOUD_NAME,
        )}
      />
    </>
  );
}
