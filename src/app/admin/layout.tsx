"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/admin",          label: "Dashboard",  icon: "⊞" },
  { href: "/admin/projects", label: "Projects",   icon: "◫" },
  { href: "/admin/media",    label: "Media",      icon: "◻" },
  { href: "/admin/skills",   label: "Skills",     icon: "≡" },
  { href: "/admin/about",    label: "About",      icon: "○" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  if (pathname === "/admin/login") return <>{children}</>;

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside
        className="flex w-52 shrink-0 flex-col border-r py-8"
        style={{ borderColor: "var(--border)", background: "var(--bg-2)" }}
      >
        {/* Logo */}
        <div className="mb-8 px-5">
          <Link href="/" className="font-mono text-[11px] tracking-[0.15em] opacity-40 hover:opacity-70 transition">
            ← SANDZH
          </Link>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.2em] opacity-30">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition"
                style={{
                  background: active ? "var(--bg-3)" : "transparent",
                  color: active ? "var(--text)" : "var(--muted)",
                  border: active ? "1px solid var(--border)" : "1px solid transparent",
                }}
              >
                <span className="text-base">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            <span>→</span> Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
