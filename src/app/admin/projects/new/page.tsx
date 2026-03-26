"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import type { ProjectCategory } from "@/types/database";

const CATEGORIES = [
  { value: "video_editing",  label: "Video Editing"   },
  { value: "graphic_design", label: "Graphic Design"  },
  { value: "3d_vfx",         label: "3D · VFX"        },
  { value: "physics",        label: "Physics"          },
  { value: "programming",    label: "Programming"      },
  { value: "photography",    label: "Photography"      },
];

export default function NewProjectPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title:        "",
    description:  "",
    category:     "video_editing",
    tags:         "",
    external_url: "",
    featured:     false,
    sort_order:   0,
  });
  const [thumbFile, setThumbFile]   = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string>("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

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
      let thumbnail_url: string | null = null;

      // Upload thumbnail kalau ada
      if (thumbFile) {
        const ext  = thumbFile.name.split(".").pop();
        const path = `thumbnails/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("portfolio-media")
          .upload(path, thumbFile, { upsert: true });
        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from("portfolio-media")
          .getPublicUrl(path);
        thumbnail_url = urlData.publicUrl;
      }

      // Insert project
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const { error: insertErr } = await supabase.from("projects").insert({
        title:        form.title,
        description:  form.description || null,
        category:     form.category as ProjectCategory,
        tags,
        external_url: form.external_url || null,
        featured:     form.featured,
        sort_order:   Number(form.sort_order),
        thumbnail_url,
      });

      if (insertErr) throw insertErr;
      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => router.back()} className="mb-4 font-mono text-[10px] uppercase tracking-[0.15em] transition hover:opacity-70"
            style={{ color: "var(--muted)" }}>
            ← Kembali
          </button>
          <h1 className="text-3xl font-bold">Tambah Project</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Thumbnail */}
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
              Thumbnail
            </label>
            <div className="relative">
              {thumbPreview ? (
                <div className="relative mb-2 aspect-video w-full overflow-hidden rounded-xl"
                  style={{ background: "var(--bg-3)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbPreview} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => { setThumbFile(null); setThumbPreview(""); }}
                    className="absolute right-2 top-2 rounded-full px-2 py-1 text-xs"
                    style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl transition hover:opacity-70"
                  style={{ background: "var(--bg-2)", border: "2px dashed var(--border)" }}>
                  <span className="text-2xl" style={{ color: "var(--muted)" }}>↑</span>
                  <span className="mt-2 text-sm" style={{ color: "var(--muted)" }}>Upload thumbnail</span>
                  <span className="mt-1 font-mono text-[10px]" style={{ color: "var(--muted)" }}>JPG, PNG, WEBP</span>
                  <input type="file" accept="image/*" onChange={handleThumb} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <Field label="Judul *">
            <input name="title" value={form.title} onChange={handleChange} required
              placeholder="Contoh: JJK VFX 3D" className="input-field" />
          </Field>

          {/* Category */}
          <Field label="Kategori *">
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>

          {/* Description */}
          <Field label="Deskripsi">
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="Deskripsi singkat project..." className="input-field resize-none" />
          </Field>

          {/* Tags */}
          <Field label="Tags" hint="Pisahkan dengan koma">
            <input name="tags" value={form.tags} onChange={handleChange}
              placeholder="Blender, After Effects, VFX" className="input-field" />
          </Field>

          {/* External URL */}
          <Field label="Link eksternal (YouTube, Instagram, dll)">
            <input name="external_url" value={form.external_url} onChange={handleChange}
              type="url" placeholder="https://youtu.be/..." className="input-field" />
          </Field>

          {/* Sort order & Featured */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Urutan tampil">
              <input name="sort_order" value={form.sort_order} onChange={handleChange}
                type="number" min={0} className="input-field" />
            </Field>
            <Field label="Featured">
              <label className="flex cursor-pointer items-center gap-3 pt-2">
                <input type="checkbox" name="featured" checked={form.featured}
                  onChange={handleChange} className="h-4 w-4 rounded" />
                <span className="text-sm" style={{ color: "var(--muted)" }}>Tampilkan sebagai featured</span>
              </label>
            </Field>
          </div>

          {error && (
            <p className="rounded-xl px-4 py-3 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 rounded-xl py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-40"
              style={{ background: "var(--text)", color: "var(--bg)" }}>
              {loading ? "Menyimpan..." : "Simpan Project"}
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
          width: 100%;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          background: var(--bg-2);
          border: 1px solid var(--border);
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
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
