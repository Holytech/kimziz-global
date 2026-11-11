"use client";

import { useEffect, useRef, useState } from "react";
import { Vehicle } from "@/lib/model";
import { Field, useEditor, EditorActions } from "./editor-tools";
import { VehicleGalleryManager, GalleryItem } from "./vehicle-gallery-manager";
import { VehicleVideoManager, StagedVideo } from "./vehicle-video-manager";

export function VehicleEditor({
  initial,
  revision,
  id,
}: {
  initial: Vehicle;
  revision: number;
  id: string;
}) {
  const editor = useEditor(initial, revision, id, "vehicle"),
    { value, setValue } = editor;

  // Local gallery items state (manages both remote uploaded photos and staged local files)
  const [items, setItems] = useState<GalleryItem[]>(() =>
    initial.images.map((img) => ({
      id: crypto.randomUUID(),
      url: img.url,
      previewUrl: img.url,
      alt: img.alt,
    })),
  );

  // Staged video state (local file awaiting upload on save)
  const [stagedVideo, setStagedVideo] = useState<StagedVideo | null>(null);

  // Upload progress state for save / publish
  const [uploadProgress, setUploadProgress] = useState<{
    active: boolean;
    current: number;
    total: number;
    currentName: string;
    percent: number;
  }>({
    active: false,
    current: 0,
    total: 0,
    currentName: "",
    percent: 0,
  });

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const stagedVideoRef = useRef(stagedVideo);
  stagedVideoRef.current = stagedVideo;

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((it) => {
        if (it.file) {
          try {
            URL.revokeObjectURL(it.previewUrl);
          } catch {
            // ignore
          }
        }
      });
      if (stagedVideoRef.current?.previewUrl) {
        try {
          URL.revokeObjectURL(stagedVideoRef.current.previewUrl);
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Determine if gallery or video has unsaved changes
  const hasStagedPhotos = items.some((it) => it.file !== undefined);
  const galleryChanged =
    hasStagedPhotos ||
    items.length !== initial.images.length ||
    items.some(
      (it, i) =>
        it.url !== initial.images[i]?.url || it.alt !== initial.images[i]?.alt,
    );
  const videoChanged = stagedVideo !== null || value.video !== initial.video;
  const isDirty = editor.dirty || galleryChanged || videoChanged;

  // Warn before navigating away if there are unsaved edits or staged files
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function set(key: keyof Vehicle, next: unknown) {
    setValue((v) => ({ ...v, [key]: next }));
  }

  const select = (key: keyof Vehicle, label: string, options: string[]) => (
    <label
      className="flex flex-col gap-1.5 text-xs font-semibold text-ink"
      key={key}
    >
      {label}
      <select
        value={String(value[key])}
        onChange={(e) => set(key, e.target.value)}
        className="min-h-[46px] px-3.5 py-2.5 rounded border border-line bg-surface text-ink text-sm outline-none focus:ring-2 focus:ring-gold/50 font-normal cursor-pointer"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );

  async function handleVehicleSave(action: "save" | "publish" | "unpublish") {
    if (action === "unpublish") {
      await editor.save("unpublish");
      return;
    }

    if (action === "publish") {
      const ok = await editor.confirm({
        title: "Publish vehicle?",
        description:
          "Publish this vehicle to the public website? It will be immediately visible to visitors.",
        confirmLabel: "Publish now",
        variant: "primary",
      });
      if (!ok) return;
    }

    const currentItems = [...itemsRef.current];
    const stagedItems = currentItems.filter((it) => it.file !== undefined);
    const currentStagedVideo = stagedVideoRef.current;
    const totalUploads = stagedItems.length + (currentStagedVideo ? 1 : 0);

    // If no staged photos or video exist, commit directly
    if (totalUploads === 0) {
      const finalImages = currentItems.map((it) => ({
        url: it.url || it.previewUrl,
        alt: it.alt,
      }));
      await editor.save(action, { ...value, images: finalImages }, true);
      return;
    }

    // Upload staged assets grouped under kimziz/vehicles/<id>
    editor.setBusy(true);
    editor.setError(false);
    editor.setMessage("");
    setUploadProgress({
      active: true,
      current: 1,
      total: totalUploads,
      currentName:
        stagedItems[0]?.fileName || currentStagedVideo?.name || "File 1",
      percent: 0,
    });

    try {
      const uploadedMap = new Map<string, { url: string; alt: string }>();

      // 1. Upload staged gallery photos
      for (let i = 0; i < stagedItems.length; i++) {
        const staged = stagedItems[i];
        setUploadProgress({
          active: true,
          current: i + 1,
          total: totalUploads,
          currentName: staged.fileName || `Photo ${i + 1}`,
          percent: 0,
        });

        const body = new FormData();
        body.set("file", staged.file!);
        body.set("alt", staged.alt);
        // Explicitly set target folder as vehicles/<id> (prefixed to kimziz/vehicles/<id> on server)
        body.set("folder", `vehicles/${id}`);

        const result = await new Promise<{ url: string; alt?: string }>(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/admin/upload");

            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                const p = Math.round((e.loaded / e.total) * 100);
                setUploadProgress((prev) => ({ ...prev, percent: p }));
              }
            };

            xhr.onload = () => {
              try {
                const res = JSON.parse(xhr.responseText);
                if (xhr.status >= 400) {
                  reject(
                    new Error(
                      res.error || `Upload failed with status ${xhr.status}`,
                    ),
                  );
                } else {
                  resolve(res);
                }
              } catch {
                reject(
                  new Error("Invalid response received from upload server."),
                );
              }
            };

            xhr.onerror = () =>
              reject(
                new Error("Network connection error during photo upload."),
              );
            xhr.send(body);
          },
        );

        uploadedMap.set(staged.id, {
          url: result.url,
          alt: result.alt || staged.alt,
        });
      }

      // 2. Upload staged video (if present)
      let finalVideoUrl = value.video;
      if (currentStagedVideo) {
        setUploadProgress({
          active: true,
          current: totalUploads,
          total: totalUploads,
          currentName: currentStagedVideo.name,
          percent: 0,
        });

        const body = new FormData();
        body.set("file", currentStagedVideo.file);
        body.set("alt", `${value.title || "Vehicle"} - Video`);
        body.set("folder", `vehicles/${id}`);

        const videoResult = await new Promise<{ url: string }>(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/admin/upload");

            xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                const p = Math.round((e.loaded / e.total) * 100);
                setUploadProgress((prev) => ({ ...prev, percent: p }));
              }
            };

            xhr.onload = () => {
              try {
                const res = JSON.parse(xhr.responseText);
                if (xhr.status >= 400) {
                  reject(
                    new Error(
                      res.error || `Upload failed with status ${xhr.status}`,
                    ),
                  );
                } else {
                  resolve(res);
                }
              } catch {
                reject(
                  new Error("Invalid response received from upload server."),
                );
              }
            };

            xhr.onerror = () =>
              reject(
                new Error("Network connection error during video upload."),
              );
            xhr.send(body);
          },
        );

        finalVideoUrl = videoResult.url;
        try {
          URL.revokeObjectURL(currentStagedVideo.previewUrl);
        } catch {
          // ignore
        }
        setStagedVideo(null);
        setValue((v) => ({ ...v, video: finalVideoUrl }));
      }

      // All staged uploads succeeded! Convert staged items to remote items
      const nextItems: GalleryItem[] = currentItems.map((item) => {
        const uploaded = uploadedMap.get(item.id);
        if (uploaded) {
          if (item.file) {
            try {
              URL.revokeObjectURL(item.previewUrl);
            } catch {
              // ignore
            }
          }
          return {
            id: item.id,
            url: uploaded.url,
            previewUrl: uploaded.url,
            alt: uploaded.alt,
          };
        }
        return item;
      });

      setItems(nextItems);

      const finalImages = nextItems.map((it) => ({
        url: it.url!,
        alt: it.alt,
      }));

      setUploadProgress({
        active: false,
        current: 0,
        total: 0,
        currentName: "",
        percent: 0,
      });

      // Save document to Supabase
      await editor.save(
        action,
        {
          ...value,
          images: finalImages,
          video: finalVideoUrl,
        },
        true,
      );
    } catch (err) {
      editor.setBusy(false);
      editor.setError(true);
      const msg = err instanceof Error ? err.message : "Upload error occurred.";
      editor.setMessage(
        `Upload failed: ${msg}. Your draft has not been saved.`,
      );
      setUploadProgress({
        active: false,
        current: 0,
        total: 0,
        currentName: "",
        percent: 0,
      });
    }
  }

  const isVideoUploading =
    uploadProgress.active &&
    Boolean(stagedVideo) &&
    uploadProgress.current === uploadProgress.total;

  return (
    <div className="max-w-[1000px]">
      <fieldset
        disabled={editor.busy}
        className="border border-line p-5 sm:p-6 rounded-[8px] bg-surface mb-6"
      >
        <legend className="text-sm font-semibold px-2 text-ink">
          Vehicle details
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {(
            [
              ["title", "Listing title"],
              ["make", "Brand"],
              ["model", "Model"],
              ["fuel", "Fuel"],
              ["colour", "Colour"],
              ["location", "Location"],
            ] as const
          ).map(([key, label]) => (
            <Field
              key={key}
              label={label}
              value={value[key]}
              onChange={(v) => set(key, v)}
            />
          ))}
          <Field
            label="Year"
            type="number"
            value={String(value.year)}
            onChange={(v) => set("year", Number(v))}
          />
          {select("condition", "Condition", [
            "Foreign used",
            "Nigerian used",
            "New",
          ])}
          {select("transmission", "Transmission", ["Automatic", "Manual"])}
          <Field
            label="Mileage (blank if unknown)"
            type="number"
            value={value.mileage === null ? "" : String(value.mileage)}
            onChange={(v) => set("mileage", v === "" ? null : Number(v))}
          />
          {select("mileageUnit", "Mileage unit", ["km", "mi"])}
          <Field
            label="Description"
            area
            wide
            value={value.description}
            onChange={(v) => set("description", v)}
          />
          <Field
            label="Features (one per line)"
            area
            wide
            value={value.features}
            onChange={(v) => set("features", v)}
          />
        </div>
      </fieldset>

      <fieldset
        disabled={editor.busy}
        className="border border-line p-5 sm:p-6 rounded-[8px] bg-surface mb-6"
      >
        <legend className="text-sm font-semibold px-2 text-ink">
          Price and availability
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <Field
            label="Price (blank for Price on request)"
            type="number"
            value={value.price === null ? "" : String(value.price)}
            onChange={(v) => set("price", v === "" ? null : Number(v))}
          />
          {select("currency", "Currency", ["NGN", "USD", "GBP", "EUR"])}
          {select("availability", "Availability", [
            "available",
            "reserved",
            "sold",
          ])}
          <Field
            label="Display order (lower first)"
            type="number"
            value={String(value.order)}
            onChange={(v) => set("order", Number(v))}
          />
          <label className="flex items-center gap-2.5 text-sm text-ink font-medium cursor-pointer pt-6">
            <input
              type="checkbox"
              checked={value.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-gold cursor-pointer"
            />
            Feature on homepage
          </label>
        </div>
      </fieldset>

      {/* Vehicle Photos Gallery */}
      <fieldset
        disabled={editor.busy}
        className="border border-line p-5 sm:p-6 rounded-[8px] bg-surface mb-6"
      >
        <legend className="text-sm font-semibold px-2 text-ink">
          Vehicle Photos
        </legend>
        <p className="text-xs text-muted mb-4">
          Upload real photos of this vehicle. You can drag and drop or select
          multiple photos at once. The first photo is automatically used as the
          primary cover photo across listings.
        </p>

        <VehicleGalleryManager
          items={items}
          onChange={setItems}
          disabled={editor.busy}
          vehicleTitle={value.title}
          vehicleId={id}
          uploadProgress={uploadProgress}
        />
      </fieldset>

      {/* Vehicle Video (Optional) */}
      <fieldset
        disabled={editor.busy}
        className="border border-line p-5 sm:p-6 rounded-[8px] bg-surface mb-6"
      >
        <legend className="text-sm font-semibold px-2 text-ink">
          Vehicle Video (Optional)
        </legend>
        <p className="text-xs text-muted mb-4">
          Upload an optional short video of this car (walkaround, cold start,
          engine sound, or interior tour). Supported formats: MP4, MOV, or WebM
          up to 25 MB.
        </p>

        <VehicleVideoManager
          videoUrl={value.video}
          onVideoUrlChange={(v) => set("video", v)}
          stagedVideo={stagedVideo}
          onStagedVideoChange={setStagedVideo}
          disabled={editor.busy}
          vehicleId={id}
          vehicleTitle={value.title}
          isUploading={isVideoUploading}
          uploadPercent={uploadProgress.percent}
        />
      </fieldset>

      <EditorActions
        editor={editor}
        id={id}
        vehicle
        onSave={handleVehicleSave}
        isDirty={isDirty}
      />
    </div>
  );
}
