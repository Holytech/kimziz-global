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
    <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] min-h-screen bg-paper text-ink">
      <aside className="bg-navy text-[#e7edf2] p-5 sm:p-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto flex flex-col gap-6">
        <Brand site={defaultSite} size="admin" />
        <span className="text-[0.6rem] tracking-[0.2em] font-bold text-gold uppercase hidden lg:block">
          CONTENT WORKSPACE
        </span>
        <nav
          aria-label="Admin navigation"
          className="flex flex-row flex-wrap lg:flex-col gap-1.5"
        >
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded text-xs sm:text-sm text-[#e7edf2]/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link
            href="/admin/content"
            className="flex items-center gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded text-xs sm:text-sm text-[#e7edf2]/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FileText size={18} />
            Website content
          </Link>
          <Link
            href="/admin/inventory"
            className="flex items-center gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded text-xs sm:text-sm text-[#e7edf2]/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <CarFront size={18} />
            Vehicle inventory
          </Link>
          <Link
            href="/admin/media"
            className="flex items-center gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded text-xs sm:text-sm text-[#e7edf2]/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ImageIcon size={18} />
            Media library
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded text-xs sm:text-sm text-[#e7edf2]/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink size={18} />
            View website
          </Link>
        </nav>
        <form
          action={logout}
          className="w-full lg:mt-auto pt-2 lg:pt-4 lg:border-t lg:border-white/10"
        >
          <button className="w-auto lg:w-full inline-flex items-center justify-center gap-4 min-h-[42px] px-5 py-2.5 bg-gold text-navy border border-gold rounded-[3px] text-xs font-semibold hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer">
            Sign out
          </button>
        </form>
      </aside>
      <main className="p-6 sm:p-10 min-w-0">
        <div className="flex justify-between items-center gap-6 pb-5 mb-8 border-b border-line text-xs text-muted">
          <span>Kimziz / Administration</span>
          <span>{email}</span>
        </div>
        {children}
      </main>
    </div>
  );
}
