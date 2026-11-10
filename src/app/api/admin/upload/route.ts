import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { fileTypeFromBuffer } from "file-type";
import { requireAdmin } from "@/lib/supabase";
import { sameOrigin } from "@/lib/request-security";
export const runtime = "nodejs";
const MAX = 4_000_000;
const allowed = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!sameOrigin(origin, request.headers.get("host")))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
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
  )
    return NextResponse.json(
      { error: "Cloudinary is not configured yet." },
      { status: 503 },
    );
  const reader = request.body?.getReader();
  if (!reader)
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > MAX + 100_000) {
      await reader.cancel();
      return NextResponse.json(
        { error: "Maximum upload size is 4 MB." },
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
    if (!(file instanceof File) || file.size === 0 || file.size > MAX)
      return NextResponse.json(
        { error: "Choose a file up to 4 MB." },
        { status: 400 },
      );
    const bytes = Buffer.from(await file.arrayBuffer());
    const detected = await fileTypeFromBuffer(bytes);
    if (!detected || !allowed.has(detected.mime))
      return NextResponse.json(
        { error: "Unsupported file. Use JPEG, PNG, WebP, MP4, PDF or DOCX." },
        { status: 400 },
      );
    const alt = String(form.get("alt") ?? "").slice(0, 200);
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
            folder: "kimziz",
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
    const { error } = await context.client.from("media").insert(row);
    if (error) {
      await cloudinary.uploader
        .destroy(result.public_id, { resource_type: type })
        .catch(() => undefined);
      return NextResponse.json(
        { error: "Unable to record the upload. Please retry." },
        { status: 500 },
      );
    }
    return NextResponse.json(row, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Upload failed. Check the file and Cloudinary configuration." },
      { status: 500 },
    );
  }
}
