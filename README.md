# Antosan — antosan.com

Landing page berbahasa Indonesia untuk [Antosan](https://antosan.com/). Proyek React + Vite mandiri,
berisi simulasi antrean, alur kerja, fitur, pilihan integrasi, dan FAQ.
Mendukung layar mobile, mode terang/gelap, dan navigasi keyboard.

Repo ini hanya berisi website pemasaran. Backend Go, Redis, dashboard admin,
autentikasi, dan API antrean berada di aplikasi Antosan yang terpisah.
Simulasi antrean berjalan lokal di browser dan tidak mengakses API.

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
4. Deploy.

Konfigurasi sudah tersedia di `vercel.json`:

| Pengaturan | Nilai |
| --- | --- |
| Framework | Vite |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |

Domain publik untuk website ini adalah `https://antosan.com/`. Canonical URL,
metadata Open Graph, data terstruktur `WebSite`, `robots.txt`, dan sitemap
menggunakan domain tersebut. Penyambungan domain dan pengaturan DNS dilakukan
di layanan hosting dan registrar domain; file website ini tidak mengubah DNS.

Lihat [panduan Vite di Vercel](https://vercel.com/docs/frameworks/frontend/vite)
dan [konfigurasi proyek Vercel](https://vercel.com/docs/project-configuration).

## Tautan dashboard dan dokumentasi

Untuk pengembangan lokal, salin `.env.example` menjadi `.env.local`.
Untuk deployment, isi variabel yang sama di pengaturan proyek Vercel.

| Variabel | Isi | Perilaku saat kosong |
| --- | --- | --- |
| `VITE_DASHBOARD_URL` | URL lengkap dashboard eksternal, termasuk protokol dan path login | Tombol menjadi **Coba simulasi** dan mengarah ke simulasi di halaman ini |
| `VITE_CONNECTOR_DOCS_URL` | URL lengkap dokumentasi protokol connector | Tautan **Panduan integrasi** membuka bagian integrasi di README ini |

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

- `src/LandingPage.jsx`: konten dan interaksi landing page.
- `src/landing.css`: tata letak dan responsivitas.
- `src/tokens.css`: warna, tipografi, dan spacing brand.
- `src/siteConfig.js`: tautan dashboard dan dokumentasi.
- `src/Mark.jsx` dan `src/Icon.jsx`: komponen visual bersama.
- `src/main.jsx`: entry point website; hanya memuat landing page.
- `index.html`: metadata Antosan dan canonical URL untuk antosan.com.
- `public/`: favicon, robots.txt, dan sitemap website.
