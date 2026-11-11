"use client";
import { startTransition, useEffect, useState } from "react";
import { saveDocument } from "@/app/admin/actions";
import { useConfirm } from "./modal";

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
    <label
      className={`flex flex-col gap-1.5 text-xs font-semibold text-ink ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      {label}
      {area ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[110px] resize-y px-3.5 py-2.5 rounded border border-line bg-surface text-ink text-sm outline-none focus:ring-2 focus:ring-gold/50 font-normal"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[46px] px-3.5 py-2.5 rounded border border-line bg-surface text-ink text-sm outline-none focus:ring-2 focus:ring-gold/50 font-normal"
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
  const { confirm, ConfirmDialog } = useConfirm();
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
    const handler = async (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (dirty && anchor && anchor.target !== "_blank") {
        const href = anchor.href;
        if (!href) return;
        e.preventDefault();
        e.stopPropagation();
        const ok = await confirm({
          title: "Unsaved changes",
          description:
            "You have unsaved changes. Are you sure you want to leave this page? Any unsaved edits will be lost.",
          confirmLabel: "Leave page",
          cancelLabel: "Stay on page",
          variant: "warning",
        });
        if (ok) {
          window.location.href = href;
        }
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [dirty, confirm]);
  async function save(
    action: "save" | "publish" | "unpublish",
    overrideData?: T,
    skipConfirm = false,
  ) {
    if (action === "unpublish" && !skipConfirm) {
      const ok = await confirm({
        title: "Unpublish vehicle?",
        description:
          "Remove this vehicle from the public website? Its draft will remain available in your inventory.",
        confirmLabel: "Unpublish & archive",
        variant: "danger",
      });
      if (!ok) return { cancelled: true };
    }
    if (action === "publish" && !skipConfirm) {
      const ok = await confirm({
        title: "Publish changes?",
        description:
          "Publish this version to the public website? Changes will be immediately visible to visitors.",
        confirmLabel: "Publish now",
        variant: "primary",
      });
      if (!ok) return { cancelled: true };
    }
    setBusy(true);
    setMessage("");
    const payload = overrideData !== undefined ? overrideData : value;
    try {
      const result = await saveDocument({
        id,
        kind,
        data: payload,
        revision,
        action,
      });
      if (result.error) {
        setError(true);
        setMessage(result.error);
        return { error: result.error };
      } else {
        setRevision(result.revision!);
        if (overrideData !== undefined) {
          setValue(overrideData);
        }
        setSaved(JSON.stringify(payload));
        setError(false);
        setMessage(
          action === "publish"
            ? "Published successfully."
            : action === "unpublish"
              ? "Removed from the public site. Draft retained."
              : "Draft saved. The public site is unchanged.",
        );
        return { success: true, revision: result.revision };
      }
    } catch {
      setError(true);
      setMessage(
        "Unable to save. Your edits are still here; please try again.",
      );
      return { error: "Unable to save" };
    } finally {
      setBusy(false);
    }
  }
  return {
    value,
    setValue,
    dirty,
    busy,
    message,
    error,
    revision,
    save,
    setRevision,
    setSaved,
    setBusy,
    setMessage,
    setError,
    confirm,
    ConfirmDialog,
  };
}

export function EditorActions({
  editor,
  id,
  vehicle = false,
  onSave,
  isDirty,
}: Readonly<{
  editor: {
    busy: boolean;
    dirty: boolean;
    revision: number;
    message: string;
    error: boolean;
    save: (
      action: "save" | "publish" | "unpublish",
      overrideData?: any,
    ) => Promise<any> | void;
    ConfirmDialog?: React.ReactNode;
  };
  id: string;
  vehicle?: boolean;
  onSave?: (action: "save" | "publish" | "unpublish") => Promise<void> | void;
  isDirty?: boolean;
}>) {
  const handleAction = (action: "save" | "publish" | "unpublish") => {
    if (onSave) {
      onSave(action);
    } else {
      editor.save(action);
    }
  };
  const hasChanges = isDirty ?? editor.dirty;

  return (
    <>
      <div className="sticky bottom-0 bg-paper/95 backdrop-blur border border-line p-4 rounded-md flex items-center gap-3 flex-wrap shadow-lg z-10 mt-6">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 bg-transparent text-ink border border-line rounded-[3px] text-xs font-semibold hover:bg-soft transition-colors cursor-pointer disabled:opacity-55"
          disabled={editor.busy}
          onClick={() => startTransition(() => handleAction("save"))}
        >
          {editor.busy ? "Working…" : "Save draft"}
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 bg-gold text-navy border border-gold rounded-[3px] text-xs font-semibold hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer disabled:opacity-55"
          disabled={editor.busy}
          onClick={() => startTransition(() => handleAction("publish"))}
        >
          Publish
        </button>
        {editor.revision > 0 && (
          <a
            className="inline-flex items-center gap-2 text-xs font-semibold text-ink hover:text-gold transition-colors py-2"
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
            className="inline-flex items-center gap-2 text-xs font-semibold text-ink hover:text-gold transition-colors py-2 cursor-pointer"
            disabled={editor.busy}
            onClick={() => startTransition(() => handleAction("unpublish"))}
          >
            Unpublish / archive
          </button>
        )}
        <span className="text-xs text-muted ml-auto">
          {hasChanges ? "Unsaved changes" : `Revision ${editor.revision}`}
        </span>
      </div>
      {editor.message && (
        <p
          role={editor.error ? "alert" : "status"}
          className={`mt-3 text-xs font-medium ${
            editor.error
              ? "text-red-700 dark:text-red-400"
              : "text-green-700 dark:text-green-400"
          }`}
        >
          {editor.message}
        </p>
      )}
      {editor.ConfirmDialog}
    </>
  );
}
