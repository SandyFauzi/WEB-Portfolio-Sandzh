import { createAdminClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const CACHE_MINUTES = 60; // refresh setiap 1 jam

export async function GET() {
  const supabase = createAdminClient();

  // Cek cache dulu
  const { data: cache } = await supabase
    .from("coding_stats_cache")
    .select("*")
    .order("fetched_at", { ascending: false })
    .limit(1)
    .single();

  if (cache) {
    const age = (Date.now() - new Date(cache.fetched_at).getTime()) / 1000 / 60;
    if (age < CACHE_MINUTES) {
      return NextResponse.json(cache.data);
    }
  }

  // Fetch fresh dari WakaTime
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "WakaTime API key not set" }, { status: 500 });
  }

  const encoded = Buffer.from(apiKey).toString("base64");

  const [summaryRes, statsRes] = await Promise.all([
    fetch("https://wakatime.com/api/v1/users/current/summaries?range=last_30_days", {
      headers: { Authorization: `Basic ${encoded}` },
    }),
    fetch("https://wakatime.com/api/v1/users/current/stats/last_year", {
      headers: { Authorization: `Basic ${encoded}` },
    }),
  ]);

  if (!summaryRes.ok || !statsRes.ok) {
    return NextResponse.json({ error: "WakaTime fetch failed" }, { status: 502 });
  }

  const [summary, stats] = await Promise.all([summaryRes.json(), statsRes.json()]);

  const data = {
    total_seconds_last_year: stats.data?.total_seconds ?? 0,
    daily_average: stats.data?.daily_average ?? 0,
    languages: stats.data?.languages?.slice(0, 6) ?? [],
    editors: stats.data?.editors ?? [],
    best_day: stats.data?.best_day ?? null,
    days_minus_holidays: stats.data?.days_minus_holidays ?? 0,
    range: summary.range ?? {},
  };

  // Simpan ke cache
  await supabase.from("coding_stats_cache").insert({ data });

  return NextResponse.json(data);
}
