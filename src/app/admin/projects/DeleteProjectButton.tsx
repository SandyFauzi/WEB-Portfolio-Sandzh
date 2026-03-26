"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    if (!confirm(`Hapus project "${title}"?`)) return;
    setLoading(true);
    await supabase.from("projects").delete().eq("id", id);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg px-3 py-1.5 text-xs transition hover:opacity-70 disabled:opacity-40"
      style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
    >
      {loading ? "..." : "Hapus"}
    </button>
  );
}
