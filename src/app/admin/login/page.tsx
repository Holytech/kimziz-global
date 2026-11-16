import { configured } from "@/lib/supabase";
import { Brand } from "@/components/shell";
import { defaultSite } from "@/lib/defaults";
import { LoginForm } from "@/components/login-form";

export default function Login() {
  const enabled = configured();
  return (
    <main className="min-h-screen grid place-items-center p-6 bg-navy">
      <div className="bg-paper p-8 sm:p-11 w-full max-w-[460px] rounded-[10px] shadow-xl border border-line/20">
        <div className="mb-8">
          <Brand site={defaultSite} size="admin" />
        </div>
        <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-muted mb-2">
          ADMIN WORKSPACE
        </span>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-2">
          Welcome back.
        </h1>
        <p className="text-sm text-muted mb-6">
          Manage your content and vehicle inventory.
        </p>
        {!enabled && (
          <div className="p-4 border border-[#b99756] bg-soft rounded-[5px] mb-6 text-sm text-ink">
            <strong>Setup required</strong>
            <p className="mt-1 text-xs text-muted">
              Connect your Supabase project using the instructions in README.md
              to enable secure sign-in. No demo login is enabled.
            </p>
          </div>
        )}
        <LoginForm enabled={enabled} />
      </div>
    </main>
  );
}
