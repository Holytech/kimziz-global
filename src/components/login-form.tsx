"use client";
import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm({ enabled }: Readonly<{ enabled: boolean }>) {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
        Email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={!enabled}
          className="min-h-[46px] px-3.5 py-2.5 rounded border border-line bg-surface text-ink text-sm outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-55"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={!enabled}
          className="min-h-[46px] px-3.5 py-2.5 rounded border border-line bg-surface text-ink text-sm outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-55"
        />
      </label>
      {state.error && (
        <p
          role="alert"
          className="p-3 rounded border border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400 text-xs"
        >
          {state.error}
        </p>
      )}
      <button
        className="w-full mt-2 inline-flex items-center justify-center gap-4 min-h-[50px] px-6 py-3 bg-gold text-navy border border-gold rounded-[3px] text-sm font-semibold hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
        disabled={!enabled || pending}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
