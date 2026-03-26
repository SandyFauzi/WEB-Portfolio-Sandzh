import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [{ count: projectCount }, { count: skillCount }, { data: recentProjects }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("skills").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("id,title,category,created_at").order("created_at", { ascending: false }).limit(5),
    ]);

  const CAT_LABEL: Record<string, string> = {
    video_editing: "Video Editing", graphic_design: "Graphic Design",
    "3d_vfx": "3D · VFX", physics: "Physics", programming: "Programming", photography: "Photography",
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Welcome back</p>
          <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Projects", value: projectCount ?? 0, href: "/admin/projects" },
            { label: "Skills",   value: skillCount ?? 0,   href: "/admin/skills"   },
            { label: "Sections", value: 5,                 href: "#"               },
            { label: "Storage",  value: "—",               href: "/admin/media"    },
          ].map((s) => (
            <Link key={s.label} href={s.href} className="rounded-2xl p-5 transition hover:opacity-80"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
              <p className="font-mono text-[9px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>{s.label}</p>
              <p className="mt-2 text-3xl font-bold">{s.value}</p>
            </Link>
          ))}
        </div>
        <div className="mb-8">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Quick actions</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Tambah project", href: "/admin/projects/new", icon: "＋" },
              { label: "Upload media",   href: "/admin/media",        icon: "↑"  },
              { label: "Edit about",     href: "/admin/about",        icon: "✎"  },
              { label: "Edit skills",    href: "/admin/skills",       icon: "≡"  },
            ].map((a) => (
              <Link key={a.label} href={a.href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:opacity-80"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                <span className="font-mono text-base" style={{ color: "var(--muted)" }}>{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Project terbaru</p>
            <Link href="/admin/projects" className="text-xs transition hover:opacity-70" style={{ color: "var(--muted)" }}>Lihat semua →</Link>
          </div>
          <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border)" }}>
            {recentProjects && recentProjects.length > 0 ? recentProjects.map((p, i) => (
              <Link key={p.id} href={`/admin/projects/${p.id}`}
                className="flex items-center justify-between px-5 py-4 transition hover:opacity-80"
                style={{ background: "var(--bg-2)", borderBottom: i < recentProjects.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="font-mono text-[10px]" style={{ color: "var(--muted)" }}>{CAT_LABEL[p.category] ?? p.category}</p>
                </div>
                <span style={{ color: "var(--muted)" }}>→</span>
              </Link>
            )) : (
              <div className="px-5 py-8 text-center text-sm" style={{ background: "var(--bg-2)", color: "var(--muted)" }}>
                Belum ada project.{" "}
                <Link href="/admin/projects/new" className="underline underline-offset-4">Tambah sekarang →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
