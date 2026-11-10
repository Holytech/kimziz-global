"use client";
import { useActionState } from "react";
import { login } from "@/app/admin/actions";
export function LoginForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <form action={action}>
      <label className="field">
        Email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          disabled={!enabled}
        />
      </label>
      <label className="field">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={!enabled}
        />
      </label>
      {state.error && <p role="alert">{state.error}</p>}
      <button className="button" disabled={!enabled || pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
