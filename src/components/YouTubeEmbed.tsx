"use client";

import { useState } from "react";

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function YouTubeEmbed({
  url,
  title,
  thumbnail,
}: {
  url: string;
  title: string;
  thumbnail?: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  const [thumbErr, setThumbErr] = useState(false);
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const thumb = thumbnail
    ? thumbnail
    : thumbErr
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full overflow-hidden rounded-t-xl bg-black" style={{ aspectRatio: "16/9" }}>
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <button onClick={() => setPlaying(true)} className="group relative h-full w-full">
          {/* Thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={title}
            onError={() => { if (!thumbnail) setThumbErr(true); }}
            className="h-full w-full object-cover transition duration-500 group-hover:brightness-75"
          />

          {/* CRT scanline overlay */}
          <div className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.08) 50%)",
              backgroundSize: "100% 4px",
              zIndex: 1,
            }} />

          {/* IBM play button — muncul saat hover */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-all duration-200 group-hover:opacity-100"
            style={{ zIndex: 2 }}>

            {/* Terminal window */}
            <div className="relative px-5 py-4"
              style={{
                background: "rgba(0,0,0,0.92)",
                border: "1px solid rgba(255,255,255,0.5)",
                fontFamily: "monospace",
              }}>

              {/* Title bar */}
              <div className="mb-3 flex items-center justify-between gap-8"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "6px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", letterSpacing: "0.15em" }}>
                  VIDEO.EXE
                </span>
                <div className="flex gap-1.5">
                  {["─","□","✕"].map((c) => (
                    <span key={c} style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px" }}>{c}</span>
                  ))}
                </div>
              </div>

              {/* Play triangle — ASCII style */}
              <div className="flex flex-col items-center gap-2">
                <div style={{
                  color: "#f0f0f0",
                  fontSize: "clamp(18px, 4vw, 28px)",
                  lineHeight: 1,
                  textShadow: "0 0 8px rgba(255,255,255,0.6)",
                  letterSpacing: "-2px",
                }}>
                  ▶
                </div>
                <span style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "8px",
                  letterSpacing: "0.2em",
                }}>
                  [ENTER] TO PLAY
                </span>
              </div>

              {/* Blinking cursor */}
              <div className="mt-2 flex items-center gap-1"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "6px" }}>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px" }}>C:\&gt;</span>
                <span className="cursor" style={{ color: "rgba(255,255,255,0.6)", fontSize: "8px" }}>_</span>
              </div>
            </div>
          </div>

          {/* Badge bawah kiri */}
          <div className="absolute bottom-2 left-2 transition-opacity duration-200 group-hover:opacity-0"
            style={{ zIndex: 2 }}>
            <span style={{
              background: "rgba(0,0,0,0.7)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "monospace",
              fontSize: "9px",
              letterSpacing: "0.1em",
              padding: "2px 6px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              YT
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
