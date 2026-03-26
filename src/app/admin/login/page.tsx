"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isMagicLink) {
        // --- LOGIN VIA MAGIC LINK ---
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });
        if (err) throw err;
        setMessage("Cek email lo! Magic link udah dikirim 🚀");
      } else {
        // --- LOGIN VIA PASSWORD ---
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        router.push("/admin");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal login, coba cek lagi datanya.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl p-8 shadow-xl transition-all" 
           style={{ background: "var(--bg-2)", border: "1px solid var(--border)" }}>
        
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {isMagicLink ? "Login cepat tanpa password" : "Login pakai password"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Input Email */}
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@domain.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition focus:border-white"
              style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text)" }}
            />
          </div>

          {/* Input Password (Hanya Muncul Jika Bukan Mode Magic Link) */}
          {!isMagicLink && (
            <div className="fade-up">
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition focus:border-white"
                style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
            </div>
          )}

          {/* Pesan Error / Sukses */}
          {error && (
            <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>
              {message}
            </p>
          )}

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-40"
            style={{ background: "var(--text)", color: "var(--bg)" }}
          >
            {loading ? "Memproses..." : (isMagicLink ? "Kirim Magic Link" : "Masuk ke Admin")}
          </button>
        </form>

        {/* Tombol Toggle Mode Login */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsMagicLink(!isMagicLink);
              setError("");
              setMessage("");
            }}
            className="text-xs transition hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            {isMagicLink ? "← Ganti pakai Password" : "Atau pakai Magic Link →"}
          </button>
        </div>

      </div>
    </div>
  );
}
