# Portfolio 2.0 — Sandy Fauzi

Personal portfolio dengan admin dashboard, media uploader, dan WakaTime coding stats.

**Stack**: Next.js 14 · Supabase · Tailwind CSS · Vercel

---

## Setup — Fase 1

Ikuti langkah ini **berurutan**.

---

### 1. Clone & install

```bash
git clone https://github.com/SandzhNine/portfolio-2.git
cd portfolio-2
npm install
```

---

### 2. Buat project Supabase

1. Buka [supabase.com](https://supabase.com) → **New project**
2. Isi nama project: `portfolio-2`, pilih region terdekat (Singapore)
3. Tunggu sampai project ready (~1 menit)

---

### 3. Jalankan SQL schema

1. Di Supabase dashboard → **SQL Editor** → **New query**
2. Copy seluruh isi file `supabase-schema.sql`
3. Paste dan klik **Run** (Ctrl+Enter)
4. Pastikan tidak ada error merah

---

### 4. Setup environment variables

```bash
cp .env.local.example .env.local
```

Buka `.env.local` dan isi:

| Variable | Cara dapat |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `WAKATIME_API_KEY` | [wakatime.com/api-key](https://wakatime.com/api-key) |
| `ADMIN_EMAIL` | Email kamu sendiri |

---

### 5. Setup Supabase Auth

1. Supabase → **Authentication** → **Providers**
2. Pastikan **Email** provider aktif
3. Supabase → **Authentication** → **URL Configuration**
4. Tambahkan ke **Redirect URLs**: `http://localhost:3000/**`

---

### 6. Install WakaTime di VSCode

1. Buka VSCode → Extensions (Ctrl+Shift+X)
2. Search `WakaTime` → Install
3. Tekan `F1` → ketik `WakaTime: API Key` → paste API key kamu
4. Done — setiap file yang kamu buka otomatis ter-track

---

### 7. Jalankan development server

```bash
npm run dev
```

Buka:
- **Portfolio**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin
- **WakaTime API**: http://localhost:3000/api/wakatime

---

### 8. Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Atau lewat GitHub:
1. Push repo ke GitHub
2. Buka [vercel.com](https://vercel.com) → Import project dari GitHub
3. Di **Environment Variables**, tambahkan semua isi `.env.local`
4. Klik **Deploy**

Setelah deploy, update Supabase redirect URL:
- Supabase → Auth → URL Configuration
- Tambahkan: `https://your-domain.vercel.app/**`

---

## Struktur project

```
src/
├── app/
│   ├── page.tsx              ← Portfolio publik
│   ├── layout.tsx            ← Root layout + font
│   ├── globals.css           ← Global styles
│   ├── admin/
│   │   ├── page.tsx          ← Dashboard admin
│   │   └── login/page.tsx    ← Login dengan magic link
│   └── api/
│       ├── auth/logout/      ← Logout endpoint
│       └── wakatime/         ← WakaTime data (cached)
├── lib/
│   ├── supabase-client.ts    ← Supabase untuk browser
│   └── supabase-server.ts    ← Supabase untuk server
├── types/
│   └── database.ts           ← TypeScript types
└── middleware.ts             ← Proteksi route /admin
```

---

## Roadmap

- [x] **Fase 1** — Fondasi: Next.js + Supabase + auth + deploy
- [ ] **Fase 2** — Admin CRUD: tambah/edit/hapus projects, upload media
- [ ] **Fase 3** — Public portfolio: halaman lengkap dengan animasi
- [ ] **Fase 4** — WakaTime: tampilkan coding stats di halaman publik
