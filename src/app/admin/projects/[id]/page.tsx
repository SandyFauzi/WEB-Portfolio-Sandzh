"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter, useParams } from "next/navigation";

const CATEGORIES = [
  { value: "video_editing",  label: "Video Editing"  },
  { value: "graphic_design", label: "Graphic Design" },
  { value: "3d_vfx",         label: "3D · VFX"       },
  { value: "physics",        label: "Physics"         },
  { value: "programming",    label: "Programming"     },
  { value: "photography",    label: "Photography"     },
];

export default function EditProjectPage() {
  const router   = useRouter();
  const params   = useParams();
  const id       = params.id as string;
  const supabase = createClient();

  const [form, setForm] = useState({
    title: "", description: "", category: "video_editing",
    tags: "", external_url: "", featured: false, sort_order: 0,
  });
  const [currentThumb, setCurrentThumb] = useState<string | null>(null);
  const [thumbFile, setThumbFile]       = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string>("");
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [error, setError]               = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await (supabase.from("projects") as any).select("*").eq("id", id).single();
      if (data) {
        setForm({
          title:        data.title,
          description:  data.description ?? "",
          category:     data.category,
          tags:         data.tags?.join(", ") ?? "",
          external_url: data.external_url ?? "",
          featured:     data.featured,
          sort_order:   data.sort_order,
        });
        setCurrentThumb(data.thumbnail_url);
      }
      setFetching(false);
    }
    load();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let thumbnail_url = currentThumb;

      if (thumbFile) {
        const ext  = thumbFile.name.split(".").pop();
        const path = `thumbnails/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("portfolio-media")
          .upload(path, thumbFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("portfolio-media").getPublicUrl(path);
        thumbnail_url = urlData.publicUrl;
      }

      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

      const { error: updateErr } = await supabase.from("projects").update({
        title:         form.title,
        description:   form.description || null,
        category:      form.category as never,
        tags,
        external_url:  form.external_url || null,
        featured:      form.featured,
        sort_order:    Number(form.sort_order),
        thumbnail_url,
      }).eq("id", id);

      if (updateErr) throw updateErr;
      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>Memuat...</p>
    </div>
  );

  const displayThumb = thumbPreview || currentThumb;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <button onClick={() => router.back()} className="mb-4 font-mono text-[10px] uppercase tracking-[0.15em] transition hover:opacity-70"
            style={{ color: "var(--muted)" }}>
            ← Kembali
          </button>
          <h1 className="text-3xl font-bold">Edit Project</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Thumbnail */}
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
              Thumbnail
            </label>
            {displayThumb ? (
              <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-xl" style={{ background: "var(--bg-3)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={displayThumb} alt="" className="h-full w-full object-cover" />
                <button type="button"
                  onClick={() => { setThumbFile(null); setThumbPreview(""); setCurrentThumb(null); }}
                  className="absolute right-2 top-2 rounded-full px-2 py-1 text-xs"
                  style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>
                  ✕
                </button>
                <label className="absolute bottom-2 right-2 cursor-pointer rounded-full px-3 py-1 text-xs"
                  style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>
                  Ganti
                  <input type="file" accept="image/*" onChange={handleThumb} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl transition hover:opacity-70"
                style={{ background: "var(--bg-2)", border: "2px dashed var(--border)" }}>
                <span className="text-2xl" style={{ color: "var(--muted)" }}>↑</span>
                <span className="mt-2 text-sm" style={{ color: "var(--muted)" }}>Upload thumbnail</span>
                <input type="file" accept="image/*" onChange={handleThumb} className="hidden" />
              </label>
            )}
          </div>

          <Field label="Judul *">
            <input name="title" value={form.title} onChange={handleChange} required className="input-field" />
          </Field>
          <Field label="Kategori *">
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Deskripsi">
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" />
          </Field>
          <Field label="Tags" hint="Pisahkan dengan koma">
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="Blender, After Effects" className="input-field" />
          </Field>
          <Field label="Link eksternal">
            <input name="external_url" value={form.external_url} onChange={handleChange} type="url" placeholder="https://..." className="input-field" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Urutan tampil">
              <input name="sort_order" value={form.sort_order} onChange={handleChange} type="number" min={0} className="input-field" />
            </Field>
            <Field label="Featured">
              <label className="flex cursor-pointer items-center gap-3 pt-2">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="h-4 w-4 rounded" />
                <span className="text-sm" style={{ color: "var(--muted)" }}>Featured</span>
              </label>
            </Field>
          </div>

          {error && (
            <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 rounded-xl py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-40"
              style={{ background: "var(--text)", color: "var(--bg)" }}>
              {loading ? "Menyimpan..." : "Update Project"}
            </button>
            <button type="button" onClick={() => router.back()}
              className="rounded-xl px-6 py-3 text-sm transition hover:opacity-70"
              style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
              Batal
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%; border-radius: 12px; padding: 10px 14px; font-size: 14px;
          background: var(--bg-2); border: 1px solid var(--border); color: var(--text);
          outline: none; transition: border-color 0.2s;
        }
        .input-field:focus { border-color: var(--border-hover); }
        .input-field::placeholder { color: var(--muted); }
        select.input-field option { background: var(--bg-2); }
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
        {label} {hint && <span className="normal-case">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
