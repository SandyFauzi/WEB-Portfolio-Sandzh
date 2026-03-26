"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";

type Skill = { id: string; name: string; percentage: number; category: string; sort_order: number };

const CATEGORIES = ["creative", "technical", "science"];

export default function SkillsPage() {
  const supabase = createClient();
  const [skills, setSkills]   = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState<string | null>(null);
  const [adding, setAdding]   = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", percentage: 80, category: "creative", sort_order: 0 });

  async function load() {
    const { data } = await supabase.from("skills").select("*").order("sort_order");
    setSkills(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateSkill(skill: Skill) {
    setSaving(skill.id);
    await supabase.from("skills").update({
      name: skill.name, percentage: skill.percentage,
      category: skill.category, sort_order: skill.sort_order,
    } as any).eq("id", skill.id);
    setSaving(null);
  }

  async function deleteSkill(id: string) {
    if (!confirm("Hapus skill ini?")) return;
    await supabase.from("skills").delete().eq("id", id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }

  async function addSkill() {
    if (!newSkill.name.trim()) return;
    setSaving("new");
    const { data } = await supabase.from("skills").insert(newSkill).select().single();
    if (data) setSkills((prev) => [...prev, data]);
    setNewSkill({ name: "", percentage: 80, category: "creative", sort_order: 0 });
    setAdding(false);
    setSaving(null);
  }

  function setField(id: string, field: keyof Skill, value: string | number) {
    setSkills((prev) =>
      prev.map((s) => s.id === id ? { ...s, [field]: field === "percentage" || field === "sort_order" ? Number(value) : value } : s)
    );
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>Memuat...</p>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Manage</p>
            <h1 className="mt-1 text-3xl font-bold">Skills</h1>
          </div>
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
            style={{ background: "var(--text)", color: "var(--bg)" }}>
            ＋ Tambah
          </button>
        </div>

        {/* Add form */}
        {adding && (
          <div className="mb-6 rounded-2xl p-5 space-y-4"
            style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Skill baru</p>
            <div className="grid grid-cols-2 gap-3">
              <input value={newSkill.name} onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
                placeholder="Nama skill" className="input-field" />
              <select value={newSkill.category} onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}
                className="input-field">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <input type="range" min={0} max={100} value={newSkill.percentage}
                onChange={(e) => setNewSkill((p) => ({ ...p, percentage: Number(e.target.value) }))}
                className="flex-1" />
              <span className="w-12 text-right font-mono text-sm" style={{ color: "var(--muted)" }}>{newSkill.percentage}%</span>
            </div>
            <div className="flex gap-3">
              <button onClick={addSkill} disabled={saving === "new"}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition hover:opacity-80 disabled:opacity-40"
                style={{ background: "var(--text)", color: "var(--bg)" }}>
                {saving === "new" ? "Menyimpan..." : "Simpan"}
              </button>
              <button onClick={() => setAdding(false)}
                className="rounded-xl px-5 py-2.5 text-sm transition hover:opacity-70"
                style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Skills list */}
        <div className="space-y-2">
          {skills.map((s) => (
            <div key={s.id} className="rounded-xl p-4 space-y-3"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
              <div className="grid grid-cols-2 gap-3">
                <input value={s.name} onChange={(e) => setField(s.id, "name", e.target.value)}
                  className="input-field" />
                <select value={s.category} onChange={(e) => setField(s.id, "category", e.target.value)}
                  className="input-field">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <input type="range" min={0} max={100} value={s.percentage}
                  onChange={(e) => setField(s.id, "percentage", e.target.value)}
                  className="flex-1" />
                <span className="w-12 text-right font-mono text-sm" style={{ color: "var(--muted)" }}>{s.percentage}%</span>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => updateSkill(s)} disabled={saving === s.id}
                  className="rounded-lg px-4 py-1.5 text-xs font-medium transition hover:opacity-80 disabled:opacity-40"
                  style={{ background: "var(--text)", color: "var(--bg)" }}>
                  {saving === s.id ? "..." : "Simpan"}
                </button>
                <button onClick={() => deleteSkill(s.id)}
                  className="rounded-lg px-4 py-1.5 text-xs transition hover:opacity-70"
                  style={{ border: "1px solid var(--border)", color: "var(--muted)" }}>
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%; border-radius: 10px; padding: 8px 12px; font-size: 13px;
          background: var(--bg-3); border: 1px solid var(--border); color: var(--text);
          outline: none; transition: border-color 0.2s;
        }
        .input-field:focus { border-color: var(--border-hover); }
        select.input-field option { background: var(--bg-2); }
      `}</style>
    </div>
  );
}
