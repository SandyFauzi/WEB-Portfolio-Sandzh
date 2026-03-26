import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.WAKATIME_API_KEY;
  if (!key) return NextResponse.json({ total_seconds_last_year: 0, daily_average: 0, languages: [], best_day: null });

  try {
    const headers = {
      Authorization: `Basic ${Buffer.from(key).toString("base64")}`,
    };

    const [statsRes, bestDayRes] = await Promise.all([
      fetch("https://wakatime.com/api/v1/users/current/stats/last_year", { headers }),
      fetch("https://wakatime.com/api/v1/users/current/summaries?range=last_year", { headers }),
    ]);

    const stats = await statsRes.json();
    const summaries = await bestDayRes.json();

    const best = summaries.data?.reduce((a: any, b: any) =>
      a.grand_total.total_seconds > b.grand_total.total_seconds ? a : b, summaries.data?.[0]);

    return NextResponse.json({
      total_seconds_last_year: stats.data?.total_seconds ?? 0,
      daily_average: stats.data?.daily_average ?? 0,
      languages: stats.data?.languages?.map((l: any) => ({
        name: l.name,
        percent: l.percent,
        total_seconds: l.total_seconds,
      })) ?? [],
      best_day: best ? {
        date: best.range.date,
        total_seconds: best.grand_total.total_seconds,
      } : null,
    }, { headers: { "Cache-Control": "s-maxage=3600" } });

  } catch {
    return NextResponse.json({ total_seconds_last_year: 0, daily_average: 0, languages: [], best_day: null });
  }
}