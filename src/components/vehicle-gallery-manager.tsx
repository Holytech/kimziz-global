"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  FolderArchive,
  Loader2,
  Link as LinkIcon,
  Clock,
} from "lucide-react";
import { useConfirm } from "./modal";

export interface GalleryItem {
  id: string;
  url?: string;
  previewUrl: string;
  alt: string;
  file?: File;
  fileName?: string;
  fileSize?: number;
}

export interface VehicleGalleryManagerProps {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  disabled?: boolean;
  vehicleTitle?: string;
  vehicleId: string;
  uploadProgress?: {
    active: boolean;
    current: number;
    total: number;
    currentName: string;
    percent: number;
  };
}

const MAX_FILE_SIZE = 4_000_000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_TOTAL_IMAGES = 20;

export function VehicleGalleryManager({
  items,
  onChange,
  disabled = false,
  vehicleTitle = "",
  vehicleId,
  uploadProgress,
}: VehicleGalleryManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [manualAlt, setManualAlt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { confirm, ConfirmDialog } = useConfirm();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null | File[]) {
    if (!files || files.length === 0 || disabled) return;
    setErrorMessage("");

    const fileList = Array.from(files);
    const availableSlots = MAX_TOTAL_IMAGES - items.length;

    if (availableSlots <= 0) {
      setErrorMessage(`Maximum limit of ${MAX_TOTAL_IMAGES} photos reached.`);
      return;
    }

    const filesToProcess = fileList.slice(0, availableSlots);
    if (fileList.length > availableSlots) {
      setErrorMessage(
        `Only ${availableSlots} more photo${availableSlots === 1 ? "" : "s"} can be added (max ${MAX_TOTAL_IMAGES} total).`,
      );
    }

    const errors: string[] = [];
    const newItems: GalleryItem[] = [];

    filesToProcess.forEach((file, index) => {
      if (!ALLOWED_TYPES.has(file.type)) {
        errors.push(
          `"${file.name}" is not a supported format (JPEG, PNG, WebP only).`,
        );
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        errors.push(
          `"${file.name}" exceeds the 4 MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB).`,
        );
        return;
      }

      const id = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);
      const position = items.length + newItems.length + 1;
      const defaultAlt = vehicleTitle
        ? `${vehicleTitle} - Photo ${position}`
        : file.name.replace(/\.[^/.]+$/, "");

      newItems.push({
        id,
        previewUrl,
        alt: defaultAlt,
        file,
        fileName: file.name,
        fileSize: file.size,
      });
    });

    if (errors.length > 0) {
      setErrorMessage(errors.join(" "));
    }

    if (newItems.length > 0) {
      onChange([...items, ...newItems]);
    }
  }

  function setCover(index: number) {
    if (index <= 0 || index >= items.length) return;
    const item = items[index];
    const remaining = items.filter((_, i) => i !== index);
    onChange([item, ...remaining]);
  }

  function moveItem(from: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    onChange(copy);
  }

  function removeItem(index: number) {
    const item = items[index];
    if (item.file) {
      URL.revokeObjectURL(item.previewUrl);
    }
    onChange(items.filter((_, i) => i !== index));
  }

  async function promptRemoveItem(index: number) {
    const item = items[index];
    const ok = await confirm({
      title: "Remove photo?",
      description: item.fileName
        ? `Are you sure you want to remove "${item.fileName}" from this vehicle?`
        : "Are you sure you want to remove this photo from this vehicle?",
      confirmLabel: "Remove photo",
      variant: "danger",
    });
    if (ok) {
      removeItem(index);
    }
  }

  function updateItemAlt(index: number, newAlt: string) {
    onChange(
      items.map((img, i) => (i === index ? { ...img, alt: newAlt } : img)),
    );
  }

  function handleAddManualUrl() {
    if (!manualUrl.trim()) return;
    const url = manualUrl.trim();
    const alt =
      manualAlt.trim() ||
      (vehicleTitle ? `${vehicleTitle} photo` : "Vehicle photo");

    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        url,
        previewUrl: url,
        alt,
      },
    ]);
    setManualUrl("");
    setManualAlt("");
    setShowUrlInput(false);
  }

  const stagedCount = items.filter((it) => it.file !== undefined).length;
  const savedCount = items.filter((it) => it.file === undefined).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Cloudinary Destination & Staging Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-[8px] bg-soft/60 border border-line text-xs">
        <div className="flex items-center gap-2.5">
          <FolderArchive size={17} className="text-gold shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-ink">
              Cloudinary Destination:{" "}
              <code className="font-mono text-gold bg-gold/10 px-1.5 py-0.5 rounded text-[0.72rem]">
                kimziz/vehicles/{vehicleId}
              </code>
            </span>
            <span className="text-[0.7rem] text-muted">
              Photos are grouped into this car&apos;s folder. Staged photos
              upload automatically when you click Save or Publish.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          {stagedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-semibold text-[0.68rem]">
              <Clock size={11} /> {stagedCount} staged (pending save)
            </span>
          )}
          {savedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold text-[0.68rem]">
              <CheckCircle2 size={11} /> {savedCount} uploaded
            </span>
          )}
        </div>
      </div>

      {/* Upload Zone */}
      <div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !uploadProgress?.active) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (!disabled && !uploadProgress?.active && e.dataTransfer.files) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          onClick={() => {
            if (!disabled && !uploadProgress?.active && fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          className={`border-2 border-dashed rounded-[10px] p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-gold bg-gold/10 scale-[0.99]"
              : "border-line bg-soft/40 hover:border-gold hover:bg-gold/5"
          } ${disabled || uploadProgress?.active ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="w-12 h-12 rounded-full bg-gold/15 text-navy dark:text-gold flex items-center justify-center">
            <UploadCloud size={26} className="text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink m-0">
              <span className="text-gold underline underline-offset-2">
                Click to browse
              </span>{" "}
              or drag & drop multiple car photos
            </p>
            <p className="text-xs text-muted mt-1 m-0">
              Select multiple photos at once · Supports JPEG, PNG, WebP up to 4
              MB each
            </p>
          </div>
          <span className="text-[0.68rem] tracking-wider font-semibold uppercase px-2.5 py-0.5 rounded-full bg-surface border border-line text-muted">
            {items.length} / {MAX_TOTAL_IMAGES} photos added
          </span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            disabled={disabled || uploadProgress?.active}
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Active Uploading Progress Banner (during Save / Publish) */}
      {uploadProgress?.active && (
        <div className="p-4 rounded-[8px] bg-gold/15 border border-gold shadow-sm flex flex-col gap-2.5 animate-pulse">
          <div className="flex items-center justify-between text-xs font-semibold text-ink">
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-gold" />
              <span>
                Uploading photo {uploadProgress.current} of{" "}
                {uploadProgress.total} to Cloudinary…
              </span>
            </div>
            <span className="text-gold font-mono">
              {uploadProgress.percent}%
            </span>
          </div>

          <p className="text-[0.7rem] text-muted m-0 truncate">
            Target folder:{" "}
            <span className="font-mono">kimziz/vehicles/{vehicleId}</span> ·
            File: {uploadProgress.currentName}
          </p>

          <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-line">
            <div
              className="bg-gold h-full transition-all duration-150"
              style={{ width: `${uploadProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Gallery Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink uppercase tracking-wider">
              Vehicle Gallery Photos ({items.length})
            </span>
            <span className="text-[0.7rem] text-muted">
              · Photo #1 is the primary cover
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <LinkIcon size={13} />
            {showUrlInput ? "Hide URL input" : "+ Add image by URL"}
          </button>
        </div>

        {/* Manual URL Input dropdown */}
        {showUrlInput && (
          <div className="p-4 rounded-lg border border-line bg-soft/60 mb-4 flex flex-col sm:flex-row gap-3 items-end">
            <label className="flex-1 w-full text-xs font-semibold text-ink flex flex-col gap-1">
              Image URL
              <input
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/... or /images/..."
                className="min-h-[40px] px-3 py-1.5 rounded border border-line bg-surface text-ink text-xs outline-none focus:ring-1 focus:ring-gold font-normal"
              />
            </label>
            <label className="flex-1 w-full text-xs font-semibold text-ink flex flex-col gap-1">
              Description / Caption (optional)
              <input
                value={manualAlt}
                onChange={(e) => setManualAlt(e.target.value)}
                placeholder="e.g. Front 3/4 angle"
                className="min-h-[40px] px-3 py-1.5 rounded border border-line bg-surface text-ink text-xs outline-none focus:ring-1 focus:ring-gold font-normal"
              />
            </label>
            <button
              type="button"
              onClick={handleAddManualUrl}
              disabled={!manualUrl.trim()}
              className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-1.5 bg-gold text-navy font-semibold text-xs rounded hover:bg-gold-hover transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              <Plus size={14} /> Add photo
            </button>
          </div>
        )}

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => {
              const isCover = i === 0;
              const isStaged = item.file !== undefined;

              return (
                <div
                  key={item.id}
                  className={`rounded-[8px] border transition-all bg-surface overflow-hidden flex flex-col ${
                    isCover
                      ? "border-gold ring-1 ring-gold shadow-xs"
                      : "border-line hover:border-gold/60"
                  }`}
                >
                  {/* Photo Thumbnail with Overlays */}
                  <div className="relative aspect-[16/10] bg-soft overflow-hidden group">
                    <img
                      src={item.previewUrl}
                      alt={item.alt || `Vehicle photo ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
                    />

                    {/* Cover badge / Set as cover */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {isCover ? (
                        <span className="inline-flex items-center gap-1 bg-gold text-navy text-[0.68rem] font-bold px-2 py-0.5 rounded shadow-sm">
                          <Star size={12} className="fill-navy" /> Cover photo
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={disabled || uploadProgress?.active}
                          onClick={() => setCover(i)}
                          className="inline-flex items-center gap-1 bg-navy/85 hover:bg-gold hover:text-navy text-white text-[0.65rem] font-semibold px-2 py-0.5 rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                          title="Set this photo as the main listing cover"
                        >
                          <Star size={11} /> Make cover
                        </button>
                      )}
                    </div>

                    {/* Status Pill (Staged vs Uploaded) */}
                    <div className="absolute bottom-2.5 left-2.5">
                      {isStaged ? (
                        <span className="inline-flex items-center gap-1 bg-amber-500/90 text-navy text-[0.62rem] font-bold px-1.5 py-0.5 rounded shadow-sm backdrop-blur">
                          <Clock size={10} /> Staged · Uploads on save
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-[0.62rem] font-medium px-1.5 py-0.5 rounded shadow-sm backdrop-blur">
                          <CheckCircle2 size={10} /> Uploaded
                        </span>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      disabled={disabled || uploadProgress?.active}
                      onClick={() => promptRemoveItem(i)}
                      className="absolute top-2.5 right-2.5 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                      title="Remove this photo from vehicle"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Card Controls & Alt Input */}
                  <div className="p-3 flex flex-col gap-2.5 border-t border-line/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[0.68rem] font-mono font-semibold text-muted">
                          Position #{i + 1}
                        </span>
                        {item.fileSize && (
                          <span className="text-[0.65rem] text-muted">
                            ({(item.fileSize / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={
                            i === 0 || disabled || uploadProgress?.active
                          }
                          onClick={() => moveItem(i, i - 1)}
                          className="p-1 rounded text-muted hover:text-ink hover:bg-soft disabled:opacity-25 transition-colors cursor-pointer"
                          title="Move earlier"
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={
                            i === items.length - 1 ||
                            disabled ||
                            uploadProgress?.active
                          }
                          onClick={() => moveItem(i, i + 1)}
                          className="p-1 rounded text-muted hover:text-ink hover:bg-soft disabled:opacity-25 transition-colors cursor-pointer"
                          title="Move later"
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    <label className="flex flex-col gap-1 text-[0.68rem] font-semibold text-muted">
                      Caption / Alt text
                      <input
                        value={item.alt}
                        disabled={disabled || uploadProgress?.active}
                        onChange={(e) => updateItemAlt(i, e.target.value)}
                        placeholder="e.g. Front 3/4 angle, dashboard"
                        className="text-xs px-2.5 py-1.5 rounded border border-line bg-surface text-ink outline-none focus:ring-1 focus:ring-gold font-normal disabled:opacity-50"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 px-4 rounded-lg border border-dashed border-line bg-soft/20 text-muted">
            <p className="text-sm font-medium text-ink mb-1">
              No car photos uploaded yet
            </p>
            <p className="text-xs text-muted max-w-[380px] mx-auto m-0">
              Drag and drop your photos into the box above or click to browse.
              You can choose multiple photos at once. Photos will be grouped in
              Cloudinary folder{" "}
              <code className="font-mono text-gold">
                kimziz/vehicles/{vehicleId}
              </code>{" "}
              upon saving.
            </p>
          </div>
        )}
      </div>
      {ConfirmDialog}
    </div>
  );
}
