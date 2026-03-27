"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase-client";

const DEFAULT_TOOLS = [
  { name: "Premiere Pro", abbr: "Pr", color: "#9999FF", bg: "#0a0a1e" },
  { name: "After Effects", abbr: "Ae", color: "#9999FF", bg: "#0d0a1a" },
  { name: "Illustrator",   abbr: "Ai", color: "#FF9A00", bg: "#1a0f00" },
  { name: "Photoshop",     abbr: "Ps", color: "#31A8FF", bg: "#001219" },
  { name: "Blender",       abbr: "Bl", color: "#E87D0D", bg: "#1a0e00" },
  { name: "VS Code",       abbr: "VS", color: "#007ACC", bg: "#001525" },
  { name: "Python",        abbr: "Py", color: "#FFD43B", bg: "#1a1500" },
  { name: "Arduino",       abbr: "Ar", color: "#00979D", bg: "#001a1b" },
];

type Tool = { name: string; abbr: string; color: string; bg: string };

export default function AboutPage() {
  // FIX utama: useMemo supaya supabase client tidak dibuat ulang tiap render
  const supabase = useMemo(() => createClient(), []);

  const [form, setForm] = useState({
    full_name: "", tagline: "", bio: "", email: "", phone: "",
    instagram: "", github: "", tiktok: "", whatsapp: "",
  });
  const [tools, setTools]             = useState<Tool[]>(DEFAULT_TOOLS);
  const [newTool, setNewTool]         = useState<Tool>({ name: "", abbr: "", color: "#ffffff", bg: "#111111" });
  const [showAddTool, setShowAddTool] = useState(false);
  const [avatarFile, setAvatarFile]   = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");
  const [recordId, setRecordId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("about").select("*").single() as any);
      if (data) {
        setRecordId(data.id);
        setCurrentAvatar(data.avatar_url ?? null);
        const s = data.socials ?? {};
        setForm({
          full_name: data.full_name ?? "", tagline: data.tagline ?? "",
          bio: data.bio ?? "", email: data.email ?? "", phone: data.phone ?? "",
          instagram: s.instagram ?? "", github: s.github ?? "",
          tiktok: s.tiktok ?? "", whatsapp: s.whatsapp ?? "",
        });
        if (s.tools && Array.isArray(s.tools) && s.tools.length > 0) {
          setTools(s.tools);
        }
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function removeTool(index: number) {
    setTools((prev) => prev.filter((_, i) => i !== index));
  }

  function addTool() {
    if (!newTool.name.trim() || !newTool.abbr.trim()) return;
    setTools((prev) => [...prev, newTool]);
    setNewTool({ name: "", abbr: "", color: "#ffffff", bg: "#111111" });
    setShowAddTool(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      let avatar_url = currentAvatar;
      if (avatarFile) {
        const ext  = avatarFile.name.split(".").pop();
        const path = `avatars/avatar.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("portfolio-media")
          .upload(path, avatarFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("portfolio-media").getPublicUrl(path);
        avatar_url = urlData.publicUrl;
      }

      const payload = {
        full_name: form.full_name, tagline: form.tagline, bio: form.bio,
        email: form.email, phone: form.phone || null, avatar_url,
        socials: {
          instagram: form.instagram, github: form.github,
          tiktok: form.tiktok, whatsapp: form.whatsapp,
          tools, // disimpan di sini
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase.from("about") as any;
      const { error: err } = recordId
        ? await db.update(payload).eq("id", recordId)
        : await db.insert(payload);
      if (err) throw err;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi error saat menyimpan");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>Memuat...</p>
    </div>
  );

  const displayAvatar = avatarPreview || currentAvatar;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Manage</p>
          <h1 className="mt-1 text-3xl font-bold">About Me</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* FOTO PROFIL */}
          <Card label="Foto Profil">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full"
                style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                {displayAvatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayAvatar} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer rounded-xl px-4 py-2 text-sm transition hover:opacity-70"
                  style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
                  {displayAvatar ? "Ganti foto" : "Upload foto"}
                  <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                </label>
                {displayAvatar && (
                  <button type="button"
                    onClick={() => { setAvatarFile(null); setAvatarPreview(""); setCurrentAvatar(null); }}
                    className="text-left text-xs transition hover:opacity-70"
                    style={{ color: "var(--muted)" }}>
                    Hapus foto
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* INFO UTAMA */}
          <Card label="Informasi Utama">
            <Field label="Nama lengkap *">
              <input name="full_name" value={form.full_name} onChange={handleChange}
                required className="input-field" placeholder="Sandy Fauzi Amrulloh" />
            </Field>
            <Field label="Tagline *" hint="ditampilkan di bawah nama">
              <input name="tagline" value={form.tagline} onChange={handleChange}
                required className="input-field" placeholder="Video Editor · Graphic Design · 3D VFX" />
            </Field>
            <Field label="Bio">
              <textarea name="bio" value={form.bio} onChange={handleChange}
                rows={4} className="input-field resize-none"
                placeholder="Ceritakan tentang dirimu..." />
            </Field>
          </Card>

          {/* KONTAK & SOSMED */}
          <Card label="Kontak & Social Media">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email *">
                <input name="email" value={form.email} onChange={handleChange}
                  type="email" required className="input-field" />
              </Field>
              <Field label="WhatsApp">
                <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
                  placeholder="+6281295710325" className="input-field" />
              </Field>
              <Field label="Instagram">
                <input name="instagram" value={form.instagram} onChange={handleChange}
                  placeholder="sandzh_" className="input-field" />
              </Field>
              <Field label="GitHub">
                <input name="github" value={form.github} onChange={handleChange}
                  placeholder="SandyFauzi" className="input-field" />
              </Field>
              <Field label="TikTok">
                <input name="tiktok" value={form.tiktok} onChange={handleChange}
                  placeholder="sandzh._" className="input-field" />
              </Field>
              <Field label="Phone">
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+62..." className="input-field" />
              </Field>
            </div>
          </Card>

          {/* TOOLS & SOFTWARE */}
          <Card label="Tools & Software">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Hover tool → klik × untuk hapus. Perubahan disimpan saat klik tombol simpan di bawah.
            </p>

            {/* List tools */}
            <div className="flex flex-wrap gap-2">
              {tools.map((t, i) => (
                <div key={i}
                  className="group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
                  style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
                    style={{ background: t.bg, color: t.color }}>
                    {t.abbr}
                  </div>
                  <span>{t.name}</span>
                  <button type="button" onClick={() => removeTool(i)}
                    className="ml-0.5 text-sm leading-none opacity-0 transition group-hover:opacity-60 hover:!opacity-100"
                    style={{ color: "var(--muted)" }}>
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Form tambah tool */}
            {showAddTool ? (
              <div className="rounded-xl p-4 space-y-3"
                style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em]"
                  style={{ color: "var(--muted)" }}>Software baru</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nama">
                    <input value={newTool.name}
                      onChange={(e) => setNewTool((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Blender" className="input-field" />
                  </Field>
                  <Field label="Singkatan (maks 3 huruf)">
                    <input value={newTool.abbr} maxLength={3}
                      onChange={(e) => setNewTool((p) => ({ ...p, abbr: e.target.value.toUpperCase() }))}
                      placeholder="BL" className="input-field" />
                  </Field>
                  <Field label="Warna teks icon">
                    <div className="flex items-center gap-2">
                      <input type="color" value={newTool.color}
                        onChange={(e) => setNewTool((p) => ({ ...p, color: e.target.value }))}
                        className="h-9 w-12 cursor-pointer rounded-lg p-0.5"
                        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }} />
                      <code className="text-xs" style={{ color: "var(--muted)" }}>{newTool.color}</code>
                    </div>
                  </Field>
                  <Field label="Background icon">
                    <div className="flex items-center gap-2">
                      <input type="color" value={newTool.bg}
                        onChange={(e) => setNewTool((p) => ({ ...p, bg: e.target.value }))}
                        className="h-9 w-12 cursor-pointer rounded-lg p-0.5"
                        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }} />
                      <code className="text-xs" style={{ color: "var(--muted)" }}>{newTool.bg}</code>
                    </div>
                  </Field>
                </div>
                {/* Live preview */}
                {newTool.name && (
                  <div>
                    <p className="mb-1 font-mono text-[9px] uppercase" style={{ color: "var(--muted)" }}>Preview</p>
                    <div className="flex w-fit items-center gap-2 rounded-xl px-3 py-2"
                      style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                      <div className="flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold"
                        style={{ background: newTool.bg, color: newTool.color }}>
                        {newTool.abbr || "??"}
                      </div>
                      <span className="text-sm">{newTool.name}</span>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={addTool}
                    className="rounded-lg px-4 py-2 text-xs font-semibold transition hover:opacity-80"
                    style={{ background: "var(--text)", color: "var(--bg)" }}>
                    Tambah
                  </button>
                  <button type="button" onClick={() => setShowAddTool(false)}
                    className="rounded-lg px-4 py-2 text-xs transition hover:opacity-70"
                    style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setShowAddTool(true)}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition hover:opacity-70"
                style={{ border: "1px dashed var(--border-hover)", color: "var(--muted)" }}>
                ＋ Tambah software
              </button>
            )}
          </Card>

          {/* STATUS */}
          {error && (
            <p className="rounded-xl px-4 py-3 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              ⚠ {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl px-4 py-3 text-sm"
              style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
              ✓ Berhasil disimpan!
            </p>
          )}

          <button type="submit" disabled={saving}
            className="w-full rounded-xl py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-40"
            style={{ background: "var(--text)", color: "var(--bg)" }}>
            {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────
function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl p-5"
      style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em]"
        style={{ color: "var(--muted)" }}>{label}</p>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em]"
        style={{ color: "var(--muted)" }}>
        {label}
        {hint && <span className="ml-1 normal-case opacity-50">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
