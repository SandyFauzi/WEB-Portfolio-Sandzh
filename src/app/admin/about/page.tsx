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

const DEFAULT_INFO = [
  { label: "Universitas", value: "UNPAD" },
  { label: "Jurusan",     value: "Fisika" },
  { label: "Fokus",       value: "Creative Tech" },
  { label: "Status",      value: "Freelance" },
];

const DEFAULT_EDU = [
  { year: "2024 –",      place: "Universitas Padjadjaran", note: "S1 Fisika" },
  { year: "2021 – 24",   place: "SMKN 1 Sumedang",        note: "Teknik Elektronika" },
  { year: "2018 – 21",   place: "SMPN 1 Sumedang",        note: "" },
  { year: "2012 – 18",   place: "SD Sukamaju",             note: "" },
];

type Tool = { name: string; abbr: string; color: string; bg: string; icon_url?: string; file?: File | null };
type InfoObj = { label: string; value: string };
type EduObj = { year: string; place: string; note: string };

export default function AboutPage() {
  const supabase = useMemo(() => createClient(), []);

  const [form, setForm] = useState({
    full_name: "", tagline: "", bio: "", email: "", phone: "",
    instagram: "", github: "", tiktok: "", whatsapp: "",
  });
  
  const [tools, setTools]             = useState<Tool[]>([]);
  const [newTool, setNewTool]         = useState<Tool>({ name: "", abbr: "", color: "#ffffff", bg: "#111111" });
  const [showAddTool, setShowAddTool] = useState(false);
  
  const [info, setInfo]               = useState<InfoObj[]>([]);
  const [education, setEducation]     = useState<EduObj[]>([]);

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
      
      // Jika data ADA di database, kita pakai data database.
      // Jika kosong/tidak ada, kita pakai nilai DEFAULT.
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
        
        // Cek satu-satu: Kalau di database ada array-nya dan isinya > 0, pakai itu. Kalau tidak, pakai DEFAULT.
        setTools(s.tools && Array.isArray(s.tools) && s.tools.length > 0 ? s.tools : DEFAULT_TOOLS);
        setInfo(s.info && Array.isArray(s.info) && s.info.length > 0 ? s.info : DEFAULT_INFO);
        setEducation(s.education && Array.isArray(s.education) && s.education.length > 0 ? s.education : DEFAULT_EDU);
      } else {
         // Jika tabel about benar-benar kosong melompong
         setTools(DEFAULT_TOOLS);
         setInfo(DEFAULT_INFO);
         setEducation(DEFAULT_EDU);
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

  // Tools Helpers
  function removeTool(index: number) { setTools((prev) => prev.filter((_, i) => i !== index)); }
  function addTool() {
    if (!newTool.name.trim() || !newTool.abbr.trim()) return;
    setTools((prev) => [...prev, newTool]);
    setNewTool({ name: "", abbr: "", color: "#ffffff", bg: "#111111", file: null });
    setShowAddTool(false);
  }

  // Info Helpers
  function addInfo() { setInfo([...info, { label: "", value: "" }]); }
  function removeInfo(idx: number) { setInfo(info.filter((_, i) => i !== idx)); }
  function updateInfo(idx: number, field: keyof InfoObj, val: string) {
    const newInfo = [...info];
    newInfo[idx] = { ...newInfo[idx], [field]: val };
    setInfo(newInfo);
  }

  // Education Helpers
  function addEdu() { setEducation([...education, { year: "", place: "", note: "" }]); }
  function removeEdu(idx: number) { setEducation(education.filter((_, i) => i !== idx)); }
  function updateEdu(idx: number, field: keyof EduObj, val: string) {
    const newEdu = [...education];
    newEdu[idx] = { ...newEdu[idx], [field]: val };
    setEducation(newEdu);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      // 1. Upload Avatar
      let avatar_url = currentAvatar;
      if (avatarFile) {
        const ext  = avatarFile.name.split(".").pop();
        const path = `avatars/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("portfolio-media").upload(path, avatarFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("portfolio-media").getPublicUrl(path);
        avatar_url = urlData.publicUrl;
      }

      // 2. Upload Tool Icons
      const finalTools = await Promise.all(tools.map(async (t) => {
        let icon_url = t.icon_url;
        if (t.file) {
          const ext = t.file.name.split(".").pop();
          const path = `icons/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
          const { error: uploadErr } = await supabase.storage.from("portfolio-media").upload(path, t.file, { upsert: true });
          if (!uploadErr) {
            const { data: urlData } = supabase.storage.from("portfolio-media").getPublicUrl(path);
            icon_url = urlData.publicUrl;
          }
        }
        return { name: t.name, abbr: t.abbr, color: t.color, bg: t.bg, icon_url };
      }));

      const payload = {
        full_name: form.full_name, tagline: form.tagline, bio: form.bio,
        email: form.email, phone: form.phone || null, avatar_url,
        socials: {
          instagram: form.instagram, github: form.github,
          tiktok: form.tiktok, whatsapp: form.whatsapp,
          info, education, tools: finalTools,
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase.from("about") as any;
      const { error: err } = recordId ? await db.update(payload).eq("id", recordId) : await db.insert(payload);
      if (err) throw err;

      // Update local state after saving
      setTools(finalTools);
      setAvatarFile(null);
      setAvatarPreview("");
      setCurrentAvatar(avatar_url);

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
              <input name="full_name" value={form.full_name} onChange={handleChange} required className="input-field" placeholder="Sandy Fauzi Amrulloh" />
            </Field>
            <Field label="Tagline *" hint="ditampilkan di bawah nama">
              <input name="tagline" value={form.tagline} onChange={handleChange} required className="input-field" placeholder="Video Editor · Graphic Design · 3D VFX" />
            </Field>
            <Field label="Bio">
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Ceritakan tentang dirimu..." />
            </Field>
          </Card>

          {/* KETERANGAN SAAT INI */}
          <Card label="Keterangan Saat Ini (Status)">
            <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>Ditampilkan di bawah Bio (ex: Universitas, Fokus, Status).</p>
            {info.map((item, i) => (
              <div key={i} className="mb-2 flex items-center gap-2">
                <input className="input-field" placeholder="Label (ex: Universitas)" value={item.label} onChange={e => updateInfo(i, 'label', e.target.value)} />
                <input className="input-field" placeholder="Value (ex: UNPAD)" value={item.value} onChange={e => updateInfo(i, 'value', e.target.value)} />
                <button type="button" onClick={() => removeInfo(i)} className="rounded-lg p-2 transition hover:bg-red-500/10 hover:text-red-500">✕</button>
              </div>
            ))}
            <button type="button" onClick={addInfo} className="mt-2 text-xs transition hover:opacity-70" style={{ color: "var(--muted)" }}>＋ Tambah Baris Baru</button>
          </Card>

          {/* PENDIDIKAN */}
          <Card label="Riwayat Pendidikan">
            <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>Daftar riwayat sekolah atau instansi.</p>
            {education.map((item, i) => (
              <div key={i} className="mb-3 grid grid-cols-[1fr_2fr_1fr_auto] items-center gap-2">
                <input className="input-field" placeholder="Tahun" value={item.year} onChange={e => updateEdu(i, 'year', e.target.value)} />
                <input className="input-field" placeholder="Nama Tempat" value={item.place} onChange={e => updateEdu(i, 'place', e.target.value)} />
                <input className="input-field" placeholder="Ket (opsional)" value={item.note} onChange={e => updateEdu(i, 'note', e.target.value)} />
                <button type="button" onClick={() => removeEdu(i)} className="rounded-lg p-2 transition hover:bg-red-500/10 hover:text-red-500">✕</button>
              </div>
            ))}
            <button type="button" onClick={addEdu} className="text-xs transition hover:opacity-70" style={{ color: "var(--muted)" }}>＋ Tambah Pendidikan Baru</button>
          </Card>

          {/* KONTAK & SOSMED */}
          <Card label="Kontak & Social Media">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email *">
                <input name="email" value={form.email} onChange={handleChange} type="email" required className="input-field" />
              </Field>
              <Field label="WhatsApp">
                <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+6281295710325" className="input-field" />
              </Field>
              <Field label="Instagram">
                <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="sandzh_" className="input-field" />
              </Field>
              <Field label="GitHub">
                <input name="github" value={form.github} onChange={handleChange} placeholder="SandyFauzi" className="input-field" />
              </Field>
            </div>
          </Card>

          {/* TOOLS & SOFTWARE */}
          <Card label="Tools & Software">
            <div className="flex flex-wrap gap-2">
              {tools.map((t, i) => (
                <div key={i} className="group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
                  style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                  
                  <div className="flex h-6 w-6 shrink-0 overflow-hidden items-center justify-center rounded-md text-[10px] font-bold"
                    style={{ background: t.icon_url ? "transparent" : t.bg, color: t.color }}>
                    {t.icon_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.icon_url} alt={t.name} className="h-full w-full object-contain" />
                    ) : (
                      t.abbr
                    )}
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
              <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Software baru</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nama">
                    <input value={newTool.name} onChange={(e) => setNewTool((p) => ({ ...p, name: e.target.value }))} placeholder="Blender" className="input-field" />
                  </Field>
                  <Field label="Singkatan (3 huruf)">
                    <input value={newTool.abbr} maxLength={3} onChange={(e) => setNewTool((p) => ({ ...p, abbr: e.target.value.toUpperCase() }))} placeholder="BL" className="input-field" />
                  </Field>
                  <Field label="Warna teks icon">
                    <input type="color" value={newTool.color} onChange={(e) => setNewTool((p) => ({ ...p, color: e.target.value }))} className="h-9 w-full cursor-pointer rounded-lg p-0.5 input-field" />
                  </Field>
                  <Field label="Background icon">
                    <input type="color" value={newTool.bg} onChange={(e) => setNewTool((p) => ({ ...p, bg: e.target.value }))} className="h-9 w-full cursor-pointer rounded-lg p-0.5 input-field" />
                  </Field>
                </div>
                
                <Field label="Atau Upload Gambar Icon (Opsional)">
                  <input type="file" accept="image/*" onChange={(e) => setNewTool(p => ({...p, file: e.target.files?.[0]}))} 
                    className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--text)] file:text-[var(--bg)] file:px-3 file:py-1.5 cursor-pointer" />
                </Field>

                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={addTool} className="rounded-lg px-4 py-2 text-xs font-semibold transition hover:opacity-80" style={{ background: "var(--text)", color: "var(--bg)" }}>Tambah</button>
                  <button type="button" onClick={() => setShowAddTool(false)} className="rounded-lg px-4 py-2 text-xs transition hover:opacity-70" style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>Batal</button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setShowAddTool(true)} className="mt-2 flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition hover:opacity-70" style={{ border: "1px dashed var(--border-hover)", color: "var(--muted)" }}>
                ＋ Tambah software
              </button>
            )}
          </Card>

          {/* STATUS */}
          {error && <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>⚠ {error}</p>}
          {success && <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>✓ Berhasil disimpan!</p>}

          <button type="submit" disabled={saving} className="w-full rounded-xl py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-40" style={{ background: "var(--text)", color: "var(--bg)" }}>
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
    <div className="space-y-4 rounded-2xl p-5" style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>{label}</p>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
        {label} {hint && <span className="ml-1 normal-case opacity-50">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
