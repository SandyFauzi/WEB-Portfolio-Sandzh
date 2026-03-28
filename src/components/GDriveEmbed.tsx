"use client";

import { useState } from "react";

function getDriveId(url: string): string | null {
  const patterns = [
    /drive\.google\.com\/file\/d\/([^/]+)/,
    /drive\.google\.com\/open\?id=([^&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function GDriveEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const fileId = getDriveId(url);
  if (!fileId) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-t-xl bg-black" style={{ aspectRatio: "16/9" }}>
      {playing ? (
        <iframe
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          title={title}
          allow="autoplay"
          className="h-full w-full border-0"
        />
      ) : (
        <button onClick={() => setPlaying(true)} className="group relative h-full w-full flex items-center justify-center"
          style={{ background: "#0a0a0a" }}>

          {/* CRT scanlines */}
          <div className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.08) 50%)",
              backgroundSize: "100% 4px",
            }} />

          {/* IBM terminal play button */}
          <div className="relative opacity-60 transition-all duration-200 group-hover:opacity-100"
            style={{ fontFamily: "monospace" }}>
            <div className="px-5 py-4"
              style={{
                background: "rgba(0,0,0,0.95)",
                border: "1px solid rgba(255,255,255,0.4)",
              }}>
              <div className="mb-3 flex items-center justify-between gap-8"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: "6px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", letterSpacing: "0.15em" }}>GDRIVE.EXE</span>
                <div className="flex gap-1.5">
                  {["─","□","✕"].map((c) => (
                    <span key={c} style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px" }}>{c}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div style={{ color: "#f0f0f0", fontSize: "clamp(18px,4vw,28px)", textShadow: "0 0 8px rgba(255,255,255,0.6)" }}>▶</div>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", letterSpacing: "0.2em" }}>DRIVE VIDEO</span>
              </div>
              <div className="mt-2 flex items-center gap-1"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "6px" }}>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px" }}>C:\&gt;</span>
                <span className="cursor" style={{ color: "rgba(255,255,255,0.6)", fontSize: "8px" }}>_</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 left-2">
            <span style={{
              background: "rgba(0,0,0,0.7)", color: "rgba(255,255,255,0.6)",
              fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.1em",
              padding: "2px 6px", border: "1px solid rgba(255,255,255,0.15)",
            }}>GDrive</span>
          </div>
        </button>
      )}
    </div>
  );
}
