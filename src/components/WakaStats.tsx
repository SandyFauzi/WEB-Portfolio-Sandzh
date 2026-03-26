"use client";

import { useEffect, useState } from "react";

type Lang = { name: string; percent: number; total_seconds: number };
type WakaData = {
  total_seconds_last_year: number;
  daily_average: number;
  languages: Lang[];
  best_day: { date: string; total_seconds: number } | null;
};

function fmtHours(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h.toLocaleString()}h ${m}m`;
}

export default function WakaStats() {
  const [data, setData]     = useState<WakaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wakatime")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-2">
      {[1,2,3].map((i) => (
        <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: "var(--bg-2)" }} />
      ))}
    </div>
  );

  if (!data || data.total_seconds_last_year === 0) return (
    <p className="text-sm text-muted">WakaTime belum dikonfigurasi.</p>
  );

  const topLangs = data.languages.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Big stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Setahun terakhir", value: fmtHours(data.total_seconds_last_year) },
          { label: "Rata-rata/hari",   value: fmtHours(data.daily_average)           },
          { label: "Best day",         value: data.best_day ? fmtHours(data.best_day.total_seconds) : "—" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 border-dim bg-card">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">{s.label}</p>
            <p className="mt-1 text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Language bars */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Top languages</p>
        <div className="space-y-2.5">
          {topLangs.map((l) => (
            <div key={l.name} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-sm font-medium">{l.name}</span>
              <div className="relative h-1.5 flex-1 rounded-full" style={{ background: "var(--bg-3)" }}>
                <div className="absolute inset-y-0 left-0 rounded-full transition-all"
                  style={{ width: `${l.percent}%`, background: "var(--text)" }} />
              </div>
              <span className="w-10 shrink-0 text-right font-mono text-xs text-muted">
                {l.percent.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
