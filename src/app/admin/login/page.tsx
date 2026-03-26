"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-xs text-white/30">ADMIN</p>
          <h1 className="mt-1 text-3xl font-bold">Masuk</h1>
          <p className="mt-1 text-sm text-white/40">
            Magic link akan dikirim ke email kamu.
          </p>
        </div>

        {sent ? (
          <div className="glass rounded-2xl p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <span className="text-2xl">📬</span>
            </div>
            <p className="font-medium">Cek email kamu!</p>
            <p className="mt-1 text-sm text-white/40">
              Link login sudah dikirim ke{" "}
              <span className="text-indigo-400">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block font-mono text-xs text-white/40">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="kamu@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim magic link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <a
            href="/"
            className="font-mono text-xs text-white/20 transition hover:text-white/40"
          >
            ← Kembali ke portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
