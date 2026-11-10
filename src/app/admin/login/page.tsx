import { configured } from "@/lib/supabase";
import { Brand } from "@/components/shell";
import { defaultSite } from "@/lib/defaults";
import { LoginForm } from "@/components/login-form";
export default function Login() {
  const enabled = configured();
  return (
    <main className="login-wrap">
      <div className="login-card">
        <Brand site={defaultSite} />
        <span className="eyebrow">ADMIN WORKSPACE</span>
        <h1>Welcome back.</h1>
        <p>Manage your content and vehicle inventory.</p>
        {!enabled && (
          <div className="notice">
            <strong>Setup required</strong>
            <p>
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
