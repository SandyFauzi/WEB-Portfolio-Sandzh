"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase-client";

type MediaFile = {
  name: string;
  id: string;
  updated_at: string;
  metadata: { size: number; mimetype: string };
};

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function MediaPage() {
  const supabase  = createClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const [files, setFiles]       = useState<MediaFile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [copied, setCopied]       = useState<string | null>(null);
  const [folder, setFolder]       = useState("thumbnails");

  const FOLDERS = ["thumbnails", "avatars", "misc"];

  async function load() {
    setLoading(true);
    const { data } = await supabase.storage.from("portfolio-media").list(folder, {
      sortBy: { column: "updated_at", order: "desc" },
    });
    setFiles((data as MediaFile[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [folder]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (!selectedFiles.length) return;

    setUploading(true);
    setProgress(0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const path = `${folder}/${Date.now()}-${file.name}`;
      await supabase.storage.from("portfolio-media").upload(path, file, { upsert: true });
      setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
    }

    setUploading(false);
    setProgress(0);
    if (fileInput.current) fileInput.current.value = "";
    load();
  }

  async function deleteFile(name: string) {
    if (!confirm(`Hapus file "${name}"?`)) return;
    await supabase.storage.from("portfolio-media").remove([`${folder}/${name}`]);
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  function copyUrl(name: string) {
    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(`${folder}/${name}`);
    navigator.clipboard.writeText(data.publicUrl);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  }

  function getPublicUrl(name: string) {
    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(`${folder}/${name}`);
    return data.publicUrl;
  }

  const isImage = (name: string) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(name);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Manage</p>
            <h1 className="mt-1 text-3xl font-bold">Media Library</h1>
          </div>
          <button onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition hover:opacity-80 disabled:opacity-40"
            style={{ background: "var(--text)", color: "var(--bg)" }}>
            {uploading ? `Uploading ${progress}%` : "↑ Upload"}
          </button>
          <input ref={fileInput} type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="hidden" />
        </div>

        {/* Folder tabs */}
        <div className="mb-6 flex gap-2">
          {FOLDERS.map((f) => (
            <button key={f} onClick={() => setFolder(f)}
              className="rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition"
              style={{
                background: folder === f ? "var(--bg-3)" : "transparent",
                border: "1px solid " + (folder === f ? "var(--border-hover)" : "var(--border)"),
                color: folder === f ? "var(--text)" : "var(--muted)",
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="mb-4 overflow-hidden rounded-full" style={{ background: "var(--bg-3)", height: "3px" }}>
            <div className="h-full transition-all" style={{ width: `${progress}%`, background: "var(--text)" }} />
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <p className="py-12 text-center font-mono text-sm" style={{ color: "var(--muted)" }}>Memuat...</p>
        ) : files.length === 0 ? (
          <div className="py-16 text-center" style={{ border: "2px dashed var(--border)", borderRadius: "16px" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Folder kosong</p>
            <button onClick={() => fileInput.current?.click()} className="mt-2 text-xs underline underline-offset-4 hover:opacity-70"
              style={{ color: "var(--muted)" }}>
              Upload file pertama →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file) => (
              <div key={file.id ?? file.name} className="group relative overflow-hidden rounded-xl"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
                {/* Preview */}
                <div className="aspect-square w-full overflow-hidden" style={{ background: "var(--bg-3)" }}>
                  {isImage(file.name) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getPublicUrl(file.name)} alt={file.name}
                      className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-mono text-2xl" style={{ color: "var(--muted)" }}>◻</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-2">
                  <p className="truncate font-mono text-[10px]" style={{ color: "var(--muted)" }}>{file.name}</p>
                  {file.metadata?.size && (
                    <p className="font-mono text-[9px]" style={{ color: "var(--muted)", opacity: 0.5 }}>
                      {formatSize(file.metadata.size)}
                    </p>
                  )}
                </div>

                {/* Hover actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <button onClick={() => copyUrl(file.name)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                    style={{ background: copied === file.name ? "#4ade80" : "var(--text)", color: copied === file.name ? "#000" : "var(--bg)" }}>
                    {copied === file.name ? "✓ Copied" : "Copy URL"}
                  </button>
                  <button onClick={() => deleteFile(file.name)}
                    className="rounded-lg px-3 py-1.5 text-xs transition hover:opacity-80"
                    style={{ background: "rgba(239,68,68,0.8)", color: "#fff" }}>
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
