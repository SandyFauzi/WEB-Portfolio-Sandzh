"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin",          label: "Dashboard", icon: "⊞" },
  { href: "/admin/projects", label: "Projects",  icon: "◫" },
  { href: "/admin/media",    label: "Media",     icon: "◻" },
  { href: "/admin/skills",   label: "Skills",    icon: "≡" },
  { href: "/admin/about",    label: "About",     icon: "○" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const Sidebar = () => (
    <aside className="flex h-full flex-col py-8"
      style={{ background: "var(--bg-2)", borderRight: "1px solid var(--border)" }}>
      <div className="mb-8 px-5">
        <Link href="/" className="font-mono text-[11px] tracking-[0.15em] transition hover:opacity-70"
          style={{ color: "var(--muted)" }}>
          ← SANDZH
        </Link>
        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em]"
          style={{ color: "var(--muted)", opacity: 0.4 }}>
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map((n) => {
          const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
          return (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
              style={{
                background: active ? "var(--bg-3)" : "transparent",
                color: active ? "var(--text)" : "var(--muted)",
                border: active ? "1px solid var(--border)" : "1px solid transparent",
              }}>
              <span className="text-base">{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
        <button onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:opacity-70"
          style={{ color: "var(--muted)" }}>
          <span>→</span> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── MOBILE TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden"
        style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)" }}>
        <span className="font-mono text-[11px] tracking-[0.15em]" style={{ color: "var(--muted)" }}>
          ADMIN
        </span>
        <button onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:opacity-70"
          style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {open && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpen(false)} />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            <Sidebar />
          </div>
        </>
      )}

      {/* ── DESKTOP LAYOUT ── */}
      <div className="flex">
        {/* Sidebar desktop */}
        <div className="hidden w-52 shrink-0 md:block" style={{ minHeight: "100dvh" }}>
          <div className="sticky top-0 h-dvh">
            <Sidebar />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
