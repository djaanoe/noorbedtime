# NoorBedtime — Panduan Langkah demi Langkah (Super Detail)

Panduan ini ditulis seolah-olah kamu belum pernah ngoding sama sekali.
Setiap langkah diberi label:

- **KAMU** = Kamu lakukan sendiri di browser / laptop
- **SURUH AI** = Kamu copy-paste perintah ke Cowork atau Claude Code, biar AI yang kerjakan
- **OTOMATIS** = Script jalan sendiri, kamu tinggal tunggu

---

## FASE 0: Persiapan Awal (1-2 jam)

### Langkah 0.1 — Install Node.js **[KAMU]**

Node.js itu seperti "mesin" yang menjalankan aplikasi web. Kamu perlu install ini di laptop.

1. Buka browser, pergi ke: **https://nodejs.org**
2. Klik tombol hijau besar yang bertuliskan **"LTS"** (versi stabil)
3. File akan ter-download. Double-click file tersebut.
4. Ikuti wizard instalasi — klik Next, Next, Next, Install, Finish.
5. Untuk cek apakah sudah terinstall:
   - Di **Mac**: buka aplikasi **Terminal** (cari "Terminal" di Spotlight/Cmd+Space)
   - Di **Windows**: buka **Command Prompt** (cari "cmd" di Start Menu)
   - Ketik: `node --version` lalu tekan Enter
   - Kalau muncul angka seperti `v20.x.x`, berarti sudah berhasil!

### Langkah 0.2 — Install VS Code **[KAMU]**

VS Code itu "editor" tempat kamu melihat dan mengedit kode. Kamu tidak perlu menulis kode — tapi perlu editor untuk melihat file-file yang AI buat.

1. Buka: **https://code.visualstudio.com**
2. Download dan install (sama seperti install app biasa)
3. Buka VS Code setelah install

### Langkah 0.3 — Install Claude Code **[KAMU]**

Claude Code itu AI assistant yang jalan di Terminal. Dia yang akan "ngoding" untuk kamu.

1. Buka Terminal (Mac) atau Command Prompt (Windows)
2. Ketik perintah ini lalu Enter:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
3. Tunggu sampai selesai (mungkin 1-2 menit)
4. Ketik `claude` lalu Enter — kalau muncul prompt Claude Code, berhasil!
5. Saat pertama kali, dia akan minta kamu login ke akun Anthropic kamu

### Langkah 0.4 — Buat Akun GitHub **[KAMU]**

GitHub itu "tempat penyimpanan kode" di internet. Ini penting supaya:
- Kode kamu tersimpan aman di cloud
- Cloudflare Pages (hosting) bisa ambil kode dari sini untuk di-deploy

1. Buka: **https://github.com**
2. Klik **Sign Up**
3. Isi email, password, username (misal: `noorbedtime` atau `januprasetya`)
4. Verifikasi email
5. Selesai! Kamu sekarang punya akun GitHub.

### Langkah 0.5 — Buat Akun-Akun yang Diperlukan **[KAMU]**

Buka browser dan daftar di semua ini (semuanya gratis untuk mulai):

| Layanan | URL | Untuk apa | Perlu kartu kredit? |
|---------|-----|-----------|---------------------|
| **Cloudflare** | https://dash.cloudflare.com | Hosting website (gratis, boleh commercial!) | Tidak |
| **Supabase** | https://supabase.com | Database + login user | Tidak |
| **Lemon Squeezy** | https://lemonsqueezy.com | Terima pembayaran (credit packs + subscription) | Tidak |
| **OpenAI** | https://platform.openai.com | Generate cerita + ilustrasi | Ya (top up $5) |
| **Namecheap** | https://namecheap.com | Beli domain | Ya |

**Tips saat daftar:**
- Untuk Cloudflare: pilih "Sign up" dengan email, lalu connect GitHub di halaman Pages
- Untuk OpenAI: setelah daftar, pergi ke **API Keys** → Create new secret key → SIMPAN key ini baik-baik! (mulai dengan `sk-...`)
- Untuk Lemon Squeezy: setelah daftar, pergi ke Settings → API → Copy API key (tidak perlu kartu kredit untuk testing)

### Langkah 0.6 — Beli Domain **[KAMU]**

1. Buka **https://namecheap.com**
2. Di kotak search, ketik: `noorbedtime.com`
3. Kalau tersedia, klik **Add to Cart** → **Checkout**
4. Bayar (~$9-12/tahun)
5. Kalau `noorbedtime.com` sudah diambil orang, coba:
   - `noorbedtime.app`
   - `noorbedtime.io`
   - `getnoor.com`
   - `bedtimestories.io`

---

## FASE 1: Generate 50 Cerita (30 menit kerja kamu, sisanya otomatis)

### Langkah 1.1 — Buka folder project di Terminal **[KAMU]**

1. Buka Terminal (Mac) atau Command Prompt (Windows)
2. Navigasi ke folder project. Ketik:
   ```
   cd "/path/to/Moslem Kids Stories"
   ```
   (Ganti `/path/to/` dengan lokasi folder yang sebenarnya di laptop kamu)

   **Cara mudah di Mac:** ketik `cd ` (dengan spasi di belakang), lalu DRAG folder dari Finder ke Terminal. Path otomatis terisi!

### Langkah 1.2 — Install Python packages **[KAMU]**

Di Terminal yang sama, ketik:
```
pip install openai anthropic
```
Kalau error, coba:
```
pip3 install openai anthropic
```
Tunggu sampai selesai.

### Langkah 1.3 — Set API Key **[KAMU]**

Di Terminal yang sama, ketik (ganti `sk-XXXXX` dengan API key OpenAI kamu yang asli):

**Mac:**
```
export OPENAI_API_KEY="sk-XXXXX"
```

**Windows:**
```
set OPENAI_API_KEY=sk-XXXXX
```

### Langkah 1.4 — Test dulu dengan 1 cerita **[OTOMATIS]**

Di Terminal:
```
cd scripts
python generate-stories-batch.py --id 4 --dry-run
```
Ini akan menampilkan estimasi biaya tanpa benar-benar generate. Kalau oke:
```
python generate-stories-batch.py --id 4
```
Ketik `y` lalu Enter saat ditanya konfirmasi. Tunggu ~10 detik. Cek hasilnya di folder `stories/`.

### Langkah 1.5 — Generate semua 50 cerita **[OTOMATIS]**

Kalau test berhasil:
```
python generate-stories-batch.py
```
Ketik `y` lalu Enter. **Tunggu ~20-30 menit.** Script akan generate semua cerita satu per satu dan menampilkan progress. Estimasi biaya: ~$2.50.

Kalau ada yang gagal, kamu bisa jalankan ulang — script otomatis skip cerita yang sudah berhasil.

### Langkah 1.6 — Generate ilustrasi (test 1 dulu) **[OTOMATIS]**

```
python generate-single-story.py "../stories/the-little-ants-big-thank-you.json" 1
```
Tunggu ~15 detik. Buka folder `images/` dan lihat hasilnya. Suka dengan stylenya?

### Langkah 1.7 — Generate semua ilustrasi **[OTOMATIS]**

```
python generate-illustrations.py
```
Ketik `y` lalu Enter. **Ini memakan waktu lama (~2-4 jam)** karena ada rate limiting. Biarkan jalan di background, kamu bisa ngerjain hal lain.

Estimasi biaya: ~$35-40 (standard quality) atau ~$70-80 (HD quality).

---

## FASE 2: Deploy Landing Page (15 menit)

### Langkah 2.1 — Preview di browser dulu **[KAMU]**

1. Buka Finder (Mac) atau File Explorer (Windows)
2. Navigasi ke folder `Moslem Kids Stories/landing-page/`
3. Double-click file `index.html`
4. Browser akan terbuka dan menampilkan homepage NoorBedtime
5. Scroll ke bawah, cek semua section. Bagus? Lanjut!

### Langkah 2.2 — Upload ke GitHub **[SURUH AI]**

Buka **Claude Code** di Terminal (ketik `claude`), lalu katakan:

> "Tolong buatkan repository GitHub baru bernama 'noorbedtime' dan push semua file dari folder landing-page ke sana. GitHub username saya adalah [USERNAME_KAMU]."

Claude Code akan:
1. Membuat repo baru
2. Initialize git
3. Push semua file ke GitHub
4. Kasih kamu URL repo-nya

### Langkah 2.3 — Deploy ke Cloudflare Pages **[KAMU]**

1. Buka **https://dash.cloudflare.com** (kamu sudah login tadi)
2. Di sidebar kiri, klik **"Workers & Pages"**
3. Klik **"Create"** → pilih tab **"Pages"** → klik **"Connect to Git"**
4. Pilih **GitHub** → authorize Cloudflare untuk akses repo kamu
5. Pilih repository **"noorbedtime"** → klik **"Begin setup"**
6. Di halaman configure:
   - Project name: `noorbedtime`
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: (kosongkan untuk landing page HTML biasa)
   - Build output directory: `landing-page`
7. Klik **"Save and Deploy"**
8. Tunggu 1-2 menit...
9. SELESAI! Kamu akan mendapat URL seperti: `https://noorbedtime.pages.dev`
10. Klik URL tersebut — website kamu sudah LIVE di internet!

### Langkah 2.4 — Connect domain custom **[KAMU]**

**Opsi A: Transfer DNS ke Cloudflare (RECOMMENDED — gratis + lebih cepat)**
1. Di Cloudflare dashboard, klik **"Add a site"** → ketik `noorbedtime.com`
2. Pilih plan **Free** → klik **Continue**
3. Cloudflare akan kasih 2 nameserver, contoh:
   - `ada.ns.cloudflare.com`
   - `bob.ns.cloudflare.com`
4. Buka **Namecheap** → login → **Domain List** → klik **Manage**
5. Di bagian **Nameservers**, ganti dari "Namecheap BasicDNS" ke **"Custom DNS"**
6. Masukkan 2 nameserver dari Cloudflare → klik centang hijau
7. Tunggu 5-30 menit untuk propagasi
8. Kembali ke Cloudflare → project Pages `noorbedtime` → **Custom domains** → **Set up a custom domain**
9. Ketik `noorbedtime.com` → klik **Continue** → DNS record otomatis dibuat!
10. SSL/HTTPS juga otomatis aktif — tidak perlu setup apapun

**Opsi B: Pakai DNS Namecheap (tanpa transfer)**
1. Di Cloudflare Pages → project `noorbedtime` → **Custom domains** → **Set up a custom domain**
2. Ketik `noorbedtime.com` → Cloudflare akan kasih CNAME record
3. Buka Namecheap → **Advanced DNS** → tambah CNAME record sesuai instruksi
4. Tunggu propagasi DNS

---

## FASE 3: Build Aplikasi Penuh — Next.js (suruh AI semua!)

Ini bagian besar, tapi SEMUA dikerjakan oleh AI. Kamu tinggal menyuruh.

### Langkah 3.1 — Setup project Next.js **[SURUH AI]**

Buka **Claude Code** di Terminal. Copy-paste perintah ini:

> "Buatkan project Next.js 14 dengan App Router untuk NoorBedtime — aplikasi cerita tidur anak Muslim. Gunakan Tailwind CSS, Supabase untuk auth dan database, dan Lemon Squeezy untuk pembayaran. Folder project di [PATH_FOLDER_KAMU]/noorbedtime-app. Ini specnya:
>
> - Homepage: ambil dari file landing-page/index.html yang sudah ada dan konversi ke Next.js
> - Library page (/library): grid semua cerita dengan filter by age tier
> - Story page (/story/[slug]): halaman detail cerita dengan preview 2 halaman pertama
> - Read page (/read/[slug]): halaman baca cerita full (page by page dengan ilustrasi)
> - Auth (/auth): login & signup dengan Supabase Auth (email + Google)
> - Credits page (/credits): beli credit packs dan subscription via Lemon Squeezy
> - Account page (/account): profile dan subscription management
>
> Data cerita ada di folder stories/*.json (50 file JSON).
> Ilustrasi ada di folder images/{slug}/*.png.
>
> Database schema:
> - users: id, email, name, credits_balance, subscription_status, subscription_plan
> - stories: id, title, slug, age_tier, category, source_reference, reading_time_minutes, is_free, cover_image_url
> - story_pages: id, story_id, page_number, text_content, illustration_url
> - user_library: user_id, story_id, unlocked_at
> - credit_transactions: id, user_id, amount, type, lemon_squeezy_payment_id
>
> Dark mode default. Mobile responsive. SEO optimized dengan schema markup per halaman cerita."

Claude Code akan bekerja selama 10-30 menit membangun seluruh aplikasi. Kamu bisa lihat progressnya di Terminal.

### Langkah 3.2 — Setup Supabase **[KAMU + SURUH AI]**

**Bagian KAMU (di browser):**
1. Buka **https://supabase.com** → Login
2. Klik **"New Project"**
3. Isi:
   - Organization: (buat baru kalau belum ada)
   - Name: `noorbedtime`
   - Database Password: (buat password kuat, SIMPAN!)
   - Region: pilih yang terdekat dengan target user (misal US East atau EU West)
4. Klik **"Create new project"** → tunggu 2 menit
5. Setelah selesai, pergi ke **Settings** → **API**
6. COPY dua value ini:
   - **Project URL** (seperti `https://abcxyz.supabase.co`)
   - **anon public key** (string panjang mulai `eyJ...`)

**Bagian SURUH AI (di Claude Code):**

> "Setup Supabase untuk NoorBedtime. Project URL: [PASTE_URL]. Anon key: [PASTE_KEY]. Tolong:
> 1. Buat file .env.local dengan credentials ini
> 2. Buat semua database tables (users, stories, story_pages, user_library, credit_transactions)
> 3. Setup Supabase Auth dengan email + Google provider
> 4. Import semua 50 cerita dari folder stories/*.json ke database
> 5. Upload semua ilustrasi dari folder images/ ke Supabase Storage"

### Langkah 3.3 — Setup Lemon Squeezy **[KAMU + SURUH AI]**

**Bagian KAMU (di browser):**
1. Buka **https://lemonsqueezy.com** → Login
2. Buat store baru (atau gunakan yang sudah ada)
3. Pergi ke **Settings** → **API**
4. COPY:
   - **API key** (string panjang)

**Bagian SURUH AI (di Claude Code):**

> "Setup Lemon Squeezy untuk NoorBedtime. API key: [PASTE]. Buat:
> 1. Products: Credit Pack 5 ($1.99), Credit Pack 15 ($4.99), Credit Pack 40 ($9.99), Yearly Unlimited ($29.99/year)
> 2. Checkout overlay integration
> 3. Webhook handler untuk konfirmasi pembayaran
> 4. Tambahkan ke .env.local"

### Langkah 3.4 — Test di laptop **[SURUH AI]**

Di Claude Code:

> "Jalankan project NoorBedtime di localhost. Pastikan semua halaman berfungsi: homepage, library, story detail, reading page, login, dan checkout."

Claude Code akan menjalankan `npm run dev` dan kasih tahu URL-nya (biasanya `http://localhost:3000`). Buka di browser dan test semua halaman.

### Langkah 3.5 — Deploy app lengkap ke Cloudflare Pages **[SURUH AI]**

Di Claude Code:

> "Deploy project NoorBedtime ke Cloudflare Pages menggunakan OpenNext adapter untuk Next.js. Setup wrangler.toml, install @opennextjs/cloudflare, configure environment variables, lalu deploy. Kasih tahu saya langkah mana yang perlu saya lakukan manual di Cloudflare dashboard."

**Catatan penting:** Next.js di Cloudflare butuh adapter bernama **OpenNext** (`@opennextjs/cloudflare`). Claude Code akan handle instalasi dan konfigurasi ini. Yang kamu perlu lakukan manual hanya set environment variables (API keys) di Cloudflare dashboard → Pages → Settings → Environment variables.

---

## FASE 4: SEO Setup (30 menit)

### Langkah 4.1 — Google Search Console **[KAMU]**

1. Buka: **https://search.google.com/search-console**
2. Login dengan Google account kamu
3. Klik **"Add Property"**
4. Pilih **"URL prefix"**
5. Masukkan: `https://noorbedtime.com`
6. Verifikasi ownership (pilih metode DNS):
   - Google akan kasih TXT record
   - Tambahkan di Namecheap → Advanced DNS → Add TXT Record
   - Tunggu beberapa menit, lalu klik Verify

### Langkah 4.2 — Submit Sitemap **[KAMU]**

1. Di Google Search Console, klik **"Sitemaps"** di sidebar
2. Ketik: `sitemap.xml`
3. Klik **Submit**
4. Google akan mulai mengindex halaman-halaman kamu!

### Langkah 4.3 — Google Analytics **[KAMU]**

1. Buka: **https://analytics.google.com**
2. Create account → Property name: `NoorBedtime`
3. Setup data stream → Web → masukkan `noorbedtime.com`
4. Copy **Measurement ID** (mulai `G-XXXXX`)

**Lalu SURUH AI di Claude Code:**

> "Tambahkan Google Analytics ke NoorBedtime. Measurement ID: G-XXXXX. Pasang di semua halaman."

### Langkah 4.4 — Setup Google Ads (untuk SEM nanti) **[KAMU]**

1. Buka: **https://ads.google.com**
2. Buat akun baru
3. JANGAN buat campaign dulu — ini buat nanti setelah app live dan stabil
4. Nanti kalau siap, **suruh AI di Cowork:**

> "Gunakan skill /google-ads-expert untuk setup campaign NoorBedtime. Target keywords: Islamic bedtime stories for kids, Muslim children stories, Quran stories for kids. Budget: $10/day. Target: US, UK, Canada, Australia."

---

## FASE 5: Launch! (Hari H)

### Langkah 5.1 — Final check **[SURUH AI di Cowork]**

> "Review website NoorBedtime di https://noorbedtime.com. Cek semua halaman berfungsi, SEO meta tags benar, cerita bisa dibaca, pembayaran jalan, dan mobile responsive."

### Langkah 5.2 — Share di social media **[KAMU]**

Buat akun social media dulu:
1. Instagram: **@noorbedtime** → Post 3-5 gambar ilustrasi dari cerita
2. Twitter/X: **@noorbedtime** → Tweet peluncuran
3. Facebook Page: **NoorBedtime**

Copy-paste post ini (atau **suruh AI di Cowork** untuk bikin yang lebih bagus):

> 🌙 Introducing NoorBedtime — beautiful Islamic bedtime stories for Muslim kids aged 3-12.
>
> 50+ stories inspired by the Quran and Prophetic traditions. Scholar-validated. Stunning illustrations.
>
> Start reading free tonight → noorbedtime.com
>
> #MuslimKids #IslamicStories #BedtimeStories #MuslimParenting

### Langkah 5.3 — Monitor **[KAMU]**

Check setiap hari:
- Google Search Console: berapa halaman yang sudah di-index?
- Google Analytics: berapa pengunjung per hari?
- Supabase Dashboard: berapa user yang signup?
- Lemon Squeezy Dashboard: ada pembelian?

---

## Ringkasan: Mana yang KAMU, mana yang SURUH AI

| Fase | Aksi | Siapa |
|------|------|-------|
| 0.1 | Install Node.js | KAMU (download & install) |
| 0.2 | Install VS Code | KAMU (download & install) |
| 0.3 | Install Claude Code | KAMU (1 perintah di Terminal) |
| 0.4 | Buat akun GitHub | KAMU (di browser) |
| 0.5 | Buat akun Cloudflare, Supabase, Lemon Squeezy, OpenAI | KAMU (di browser) |
| 0.6 | Beli domain | KAMU (di Namecheap) |
| 1.1-1.3 | Setup Terminal & API key | KAMU (ketik di Terminal) |
| 1.4-1.5 | Generate 50 cerita | OTOMATIS (jalankan script, tunggu) |
| 1.6-1.7 | Generate ilustrasi | OTOMATIS (jalankan script, tunggu) |
| 2.1 | Preview homepage | KAMU (double-click file) |
| 2.2 | Upload ke GitHub | SURUH Claude Code |
| 2.3 | Deploy ke Cloudflare Pages | KAMU (klik-klik di browser) |
| 2.4 | Connect domain | KAMU (di Cloudflare + Namecheap) |
| 3.1 | Build app Next.js | SURUH Claude Code (1 perintah panjang) |
| 3.2 | Setup Supabase | KAMU buat project + SURUH Claude Code config |
| 3.3 | Setup Lemon Squeezy | KAMU ambil API keys + SURUH Claude Code integrasi |
| 3.4 | Test di laptop | SURUH Claude Code |
| 3.5 | Deploy app penuh ke Cloudflare Pages | SURUH Claude Code |
| 4.1-4.2 | Google Search Console | KAMU (di browser) |
| 4.3 | Google Analytics | KAMU buat akun + SURUH Claude Code pasang |
| 5.1 | Final check | SURUH AI di Cowork |
| 5.2 | Share social media | KAMU (di HP) |

---

## Kalau Bingung atau Error

**Error saat install?**
→ Suruh Claude Code: "Saya dapat error ini: [paste error message]. Tolong bantu fix."

**Website tidak muncul setelah deploy?**
→ Cek Cloudflare dashboard → Workers & Pages → project `noorbedtime` → Deployments → klik yang terbaru → lihat error log

**Cerita tidak ter-generate?**
→ Jalankan ulang script, dia akan skip yang sudah selesai

**Ingin ubah tampilan/warna/teks?**
→ Suruh Claude Code: "Ubah warna gold menjadi lebih terang di homepage NoorBedtime" (atau perubahan apapun)

**Ingin tambah cerita baru?**
→ Suruh AI di Cowork: "Tambahkan 5 cerita baru ke NoorBedtime tentang [tema]. Update story-catalog.json, generate cerita dan ilustrasinya."

---

## Estimasi Waktu Total

| Fase | Waktu |
|------|-------|
| Fase 0: Persiapan | 1-2 jam (sekali saja) |
| Fase 1: Generate konten | 30 menit kerja kamu + 1-2 jam script jalan |
| Fase 2: Deploy landing | 15-30 menit |
| Fase 3: Build app penuh | 1-2 jam (sebagian besar nunggu AI kerja) |
| Fase 4: SEO setup | 30 menit |
| Fase 5: Launch | 30 menit |
| **TOTAL** | **~1-2 hari kerja** |

## Estimasi Biaya Total

| Item | Biaya |
|------|-------|
| Domain (noorbedtime.com) | ~$12/tahun |
| Generate 50 cerita (GPT-4o) | ~$2.50 |
| Generate ~900 ilustrasi (gpt-image-1 medium) | ~$30.60 |
| Generate ~900 ilustrasi (gpt-image-1 high) | ~$150.30 |
| Hosting (Cloudflare Pages) | GRATIS |
| Database (Supabase) | GRATIS |
| Total hari pertama | **~$50-85** |
| Lemon Squeezy fee (per transaksi) | 5% + $0.50 |
