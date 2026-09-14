# Antosan — Website pemasaran

Landing page berbahasa Indonesia untuk [Antosan](https://antosan.com/). Proyek React + Vite mandiri,
dengan beranda ringkas, halaman harga, dan simulator antrean terpisah.
Mendukung layar mobile dan navigasi keyboard, dengan tema terang mengikuti desain Stitch.

Repo ini hanya berisi website pemasaran. Backend Go, Redis, dashboard admin,
autentikasi, dan API antrean berada di aplikasi Antosan yang terpisah.
Simulasi antrean berjalan lokal di browser dan tidak mengakses API.

## Sumber desain

Halaman `/harga` mengikuti **Antosan-harga** dari MCP Google Stitch:

- Project: `14784201623519037146`
- Screen: `2d316818fa8e48d983ada4a7691c1e44`
- Judul: Antosan — Halaman Harga & Fitur Lengkap Ramah Bisnis (Gaya Kasual)
- Diambil pada 14 September 2026.

Palet resmi deep teal–warm ivory, Plus Jakarta Sans, dan JetBrains Mono
mengikuti screen tersebut dan `tokens.css`. Beranda memuat empat bagian:
pengantar dengan demo kecil, manfaat, cara kerja, dan ajakan memilih paket.
Detail add-on dibuka dengan disclosure bawaan browser di halaman Harga.

Harga dan batas komersial dikelola di `src/siteConfig.js`:

| Paket      | Harga per event | Pengunjung bersamaan |          Ruang |    Anggota tim | Retensi laporan |
| ---------- | --------------: | -------------------: | -------------: | -------------: | --------------: |
| Starter    |    Rp 2.900.000 |                2.000 |              2 |              3 |         14 hari |
| Growth     |    Rp 6.900.000 |               10.000 |             10 |             10 |         60 hari |
| Scale      |   Rp 21.000.000 |               50.000 |             25 |             25 |         90 hari |
| Enterprise |  Kontrak kustom |       Sesuai kontrak | Sesuai kontrak | Sesuai kontrak |  Sesuai kontrak |

Event Pack menambah 25.000 pengunjung bersamaan selama 7 hari dengan harga
Rp 7.500.000/event. Delapan add-on mengikuti nominal dan satuan di screen.
Batas pengunjung paket merupakan allowance komersial, **bukan** konfigurasi
`max_active` origin. Situs ini tidak mengubah batas atau billing aplikasi.

Tombol pemilihan mengisi konteks paket/add-on di panel kontak dan tautan
Gmail, Outlook, atau aplikasi email menuju `halo@antosan.com`. Pengunjung
masih harus mengirim pesannya sendiri; belum ada checkout otomatis.
Klaim penghematan, uptime, dan perbandingan biaya tahunan dari mockup tidak dipakai.

Simulator berasal dari screen arsitektur `b031a7bba17748c2ab73371de2cde111`.
Versi navy–oranye tetap tersedia pada branch `design/gateway-a`.

## Simulator arsitektur

Enam skenario: trafik normal, flash sale, pre-queue, lonjakan latensi origin,
trafik bot, dan akses VIP. Pengunjung dan kapasitas dapat diubah dengan slider.
Pre-queue menahan semua pengunjung sampai tombol pembukaan ditekan. Validasi
kode `VIP-ANTOSAN` menambahkan satu admisi prioritas di luar batas kapasitas origin.

Model menggunakan **satu gelombang pengunjung**, bukan request per detik.
Pengunjung selalu terbagi menjadi yang ditahan verifikasi, yang mengantre,
dan yang masuk origin. Skenario bot secara eksplisit mengasumsikan 42% gagal
verifikasi; tidak menganggap lonjakan trafik biasa sebagai bot.

Log, kode VIP, serta angka pada contoh ruang tunggu adalah ilustrasi lokal.
Tidak ada pengiriman trafik, penerbitan token akses, atau API backend.
Simulator lengkap berada di `/simulasi`; demo sederhana ada di beranda.

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

Hasil build berupa file statis di `dist/`: `index.html`, `harga.html`, dan
`simulasi.html`, masing-masing dengan metadata sendiri. Vite memakai mode MPA
dan Vercel memakai `cleanUrls: true`, sehingga `/harga` dan `/simulasi` bisa
dibuka langsung atau di-refresh tanpa router JavaScript tambahan.

## Deploy ke Vercel

1. Import repository `islamyakin/landingpage-wr` ke Vercel.
2. Gunakan root directory repo (`.`).
3. Tambahkan URL dashboard pada environment variable `VITE_DASHBOARD_URL`, jika sudah tersedia.
4. Pilih branch `design/pricing-simple-home` untuk preview perubahan harga dan beranda.

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

| Variabel                  | Isi                                                               | Perilaku saat kosong                                                |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| `VITE_DASHBOARD_URL`      | URL lengkap dashboard eksternal, termasuk protokol dan path login | Tautan konsol tidak ditampilkan; simulasi tersedia di `/simulasi`   |
| `VITE_CONNECTOR_DOCS_URL` | URL lengkap dokumentasi protokol connector                        | Tautan **Panduan integrasi** membuka bagian integrasi di README ini |

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
- `src/StitchPage.jsx`: beranda ringkas.
- `src/PricingPage.jsx`: paket, Event Pack, add-on, dan kontak.
- `src/SimulationPage.jsx`: halaman simulator lengkap.
- `src/SiteLayout.jsx`: header, footer, dan navigasi bersama.
- `src/marketing.css`: penyesuaian beranda dan harga menggunakan token yang ada.
- `src/ArchitectureSimulator.jsx`: kontrol skenario, slider, pre-queue, kode VIP, dan log lokal.
- `src/architectureModel.js`: perhitungan pembagian pengunjung.
- `src/stitch.css`: tata letak responsif dan interaksi versi Stitch.
- `tokens.css`: token palet resmi dan tipografi versi Stitch.
- `src/siteConfig.js`: harga, allowance paket, add-on, dan tautan publik.
- `public/images/stitch/`: aset yang diambil dari screen pilihan pengguna.
- `src/main.jsx`: entry point website; hanya memuat landing page.
- `index.html`, `harga.html`, `simulasi.html`: entry HTML dengan metadata dan canonical masing-masing.

Stylesheet dan aset versi terdahulu tetap tersedia di repository.
Font disajikan dari build sendiri. Logo memakai domain R2 `kratos.antosan.com`,
dengan mark SVG yang sudah ada sebagai fallback ketika gambar gagal dimuat;
website tidak memuat CDN Tailwind, Google Fonts, atau JavaScript dari Stitch.

Jalankan `npm test` untuk memeriksa model simulasi dan kontrak konten.
