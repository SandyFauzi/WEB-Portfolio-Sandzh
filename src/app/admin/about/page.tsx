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
  { year: "2024 –",    place: "Universitas Padjadjaran", note: "S1 Fisika" },
  { year: "2021 – 24", place: "SMKN 1 Sumedang",        note: "Teknik Elektronika" },
  { year: "2018 – 21", place: "SMPN 1 Sumedang",        note: "" },
  { year: "2012 – 18", place: "SD Sukamaju",             note: "" },
];
const DEFAULT_EXP = [
  { year: "2023 - 2024", title: "Ketua Divisi PDD", org: "BEM Kema UNPAD", link_label: "Lihat Aftermovie", link: "#" },
  { year: "2022", title: "Staff Dekorasi & Dokumentasi", org: "Kepanitiaan Fakultas", link_label: "Poster Project", link: "#" },
];

type Tool    = { name: string; abbr: string; color: string; bg: string; icon_url?: string; file?: File | null };
type InfoObj = { label: string; value: string };
type EduObj  = { year: string; place: string; note: string };
type ExpObj  = { year: string; title: string; org: string; link: string; link_label: string };

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
  const [experience, setExperience]   = useState<ExpObj[]>([]);
  const [avatarFile, setAvatarFile]   = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const [recordId, setRecordId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile"|"about"|"contact"|"tools">("profile");

  useEffect(() => {
    async function load() {
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
        setTools(s.tools?.length > 0 ? s.tools : DEFAULT_TOOLS);
        setInfo(s.info?.length > 0 ? s.info : DEFAULT_INFO);
        setEducation(s.education?.length > 0 ? s.education : DEFAULT_EDU);
        setExperience(s.experience?.length > 0 ? s.experience : DEFAULT_EXP);
      } else {
        setTools(DEFAULT_TOOLS); setInfo(DEFAULT_INFO);
        setEducation(DEFAULT_EDU); setExperience(DEFAULT_EXP);
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

  function removeTool(i: number) { setTools(p => p.filter((_, idx) => idx !== i)); }
  function addTool() {
    if (!newTool.name.trim() || !newTool.abbr.trim()) return;
    setTools(p => [...p, newTool]);
    setNewTool({ name: "", abbr: "", color: "#ffffff", bg: "#111111", file: null });
    setShowAddTool(false);
  }
  function addInfo()    { setInfo([...info, { label: "", value: "" }]); }
  function removeInfo(i: number) { setInfo(info.filter((_, idx) => idx !== i)); }
  function updateInfo(i: number, f: keyof InfoObj, v: string) {
    const n = [...info]; n[i] = { ...n[i], [f]: v }; setInfo(n);
  }
  function addEdu()    { setEducation([...education, { year: "", place: "", note: "" }]); }
  function removeEdu(i: number) { setEducation(education.filter((_, idx) => idx !== i)); }
  function updateEdu(i: number, f: keyof EduObj, v: string) {
    const n = [...education]; n[i] = { ...n[i], [f]: v }; setEducation(n);
  }
  function addExp()    { setExperience([...experience, { year: "", title: "", org: "", link: "", link_label: "" }]); }
  function removeExp(i: number) { setExperience(experience.filter((_, idx) => idx !== i)); }
  function updateExp(i: number, f: keyof ExpObj, v: string) {
    const n = [...experience]; n[i] = { ...n[i], [f]: v }; setExperience(n);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess(false);
    try {
      let avatar_url = currentAvatar;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `avatars/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("portfolio-media").upload(path, avatarFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("portfolio-media").getPublicUrl(path);
        avatar_url = urlData.publicUrl;
      }
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
          info, education, experience, tools: finalTools,
        },
      };
      const db = supabase.from("about") as any;
      const { error: err } = recordId ? await db.update(payload).eq("id", recordId) : await db.insert(payload);
      if (err) throw err;
      setTools(finalTools); setAvatarFile(null); setAvatarPreview(""); setCurrentAvatar(avatar_url);
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi error");
    } finally { setSaving(false); }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>Memuat...</p>
    </div>
  );

  const displayAvatar = avatarPreview || currentAvatar;
  const tabs = [
    { id: "profile", label: "Profil" },
    { id: "about",   label: "About" },
    { id: "contact", label: "Kontak" },
    { id: "tools",   label: "Tools" },
  ] as const;

  return (
    <div className="min-h-screen pb-32" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-6 pb-4 md:px-8"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Manage</p>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">About Me</h1>
          {/* Tab navigation */}
          <div className="mt-4 flex gap-1 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
                className="shrink-0 rounded-lg px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition"
                style={{
                  background: activeTab === t.id ? "var(--text)" : "var(--bg-2)",
                  color: activeTab === t.id ? "var(--bg)" : "var(--muted)",
                  border: "1px solid var(--border)",
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 space-y-5">

          {/* ── TAB: PROFIL ── */}
          {activeTab === "profile" && (
            <>
              {/* Foto */}
              <Card label="Foto Profil">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl"
                    style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                    {displayAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={displayAvatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-3xl opacity-20">◻</span>
                      </div>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-3">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition hover:opacity-70"
                      style={{ border: "1px solid var(--border)", color: "var(--text)", background: "var(--bg-2)" }}>
                      ↑ {displayAvatar ? "Ganti Foto" : "Upload Foto"}
                      <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                    </label>
                    {displayAvatar && (
                      <button type="button"
                        onClick={() => { setAvatarFile(null); setAvatarPreview(""); setCurrentAvatar(null); }}
                        className="rounded-xl px-4 py-3 text-sm transition hover:opacity-70"
                        style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
                        ✕ Hapus Foto
                      </button>
                    )}
                    <p className="text-center text-xs sm:text-left" style={{ color: "var(--muted)" }}>
                      Pakai PNG transparan untuk efek hero terbaik
                    </p>
                  </div>
                </div>
              </Card>

              {/* Info utama */}
              <Card label="Informasi Utama">
                <Field label="Nama Lengkap *">
                  <input name="full_name" value={form.full_name} onChange={handleChange}
                    required className="input-field" placeholder="Sandy Fauzi Amrulloh" />
                </Field>
                <Field label="Tagline *" hint="tampil di bawah nama">
                  <input name="tagline" value={form.tagline} onChange={handleChange}
                    required className="input-field" placeholder="Video Editor · Graphic Design · 3D VFX" />
                </Field>
                <Field label="Bio">
                  <textarea name="bio" value={form.bio} onChange={handleChange}
                    rows={6} className="input-field resize-none leading-relaxed"
                    placeholder="Ceritakan tentang dirimu..." />
                </Field>
              </Card>

              {/* Status cards */}
              <Card label="Status Cards">
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Ditampilkan sebagai kartu di section About (contoh: Universitas, Fokus, Status).
                </p>
                <div className="space-y-3">
                  {info.map((item, i) => (
                    <div key={i} className="flex gap-2">
                      <input className="input-field" placeholder="Label (ex: Universitas)"
                        value={item.label} onChange={e => updateInfo(i, "label", e.target.value)} />
                      <input className="input-field" placeholder="Value (ex: UNPAD)"
                        value={item.value} onChange={e => updateInfo(i, "value", e.target.value)} />
                      <button type="button" onClick={() => removeInfo(i)}
                        className="shrink-0 rounded-xl px-3 text-sm transition hover:opacity-70"
                        style={{ border: "1px solid var(--border)", color: "#f87171" }}>✕</button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addInfo}
                  className="mt-1 w-full rounded-xl py-3 text-sm transition hover:opacity-70"
                  style={{ border: "1px dashed var(--border)", color: "var(--muted)" }}>
                  ＋ Tambah Baris
                </button>
              </Card>
            </>
          )}

          {/* ── TAB: ABOUT ── */}
          {activeTab === "about" && (
            <>
              <Card label="Riwayat Pendidikan">
                <div className="space-y-3">
                  {education.map((item, i) => (
                    <div key={i} className="rounded-xl p-4 space-y-3"
                      style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted uppercase">Pendidikan #{i+1}</span>
                        <button type="button" onClick={() => removeEdu(i)}
                          className="text-xs transition hover:opacity-70" style={{ color: "#f87171" }}>
                          ✕ Hapus
                        </button>
                      </div>
                      <input className="input-field" placeholder="Tahun (ex: 2024 –)"
                        value={item.year} onChange={e => updateEdu(i, "year", e.target.value)} />
                      <input className="input-field" placeholder="Nama Tempat (ex: Universitas Padjadjaran)"
                        value={item.place} onChange={e => updateEdu(i, "place", e.target.value)} />
                      <input className="input-field" placeholder="Keterangan opsional (ex: S1 Fisika)"
                        value={item.note} onChange={e => updateEdu(i, "note", e.target.value)} />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addEdu}
                  className="mt-1 w-full rounded-xl py-3 text-sm transition hover:opacity-70"
                  style={{ border: "1px dashed var(--border)", color: "var(--muted)" }}>
                  ＋ Tambah Pendidikan
                </button>
              </Card>

              <Card label="Pengalaman Organisasi & Kepanitiaan">
                <div className="space-y-3">
                  {experience.map((item, i) => (
                    <div key={i} className="rounded-xl p-4 space-y-3"
                      style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted uppercase">Pengalaman #{i+1}</span>
                        <button type="button" onClick={() => removeExp(i)}
                          className="text-xs transition hover:opacity-70" style={{ color: "#f87171" }}>
                          ✕ Hapus
                        </button>
                      </div>
                      <input className="input-field" placeholder="Tahun (ex: 2023 - 2024)"
                        value={item.year} onChange={e => updateExp(i, "year", e.target.value)} />
                      <input className="input-field" placeholder="Peran / Jabatan (ex: Ketua Divisi PDD)"
                        value={item.title} onChange={e => updateExp(i, "title", e.target.value)} />
                      <input className="input-field" placeholder="Nama Organisasi (ex: BEM Kema UNPAD)"
                        value={item.org} onChange={e => updateExp(i, "org", e.target.value)} />
                      <div className="pt-2 space-y-3" style={{ borderTop: "1px dashed var(--border)" }}>
                        <input className="input-field" placeholder="Label link (ex: Lihat Aftermovie)"
                          value={item.link_label} onChange={e => updateExp(i, "link_label", e.target.value)} />
                        <input className="input-field" placeholder="URL (ex: https://...)"
                          value={item.link} onChange={e => updateExp(i, "link", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addExp}
                  className="mt-1 w-full rounded-xl py-3 text-sm transition hover:opacity-70"
                  style={{ border: "1px dashed var(--border)", color: "var(--muted)" }}>
                  ＋ Tambah Pengalaman
                </button>
              </Card>
            </>
          )}

          {/* ── TAB: KONTAK ── */}
          {activeTab === "contact" && (
            <Card label="Kontak & Social Media">
              <div className="space-y-4">
                {[
                  { name: "email",     label: "Email *",    type: "email",  placeholder: "sandyfauzia09@gmail.com", required: true },
                  { name: "whatsapp",  label: "WhatsApp",   type: "tel",    placeholder: "+6281295710325" },
                  { name: "instagram", label: "Instagram",  type: "text",   placeholder: "sandzh_" },
                  { name: "github",    label: "GitHub",     type: "text",   placeholder: "SandyFauzi" },
                  { name: "tiktok",    label: "TikTok",     type: "text",   placeholder: "sandzh._" },
                  { name: "phone",     label: "Phone",      type: "tel",    placeholder: "+62..." },
                ].map((f) => (
                  <Field key={f.name} label={f.label}>
                    <input
                      name={f.name}
                      type={f.type}
                      required={f.required}
                      placeholder={f.placeholder}
                      value={(form as any)[f.name]}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </Field>
                ))}
              </div>
            </Card>
          )}

          {/* ── TAB: TOOLS ── */}
          {activeTab === "tools" && (
            <Card label="Tools & Software">
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Hover tool → tap × untuk hapus. Disimpan saat klik tombol simpan.
              </p>

              {/* List tools */}
              <div className="flex flex-wrap gap-2">
                {tools.map((t, i) => (
                  <div key={i}
                    className="group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm"
                    style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg text-[11px] font-bold"
                      style={{ background: t.icon_url ? "transparent" : t.bg, color: t.color }}>
                      {t.icon_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.icon_url} alt={t.name} className="h-full w-full object-contain" />
                      ) : t.abbr}
                    </div>
                    <span>{t.name}</span>
                    <button type="button" onClick={() => removeTool(i)}
                      className="ml-1 text-base leading-none opacity-30 transition hover:opacity-100"
                      style={{ color: "#f87171" }}>×</button>
                  </div>
                ))}
              </div>

              {/* Form tambah */}
              {showAddTool ? (
                <div className="rounded-xl p-4 space-y-4"
                  style={{ background: "var(--bg-3)", border: "1px solid var(--border)" }}>
                  <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Tambah Tool Baru
                  </p>
                  <Field label="Nama Tool">
                    <input value={newTool.name}
                      onChange={e => setNewTool(p => ({ ...p, name: e.target.value }))}
                      placeholder="Blender" className="input-field" />
                  </Field>
                  <Field label="Singkatan (maks 3 huruf)">
                    <input value={newTool.abbr} maxLength={3}
                      onChange={e => setNewTool(p => ({ ...p, abbr: e.target.value.toUpperCase() }))}
                      placeholder="BL" className="input-field" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Warna teks">
                      <div className="flex items-center gap-3">
                        <input type="color" value={newTool.color}
                          onChange={e => setNewTool(p => ({ ...p, color: e.target.value }))}
                          className="h-11 w-14 cursor-pointer rounded-xl p-1 input-field" />
                        <code className="text-xs" style={{ color: "var(--muted)" }}>{newTool.color}</code>
                      </div>
                    </Field>
                    <Field label="Background">
                      <div className="flex items-center gap-3">
                        <input type="color" value={newTool.bg}
                          onChange={e => setNewTool(p => ({ ...p, bg: e.target.value }))}
                          className="h-11 w-14 cursor-pointer rounded-xl p-1 input-field" />
                        <code className="text-xs" style={{ color: "var(--muted)" }}>{newTool.bg}</code>
                      </div>
                    </Field>
                  </div>
                  <Field label="Upload Icon (opsional)">
                    <input type="file" accept="image/*"
                      onChange={e => setNewTool(p => ({ ...p, file: e.target.files?.[0] }))}
                      className="input-field cursor-pointer text-sm file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-1 file:text-xs"
                      style={{ "--file-bg": "var(--text)" } as any} />
                  </Field>
                  {/* Preview */}
                  {newTool.name && (
                    <div>
                      <p className="mb-2 font-mono text-[9px] uppercase" style={{ color: "var(--muted)" }}>Preview</p>
                      <div className="flex w-fit items-center gap-2 rounded-xl px-3 py-2.5"
                        style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold"
                          style={{ background: newTool.bg, color: newTool.color }}>
                          {newTool.abbr || "??"}
                        </div>
                        <span className="text-sm">{newTool.name}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={addTool}
                      className="flex-1 rounded-xl py-3 text-sm font-semibold transition hover:opacity-80"
                      style={{ background: "var(--text)", color: "var(--bg)" }}>
                      Tambah
                    </button>
                    <button type="button" onClick={() => setShowAddTool(false)}
                      className="rounded-xl px-5 py-3 text-sm transition hover:opacity-70"
                      style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setShowAddTool(true)}
                  className="w-full rounded-xl py-3 text-sm transition hover:opacity-70"
                  style={{ border: "1px dashed var(--border-hover)", color: "var(--muted)" }}>
                  ＋ Tambah Tool Baru
                </button>
              )}
            </Card>
          )}

          {/* Status */}
          {error && (
            <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
              ⚠ {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
              ✓ Berhasil disimpan!
            </p>
          )}
        </div>

        {/* Tombol simpan sticky di bawah */}
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4"
          style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div className="mx-auto max-w-2xl">
            <button type="submit" disabled={saving}
              className="w-full rounded-xl py-4 text-sm font-semibold transition hover:opacity-80 disabled:opacity-40"
              style={{ background: "var(--text)", color: "var(--bg)" }}>
              {saving ? "Menyimpan..." : "💾 Simpan Semua Perubahan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 rounded-2xl p-5 md:p-6"
      style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>{label}</p>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
        {label} {hint && <span className="ml-1 normal-case opacity-50">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
