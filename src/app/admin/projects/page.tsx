import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteProjectButton from "./DeleteProjectButton";

const CAT_LABEL: Record<string, string> = {
  video_editing: "Video Editing", graphic_design: "Graphic Design",
  "3d_vfx": "3D · VFX", physics: "Physics", programming: "Programming", photography: "Photography",
};

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Manage</p>
            <h1 className="mt-1 text-3xl font-bold">Projects</h1>
          </div>
          <Link href="/admin/projects/new"
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
            style={{ background: "var(--text)", color: "var(--bg)" }}>
            ＋ Tambah
          </Link>
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border)" }}>
          {projects && projects.length > 0 ? (
            projects.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-4 px-5 py-4"
                style={{
                  background: "var(--bg-2)",
                  borderBottom: i < projects.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                {/* Thumbnail kecil */}
                <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg"
                  style={{ background: "var(--bg-3)" }}>
                  {p.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.thumbnail_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="font-mono text-[10px]" style={{ color: "var(--muted)" }}>
                      {CAT_LABEL[p.category] ?? p.category}
                    </span>
                    {p.featured && (
                      <span className="rounded px-1.5 py-0.5 font-mono text-[9px]"
                        style={{ background: "var(--bg-3)", color: "var(--muted)" }}>
                        featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/projects/${p.id}`}
                    className="rounded-lg px-3 py-1.5 text-xs transition hover:opacity-70"
                    style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
                    Edit
                  </Link>
                  <DeleteProjectButton id={p.id} title={p.title} />
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-12 text-center" style={{ background: "var(--bg-2)", color: "var(--muted)" }}>
              <p className="text-sm">Belum ada project.</p>
              <Link href="/admin/projects/new"
                className="mt-2 inline-block text-xs underline underline-offset-4 hover:opacity-70">
                Tambah project pertama →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
