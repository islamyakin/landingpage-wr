# Requirements Document

## Introduction

Antosan adalah produk ruang tunggu virtual (virtual waiting room) yang menata lonjakan trafik dengan antrean, bersaing dengan produk sejenis seperti Queue-it dan Cloudflare Waiting Room. Halaman pemasaran (marketing landing page) Antosan saat ini berbasis fitur dan strukturnya tipis pada beberapa bagian penting.

Redesign ini menyusun ulang struktur bagian, salinan (copy), dan visual halaman agar berorientasi hasil (outcome-led) dan menonjolkan kepercayaan (trust-forward), sejalan dengan cara produk acuan memposisikan diri. Redesign menyentuh penataan ulang bagian, penajaman pesan nilai, penambahan bagian skenario dan kepercayaan, serta konsistensi visual - sambil mempertahankan perilaku simulasi antrean yang sudah diperbaiki beserta aksesibilitasnya, dan tidak merusak kontrak fungsi yang telah diekspor beserta tesnya.

Cakupan pekerjaan adalah halaman pemasaran saja (React + Vite, build statis). Tidak ada perubahan backend, API, atau perilaku produk sebenarnya dalam cakupan ini. Seluruh salinan tetap dalam bahasa Indonesia dan nama brand tetap "Antosan".

## Glossary

- **Landing_Page**: Komponen halaman pemasaran Antosan (`src/LandingPage.jsx`) beserta gaya di `src/landing.css` dan `src/tokens.css`, yang di-render sebagai satu halaman statis.
- **Antosan**: Nama brand produk ruang tunggu virtual yang dipasarkan halaman ini.
- **Hero_Section**: Bagian pembuka Landing_Page yang berisi proposisi nilai utama dan CTA primer.
- **Scenario_Section**: Bagian yang menampilkan momen atau skenario penggunaan konkret (mis. penjualan tiket, flash sale).
- **How_It_Works_Section**: Bagian yang menjelaskan alur pengunjung dan tiga mode aktivasi antrean.
- **Fairness_Section**: Bagian yang menjelaskan urutan antrean (FIFO), pengacakan untuk mulai terjadwal, dan keadilan terhadap bot.
- **Traffic_Control_Section**: Bagian yang menjelaskan kapasitas, laju keluar (outflow), cakupan proteksi, dan mode tampil antrean.
- **Queue_Demo**: Simulasi antrean interaktif pada Landing_Page yang dikendalikan oleh fungsi `computeDemoState` dan komponen `QueueDemo`.
- **Brand_Experience_Section**: Bagian yang menjelaskan halaman antrean yang dapat di-brand sesuai identitas pelanggan.
- **Features_Section**: Bagian yang menjelaskan kontrol untuk tim (penjadwalan, pemantauan, custom HTML, peran tim).
- **Integrations_Section**: Bagian yang menjelaskan mode integrasi reverse proxy dan edge connector.
- **Trust_Section**: Bagian bukti sosial dan skala yang berisi kutipan ilustratif serta pernyataan keandalan/skala.
- **FAQ_Section**: Bagian pertanyaan yang dirender dari kontrak `faqs` yang diekspor.
- **Navigation**: Header navigasi Landing_Page beserta menu seluler (mobile menu).
- **Footer**: Bagian penutup Landing_Page yang berisi CTA penutup dan tautan navigasi.
- **Primary_CTA**: Tautan aksi utama yang mengarah ke dashboard (`siteConfig.dashboardUrl`) dengan label dari `siteConfig`.
- **Exported_Contract**: Fungsi dan nilai yang diekspor dari `src/LandingPage.jsx`: `computeDemoState`, `faqs`, `demoReleaseInstruction`, dan `demoEmptyQueuePrompt`.
- **Design_Token**: Nilai gaya bersama yang didefinisikan di `src/tokens.css` (warna, spasi, tipografi).
- **Color_Palette**: Kumpulan token warna brand pada `src/tokens.css` (accent, accent-deep, accent-ink, ink, line, input-line, info, dan turunan light/dark) yang menentukan identitas visual Landing_Page.
- **WCAG_AA**: Standar Web Content Accessibility Guidelines 2.1 tingkat AA.
- **Illustrative_Placeholder**: Angka, metrik, atau atribusi kutipan yang jelas bersifat contoh dan bukan klaim pelanggan atau metrik nyata.
- **Section_Anchor**: Identitas fragmen (mis. `#cara-kerja`) yang menjadi target tautan Navigation.

## Requirements

### Requirement 1: Proposisi Nilai Berorientasi Hasil pada Hero

**User Story:** Sebagai calon pelanggan yang mengevaluasi produk ruang tunggu virtual, saya ingin hero yang langsung menyampaikan hasil bisnis (situs tetap hidup, trafik terkendali, giliran yang adil, pendapatan terlindungi), sehingga saya paham manfaat Antosan dalam beberapa detik.

#### Acceptance Criteria

1. THE Hero_Section SHALL menampilkan judul utama dan deskripsi yang menyatakan hasil menjaga situs tetap dapat diakses saat lonjakan trafik, mengendalikan arus masuk, memberi giliran yang adil, dan melindungi pendapatan.
2. THE Hero_Section SHALL menampilkan tepat satu Primary_CTA yang mengarah ke `siteConfig.dashboardUrl` dengan label dari `siteConfig`.
3. THE Hero_Section SHALL menampilkan tepat satu tautan sekunder yang mengarah ke Section_Anchor How_It_Works_Section.
4. THE Hero_Section SHALL menyusun seluruh salinan dalam bahasa Indonesia menggunakan nama brand "Antosan".
5. WHERE `siteConfig.dashboardUrl` tidak dikonfigurasi saat build, THE Primary_CTA SHALL memakai nilai fallback yang sudah didefinisikan di `siteConfig` tanpa menghasilkan tautan kosong.

### Requirement 2: Bagian Skenario Penggunaan yang Berorientasi Hasil

**User Story:** Sebagai calon pelanggan, saya ingin melihat momen konkret di mana Antosan berguna beserta hasil yang saya dapatkan, sehingga saya bisa mengenali situasi saya sendiri.

#### Acceptance Criteria

1. THE Scenario_Section SHALL menampilkan sekurang-kurangnya empat skenario konkret yang mencakup penjualan tiket, flash sale, registrasi event, dan peluncuran produk.
2. THE Scenario_Section SHALL menyertakan skenario puncak trafik musiman (mis. libur atau hari besar) sebagai tambahan dari empat skenario dasar.
3. FOR setiap skenario yang ditampilkan, THE Scenario_Section SHALL menyertakan pernyataan hasil singkat yang menjelaskan manfaat bagi pengunjung atau bisnis.
4. THE Scenario_Section SHALL menyusun seluruh salinan dalam bahasa Indonesia.

### Requirement 3: Bagian "Cara Kerja" dengan Tiga Mode Aktivasi

**User Story:** Sebagai calon pelanggan, saya ingin memahami alur pengunjung dan berbagai cara mengaktifkan antrean, sehingga saya tahu Antosan cocok untuk situasi saya.

#### Acceptance Criteria

1. THE How_It_Works_Section SHALL menjelaskan alur pengunjung dari kedatangan, ke ruang tunggu, hingga masuk ke situs.
2. THE How_It_Works_Section SHALL menjelaskan tiga mode aktivasi antrean: jaring pengaman yang aktif hanya saat trafik melampaui ambang tertentu, pelepasan terjadwal dengan hitung mundur sebelum gerbang dibuka, dan akses eksklusif melalui undangan atau tautan unik.
3. FOR setiap mode aktivasi, THE How_It_Works_Section SHALL menyatakan kapan mode tersebut sebaiknya digunakan.
4. THE How_It_Works_Section SHALL dapat dijangkau melalui Section_Anchor yang dirujuk oleh Navigation.
5. THE How_It_Works_Section SHALL menyusun seluruh salinan dalam bahasa Indonesia.

### Requirement 4: Bagian Keadilan dan Urutan Antrean

**User Story:** Sebagai calon pelanggan yang peduli pada pengalaman yang adil, saya ingin memahami bagaimana urutan antrean ditentukan dan bagaimana bot dicegah mendapat keuntungan, sehingga saya percaya sistemnya adil.

#### Acceptance Criteria

1. THE Fairness_Section SHALL menjelaskan urutan antrean FIFO yang mendahulukan pengunjung yang datang lebih awal.
2. THE Fairness_Section SHALL menjelaskan pengacakan urutan peserta pre-queue untuk event dengan mulai terjadwal.
3. THE Fairness_Section SHALL menjelaskan bahwa mekanisme antrean mengurangi keuntungan tidak adil dari bot.
4. THE Fairness_Section SHALL menyusun seluruh salinan dalam bahasa Indonesia tanpa mengklaim pemblokiran bot secara mutlak.

### Requirement 5: Bagian Kontrol Trafik dan Kapasitas

**User Story:** Sebagai calon pelanggan teknis, saya ingin memahami bagaimana kapasitas dan laju keluar diatur serta bagian situs mana yang dilindungi, sehingga saya bisa menilai kecocokannya dengan arsitektur saya.

#### Acceptance Criteria

1. THE Traffic_Control_Section SHALL menjelaskan pengaturan kapasitas pengunjung dan laju keluar yang diukur dalam pengunjung per menit.
2. THE Traffic_Control_Section SHALL menjelaskan bahwa laju keluar dapat disesuaikan saat event berlangsung.
3. THE Traffic_Control_Section SHALL menjelaskan cakupan proteksi yang dapat mencakup seluruh situs, path tertentu, atau aksi dinamis tertentu.
4. THE Traffic_Control_Section SHALL menjelaskan pilihan antrean yang selalu tampil versus antrean yang hanya tampil saat puncak trafik.
5. THE Traffic_Control_Section SHALL menyusun seluruh salinan dalam bahasa Indonesia.

### Requirement 6: Pelestarian Simulasi Antrean Interaktif

**User Story:** Sebagai pengunjung halaman, saya ingin simulasi antrean tetap berperilaku benar dan dapat diakses setelah redesign, sehingga saya bisa memahami produk melalui interaksi langsung.

#### Acceptance Criteria

1. THE Queue_Demo SHALL mempertahankan perilaku turunan yang dihitung `computeDemoState` sehingga `active` tidak pernah melebihi `capacity` dan `queued` tidak pernah bernilai negatif.
2. WHEN pengguna menekan tombol pelepasan antrean sementara `queued > 0`, THE Queue_Demo SHALL memasukkan hingga empat pengunjung dan menurunkan `queued` sesuai jumlah yang dimasukkan.
3. IF `queued` bernilai 0, THEN THE Queue_Demo SHALL menonaktifkan tombol pelepasan antrean dan menampilkan prompt `demoEmptyQueuePrompt`.
4. WHEN pengguna mengganti tingkat trafik, THE Queue_Demo SHALL mengatur ulang jumlah yang dilepas ke 0 dan menghitung ulang antrean dari total pengunjung tingkat baru.
5. THE Queue_Demo SHALL mempertahankan region `aria-live` yang mengumumkan perubahan metrik antrean.
6. WHERE Queue_Demo direfresh secara visual atau dipindahkan posisinya, THE Landing_Page SHALL tetap mempertahankan perilaku dan aksesibilitas yang disebut pada kriteria 1 sampai 5.

### Requirement 7: Bagian Pengalaman Brand pada Ruang Tunggu

**User Story:** Sebagai calon pelanggan yang peduli pada pengalaman merek, saya ingin tahu bahwa halaman antrean dapat mengikuti identitas brand saya, sehingga ruang tunggu terasa sebagai bagian dari situs saya.

#### Acceptance Criteria

1. THE Brand_Experience_Section SHALL menjelaskan bahwa halaman antrean dapat disesuaikan dengan identitas brand pelanggan melalui custom HTML.
2. THE Brand_Experience_Section SHALL menjelaskan bahwa halaman antrean tetap menampilkan posisi antrean dan estimasi waktu tunggu.
3. THE Brand_Experience_Section SHALL menyusun seluruh salinan dalam bahasa Indonesia.

### Requirement 8: Bagian Fitur dan Kontrol untuk Tim

**User Story:** Sebagai administrator yang mengelola event, saya ingin melihat kontrol yang tersedia untuk tim, sehingga saya tahu Antosan mendukung cara kerja tim saya.

#### Acceptance Criteria

1. THE Features_Section SHALL menjelaskan penjadwalan pembukaan event dengan hitung mundur pre-queue.
2. THE Features_Section SHALL menjelaskan pemantauan real-time atas pengunjung aktif, panjang antrean, dan estimasi waktu tunggu.
3. THE Features_Section SHALL menjelaskan penyesuaian halaman antrean melalui custom HTML.
4. THE Features_Section SHALL menjelaskan peran tim dan pemisahan room dalam workspace.
5. THE Features_Section SHALL menampilkan tautan yang mengarah ke `siteConfig.dashboardUrl` dengan label fitur dari `siteConfig`.
6. THE Features_Section SHALL dapat dijangkau melalui Section_Anchor yang dirujuk oleh Navigation.

### Requirement 9: Bagian Integrasi

**User Story:** Sebagai calon pelanggan teknis, saya ingin memahami opsi integrasi Antosan, sehingga saya bisa memilih yang sesuai dengan stack saya.

#### Acceptance Criteria

1. THE Integrations_Section SHALL menyajikan dua mode integrasi: reverse proxy dan edge connector.
2. WHEN pengguna memilih salah satu mode integrasi, THE Integrations_Section SHALL menampilkan deskripsi dan alur yang sesuai dengan mode tersebut.
3. THE Integrations_Section SHALL menyebutkan jangkauan connector yang lebih luas termasuk sisi klien, sisi server, edge, dan seluler.
4. THE Integrations_Section SHALL mempertahankan pola tab yang dapat dioperasikan dengan keyboard beserta peran dan atribut ARIA yang sesuai.
5. THE Integrations_Section SHALL menyusun seluruh salinan dalam bahasa Indonesia.

### Requirement 10: Bagian Kepercayaan dan Skala

**User Story:** Sebagai calon pelanggan yang menilai keandalan, saya ingin melihat bukti sosial dan pernyataan skala, sehingga saya lebih yakin memilih Antosan.

#### Acceptance Criteria

1. THE Trust_Section SHALL menampilkan sekurang-kurangnya satu kutipan bergaya testimoni beserta atribusi.
2. THE Trust_Section SHALL menampilkan pernyataan keandalan atau skala Antosan.
3. WHERE metrik atau atribusi kutipan bukan angka nyata yang disediakan pelanggan, THE Trust_Section SHALL menandainya sebagai Illustrative_Placeholder sehingga tidak tampil sebagai klaim pelanggan nyata.
4. THE Trust_Section SHALL menyusun seluruh salinan dalam bahasa Indonesia.

### Requirement 11: Bagian FAQ

**User Story:** Sebagai calon pelanggan, saya ingin menemukan jawaban atas pertanyaan umum, sehingga saya bisa menyelesaikan keraguan sebelum mencoba produk.

#### Acceptance Criteria

1. THE FAQ_Section SHALL merender setiap entri dari nilai `faqs` yang diekspor sebagai pasangan pertanyaan dan jawaban.
2. THE FAQ_Section SHALL mempertahankan struktur data `faqs` sebagai larik pasangan `[pertanyaan, jawaban]` sehingga kontrak yang diuji `phrasing.test.js` tetap valid.
3. THE FAQ_Section SHALL dapat dijangkau melalui Section_Anchor yang dirujuk oleh Navigation.
4. THE FAQ_Section SHALL menyusun seluruh salinan dalam bahasa Indonesia.

### Requirement 12: Navigasi, Footer, Responsivitas, Aksesibilitas, dan Performa Global

**User Story:** Sebagai pengunjung di perangkat apa pun, saya ingin halaman yang mudah dinavigasi, dapat diakses, dan cepat, sehingga saya bisa menjelajah tanpa hambatan.

#### Acceptance Criteria

1. THE Navigation SHALL menyediakan tautan yang mengarah ke Section_Anchor dari bagian utama Landing_Page hasil redesign.
2. WHEN pengguna membuka menu seluler, THE Navigation SHALL menampilkan tautan yang sama seperti navigasi desktop dan menutup menu setelah sebuah tautan dipilih.
3. THE Footer SHALL menampilkan CTA penutup yang mengarah ke `siteConfig.dashboardUrl`.
4. THE Landing_Page SHALL menyediakan tautan lewati navigasi (skip link) yang mengarah ke konten utama.
5. THE Landing_Page SHALL menggunakan landmark semantik dan atribut ARIA untuk header, navigasi, konten utama, dan footer.
6. THE Landing_Page SHALL memenuhi WCAG_AA untuk navigasi keyboard, pengelolaan fokus, dan kontras warna pada elemen yang dapat diverifikasi secara otomatis.
7. THE Landing_Page SHALL menampilkan tata letak yang responsif pada lebar layar seluler dan desktop.
8. THE Landing_Page SHALL menerapkan Design_Token dari `src/tokens.css` untuk warna, spasi, dan tipografi secara konsisten antarbagian, sesuai Color_Palette yang ditetapkan pada Requirement 14.
9. THE Landing_Page SHALL tetap berupa build statis Vite tanpa menambahkan dependensi runtime berat yang baru.
10. THE Landing_Page SHALL menjaga seluruh salinan dalam bahasa Indonesia tanpa pengulangan pesan yang tidak perlu antarbagian.

### Requirement 13: Non-Regresi Kontrak dan Build

**User Story:** Sebagai pemelihara kode, saya ingin redesign tidak merusak kontrak yang sudah ada beserta build dan tesnya, sehingga kualitas yang sudah dicapai tetap terjaga.

#### Acceptance Criteria

1. THE Landing_Page SHALL tetap mengekspor `computeDemoState`, `faqs`, `demoReleaseInstruction`, dan `demoEmptyQueuePrompt` dengan tanda tangan dan makna yang sama, kecuali sebuah requirement secara eksplisit mengubahnya.
2. THE Queue_Demo SHALL mempertahankan nilai `demoReleaseInstruction` sebagai `"Loloskan 4 pengunjung ke dalam situs."` dan `demoEmptyQueuePrompt` sebagai `"Ubah trafik untuk mencoba lagi."`.
3. WHEN perintah build produksi `npm run build` dijalankan setelah redesign, THE Landing_Page SHALL menghasilkan build yang berhasil tanpa galat.
4. WHEN suite tes `npm test` dijalankan setelah redesign, THE Landing_Page SHALL membuat seluruh tes yang ada lolos.

### Requirement 14: Skema Warna (Color Palette) Berorientasi Cloudflare

**User Story:** Sebagai pemilik brand dan pengunjung, saya ingin Landing_Page memakai palet warna hangat dan netral bergaya Cloudflare yang konsisten dan berkontras cukup, sehingga halaman terasa modern, kredibel, dan nyaman dibaca di mode terang maupun gelap.

#### Acceptance Criteria

1. THE Color_Palette SHALL memakai warna accent oranye hangat bergaya Cloudflare dengan nilai light `--accent: #f6821f` dan `--accent-deep: #d5680a`, serta `--accent-ink: #ffffff`.
2. THE Color_Palette SHALL menetapkan netral hangat pada mode light: `--ink: #1d1f20`, `--line: #e6e6e9`, `--input-line: #9b9ba3`, dan `--lp-secondary-ink: #5b5b62`.
3. THE Color_Palette SHALL menetapkan warna tautan informasional `--info: #0b73c7` pada mode light.
4. THE Color_Palette SHALL menyediakan varian mode dark yang selaras: `--accent: #ff9147`, `--accent-deep: #ffa869`, dan `--accent-ink: #1e2227`, dengan netral gelap yang dipertahankan mendekati nilai saat ini (mis. `--panel: #20262e`).
5. THE Color_Palette SHALL mempertahankan token brand-mark dots (`--dot-blue`, `--dot-cyan`, `--dot-purple`, `--dot-pink`) dan band gelap `--story-*` tanpa perubahan.
6. WHERE pasangan teks/latar accent dipakai (mis. `--accent-ink` di atas `--accent`, dan teks di atas `--panel`), THE Color_Palette SHALL menargetkan rasio kontras WCAG_AA untuk teks yang dapat diverifikasi.
7. THE Landing_Page SHALL menerapkan perubahan Color_Palette melalui pembaruan `src/tokens.css` saja untuk token warna, tanpa mengubah pemakaian token pada `src/landing.css` yang sudah memakai `var(--...)`.

## Out of Scope and Assumptions

- Perubahan backend, API, atau perilaku produk sebenarnya tidak termasuk dalam cakupan; pekerjaan ini hanya menyentuh halaman pemasaran statis.
- Kutipan testimoni, metrik, dan angka skala pada Trust_Section bersifat Illustrative_Placeholder dan bukan metrik atau klaim pelanggan nyata, kecuali pengguna menyediakan data nyata.
- Nilai konfigurasi tautan (mis. `dashboardUrl`, `connectorDocsUrl`) tetap disuplai saat build melalui variabel lingkungan Vite; redesign tidak mengubah mekanisme ini.
- Kapasitas simulasi (8 pengunjung) dan tingkat trafik (Normal/Ramai/Lonjakan) dianggap tetap kecuali sebuah requirement eksplisit mengubahnya.
- Validasi WCAG_AA penuh memerlukan pengujian manual dengan teknologi bantu dan tinjauan ahli aksesibilitas; kriteria pada dokumen ini menargetkan yang dapat diverifikasi selama pengembangan.
- Perubahan Color_Palette terbatas pada token warna di `src/tokens.css`; komponen/markup dan pemakaian `var(--token)` di `src/landing.css` tidak berubah kecuali sebuah requirement lain menyebutkannya, dan verifikasi kontras penuh tetap memerlukan tinjauan manual.
