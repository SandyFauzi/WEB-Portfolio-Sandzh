# WEB Portfolio Sandzh 2.0

Portfolio pribadi dengan admin dashboard, dark/light theme toggle, dan WakaTime coding stats.

**Stack**: Next.js 14 · Supabase · Tailwind CSS · Vercel

---

## Fitur
- Dark / Light theme toggle
- Admin dashboard (protected login)
- Dynamic content dari Supabase
- WakaTime coding stats
- Media via YouTube & Google Drive
- Deploy otomatis via Vercel

---

## Struktur
```
src/
├── app/
│   ├── page.tsx           ← Portfolio publik
│   ├── layout.tsx         ← Root layout
│   ├── globals.css        ← Global styles + theme
│   ├── admin/             ← Admin dashboard
│   └── api/               ← API routes
├── components/
│   └── ThemeToggle.tsx    ← Dark/light toggle
├── lib/
│   ├── supabase-client.ts
│   └── supabase-server.ts
└── types/
    └── database.ts
```

## Deploy
Live: https://web-portfolio-sandzh.vercel.app
