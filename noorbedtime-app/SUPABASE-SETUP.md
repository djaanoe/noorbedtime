# NoorBedtime — Supabase Setup Guide

## Step 1 — Tables (SQL Editor)

1. Buka https://supabase.com/dashboard/project/unlaqymnoapznqxeqgom/sql/new
2. Copy-paste isi file: `supabase/migrations/001_initial_schema.sql`
3. Klik **Run**

## Step 2 — Import Story Data (SQL Editor)

1. Buka SQL Editor yang sama
2. Copy-paste isi file: `scripts/seed_stories.sql`
3. Klik **Run**
   - 50 stories + 829 pages akan di-insert

## Step 3 — Storage Bucket

1. Buka https://supabase.com/dashboard/project/unlaqymnoapznqxeqgom/storage/buckets
2. Klik **New bucket**
3. Name: `illustrations`
4. Public bucket: **ON**
5. Klik **Save**

## Step 4 — Upload Ilustrasi

Butuh Service Role Key:
1. Buka https://supabase.com/dashboard/project/unlaqymnoapznqxeqgom/settings/api
2. Copy **service_role** key
3. Tambahkan ke `.env.local`:
   ```
   SUPABASE_SERVICE_KEY=your_service_role_key
   ```
4. Jalankan:
   ```bash
   cd noorbedtime-app
   node scripts/upload-illustrations.mjs
   ```
   Upload 879 file WebP (~110MB). Butuh ~5-10 menit.

## Step 5 — Google OAuth

1. Buka https://console.cloud.google.com → Create OAuth credentials
2. Authorized redirect URI:
   ```
   https://unlaqymnoapznqxeqgom.supabase.co/auth/v1/callback
   ```
3. Buka Supabase Dashboard > Authentication > Providers > Google
4. Masukkan Client ID dan Client Secret
5. Enable Google provider

## Step 6 — Auth Email Settings

1. Supabase Dashboard > Authentication > Email Templates
2. Pastikan "Confirm email" diaktifkan
3. Site URL: `http://localhost:3000` (dev) atau domain production

## Verifikasi

Setelah semua langkah selesai, test:
```bash
cd noorbedtime-app
npm run dev
```
Buka http://localhost:3000 — semua story harus muncul dengan ilustrasi.
