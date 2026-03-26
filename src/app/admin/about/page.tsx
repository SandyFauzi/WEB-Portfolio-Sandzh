"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function AboutPage() {
  const supabase = createClient();
  const [form, setForm] = useState({
    full_name: "", tagline: "", bio: "", email: "", phone: "",
    instagram: "", github: "", tiktok: "", whatsapp: "",
  });
  const [avatarFile, setAvatarFile]     = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const [recordId, setRecordId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("about").select("*").single() as any;
      if (data) {
        setRecordId(data.id);
        setCurrentAvatar(data.avatar_url);
        const s = data.socials ?? {};
        setForm({
          full_name: data.full_name ?? "", tagline: data.tagline ?? "",
          bio: data.bio ?? "", email: data.email ?? "", phone: data.phone ?? "",
          instagram: s.instagram ?? "", github: s.github ?? "",
          tiktok: s.tiktok ?? "", whatsapp: s.whatsapp ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
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
        },
      };

      if (recordId) {
        const { error: e } = await supabase.from("about").update(payload).eq("id", recordId);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from("about").insert(payload);
        if (e) throw e;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi error");
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
          {/* Avatar */}
          <div>
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
              Foto Profil
            </label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full"
                style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                {displayAvatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayAvatar} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <label className="cursor-pointer rounded-xl px-4 py-2 text-sm transition hover:opacity-70"
                style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
                {displayAvatar ? "Ganti foto" : "Upload foto"}
                <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
              </label>
            </div>
          </div>

          <Field label="Nama lengkap *">
            <input name="full_name" value={form.full_name} onChange={handleChange} required className="input-field" />
          </Field>
          <Field label="Tagline *" hint="Ditampilkan di bawah nama">
            <input name="tagline" value={form.tagline} onChange={handleChange} required className="input-field"
              placeholder="Video Editor · Graphic Design · 3D VFX" />
          </Field>
          <Field label="Bio">
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={4}
              className="input-field resize-none" placeholder="Ceritakan tentang dirimu..." />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email *">
              <input name="email" value={form.email} onChange={handleChange} type="email" required className="input-field" />
            </Field>
            <Field label="WhatsApp">
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
                placeholder="+6281295710325" className="input-field" />
            </Field>
          </div>

          {/* Socials */}
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
              Social Media
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Instagram">
                <input name="instagram" value={form.instagram} onChange={handleChange}
                  placeholder="sandzh_" className="input-field" />
              </Field>
              <Field label="GitHub">
                <input name="github" value={form.github} onChange={handleChange}
                  placeholder="SandzhNine" className="input-field" />
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
          </div>

          {error && (
            <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>
              Berhasil disimpan!
            </p>
          )}

          <button type="submit" disabled={saving}
            className="w-full rounded-xl py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-40"
            style={{ background: "var(--text)", color: "var(--bg)" }}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
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
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
        {label} {hint && <span className="normal-case opacity-60">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
