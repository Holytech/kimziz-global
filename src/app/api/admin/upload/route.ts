import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { fileTypeFromBuffer } from "file-type";
import { requireAdmin } from "@/lib/supabase";
import { sameOrigin } from "@/lib/request-security";

export const runtime = "nodejs";

const MAX = 25_000_000; // 25 MB
const allowed = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!sameOrigin(origin, host)) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }

  let context;
  try {
    context = await requireAdmin();
  } catch {
    return NextResponse.json(
      { error: "Administrator sign-in required." },
      { status: 401 },
    );
  }

  if (
    !process.env.CLOUDINARY_API_SECRET ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_CLOUD_NAME
  ) {
    return NextResponse.json(
      {
        error:
          "Cloudinary credentials are not configured. Please check .env.local.",
      },
      { status: 503 },
    );
  }

  const reader = request.body?.getReader();
  if (!reader) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > MAX + 100_000) {
      await reader.cancel();
      return NextResponse.json(
        { error: "Maximum upload size is 25 MB." },
        { status: 413 },
      );
    }
    chunks.push(value);
  }

  try {
    const buffer = Buffer.concat(chunks);
    const form = await new Response(buffer, {
      headers: { "Content-Type": request.headers.get("content-type") ?? "" },
    }).formData();

    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0 || file.size > MAX) {
      return NextResponse.json(
        { error: "Choose a file up to 25 MB." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const detected = await fileTypeFromBuffer(bytes);
    if (!detected || !allowed.has(detected.mime)) {
      return NextResponse.json(
        {
          error:
            "Unsupported file. Use JPEG, PNG, WebP, MP4, MOV, WebM, PDF or DOCX.",
        },
        { status: 400 },
      );
    }

    const alt = String(form.get("alt") ?? "").slice(0, 200);

    // Sanitize and determine Cloudinary destination folder (e.g. kimziz/vehicles/<reference>)
    const folderParam = String(form.get("folder") ?? "").trim();
    let targetFolder = "kimziz";
    if (folderParam) {
      const clean = folderParam
        .replace(/[^a-zA-Z0-9_\-\/]/g, "")
        .replace(/\.{2,}/g, "")
        .replace(/^\/+|\/+$/g, "");
      if (clean) {
        targetFolder = clean.startsWith("kimziz/") ? clean : `kimziz/${clean}`;
      }
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const type = detected.mime.startsWith("image/")
      ? "image"
      : detected.mime.startsWith("video/")
        ? "video"
        : "raw";

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: type,
            folder: targetFolder,
            public_id: crypto.randomUUID(),
            overwrite: false,
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          },
        )
        .end(bytes);
    });

    const row = {
      id: result.public_id,
      url: result.secure_url,
      title: file.name.slice(0, 200),
      alt,
      resource_type: result.resource_type,
      bytes: result.bytes,
      created_by: context.user.id,
    };

    const { error: dbError } = await context.client.from("media").insert(row);
    if (dbError) {
      console.error("Database insert error into media table:", dbError);
      await cloudinary.uploader
        .destroy(result.public_id, { resource_type: type })
        .catch(() => undefined);
      return NextResponse.json(
        {
          error:
            "Unable to record the upload in the database: " +
            (dbError.message || "Unknown error"),
        },
        { status: 500 },
      );
    }

    return NextResponse.json(row, { status: 201 });
  } catch (err: unknown) {
    console.error("Upload error caught:", err);
    const message =
      err instanceof Error ? err.message : "Cloudinary or server error";
    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!sameOrigin(origin, host)) {
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  }

  let context;
  try {
    context = await requireAdmin();
  } catch {
    return NextResponse.json(
      { error: "Administrator sign-in required." },
      { status: 401 },
    );
  }

  if (
    !process.env.CLOUDINARY_API_SECRET ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_CLOUD_NAME
  ) {
    return NextResponse.json(
      { error: "Cloudinary credentials not configured." },
      { status: 503 },
    );
  }

  try {
    const { id, resource_type = "image" } = await request.json();
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Asset ID is required." },
        { status: 400 },
      );
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    await cloudinary.uploader.destroy(id, { resource_type });
    await context.client.from("media").delete().eq("id", id);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Deletion failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
