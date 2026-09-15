# Antosan - Stitch Architecture

Landing page berbahasa Indonesia untuk [Antosan](https://antosan.com/). Proyek React + Vite mandiri,
berisi simulasi antrean, alur kerja, fitur, pilihan integrasi, dan FAQ.
Mendukung layar mobile dan navigasi keyboard, dengan tema terang mengikuti desain Stitch.

Repo ini hanya berisi website pemasaran. Backend Go, Redis, dashboard admin,
autentikasi, dan API antrean berada di aplikasi Antosan yang terpisah.
Simulasi antrean berjalan lokal di browser dan tidak mengakses API.

## Sumber desain

Branch `design/stitch-architecture` menerapkan screen Stitch yang dipilih:
**Antosan Landing Page (Simulasi Interaktif Arsitektur)**.

- Project: `14784201623519037146`
- Screen: `b031a7bba17748c2ab73371de2cde111`
- Diambil melalui MCP Stitch pada 10 September 2026.
- Palet teal–turquoise, panel kaca, font Plus Jakarta Sans, dan aset gerbang mengikuti screen tersebut.

Versi navy–oranye tetap tersedia pada branch `design/gateway-a`.
Domain publik tetap `antosan.com`.

## Simulator arsitektur

Enam skenario: trafik normal, flash sale, pre-queue, lonjakan latensi origin,
trafik bot, dan akses VIP. Pengunjung dan kapasitas dapat diubah dengan slider.
Pre-queue menahan semua pengunjung sampai tombol pembukaan ditekan. Validasi
kode `VIP-ANTOSAN` memprioritaskan satu slot simulasi di dalam kapasitas origin.

Model menggunakan **satu gelombang pengunjung**, bukan request per detik.
Pengunjung selalu terbagi menjadi yang ditahan verifikasi, yang mengantre,
dan yang masuk origin. Skenario bot secara eksplisit mengasumsikan 42% gagal
verifikasi; tidak menganggap lonjakan trafik biasa sebagai bot.

Log, kode VIP, serta angka pada contoh ruang tunggu adalah ilustrasi lokal.
Tidak ada pengiriman trafik, penerbitan token akses, atau API backend.
Simulasi antrean sederhana versi sebelumnya tersedia lewat panel yang dapat dibuka.

Harga, statistik uptime, dan volume pelanggan pada mockup Stitch tidak dianggap
sebagai data produk terverifikasi. Halaman menampilkan kebutuhan implementasi
serta penjelasan bahwa harga belum dipublikasikan.

## Menjalankan lokal

```sh
npm ci
npm run dev
```

Membuat dan melihat hasil build produksi:

```sh
npm run build
npm run preview
```

Hasil build berupa file statis di `dist/`.

## Deploy ke Vercel

1. Import repository `islamyakin/landingpage-wr` ke Vercel.
2. Gunakan root directory repo (`.`).
3. Tambahkan URL dashboard pada environment variable `VITE_DASHBOARD_URL`, jika sudah tersedia.
4. Pilih branch `design/stitch-architecture` untuk preview versi ini, lalu deploy.

Konfigurasi sudah tersedia di `vercel.json`:

| Pengaturan       | Nilai           |
| ---------------- | --------------- |
| Framework        | Vite            |
| Install command  | `npm ci`        |
| Build command    | `npm run build` |
| Output directory | `dist`          |

Domain publik untuk website ini adalah `https://antosan.com/`. Canonical URL,
metadata Open Graph, data terstruktur `WebSite`, `robots.txt`, dan sitemap
menggunakan domain tersebut. Penyambungan domain dan pengaturan DNS dilakukan
di layanan hosting dan registrar domain; file website ini tidak mengubah DNS.

Lihat [panduan Vite di Vercel](https://vercel.com/docs/frameworks/frontend/vite)
dan [konfigurasi proyek Vercel](https://vercel.com/docs/project-configuration).

## Tautan dashboard dan dokumentasi

Untuk pengembangan lokal, salin `.env.example` menjadi `.env.local`.
Untuk deployment, isi variabel yang sama di pengaturan proyek Vercel.

| Variabel                  | Isi                                                               | Perilaku saat kosong                                                     |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `VITE_DASHBOARD_URL`      | URL lengkap dashboard eksternal, termasuk protokol dan path login | Tombol menjadi **Coba simulasi** dan mengarah ke simulasi di halaman ini |
| `VITE_CONNECTOR_DOCS_URL` | URL lengkap dokumentasi protokol connector                        | Tautan **Panduan integrasi** membuka bagian integrasi di README ini      |

Variabel ini hanya untuk URL publik. Nilainya masuk ke bundle saat build;
jalankan build/deploy ulang setelah mengubahnya.

## Integrasi

Pilihan integrasi berikut menjelaskan aplikasi Antosan yang dipasarkan.
Konfigurasi room dilakukan di dashboard aplikasi tersebut.

### Reverse proxy

Daftarkan domain atau path yang dilindungi di dashboard, tentukan kapasitas dan
laju masuk, lalu arahkan domain ke gateway Antosan. Pengunjung melewati
aturan antrean di gateway sebelum diteruskan ke server situs Anda.

### Edge connector

Pasang connector pada edge situs, seperti Cloudflare Workers atau AWS CloudFront.
DNS tetap dikelola di sisi Anda. Connector mengarahkan pengunjung ke halaman
antrean saat diperlukan, lalu memverifikasi token akses ketika pengunjung kembali.
Trafik situs tidak diteruskan melalui gateway Antosan.

Isi `VITE_CONNECTOR_DOCS_URL` dengan URL dokumentasi aplikasi Antosan untuk
menautkan pengunjung langsung ke spesifikasi protokol connector.

## Struktur

- `src/LandingPage.jsx`: entry komponen halaman; mempertahankan model antrean dan komponen bersama.
- `src/StitchPage.jsx`: komposisi landing page dari screen Stitch.
- `src/ArchitectureSimulator.jsx`: kontrol skenario, slider, pre-queue, kode VIP, dan log lokal.
- `src/architectureModel.js`: perhitungan pembagian pengunjung.
- `src/stitch.css`: tata letak responsif dan interaksi versi Stitch.
- `tokens.css`: token palet dan tipografi versi Stitch dalam OKLCH.
- `src/siteConfig.js`: tautan publik dashboard dan dokumentasi.
- `public/images/stitch/`: aset yang diambil dari screen pilihan pengguna.
- `src/main.jsx`: entry point website; hanya memuat landing page.
- `index.html`: metadata dan canonical URL untuk antosan.com.

Stylesheet dan aset versi terdahulu tetap tersedia di repository.
Font Plus Jakarta Sans dan aset gambar disajikan dari build sendiri;
website tidak memuat CDN Tailwind, Google Fonts, atau JavaScript dari Stitch.

Jalankan `npm test` untuk memeriksa model simulasi dan kontrak konten.
