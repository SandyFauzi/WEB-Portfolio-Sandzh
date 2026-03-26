-- ============================================================
-- PORTFOLIO 2.0 — DATABASE SCHEMA
-- Jalankan di: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── ENUM ───────────────────────────────────────────────────────
create type project_category as enum (
  'video_editing',
  'graphic_design',
  '3d_vfx',
  'physics',
  'programming',
  'photography'
);

-- ─── TABLE: projects ────────────────────────────────────────────
create table projects (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text,
  category      project_category not null,
  tags          text[] default '{}',
  thumbnail_url text,
  media_urls    text[] default '{}',
  external_url  text,
  featured      boolean default false,
  sort_order    integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─── TABLE: skills ──────────────────────────────────────────────
create table skills (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  percentage integer not null check (percentage between 0 and 100),
  category   text not null,  -- 'creative', 'technical', 'science'
  sort_order integer default 0
);

-- ─── TABLE: about ───────────────────────────────────────────────
-- Single row — data tentang Sandy
create table about (
  id          uuid primary key default uuid_generate_v4(),
  full_name   text not null default 'Sandy Fauzi Amrulloh',
  tagline     text not null default 'Video Editor · Graphic Design · 3D VFX Artist',
  bio         text not null default '',
  email       text not null default '',
  phone       text,
  avatar_url  text,
  socials     jsonb default '{}',  -- { "instagram": "...", "github": "...", ... }
  updated_at  timestamptz default now()
);

-- ─── TABLE: coding_stats_cache ──────────────────────────────────
-- Cache data WakaTime supaya tidak hit API terus-terusan
create table coding_stats_cache (
  id          uuid primary key default uuid_generate_v4(),
  data        jsonb not null default '{}',
  fetched_at  timestamptz default now()
);

-- ─── AUTO-UPDATE updated_at TRIGGER ─────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

create trigger about_updated_at
  before update on about
  for each row execute function update_updated_at();

-- ─── ROW LEVEL SECURITY (RLS) ───────────────────────────────────
-- Public: bisa baca semua (untuk portfolio publik)
-- Admin: bisa write setelah login

alter table projects enable row level security;
alter table skills enable row level security;
alter table about enable row level security;
alter table coding_stats_cache enable row level security;

-- Read public
create policy "public read projects" on projects for select using (true);
create policy "public read skills" on skills for select using (true);
create policy "public read about" on about for select using (true);
create policy "public read coding stats" on coding_stats_cache for select using (true);

-- Write hanya untuk user yang sudah login (admin)
create policy "admin write projects" on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin write skills" on skills for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin write about" on about for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "admin write coding stats" on coding_stats_cache for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─── STORAGE BUCKETS ────────────────────────────────────────────
-- Jalankan ini SETELAH buat bucket manual di Storage dashboard
-- atau buat lewat SQL:

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict do nothing;

-- Policy: siapapun bisa lihat file (portfolio publik)
create policy "public read media" on storage.objects
  for select using (bucket_id = 'portfolio-media');

-- Hanya admin (authenticated) yang bisa upload/delete
create policy "admin write media" on storage.objects
  for all using (
    bucket_id = 'portfolio-media'
    and auth.role() = 'authenticated'
  );

-- ─── SEED DATA — bisa dihapus nanti ─────────────────────────────
insert into about (full_name, tagline, bio, email, socials)
values (
  'Sandy Fauzi Amrulloh',
  'Video Editor · Graphic Design · 3D VFX Artist',
  'Mahasiswa Fisika UNPAD yang juga freelance video editor dan graphic designer.',
  'sandyfauzia09@gmail.com',
  '{"instagram": "sandzh_", "github": "SandzhNine", "tiktok": "sandzh._"}'
);

insert into skills (name, percentage, category, sort_order) values
  ('Video Editing',           100, 'creative',  1),
  ('Graphic Design',           85, 'creative',  2),
  ('3D VFX',                   90, 'creative',  3),
  ('Videography & Photography',87, 'creative',  4),
  ('Electronic Engineering',   91, 'technical', 5),
  ('Programming',              80, 'technical', 6),
  ('Mathematics',              90, 'science',   7),
  ('Physics',                  90, 'science',   8);
