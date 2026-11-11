"use client";

import { useRef, useState } from "react";
import {
  Video,
  UploadCloud,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Link as LinkIcon,
  RotateCcw,
  Loader2,
  FolderArchive,
} from "lucide-react";
import { useConfirm } from "./modal";

export interface StagedVideo {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

export interface VehicleVideoManagerProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  stagedVideo: StagedVideo | null;
  onStagedVideoChange: (staged: StagedVideo | null) => void;
  disabled?: boolean;
  vehicleId: string;
  vehicleTitle?: string;
  isUploading?: boolean;
  uploadPercent?: number;
}

const MAX_VIDEO_SIZE = 25_000_000; // 25 MB
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);

export function VehicleVideoManager({
  videoUrl,
  onVideoUrlChange,
  stagedVideo,
  onStagedVideoChange,
  disabled = false,
  vehicleId,
  vehicleTitle = "",
  isUploading = false,
  uploadPercent = 0,
}: VehicleVideoManagerProps) {
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const { confirm, ConfirmDialog } = useConfirm();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined | null) {
    if (!file || disabled || isUploading) return;
    setErrorMessage("");

    const isVideoMime =
      ALLOWED_VIDEO_TYPES.has(file.type) ||
      /\.(mp4|mov|webm)$/i.test(file.name);

    if (!isVideoMime) {
      setErrorMessage(
        `"${file.name}" is not a supported video format. Please select an MP4, MOV, or WebM video file.`,
      );
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setErrorMessage(
        `"${file.name}" exceeds the 25 MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB). Please select a shorter clip or compress the video.`,
      );
      return;
    }

    // Revoke previous staged video preview if any
    if (stagedVideo?.previewUrl) {
      try {
        URL.revokeObjectURL(stagedVideo.previewUrl);
      } catch {
        // ignore
      }
    }

    const previewUrl = URL.createObjectURL(file);
    onStagedVideoChange({
      file,
      previewUrl,
      name: file.name,
      size: file.size,
    });
  }

  function handleRemoveVideo() {
    setErrorMessage("");
    if (stagedVideo?.previewUrl) {
      try {
        URL.revokeObjectURL(stagedVideo.previewUrl);
      } catch {
        // ignore
      }
      onStagedVideoChange(null);
    } else if (videoUrl) {
      onVideoUrlChange("");
    }
  }

  async function promptRemoveVideo() {
    const ok = await confirm({
      title: "Remove vehicle video?",
      description:
        "Are you sure you want to remove the video from this vehicle?",
      confirmLabel: "Remove video",
      variant: "danger",
    });
    if (ok) {
      handleRemoveVideo();
    }
  }

  function handleApplyManualUrl() {
    const trimmed = manualUrl.trim();
    if (!trimmed) return;

    // Validate safe URL: must start with https:// or /
    const isValidUrl =
      (trimmed.startsWith("/") &&
        !trimmed.startsWith("//") &&
        !trimmed.includes("\\")) ||
      /^https:\/\/[^\s]+$/.test(trimmed);

    if (!isValidUrl) {
      setErrorMessage(
        "Please enter a valid HTTPS URL (e.g. https://res.cloudinary.com/.../video.mp4) or local /path.",
      );
      return;
    }

    setErrorMessage("");

    // If replacing staged video, revoke its preview
    if (stagedVideo?.previewUrl) {
      try {
        URL.revokeObjectURL(stagedVideo.previewUrl);
      } catch {
        // ignore
      }
      onStagedVideoChange(null);
    }
    onVideoUrlChange(trimmed);
    setManualUrl("");
  }

  const hasVideo = stagedVideo !== null || Boolean(videoUrl);
  const currentVideoSrc = stagedVideo ? stagedVideo.previewUrl : videoUrl;

  return (
    <div className="flex flex-col gap-4">
      {hasVideo ? (
        /* Video Player Card */
        <div className="rounded-[10px] border border-line bg-surface overflow-hidden shadow-xs">
          {/* Header Bar */}
          <div className="p-3.5 bg-soft/60 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <Video size={17} className="text-gold shrink-0" />
              <span className="font-semibold text-ink">
                {stagedVideo ? stagedVideo.name : "Vehicle Video"}
              </span>
              {stagedVideo && (
                <span className="text-muted text-[0.7rem]">
                  ({(stagedVideo.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}

              {stagedVideo ? (
                <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-semibold text-[0.68rem] px-2 py-0.5 rounded-full">
                  <Clock size={10} /> Staged · Uploads to kimziz/vehicles/
                  {vehicleId} on save
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold text-[0.68rem] px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={10} /> Saved / Active
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                disabled={disabled || isUploading}
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink border border-line rounded bg-surface hover:bg-soft transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={12} /> Replace with file
              </button>
              <button
                type="button"
                disabled={disabled || isUploading}
                onClick={promptRemoveVideo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-500/30 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative bg-black flex items-center justify-center">
            <video
              src={currentVideoSrc}
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-[420px] object-contain aspect-video"
            />

            {/* Upload Overlay during save */}
            {isUploading && (
              <div className="absolute inset-0 bg-navy/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white p-4">
                <Loader2 size={32} className="animate-spin text-gold" />
                <p className="text-sm font-semibold m-0">
                  Uploading video to Cloudinary…
                </p>
                <p className="text-xs text-muted m-0">
                  Target folder: kimziz/vehicles/{vehicleId}
                </p>
                <div className="w-48 bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gold h-full transition-all duration-150"
                    style={{ width: `${uploadPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono">{uploadPercent}%</span>
              </div>
            )}
          </div>

          {/* Footer note */}
          {!stagedVideo && videoUrl && (
            <div className="p-3 bg-surface border-t border-line text-[0.72rem] text-muted flex items-center gap-1.5 truncate">
              <span className="font-semibold text-ink shrink-0">
                Direct URL:
              </span>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-gold hover:underline truncate"
              >
                {videoUrl}
              </a>
            </div>
          )}
        </div>
      ) : (
        /* Empty State with Mode Switcher (Upload vs URL) */
        <div className="flex flex-col gap-3">
          {/* Segmented Mode Control */}
          <div className="flex items-center gap-1 p-1 bg-soft/70 border border-line rounded-[6px] w-fit">
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => {
                setInputMode("upload");
                setErrorMessage("");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                inputMode === "upload"
                  ? "bg-surface text-ink shadow-xs border border-line/60"
                  : "text-muted hover:text-ink"
              }`}
            >
              <UploadCloud
                size={13}
                className={inputMode === "upload" ? "text-gold" : ""}
              />
              Upload video file
            </button>
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => {
                setInputMode("url");
                setErrorMessage("");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                inputMode === "url"
                  ? "bg-surface text-ink shadow-xs border border-line/60"
                  : "text-muted hover:text-ink"
              }`}
            >
              <LinkIcon
                size={13}
                className={inputMode === "url" ? "text-gold" : ""}
              />
              Direct video URL
            </button>
          </div>

          {/* ONLY ONE SHOWS AT A TIME */}
          {inputMode === "upload" ? (
            /* Upload Mode: Dropzone ONLY */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                if (!disabled && !isUploading) setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (!disabled && !isUploading && e.dataTransfer.files?.[0]) {
                  handleFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => {
                if (!disabled && !isUploading && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              className={`border-2 border-dashed rounded-[10px] p-6 sm:p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                isDragging
                  ? "border-gold bg-gold/10 scale-[0.99]"
                  : "border-line bg-soft/30 hover:border-gold hover:bg-gold/5"
              } ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="w-10 h-10 rounded-full bg-gold/15 text-navy dark:text-gold flex items-center justify-center">
                <Video size={20} className="text-gold" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-ink m-0">
                  <span className="text-gold underline underline-offset-2">
                    Click to browse
                  </span>{" "}
                  or drag & drop a car video
                </p>
                <p className="text-[0.72rem] text-muted mt-1 m-0">
                  Supports MP4, MOV, or WebM up to 25 MB · Walkaround, engine
                  rev, or interior showcase
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[0.68rem] text-muted">
                <FolderArchive size={12} className="text-gold" />
                <span>
                  Uploads into folder:{" "}
                  <code className="font-mono text-gold">
                    kimziz/vehicles/{vehicleId}
                  </code>{" "}
                  upon save
                </span>
              </div>
            </div>
          ) : (
            /* URL Mode: Direct URL Input ONLY */
            <div className="p-4 sm:p-5 rounded-[10px] border border-line bg-surface flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <LinkIcon size={14} className="text-gold" />
                  <span>Enter Direct Video Link</span>
                </div>
                <span className="text-[0.68rem] text-muted">
                  Cloudinary or direct MP4/WebM URL
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                <input
                  type="url"
                  value={manualUrl}
                  disabled={disabled || isUploading}
                  onChange={(e) => setManualUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyManualUrl();
                    }
                  }}
                  placeholder="https://res.cloudinary.com/.../video/upload/.../video.mp4"
                  className="flex-1 min-h-[42px] px-3.5 py-2 rounded border border-line bg-surface text-ink text-xs outline-none focus:ring-1 focus:ring-gold font-mono disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleApplyManualUrl}
                  disabled={!manualUrl.trim() || disabled || isUploading}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-5 py-2 bg-gold text-navy font-semibold text-xs rounded hover:bg-gold-hover transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                  Set video
                </button>
              </div>

              <p className="text-[0.7rem] text-muted m-0">
                Tip: Paste an existing HTTPS link from Cloudinary or your video
                host. Press{" "}
                <kbd className="px-1 py-0.5 bg-soft rounded text-[0.65rem] border border-line">
                  Enter
                </kbd>{" "}
                to set.
              </p>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden file input for video */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        disabled={disabled || isUploading}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
          }
          e.target.value = "";
        }}
      />

      {ConfirmDialog}
    </div>
  );
}
