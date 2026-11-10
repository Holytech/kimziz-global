"use client";
import { useState } from "react";
export type Media = {
  id: string;
  url: string;
  title: string;
  alt: string;
  resource_type: string;
};
export function Upload({
  onUploaded,
  imageOnly = false,
}: {
  onUploaded: (m: Media) => void;
  imageOnly?: boolean;
}) {
  const [progress, setProgress] = useState<number | null>(null),
    [error, setError] = useState(""),
    [alt, setAlt] = useState("");
  function upload(file?: File) {
    if (!file) return;
    if (file.size > 4_000_000) {
      setError(
        "Maximum upload size is 4 MB. Compress the file or use an existing Cloudinary URL.",
      );
      return;
    }
    setError("");
    setProgress(0);
    const body = new FormData();
    body.set("file", file);
    body.set("alt", alt);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        setProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setProgress(null);
      try {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status >= 400) {
          setError(result.error ?? "Upload failed.");
          return;
        }
        onUploaded(result);
        setAlt("");
      } catch {
        setError("Upload failed. Please try again.");
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setError("Network error. Please try again.");
    };
    xhr.send(body);
  }
  return (
    <div className="upload-field">
      <label className="field">
        Description / alternative text
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          disabled={progress !== null}
        />
      </label>
      <label className="field">
        Upload {imageOnly ? "image" : "media"} (maximum 4 MB)
        <input
          type="file"
          accept={
            imageOnly
              ? "image/jpeg,image/png,image/webp"
              : "image/jpeg,image/png,image/webp,video/mp4,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          }
          disabled={progress !== null}
          onChange={(e) => {
            upload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {progress !== null && (
        <>
          <progress max="100" value={progress} />
          <span role="status">
            {progress === 100 ? "Processing upload…" : `Uploading ${progress}%`}
          </span>
        </>
      )}
      {error && <p role="alert">{error}</p>}
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
        <fieldset className="notice">
          <legend>Upload asset</legend>
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
        <div className="notice">
          Set the Cloudinary variables in .env.local to enable uploads. Existing
          media remains available.
        </div>
      )}
      {message && <p role="status">{message}</p>}
      <div className="media-grid">
        {media.map((m) => (
          <article className="media-card" key={m.id}>
            {m.resource_type === "image" && (
              <img src={m.url} alt={m.alt || m.title} />
            )}
            <h3>{m.title}</h3>
            <p>
              {m.resource_type} · {m.alt || "No description"}
            </p>
            <div className="button-row">
              <a
                href={m.url}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open ↗
              </a>
              <button
                className="button secondary"
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
      {!media.length && <p>No assets uploaded yet.</p>}
    </>
  );
}
