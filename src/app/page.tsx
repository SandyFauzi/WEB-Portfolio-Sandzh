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

const DEFAULT_SOFTWARE = [
  { name: "Premiere Pro", abbr: "Pr", color: "#9999FF", bg: "#0a0a1e" },
  { name: "After Effects", abbr: "Ae", color: "#9999FF", bg: "#0d0a1a" },
  { name: "Illustrator",   abbr: "Ai", color: "#FF9A00", bg: "#1a0f00" },
  { name: "Photoshop",     abbr: "Ps", color: "#31A8FF", bg: "#001219" },
  { name: "Blender",       abbr: "Bl", color: "#E87D0D", bg: "#1a0e00" },
  { name: "VS Code",       abbr: "VS", color: "#007ACC", bg: "#001525" },
  { name: "Python",        abbr: "Py", color: "#FFD43B", bg: "#1a1500" },
  { name: "Arduino",       abbr: "Ar", color: "#00979D", bg: "#001a1b" },
];

const DEFAULT_EXP = [
  { year: "2023 - 2024", title: "Ketua Divisi PDD", org: "BEM Kema UNPAD", link_label: "Lihat Aftermovie", link: "#" },
  { year: "2022", title: "Staff Dekorasi & Dokumentasi", org: "Kepanitiaan Fakultas", link_label: "Poster Project", link: "#" },
];

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default async function HomePage() {
  const supabase = createClient();
  const [aboutRes, projectsRes, skillsRes] = await Promise.all([
    supabase.from("about").select("*").single(),
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("skills").select("*").order("sort_order", { ascending: true }),
  ]);

  const about: any    = aboutRes.data || {};
  const projects: any = projectsRes.data || [];
  const skills: any   = skillsRes.data || [];

  const name    = about?.full_name ?? "Sandy Fauzi Amrulloh";
  const tagline = about?.tagline   ?? "Video Editor · Graphic Design · 3D VFX Artist";
  const bio     = about?.bio       ?? "Freelance video editor dan graphic designer dengan background Fisika UNPAD dan Teknik Elektronika.";
  
  const socials = (about?.socials ?? {}) as any;

  const infoArray = (Array.isArray(socials.info) && socials.info.length > 0) ? socials.info : [
    { label: "Universitas", value: "UNPAD" },
    { label: "Jurusan",     value: "Fisika" },
    { label: "Fokus",       value: "Creative Tech" },
    { label: "Status",      value: "Freelance" },
  ];

  const eduArray = (Array.isArray(socials.education) && socials.education.length > 0) ? socials.education : [
    { year: "2024 –",      place: "Universitas Padjadjaran", note: "S1 Fisika" },
    { year: "2021 – 24",   place: "SMKN 1 Sumedang",        note: "Teknik Elektronika" },
    { year: "2018 – 21",   place: "SMPN 1 Sumedang",        note: "" },
    { year: "2012 – 18",   place: "SD Sukamaju",             note: "" },
  ];

  const software = (Array.isArray(socials.tools) && socials.tools.length > 0) ? socials.tools : DEFAULT_SOFTWARE;
  
  const expArray = (Array.isArray(socials.experience) && socials.experience.length > 0) ? socials.experience : DEFAULT_EXP;

  const grouped = projects.reduce((acc: Record<string, any[]>, p: any) => {
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
          
          <div className="h-6 w-28 md:h-7 md:w-32 opacity-90 transition-opacity hover:opacity-100 origin-left scale-[3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/Sandzh Black.png" 
              alt="SANDZH" 
              className="h-full w-full object-contain object-left theme-logo" 
            />
          </div>

          <div className="flex items-center gap-5">
            <ThemeToggle />
            {["about","experience","skills","work","contact"].map((s) => (
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
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(var(--text) 1px,transparent 1px),linear-gradient(90deg,var(--text) 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }} />

        <div className="relative mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-2">
            <div>
              <div className="fade-up mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--text)", opacity: 0.5 }} />
                <Label>Available for freelance</Label>
              </div>
              <h1 className="fade-up-2 mb-5 text-[clamp(2.8rem,9vw,7rem)] font-extrabold leading-[0.88] tracking-tight">
                {name.split(" ").map((w: string, i: number) => <span key={i} className="block">{w}</span>)}
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

            <div className="fade-up-2 flex justify-center md:justify-end">
              <div className="relative">
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
      
          {/* Grid 4 kolom desktop, 2 kolom HP */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {software.map((s: any, i: number) => (
              <div key={i}
                className="group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition hover:scale-[1.02]"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
      
                {/* Icon */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl text-[12px] font-bold"
                  style={{ background: s.icon_url ? "transparent" : s.bg, color: s.color }}>
                  {s.icon_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.icon_url} alt={s.name} className="h-full w-full object-contain" />
                  ) : (
                    s.abbr
                  )}
                </div>
      
                {/* Nama */}
                <span className="truncate text-sm font-medium">{s.name}</span>
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
                {infoArray.map((item: any, idx: number) => (
                  <div key={idx} className="rounded-xl p-4 border-dim bg-card">
                    <Label>{item.label}</Label>
                    <p className="mt-1 font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Pendidikan</Label>
              <div className="mt-5">
                {eduArray.map((e: any, i: number) => (
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

      {/* ── EXPERIENCE & ORGANISATIONS (BARU) ── */}
      <section id="experience" className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-4">
            <Label>003 / Experience</Label>
            <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {expArray.map((exp: any, i: number) => (
              <div key={i} className="group relative flex flex-col justify-between rounded-2xl p-6 transition-all hover:bg-[var(--bg-2)]" style={{ border: "1px solid var(--border)" }}>
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <Label>{exp.year}</Label>
                    <span className="font-mono text-[10px] text-muted opacity-30 group-hover:opacity-100 transition-opacity">SYS.LOG</span>
                  </div>
                  <h3 className="mb-1 text-lg font-bold leading-tight">{exp.title}</h3>
                  <p className="text-sm text-muted mb-6">{exp.org}</p>
                </div>
                
                {exp.link && (
                  <div>
                    <a href={exp.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest transition hover:opacity-70" style={{ borderBottom: "1px dashed var(--border)" }}>
                      <span className="text-muted">[{exp.link_label || 'View Project'}]</span> ↗
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── SKILLS ── */}
      <section id="skills" className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-4">
            <Label>004 / Skills</Label>
            <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          </div>
          <div>
            {skills.map((s: any, i: number) => (
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
            <Label>005 / Work</Label>
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
              {Object.entries(grouped).map(([cat, items]: [string, any[]]) => (
                <div key={cat}>
                  <div className="mb-5 flex items-center gap-3">
                    <Label>{CAT_LABEL[cat] ?? cat}</Label>
                    <span className="font-mono text-[10px] text-muted opacity-50">({items.length})</span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((p) => {
                      const hasYT = !!p.external_url && isYouTubeUrl(p.external_url);
                      const hasDrive = !!p.gdrive_url;
                      return (
                        <div key={p.id} className="group overflow-hidden rounded-2xl bg-card border-dim transition hover:border-dim-hover">
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

                          <div className="p-4">
                            <h3 className="font-bold leading-tight">{p.title}</h3>
                            {p.description && (
                              <p className="mt-1 text-sm text-muted line-clamp-2">{p.description}</p>
                            )}
                            {p.tags?.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {p.tags.map((tag: string) => (
                                  <span key={tag} className="rounded-lg px-2 py-0.5 font-mono text-[10px] text-muted"
                                    style={{ background: "var(--bg-2)" }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {(hasDrive || (p.external_url && !hasYT)) && (
                              <div className="mt-4 flex gap-2">
                                {hasDrive && (
                                  <a href={p.gdrive_url} target="_blank" rel="noreferrer"
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
            <Label>006 / Coding hours</Label>
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
            <Label>007 / Contact</Label>
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
                { 
                  label: "Email",     
                  value: about?.email ?? "sandyfauzia09@gmail.com", 
                  href: `mailto:${about?.email ?? "sandyfauzia09@gmail.com"}`,
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                },
                { 
                  label: "Instagram", 
                  value: `@${String(socials.instagram ?? "sandzh_")}`,      
                  href: `https://instagram.com/${String(socials.instagram ?? "sandzh_")}`,
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                },
                { 
                  label: "GitHub",    
                  value: String(socials.github ?? "SandzhNine"),             
                  href: `https://github.com/${String(socials.github ?? "SandzhNine")}`,
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0 .1-3.8s-1.2-.4-3.9 1.7a13.9 13.9 0 0 0-7 0C3.9 2.7 2.7 3.1 2.7 3.1a5.4 5.4 0 0 0 .1 3.8A5.4 5.4 0 0 0 1 10.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/><path d="M9 18c-4.5 1.2-5-2.5-7-3"/></svg>
                },
                { 
                  label: "WhatsApp",  
                  value: String(socials.whatsapp ?? "+62 812-9571-0325"),    
                  href: `http://wa.me/${String(socials.whatsapp ?? "+6281295710325").replace(/[^0-9+]/g, '')}`,
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                },
              ].map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                  className="group flex items-center justify-between py-4 transition hover:opacity-100 opacity-80"
                  style={{ borderBottom: "1px solid var(--border)" }}>
                  
                  <div className="flex items-center gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                      style={{ border: "1px solid var(--border)", background: "var(--bg-2)" }}>
                      <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                        {c.icon}
                      </div>
                    </div>
                    
                    <div>
                      <Label>{c.label}</Label>
                      <p className="mt-0.5 font-semibold transition-transform group-hover:translate-x-1">{c.value}</p>
                    </div>
                  </div>
                  
                  <span className="text-muted transition-all group-hover:translate-x-2 group-hover:opacity-100 opacity-40 font-mono">↗</span>
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
