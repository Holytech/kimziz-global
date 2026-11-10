"use client";
import { startTransition, useEffect, useState } from "react";
import { saveDocument } from "@/app/admin/actions";
export function Field({
  label,
  value,
  onChange,
  area = false,
  type = "text",
  wide = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
  type?: string;
  wide?: boolean;
}) {
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      {label}
      {area ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
export function useEditor<T>(
  initial: T,
  initialRevision: number,
  id: string,
  kind: "site" | "vehicle",
) {
  const [value, setValue] = useState(initial),
    [revision, setRevision] = useState(initialRevision),
    [saved, setSaved] = useState(JSON.stringify(initial)),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(false);
  const dirty = JSON.stringify(value) !== saved;
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (
        dirty &&
        anchor &&
        anchor.target !== "_blank" &&
        !window.confirm("You have unsaved changes. Leave this page?")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [dirty]);
  async function save(action: "save" | "publish" | "unpublish") {
    if (
      action === "unpublish" &&
      !window.confirm(
        "Remove this vehicle from the public website? Its draft will remain available.",
      )
    )
      return;
    if (
      action === "publish" &&
      !window.confirm("Publish this version to the public website?")
    )
      return;
    setBusy(true);
    setMessage("");
    try {
      const result = await saveDocument({
        id,
        kind,
        data: value,
        revision,
        action,
      });
      if (result.error) {
        setError(true);
        setMessage(result.error);
      } else {
        setRevision(result.revision!);
        setSaved(JSON.stringify(value));
        setError(false);
        setMessage(
          action === "publish"
            ? "Published successfully."
            : action === "unpublish"
              ? "Removed from the public site. Draft retained."
              : "Draft saved. The public site is unchanged.",
        );
      }
    } catch {
      setError(true);
      setMessage(
        "Unable to save. Your edits are still here; please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return { value, setValue, dirty, busy, message, error, revision, save };
}
export function EditorActions({
  editor,
  id,
  vehicle = false,
}: {
  editor: {
    busy: boolean;
    dirty: boolean;
    revision: number;
    message: string;
    error: boolean;
    save: (action: "save" | "publish" | "unpublish") => void;
  };
  id: string;
  vehicle?: boolean;
}) {
  return (
    <>
      <div className="editor-actions">
        <button
          type="button"
          className="button secondary"
          disabled={editor.busy}
          onClick={() => startTransition(() => editor.save("save"))}
        >
          {editor.busy ? "Working…" : "Save draft"}
        </button>
        <button
          type="button"
          className="button"
          disabled={editor.busy}
          onClick={() => startTransition(() => editor.save("publish"))}
        >
          Publish
        </button>
        {editor.revision > 0 && (
          <a
            className="text-link"
            href={`/admin/preview/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Preview saved draft ↗
          </a>
        )}
        {vehicle && editor.revision > 0 && (
          <button
            type="button"
            className="text-link"
            disabled={editor.busy}
            onClick={() => startTransition(() => editor.save("unpublish"))}
          >
            Unpublish / archive
          </button>
        )}
        <span className="small muted">
          {editor.dirty ? "Unsaved changes" : `Revision ${editor.revision}`}
        </span>
      </div>
      {editor.message && (
        <p
          role={editor.error ? "alert" : "status"}
          className={`save-message ${editor.error ? "error" : ""}`}
        >
          {editor.message}
        </p>
      )}
    </>
  );
}
