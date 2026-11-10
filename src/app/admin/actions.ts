"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, sessionClient } from "@/lib/supabase";
import { siteSchema, vehicleSchema } from "@/lib/model";
export async function login(_previous: { error: string }, form: FormData) {
  const parsed = z
    .object({ email: z.email(), password: z.string().min(1).max(200) })
    .safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Enter your email and password." };
  try {
    const client = await sessionClient();
    const { error } = await client.auth.signInWithPassword(parsed.data);
    if (error)
      return { error: "Sign-in failed. Check your credentials and try again." };
    try {
      await requireAdmin();
    } catch {
      await client.auth.signOut();
      return { error: "This account does not have administrator access." };
    }
  } catch {
    return {
      error: "Sign-in is unavailable. Check the Supabase configuration.",
    };
  }
  redirect("/admin");
}
export async function logout() {
  const client = await sessionClient();
  await client.auth.signOut();
  redirect("/admin/login");
}
export async function saveDocument(
  input: unknown,
): Promise<{ revision?: number; error?: string }> {
  try {
    const { client } = await requireAdmin();
    const base = z
      .object({
        id: z.string().regex(/^(site|[0-9a-f-]{36})$/),
        kind: z.enum(["site", "vehicle"]),
        data: z.unknown(),
        revision: z.number().int().nonnegative(),
        action: z.enum(["save", "publish", "unpublish"]),
      })
      .parse(input);
    if ((base.kind === "site") !== (base.id === "site"))
      throw new Error("Invalid document identifier.");
    const data = (base.kind === "site" ? siteSchema : vehicleSchema).parse(
      base.data,
    );
    const { data: revision, error } = await client.rpc("save_document", {
      p_id: base.id,
      p_kind: base.kind,
      p_data: data,
      p_revision: base.revision,
      p_action: base.action,
    });
    if (error)
      throw new Error(
        error.message.includes("newer version")
          ? "A newer version exists. Reload before saving; copy your edits first."
          : "Unable to save. Check your connection and database setup.",
      );
    revalidatePath("/", "layout");
    return { revision };
  } catch (error) {
    return {
      error:
        error instanceof z.ZodError
          ? error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; ")
          : error instanceof Error
            ? error.message
            : "Unable to save.",
    };
  }
}
