"use client";

import { useEffect, useState, useRef, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!mounted || !isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[size];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-in fade-in duration-150"
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeClasses} rounded-[10px] bg-surface border border-line shadow-2xl overflow-hidden flex flex-col text-ink transform transition-all animate-in zoom-in-95 duration-150`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="px-5 py-4 border-b border-line flex items-center justify-between gap-3 bg-soft/30">
            <div className="flex flex-col gap-0.5 min-w-0">
              {title && (
                <h3 className="text-sm font-semibold text-ink m-0 tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-muted m-0 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="text-muted hover:text-ink p-1.5 rounded hover:bg-soft transition-colors shrink-0 cursor-pointer -mr-1"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        {children && (
          <div className="p-5 text-sm leading-relaxed text-ink">{children}</div>
        )}

        {/* Footer */}
        {footer && (
          <div className="px-5 py-3.5 border-t border-line bg-soft/40 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger" | "warning";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  isLoading = false,
}: ConfirmModalProps) {
  const icon =
    variant === "danger" ? (
      <div className="w-10 h-10 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
        <AlertCircle size={22} />
      </div>
    ) : variant === "warning" ? (
      <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
        <AlertTriangle size={22} />
      </div>
    ) : (
      <div className="w-10 h-10 rounded-full bg-gold/15 text-navy dark:text-gold flex items-center justify-center shrink-0">
        <CheckCircle2 size={22} />
      </div>
    );

  const confirmBtnClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white border border-red-600"
      : variant === "warning"
        ? "bg-amber-600 hover:bg-amber-700 text-white border border-amber-600"
        : "bg-gold hover:bg-gold-hover text-navy border border-gold";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={!isLoading}
      closeOnBackdrop={!isLoading}
      closeOnEsc={!isLoading}
      footer={
        <>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="min-h-[38px] px-4 py-2 rounded text-xs font-semibold text-ink border border-line bg-surface hover:bg-soft transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`min-h-[38px] px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2 ${confirmBtnClass}`}
          >
            {isLoading ? "Working…" : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3.5">
        {icon}
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-sm font-semibold text-ink m-0 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-muted m-0 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void | Promise<void>;
  title: string;
  description?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function PromptModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  defaultValue = "",
  placeholder = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: PromptModalProps) {
  const [val, setVal] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) setVal(defaultValue);
  }, [isOpen, defaultValue]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={title}
      description={description}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[38px] px-4 py-2 rounded text-xs font-semibold text-ink border border-line bg-surface hover:bg-soft transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(val)}
            className="min-h-[38px] px-4 py-2 rounded text-xs font-semibold bg-gold hover:bg-gold-hover text-navy border border-gold transition-colors cursor-pointer"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <input
        type="text"
        value={val}
        autoFocus
        placeholder={placeholder}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onConfirm(val);
          }
        }}
        className="w-full min-h-[42px] px-3.5 py-2 rounded border border-line bg-surface text-ink text-sm outline-none focus:ring-2 focus:ring-gold/50"
      />
    </Modal>
  );
}

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger" | "warning";
}

export function useConfirm() {
  const [state, setState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: ((val: boolean) => void) | null;
  }>({
    isOpen: false,
    options: { title: "", description: "" },
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (state.resolve) state.resolve(false);
    setState((prev) => ({ ...prev, isOpen: false }));
  }, [state]);

  const handleConfirm = useCallback(() => {
    if (state.resolve) state.resolve(true);
    setState((prev) => ({ ...prev, isOpen: false }));
  }, [state]);

  const ConfirmDialog = state.isOpen ? (
    <ConfirmModal
      isOpen={state.isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={state.options.title}
      description={state.options.description}
      confirmLabel={state.options.confirmLabel}
      cancelLabel={state.options.cancelLabel}
      variant={state.options.variant}
    />
  ) : null;

  return { confirm, ConfirmDialog };
}

export interface PromptOptions {
  title: string;
  description?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function usePrompt() {
  const [state, setState] = useState<{
    isOpen: boolean;
    options: PromptOptions;
    resolve: ((val: string | null) => void) | null;
  }>({
    isOpen: false,
    options: { title: "" },
    resolve: null,
  });

  const prompt = useCallback(
    (options: PromptOptions): Promise<string | null> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          options,
          resolve,
        });
      });
    },
    [],
  );

  const handleClose = useCallback(() => {
    if (state.resolve) state.resolve(null);
    setState((prev) => ({ ...prev, isOpen: false }));
  }, [state]);

  const handleConfirm = useCallback(
    (value: string) => {
      if (state.resolve) state.resolve(value);
      setState((prev) => ({ ...prev, isOpen: false }));
    },
    [state],
  );

  const PromptDialog = state.isOpen ? (
    <PromptModal
      isOpen={state.isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={state.options.title}
      description={state.options.description}
      defaultValue={state.options.defaultValue}
      placeholder={state.options.placeholder}
      confirmLabel={state.options.confirmLabel}
      cancelLabel={state.options.cancelLabel}
    />
  ) : null;

  return { prompt, PromptDialog };
}
