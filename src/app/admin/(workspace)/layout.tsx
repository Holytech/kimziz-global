import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CarFront,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { requireAdmin, configured } from "@/lib/supabase";
import { Brand } from "@/components/shell";
import { defaultSite } from "@/lib/defaults";
import { logout } from "../actions";
export default async function Workspace({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!configured()) redirect("/admin/login");
  let email = "";
  try {
    const { user } = await requireAdmin();
    email = user.email ?? "Administrator";
  } catch {
    redirect("/admin/login");
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Brand site={defaultSite} />
        <span className="admin-label">CONTENT WORKSPACE</span>
        <nav aria-label="Admin navigation">
          <Link href="/admin">
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link href="/admin/content">
            <FileText size={18} />
            Website content
          </Link>
          <Link href="/admin/inventory">
            <CarFront size={18} />
            Vehicle inventory
          </Link>
          <Link href="/admin/media">
            <ImageIcon size={18} />
            Media library
          </Link>
          <Link href="/" target="_blank">
            <ExternalLink size={18} />
            View website
          </Link>
        </nav>
        <form action={logout} className="signout">
          <button className="button">Sign out</button>
        </form>
      </aside>
      <main className="admin-main">
        <div className="admin-topline">
          <span>Kimziz / Administration</span>
          <span>{email}</span>
        </div>
        {children}
      </main>
    </div>
  );
}
