"use client";
import { useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";

export type Media = {
  id: string;
  url: string;
  title: string;
  alt: string;
  resource_type: string;
};

interface QueueFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

export function Upload({
  onUploaded,
  imageOnly = false,
}: {
  onUploaded: (m: Media) => void;
  imageOnly?: boolean;
}) {
  const [queue, setQueue] = useState<QueueFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null | File[]) {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newItems: QueueFile[] = fileList.map((file) => {
      const id = crypto.randomUUID();
      let error: string | undefined;

      if (file.size > 4_000_000) {
        error = "Maximum file size is 4 MB.";
      }

      return {
        id,
        file,
        progress: 0,
        status: error ? "error" : "uploading",
        error,
      };
    });

    setQueue((prev) => [...prev, ...newItems]);

    newItems.forEach((item) => {
      if (item.status === "uploading") {
        uploadSingle(item);
      }
    });
  }

  function uploadSingle(item: QueueFile) {
    const body = new FormData();
    body.set("file", item.file);
    body.set("alt", item.file.name.replace(/\.[^/.]+$/, ""));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, progress: percent } : q)),
        );
      }
    };

    xhr.onload = () => {
      try {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status >= 400) {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? {
                    ...q,
                    status: "error",
                    error: result.error ?? "Upload failed.",
                  }
                : q,
            ),
          );
        } else {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, status: "success", progress: 100 } : q,
            ),
          );
          onUploaded(result);
          setTimeout(() => {
            setQueue((prev) => prev.filter((q) => q.id !== item.id));
          }, 1000);
        }
      } catch {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: "error",
                  error: "Upload failed. Please try again.",
                }
              : q,
          ),
        );
      }
    };

    xhr.onerror = () => {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? {
                ...q,
                status: "error",
                error: "Network error. Please try again.",
              }
            : q,
        ),
      );
    };

    xhr.send(body);
  }

  return (
    <div className="flex flex-col gap-4 max-w-[600px]">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2.5 ${
          isDragging
            ? "border-gold bg-gold/10"
            : "border-line bg-surface hover:border-gold hover:bg-gold/5"
        }`}
      >
        <UploadCloud size={30} className="text-gold" />
        <p className="text-sm font-semibold text-ink m-0">
          <span className="text-gold underline">Click to choose files</span> or
          drag and drop
        </p>
        <p className="text-xs text-muted m-0">
          Upload one or multiple files up to 4 MB each (JPEG, PNG, WebP, MP4,
          PDF, DOCX)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={
            imageOnly
              ? "image/jpeg,image/png,image/webp"
              : "image/jpeg,image/png,image/webp,video/mp4,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          }
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {queue.length > 0 && (
        <div className="flex flex-col gap-2">
          {queue.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded border border-line bg-surface flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate m-0">
                  {item.file.name}
                </p>
                {item.status === "uploading" && (
                  <div className="mt-1.5 w-full bg-soft h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gold h-full transition-all duration-150"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                {item.status === "error" && (
                  <p className="text-red-600 dark:text-red-400 mt-1 m-0 flex items-center gap-1">
                    <AlertCircle size={13} /> {item.error}
                  </p>
                )}
                {item.status === "success" && (
                  <p className="text-green-700 dark:text-green-400 mt-1 m-0 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Uploaded
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.status === "uploading" && (
                  <Loader2 size={16} className="animate-spin text-gold" />
                )}
                <button
                  type="button"
                  onClick={() =>
                    setQueue((prev) => prev.filter((q) => q.id !== item.id))
                  }
                  className="text-muted hover:text-ink p-1"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MediaLibrary({
  initial,
  enabled,
}: {
  initial: Media[];
  enabled: boolean;
}) {
  const [media, setMedia] = useState(initial),
    [message, setMessage] = useState("");

  return (
    <>
      {enabled ? (
        <fieldset className="p-4 sm:p-5 border border-[#b99756] bg-soft rounded-[6px] mb-6 text-sm text-ink">
          <legend className="text-sm font-semibold px-2 text-ink">
            Upload asset
          </legend>
          <Upload
            onUploaded={(m) => {
              setMedia((v) => [m, ...v]);
              setMessage(
                "Upload complete. Copy its URL into a content or vehicle field.",
              );
            }}
          />
        </fieldset>
      ) : (
        <div className="p-4 sm:p-5 border border-[#b99756] bg-soft rounded-[6px] mb-6 text-sm text-ink">
          Set the Cloudinary variables in .env.local to enable uploads. Existing
          media remains available.
        </div>
      )}
      {message && (
        <p
          role="status"
          className="text-xs text-green-700 dark:text-green-400 mb-4"
        >
          {message}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {media.map((m) => (
          <article
            className="border border-line p-4 rounded bg-surface overflow-hidden flex flex-col"
            key={m.id}
          >
            {m.resource_type === "image" && (
              <img
                src={m.url}
                alt={m.alt || m.title}
                className="w-full h-[130px] object-cover rounded mb-3"
              />
            )}
            <h3 className="text-sm font-semibold text-ink mb-1 truncate">
              {m.title}
            </h3>
            <p className="text-xs text-muted mb-3 truncate">
              {m.resource_type} · {m.alt || "No description"}
            </p>
            <div className="flex items-center gap-3 mt-auto pt-2 border-t border-line/60">
              <a
                href={m.url}
                className="text-xs font-semibold text-ink hover:text-gold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open ↗
              </a>
              <button
                type="button"
                className="ml-auto inline-flex items-center justify-center min-h-[34px] px-3 py-1 bg-transparent text-ink border border-line rounded-[3px] text-xs font-semibold hover:bg-soft transition-colors cursor-pointer"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(m.url);
                    setMessage("URL copied.");
                  } catch {
                    setMessage(`Copy this URL: ${m.url}`);
                  }
                }}
              >
                Copy URL
              </button>
            </div>
          </article>
        ))}
      </div>
      {!media.length && (
        <p className="text-sm text-muted mt-4">No assets uploaded yet.</p>
      )}
    </>
  );
}
