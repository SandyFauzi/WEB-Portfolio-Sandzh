import { createClient } from "@/lib/supabase-server";
import ThemeToggle from "@/components/ThemeToggle";
import WakaStats from "@/components/WakaStats";
import YouTubeEmbed from "@/components/YouTubeEmbed";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{children}</span>;
}
function Divider() {
  return <div className="w-full border-t" style={{ borderColor: "var(--border)" }} />;
}

const CAT_LABEL: Record<string, string> = {
  video_editing: "Video Editing", graphic_design: "Graphic Design",
  "3d_vfx": "3D · VFX", physics: "Physics", programming: "Programming", photography: "Photography",
};

// Software icons SVG paths (simplified brand-accurate)
const SOFTWARE = [
  {
    name: "Premiere Pro", abbr: "Pr", color: "#9999FF",
    bg: "#0a0a1e",
  },
  {
    name: "After Effects", abbr: "Ae", color: "#9999FF",
    bg: "#0d0a1a",
  },
  {
    name: "Illustrator", abbr: "Ai", color: "#FF9A00",
    bg: "#1a0f00",
  },
  {
    name: "Photoshop", abbr: "Ps", color: "#31A8FF",
    bg: "#001219",
  },
  {
    name: "Blender", abbr: "Bl", color: "#E87D0D",
    bg: "#1a0e00",
  },
  {
    name: "VS Code", abbr: "VS", color: "#007ACC",
    bg: "#001525",
  },
  {
    name: "Python", abbr: "Py", color: "#FFD43B",
    bg: "#1a1500",
  },
  {
    name: "Arduino", abbr: "Ar", color: "#00979D",
    bg: "#001a1b",
  },
];

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default async function HomePage() {
  const supabase = createClient();
  const [{ data: about }, { data: projects }, { data: skills }] = await Promise.all([
    supabase.from("about").select("*").single(),
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("skills").select("*").order("sort_order", { ascending: true }),
  ]);

  const name    = about?.full_name ?? "Sandy Fauzi Amrulloh";
  const tagline = about?.tagline   ?? "Video Editor · Graphic Design · 3D VFX Artist";
  const bio     = about?.bio       ?? "Freelance video editor dan graphic designer dengan background Fisika UNPAD dan Teknik Elektronika.";
  const socials = (about?.socials ?? {}) as Record<string, string>;

  const grouped = (projects ?? []).reduce<Record<string, NonNullable<typeof projects>>>((acc, p) => {
    if (!p) return acc;
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const marqueeItems = ["Video Editing","3D VFX","Graphic Design","Physics","Blender","After Effects","Premiere Pro","Illustrator","Arduino","Python","Fisika UNPAD"];

  return (
    <main className="min-h-screen">
      {/* ── NAV ── */}
      <nav className="fixed top-0 z-50 w-full nav-blur border-b border-dim">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
          <span className="font-mono text-[11px] tracking-[0.18em] opacity-50">SANDZH</span>
          <div className="flex items-center gap-5">
            <ThemeToggle />
            {["work","skills","about","contact"].map((s) => (
              <a key={s} href={`#${s}`}
                className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-muted transition hover:opacity-80 sm:block">
                {s}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative flex min-h-screen flex-col justify-end px-6 pb-16 pt-28 md:px-12">
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(var(--text) 1px,transparent 1px),linear-gradient(90deg,var(--text) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }} />

        <div className="relative mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-2">
            {/* Left — text */}
            <div>
              <div className="fade-up mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--text)", opacity: 0.5 }} />
                <Label>Available for freelance</Label>
              </div>
              <h1 className="fade-up-2 mb-5 text-[clamp(2.8rem,9vw,7rem)] font-extrabold leading-[0.88] tracking-tight">
                {name.split(" ").map((w, i) => <span key={i} className="block">{w}</span>)}
              </h1>
              <p className="fade-up-3 mb-8 max-w-xs text-sm leading-relaxed text-muted">{tagline}</p>
              <div className="fade-up-4 flex flex-wrap items-center gap-4">
                <a href="#work" className="group flex items-center gap-3 text-sm font-semibold">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full transition group-hover:opacity-80"
                    style={{ background: "var(--text)", color: "var(--bg)" }}>↓</span>
                  Lihat karya
                </a>
                <a href="#contact" className="text-sm text-muted transition hover:opacity-70">Hubungi →</a>
              </div>
            </div>

            {/* Right — foto profil */}
            <div className="fade-up-2 flex justify-center md:justify-end">
              <div className="relative">
                {/* Frame dekoratif */}
                <div className="absolute -right-3 -top-3 h-full w-full rounded-2xl border-dim" />
                <div className="relative h-72 w-56 overflow-hidden rounded-2xl md:h-80 md:w-64"
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                  {about?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={about.avatar_url} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2">
                      <span className="text-4xl opacity-20">◻</span>
                      <p className="font-mono text-[10px] text-muted">Upload foto di admin</p>
                    </div>
                  )}
                </div>
                {/* Badge bawah */}
                <div className="absolute -bottom-4 left-4 rounded-xl px-3 py-2 text-xs font-medium border-dim"
                  style={{ background: "var(--card-bg)" }}>
                  <Label>Sumedang, ID</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden border-y py-3" style={{ borderColor: "var(--border)" }}>
        <div className="marquee-inner">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-6 font-mono text-[10px] uppercase tracking-widest text-muted">
              {item}<span className="mx-6 opacity-30">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SOFTWARE ICONS ── */}
      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-4">
            <Label>Tools & Software</Label>
            <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>
          <div className="flex flex-wrap gap-3">
            {SOFTWARE.map((s) => (
              <div key={s.name}
                className="group flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition hover:scale-105"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                {/* Icon badge */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                  style={{ background: s.bg, color: s.color }}>
                  {s.abbr}
                </div>
                <span className="text-sm font-medium">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── ABOUT ── */}
      <section id="about" className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-4">
            <Label>002 / About</Label>
            <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>
          <div className="grid grid-cols-1 gap-14 md:grid-cols-2">
            <div>
              <h2 className="mb-5 text-4xl font-bold leading-tight">Fisika &<br />Kreativitas</h2>
              <p className="leading-relaxed text-muted">{bio}</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { label: "Universitas", value: "UNPAD" },
                  { label: "Jurusan",     value: "Fisika" },
                  { label: "Fokus",       value: "Creative Tech" },
                  { label: "Status",      value: "Freelance" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl p-4 border-dim bg-card">
                    <Label>{item.label}</Label>
                    <p className="mt-1 font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Pendidikan</Label>
              <div className="mt-5">
                {[
                  { year: "2024 –",      place: "Universitas Padjadjaran", note: "S1 Fisika" },
                  { year: "2021 – 24",   place: "SMKN 1 Sumedang",        note: "Teknik Elektronika" },
                  { year: "2018 – 21",   place: "SMPN 1 Sumedang",        note: "" },
                  { year: "2012 – 18",   place: "SD Sukamaju",             note: "" },
                ].map((e, i) => (
                  <div key={i} className="flex gap-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="w-20 shrink-0 font-mono text-xs text-muted">{e.year}</span>
                    <div>
                      <p className="font-semibold">{e.place}</p>
                      {e.note && <p className="text-sm text-muted">{e.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── SKILLS ── */}
      <section id="skills" className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-4">
            <Label>003 / Skills</Label>
            <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>
          <div>
            {(skills ?? []).map((s, i) => (
              <div key={s.id} className="flex items-center gap-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="w-6 shrink-0 font-mono text-[10px] text-muted">{String(i+1).padStart(2,"0")}</span>
                <span className="w-44 shrink-0 font-semibold text-sm">{s.name}</span>
                <div className="relative h-px flex-1" style={{ background: "var(--bg-3)" }}>
                  <div className="absolute inset-y-0 left-0 h-px" style={{ width: `${s.percentage}%`, background: "var(--text)" }} />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-sm text-muted">{s.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── WORK ── */}
      <section id="work" className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-4">
            <Label>004 / Work</Label>
            <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>

          {Object.keys(grouped).length === 0 ? (
            <div className="rounded-2xl p-12 text-center border-dim">
              <p className="text-sm text-muted">Belum ada project —</p>
              <a href="/admin" className="mt-2 inline-block text-xs underline underline-offset-4 text-muted hover:opacity-70">
                tambahkan lewat admin panel →
              </a>
            </div>
          ) : (
            <div className="space-y-14">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <div className="mb-5 flex items-center gap-3">
                    <Label>{CAT_LABEL[cat] ?? cat}</Label>
                    <span className="font-mono text-[10px] text-muted opacity-50">({items.length})</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((p) => {
                      const hasYT = !!p.external_url && isYouTubeUrl(p.external_url);
                      const hasDrive = !!(p as Record<string,unknown>).gdrive_url;
                      return (
                        <div key={p.id} className="group overflow-hidden rounded-2xl bg-card border-dim transition hover:border-dim-hover">
                          {/* Media — YouTube embed atau thumbnail */}
                          {hasYT ? (
                            <YouTubeEmbed url={p.external_url!} title={p.title} />
                          ) : p.thumbnail_url ? (
                            <div className="aspect-video w-full overflow-hidden" style={{ background: "var(--bg-3)" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.thumbnail_url} alt={p.title}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                            </div>
                          ) : (
                            <div className="aspect-video w-full flex items-center justify-center" style={{ background: "var(--bg-3)" }}>
                              <span className="font-mono text-xs text-muted opacity-30">no preview</span>
                            </div>
                          )}

                          {/* Info */}
                          <div className="p-4">
                            <h3 className="font-bold leading-tight">{p.title}</h3>
                            {p.description && (
                              <p className="mt-1 text-sm text-muted line-clamp-2">{p.description}</p>
                            )}
                            {p.tags?.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {p.tags.map((tag) => (
                                  <span key={tag} className="rounded-lg px-2 py-0.5 font-mono text-[10px] text-muted"
                                    style={{ background: "var(--bg-2)" }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Action buttons */}
                            {(hasDrive || (p.external_url && !hasYT)) && (
                              <div className="mt-4 flex gap-2">
                                {hasDrive && (
                                  <a href={String((p as Record<string,unknown>).gdrive_url)}
                                    target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                                    style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                                    <span>▤</span> Drive files
                                  </a>
                                )}
                                {p.external_url && !hasYT && (
                                  <a href={p.external_url} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                                    style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                                    Lihat ↗
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Divider />

      {/* ── WAKATIME ── */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-4">
            <Label>005 / Coding hours</Label>
            <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-3xl font-bold">Jam Terbang<br />Coding</h2>
              <p className="text-sm leading-relaxed text-muted">
                Auto-tracked oleh WakaTime dari VSCode — setiap file yang dibuka tercatat otomatis.
              </p>
            </div>
            <WakaStats />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── CONTACT ── */}
      <section id="contact" className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-4">
            <Label>006 / Contact</Label>
            <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold leading-tight">Let&apos;s work<br />together.</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Butuh video editor, graphic designer, atau kolaborasi project kreatif?
              </p>
            </div>
            <div>
              {[
                { label: "Email",     value: about?.email ?? "sandyfauzia09@gmail.com", href: `mailto:${about?.email ?? "sandyfauzia09@gmail.com"}` },
                { label: "Instagram", value: `@${socials.instagram ?? "sandzh_"}`,      href: `https://instagram.com/${socials.instagram ?? "sandzh_"}` },
                { label: "GitHub",    value: socials.github ?? "SandzhNine",             href: `https://github.com/${socials.github ?? "SandzhNine"}` },
                { label: "WhatsApp",  value: socials.whatsapp ?? "+62 812-9571-0325",    href: `http://wa.me/${socials.whatsapp ?? "+6281295710325"}` },
              ].map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                  className="group flex items-center justify-between py-5 transition hover:opacity-70"
                  style={{ borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <Label>{c.label}</Label>
                    <p className="mt-0.5 font-semibold">{c.value}</p>
                  </div>
                  <span className="text-muted transition group-hover:translate-x-1">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-8 md:px-12" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Label>© {new Date().getFullYear()} Sandy Fauzi Amrulloh</Label>
          <div className="flex items-center gap-6">
            <a href="/admin" className="font-mono text-[10px] transition hover:opacity-50" style={{ color: "var(--muted)", opacity: 0.4 }}>admin</a>
            <Label>Next.js · Supabase</Label>
          </div>
        </div>
      </footer>
    </main>
  );
}