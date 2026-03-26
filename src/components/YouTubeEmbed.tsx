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

export default function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

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
          <img src={thumb} alt={title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-80" />
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-full transition group-hover:scale-110"
              style={{ background: "rgba(255,255,255,0.95)" }}>
              <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5" fill="#0c0c0c">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          {/* YT badge */}
          <div className="absolute bottom-2 left-2 rounded px-1.5 py-0.5 font-mono text-[9px] text-white"
            style={{ background: "rgba(0,0,0,0.6)" }}>
            YouTube
          </div>
        </button>
      )}
    </div>
  );
}
