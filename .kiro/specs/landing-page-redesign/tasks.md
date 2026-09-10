# Implementation Plan: Landing Page Redesign

## Overview

Redesign halaman pemasaran Antosan di dalam satu berkas `src/LandingPage.jsx` (subkomponen per-bagian) plus gaya di `src/landing.css`, mengikuti urutan bagian dan model data pada `design.md`. Pekerjaan berjalan inkremental: pertama menambahkan data konten statis di scope modul, lalu membangun/merefresh komponen bagian dalam urutan baru, memindahkan `QueueDemo` ke bagian `#simulasi` tanpa mengubah perilaku/kontrak, menambah gaya `lp-*`, merapikan aksesibilitas, menyelaraskan meta di `index.html`, dan menutup dengan pengujian ringan + checkpoint build/test.

Kontrak yang wajib dijaga: ekspor `computeDemoState`, `faqs`, `demoReleaseInstruction`, `demoEmptyQueuePrompt` (tanda tangan & makna sama); string demo persis; struktur `faqs` sebagai `Array<[string, string]>`; lima berkas tes (`setup.test.js`, `bugCondition.test.js`, `preservation.test.js`, `phrasing.test.js`, `demoModel.test.js`) tetap hijau. Konstanta `trafficLevels`, `capacity`, dan `demo` string tidak boleh berubah.

Catatan lingkungan tes: environment Vitest adalah `node` (lihat `vite.config.js`) dan `@testing-library/react`/jsdom TIDAK tersedia. Tes konten baru karena itu memvalidasi struktur data statis (`scenarios`, `plays`, `trustQuote`, `trustStats`, `integrations`, `navLinks`) yang di-ekspor sebagai ekspor internal dari `LandingPage.jsx` - sama seperti `computeDemoState`/`faqs` yang sudah diekspor - tanpa merender DOM dan tanpa menambah dependensi berat (Req 12.9).

## Tasks

- [x] 1. Tambahkan model data konten statis di scope modul `LandingPage.jsx`
  - [x] 1.1 Tambahkan `scenarios` dan `plays` sebagai ekspor internal
    - Definisikan `export const scenarios` di scope modul dengan minimal empat skenario dasar berlabel Penjualan tiket, Flash sale, Registrasi event, Peluncuran produk, plus satu entri `seasonal: true` (puncak musiman); tiap entri bentuk `{ id, label, outcome }` dengan `outcome` (pernyataan hasil singkat, bahasa Indonesia) non-kosong
    - Definisikan `export const plays` dengan tepat tiga mode aktivasi ber-id `jaring-pengaman`, `terjadwal`, `eksklusif`; tiap entri bentuk `{ id, title, description, when }`, `when` menyatakan kapan mode dipakai (bahasa Indonesia)
    - Tempatkan di atas komponen yang memakainya, mengikuti pola `trafficLevels`/`integrations`/`faqs`; JANGAN mengubah `trafficLevels`, `capacity`, `demoReleaseInstruction`, `demoEmptyQueuePrompt`, atau `faqs`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.2, 3.3, 3.5_

  - [x] 1.2 Tambahkan `fairnessPoints` dan `trafficControlPoints` sebagai ekspor internal
    - `export const fairnessPoints`: poin FIFO (mendahulukan yang datang lebih awal), pengacakan pre-queue untuk mulai terjadwal, dan keadilan terhadap bot memakai frasa "mengurangi keuntungan tidak adil dari bot" (tanpa klaim pemblokiran mutlak); bentuk `{ id, title, body }`, bahasa Indonesia
    - `export const trafficControlPoints`: poin kapasitas & laju keluar (pengunjung per menit), penyesuaian laju saat event berjalan, cakupan proteksi (seluruh situs/path/aksi dinamis), dan mode tampil antrean (selalu tampil vs saat puncak); bentuk `{ id, title, body }`, bahasa Indonesia
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 1.3 Refresh data `features`, perluas copy `integrations`, dan tambahkan data `trust`
    - Ubah bagian fitur menjadi `export const features` berbentuk `{ term, detail }` yang mencakup penjadwalan pre-queue + hitung mundur, pemantauan real-time (pengunjung aktif, panjang antrean, estimasi waktu tunggu), custom HTML, serta peran tim + pemisahan room (bahasa Indonesia)
    - Perluas detail mode `connector` pada `integrations` agar menyebut jangkauan lebih luas: sisi klien, sisi server, edge, dan seluler; pertahankan dua mode `proxy`/`connector` dan bentuk `{ title, description, path, details }`
    - Tambahkan `export const trustQuote` (`{ quote, author, role, illustrative: true }`) dan `export const trustStats` (array `{ value, label, illustrative: true }`) dengan salinan bahasa Indonesia yang jelas bersifat ilustratif
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.3, 10.1, 10.2, 10.3, 10.4_

  - [x] 1.4 Tulis tes contoh untuk struktur data konten baru
    - Impor `scenarios`, `plays`, `trustQuote` dari `./LandingPage.jsx`; assert `scenarios.length >= 5`, memuat label wajib (Penjualan tiket, Flash sale, Registrasi event, Peluncuran produk) dan tepat satu entri `seasonal: true`, tiap entri punya `outcome` non-kosong
    - Assert `plays.length === 3` dengan id `jaring-pengaman`/`terjadwal`/`eksklusif` dan setiap `play.when` non-kosong; assert `trustQuote.illustrative === true`
    - Node environment, tanpa render DOM
    - _Requirements: 2.1, 2.2, 2.3, 3.2, 3.3, 10.3_

- [x] 2. Perbarui navigasi dan kerangka halaman (anchor + urutan bagian)
  - [x] 2.1 Perbarui `navLinks` dan simpan sebagai fragment/data yang dapat diuji
    - Perbarui `navLinks` agar merujuk Section_Anchor bagian utama hasil redesign: `#cara-kerja`, `#keadilan`, `#kontrol-trafik`, `#fitur`, `#integrasi`, `#pertanyaan`; pertahankan pemakaian fragment yang sama untuk nav desktop dan nav seluler
    - Ekspor daftar anchor/label sebagai ekspor internal (mis. `export const navLinkItems`) agar dapat diperiksa oleh tes tanpa DOM
    - Pertahankan perilaku menu seluler yang ada (toggle, `aria-expanded`/`aria-controls`, `Escape` menutup + kembalikan fokus ke tombol, `onBlur` menutup, klik tautan menutup)
    - _Requirements: 12.1, 12.2_

  - [x] 2.2 Susun ulang `main` mengikuti urutan bagian baru dengan landmark & anchor
    - Susun `main#konten[tabindex=-1]` berisi bagian berurutan: Hero (`#atas` di root), Scenarios (`#skenario`), HowItWorks (`#cara-kerja`), Fairness (`#keadilan`), TrafficControl (`#kontrol-trafik`), QueueDemo (`#simulasi`), BrandExperience (`#brand`), Features (`#fitur`), Integrations (`#integrasi`), Trust (`#kepercayaan`), Faq (`#pertanyaan`)
    - Pertahankan skip link `#konten`, struktur `header`/`main`/`footer`, dan `aria-labelledby` per section; sisipkan komponen bagian sebagai placeholder yang di-render kosong/minimal agar halaman tetap ter-compile setelah langkah ini
    - _Requirements: 12.1, 12.4, 12.5_

  - [x] 2.3 Refresh komponen `Hero` berorientasi hasil
    - `section.lp-hero` `aria-labelledby="hero-title"` dengan `h1#hero-title`; deskripsi menyatakan keempat hasil (akses saat lonjakan, kendali arus masuk, giliran adil, pendapatan terlindungi) dalam bahasa Indonesia, brand "Antosan"
    - Tepat satu Primary_CTA `a.lp-button` `href={siteConfig.dashboardUrl}` label `siteConfig.dashboardLabel`, dan tepat satu tautan sekunder `a.lp-secondary-link` `href="#cara-kerja"`
    - Pindahkan `QueueDemo` keluar dari Hero; Hero menampilkan visual pendukung ringan atau tautan "Coba simulasi" ke `#simulasi` (bukan demo interaktif)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.4 Implementasikan komponen `Scenarios`
    - `Scenarios` me-render `section.lp-scenarios` `aria-labelledby` ke heading `h2`; me-map `scenarios` menjadi daftar item berisi label + kalimat hasil singkat; tandai/tampilkan entri musiman
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 2.5 Refresh komponen `HowItWorks` dengan tiga mode aktivasi
    - Pertahankan intro + `ol.lp-steps` (alur kedatangan → ruang tunggu → masuk); tambahkan blok tiga mode aktivasi sebagai `<article>` statis dari `plays` (tanpa state), tiap mode menyatakan judul, deskripsi, dan "kapan digunakan"
    - Section `#cara-kerja` `aria-labelledby`; gunakan `h3` untuk sub-item tanpa melompati level heading
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 2.6 Implementasikan komponen `Fairness`
    - `section.lp-fairness#keadilan` `aria-labelledby` `h2`; me-map `fairnessPoints` menjadi daftar (FIFO, pengacakan pre-queue, keadilan bot); copy tidak mengklaim pemblokiran bot mutlak
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 2.7 Implementasikan komponen `TrafficControl`
    - `section.lp-traffic-control#kontrol-trafik` `aria-labelledby` `h2`; me-map `trafficControlPoints` (kapasitas & laju keluar per menit, penyesuaian saat berjalan, cakupan proteksi, mode tampil antrean)
    - Catatan: pakai kelas kontainer yang tidak bentrok dengan `.lp-traffic-control` internal QueueDemo bila perlu (mis. `lp-traffic-section`) agar gaya tidak saling menimpa
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 2.8 Implementasikan komponen `BrandExperience`
    - `section.lp-brand-experience#brand` `aria-labelledby` `h2`; jelaskan kustomisasi halaman antrean via custom HTML dan bahwa posisi antrean + estimasi waktu tunggu tetap tampil (bahasa Indonesia)
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 2.9 Refresh komponen `Features` dari data `features`
    - `section.lp-features#fitur` `aria-labelledby` `h2`; render `dl` dari `features` (`dt`/`dd`); sertakan `a.lp-dark-link` `href={siteConfig.dashboardUrl}` label `siteConfig.dashboardFeatureLabel`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 2.10 Implementasikan komponen `Trust`
    - `section.lp-trust#kepercayaan` `aria-labelledby` `h2`; render `trustQuote` (kutipan + atribusi) di band gelap `--story-*` dan `trustStats` (pernyataan keandalan/skala); tampilkan penanda "Ilustrasi" terlihat (mis. `.lp-illustrative`) karena data bersifat ilustratif
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 3. Checkpoint - pastikan halaman ter-compile dan tes tetap hijau
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Pertahankan `QueueDemo` di bagian `#simulasi` tanpa mengubah perilaku/kontrak
  - [x] 4.1 Reposisikan `QueueDemo` menjadi bagian tersendiri setelah TrafficControl
    - Render `QueueDemo` di dalam bagian `#simulasi` pada urutan baru; JANGAN mengubah `computeDemoState`, handler pelepasan `setReleased((v) => v + Math.min(4, queued))`, `changeLevel` (set level + reset `released` ke 0), `disabled={queued === 0}`, prompt `demoEmptyQueuePrompt`/`demoReleaseInstruction`, `aria-live="polite" aria-atomic="true"`, dan visual `aria-hidden`
    - Pertahankan `trafficLevels`, `capacity`, dan tiga string status line; hanya pembungkus/penempatan visual yang boleh berubah
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 13.1, 13.2_

  - [x] 4.2 Property test - batas model selalu terjaga
    - **Feature: landing-page-redesign, Property 1: Batas model selalu terjaga**
    - Assert untuk semua tingkat trafik dan `released` valid: `active <= capacity`, `queued >= 0`, dan `remaining === queued` menggunakan `computeDemoState` yang diimpor (fast-check, tanpa menduplikasi formula)
    - **Validates: Requirements 6.1, 6.6**

  - [x] 4.3 Property test - pelepasan memasukkan pengunjung antrean
    - **Feature: landing-page-redesign, Property 2: Pelepasan memasukkan pengunjung antrean**
    - Untuk `queued > 0`, satu pelepasan menghasilkan `queued -> max(0, queued - 4)`, `active` terpancang pada `capacity` selama antrean tersisa, dan `visitors` tidak berubah (model handler `released + Math.min(4, queued)`)
    - **Validates: Requirements 6.2, 6.6**

  - [x] 4.4 Property test - tombol nonaktif tepat saat antrean kosong
    - **Feature: landing-page-redesign, Property 3: Tombol pelepasan nonaktif tepat saat antrean kosong**
    - Assert keadaan disabled === (`queued === 0`); saat `queued === 0` prompt yang ditampilkan adalah `demoEmptyQueuePrompt`
    - **Validates: Requirements 6.3**

  - [x] 4.5 Property test - ganti tingkat mereset dan menghitung ulang
    - **Feature: landing-page-redesign, Property 4: Ganti tingkat mereset dan menghitung ulang**
    - Assert untuk semua tingkat: keadaan dengan `released = 0` menghasilkan `queued === max(0, visitors - capacity)` dan `released === 0`
    - **Validates: Requirements 6.4**

- [ ] 5. Tambahkan gaya `lp-*` untuk bagian baru/refresh di `landing.css`
  - [x] 5.1 Gaya struktur & responsif untuk bagian baru
    - Tambahkan aturan `lp-scenarios`, `lp-fairness`, `lp-traffic-section`, `lp-brand-experience`, `lp-trust`/`lp-trust-quote`, `lp-illustrative`, dan penyesuaian Hero/Features memakai token yang ada (`--panel`, `--ink`, `--line`, `--accent`, `--space-*`, `--radius*`, `--lp-section-gap`) dan kontainer `.lp-container`
    - Pastikan grid/flow menyusut ke satu kolom pada layar sempit dan dukungan light/dark otomatis via token; hormati `prefers-reduced-motion`; tidak menambah token baru dan tidak menambah dependensi
    - _Requirements: 12.7, 12.8, 12.9_

  - [-] 5.2 Terapkan Color_Palette Cloudflare pada token warna
    - Perbarui `src/tokens.css` blok `:root` (light): `--accent: #f6821f`, `--accent-deep: #d5680a`, `--accent-ink: #ffffff`, `--ink: #1d1f20`, `--line: #e6e6e9`, `--input-line: #9b9ba3`, `--info: #0b73c7`
    - Perbarui blok `@media (prefers-color-scheme: dark)` di `tokens.css`: `--accent: #ff9147`, `--accent-deep: #ffa869`, `--accent-ink: #1e2227` (pertahankan netral gelap seperti `--panel: #20262e`)
    - Perbarui `--lp-secondary-ink` di `src/landing.css` (light `#5b5b62`; sesuaikan varian dark bila perlu tetap selaras) karena token ini didefinisikan di `landing.css`, bukan `tokens.css`
    - JANGAN mengubah `--dot-*` dan `--story-*`; JANGAN mengubah pemakaian `var(--token)` pada aturan CSS lain - cukup ubah definisi token
    - Pastikan pemakaian token tetap valid (tidak ada warna hardcoded baru) dan light/dark tetap berfungsi
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.7, 12.8_

  - [~] 5.3 Tes verifikasi token warna Cloudflare
    - Baca `src/tokens.css` sebagai teks (Node `fs`, tanpa dependensi baru); assert blok light memuat `#f6821f` dan `#d5680a`, serta blok dark memuat `#ff9147`
    - _Requirements: 14.1, 14.4_

- [ ] 6. Penyempurnaan aksesibilitas
  - [-] 6.1 Verifikasi & rapikan wiring landmark, heading, dan fokus
    - Pastikan satu `h1` (Hero), `h2` per bagian, `h3` untuk sub-item tanpa lompatan; skip link `#konten` → `main#konten[tabindex=-1]`; `header`/`nav[aria-label]`/`main`/`footer` sebagai landmark; setiap `section` `aria-labelledby`
    - Pertahankan `aria-live` pada metrik QueueDemo, penanda ilustratif pada Trust, dan pengelolaan fokus menu seluler (Escape mengembalikan fokus, tutup saat tautan diklik); pertahankan tablist Integrations yang keyboard-accessible
    - _Requirements: 10.3, 12.4, 12.5, 12.6, 6.5_

- [x] 7. Selaraskan meta `index.html` dengan copy Hero/bagian baru
  - [x] 7.1 Perbarui salinan meta/OG/Twitter/JSON-LD tanpa merestrukturisasi tag
    - Sesuaikan `meta description`, Open Graph, Twitter Card, dan JSON-LD (`WebSite`) agar konsisten dengan copy Hero/bagian yang diperbarui; pertahankan struktur tag, `lang="id"`, `og:locale="id_ID"`, dan `inLanguage="id-ID"`
    - _Requirements: 1.4, 12.10_

- [ ] 8. Pengujian ringan untuk konten & interaksi (data statis, tanpa DOM)
  - [~] 8.1 Tes CTA & tautan dari `siteConfig`
    - Assert nilai yang dipakai Primary_CTA (Hero) dan Footer CTA `=== siteConfig.dashboardUrl` dan tidak kosong; label fitur `=== siteConfig.dashboardFeatureLabel`
    - _Requirements: 1.2, 1.5, 8.5, 12.3_

  - [~] 8.2 Tes struktur data Integrations & navigasi
    - Assert `integrations.proxy`/`integrations.connector` ada dengan `title`/`description`/`path`/`details`, dan detail connector menyebut sisi klien/server/edge/seluler; assert `navLinkItems` memuat anchor `#cara-kerja`, `#keadilan`, `#kontrol-trafik`, `#fitur`, `#integrasi`, `#pertanyaan`
    - _Requirements: 9.1, 9.2, 9.3, 12.1, 12.2_

  - [~] 8.3 Tes traceability Fairness/TrafficControl/Features/Trust
    - Assert `fairnessPoints` memuat poin FIFO/pengacakan/bot dan tidak memuat klaim absolut; `trafficControlPoints` memuat empat topik (kapasitas & laju keluar, penyesuaian, cakupan, mode tampil); `features` memuat empat kontrol tim; `trustStats` semua ber-flag `illustrative: true`
    - _Requirements: 4.1, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 8.1, 8.2, 8.3, 8.4, 10.2, 10.3_

- [ ] 9. Checkpoint akhir - build & seluruh tes hijau
  - [~] 9.1 Jalankan `npm test` dan `npm run build`, rapikan berkas sementara
    - Jalankan `npm test` hingga seluruh tes (lima berkas lama + tes baru) lolos, dan `npm run build` berhasil tanpa galat; hapus berkas/artefak sementara yang dibuat saat verifikasi
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tugas bertanda `*` bersifat opsional (tes) dan dapat dilewati untuk MVP lebih cepat; tugas inti tanpa `*` wajib diimplementasikan.
- Setiap tugas merujuk requirement spesifik untuk traceability.
- Property test merujuk Property 1–4 pada `design.md` memakai tag `Feature: landing-page-redesign, Property N` dan memvalidasi perilaku QueueDemo yang dipertahankan (seharusnya sudah lolos; tugas menambahkan/menegaskan assertion, bukan mengubah model).
- Lingkungan tes Vitest adalah `node` tanpa jsdom/`@testing-library/react`; tes konten baru memvalidasi ekspor data statis, bukan render DOM, agar tidak menambah dependensi berat (Req 12.9).
- Konstanta dan string demo (`trafficLevels`, `capacity`, `demoReleaseInstruction`, `demoEmptyQueuePrompt`) serta struktur `faqs` dipertahankan agar lima berkas tes lama tetap hijau.
- Task 5.2 (Color_Palette Cloudflare) hanya mengubah definisi token di `tokens.css` dan `--lp-secondary-ink` di `landing.css`; pemakaian `var(--token)` tidak diubah sehingga tidak menyentuh `LandingPage.jsx` dan bisa berjalan paralel dengan wave styling. Karena 5.1 dan 5.2 sama-sama menulis `landing.css`, keduanya ditempatkan di wave berbeda (5.1 di wave 12, 5.2 di wave 13). Checkpoint akhir (Task 9.1) menjalankan `npm run build` untuk memastikan build tetap sukses setelah perubahan token.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["1.4", "2.1"] },
    { "id": 2, "tasks": ["2.2"] },
    { "id": 3, "tasks": ["2.3"] },
    { "id": 4, "tasks": ["2.4"] },
    { "id": 5, "tasks": ["2.5"] },
    { "id": 6, "tasks": ["2.6"] },
    { "id": 7, "tasks": ["2.7"] },
    { "id": 8, "tasks": ["2.8"] },
    { "id": 9, "tasks": ["2.9"] },
    { "id": 10, "tasks": ["2.10"] },
    { "id": 11, "tasks": ["4.1"] },
    { "id": 12, "tasks": ["4.2", "4.3", "4.4", "4.5", "5.1", "7.1"] },
    { "id": 13, "tasks": ["5.2", "6.1"] },
    { "id": 14, "tasks": ["5.3", "8.1", "8.2", "8.3"] },
    { "id": 15, "tasks": ["9.1"] }
  ]
}
```
