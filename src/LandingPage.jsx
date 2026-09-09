import React, { useRef, useState } from "react";
import Mark from "./Mark.jsx";
import Icon from "./Icon.jsx";
import { HeroVisual, WaitingPreview } from "./BrandVisuals.jsx";
import { siteConfig } from "./siteConfig.js";
import "./landing.css";
import "./redesign.css";

const trafficLevels = [
  { label: "Normal", visitors: 6 },
  { label: "Ramai", visitors: 18 },
  { label: "Lonjakan", visitors: 30 },
];
const capacity = 8;

// Demo instruction copy shown while a queue remains (`queued > 0`). Exported so
// tests can assert against the real string rather than duplicating the literal.
export const demoReleaseInstruction = "Loloskan 4 pengunjung ke dalam situs.";
// Prompt shown when the queue is empty (`queued === 0`).
export const demoEmptyQueuePrompt = "Ubah trafik untuk mencoba lagi.";

// Scenario_Section data (Req 2). Minimal empat skenario dasar berlabel
// Penjualan tiket, Flash sale, Registrasi event, Peluncuran produk, plus satu
// entri musiman (`seasonal: true`, Req 2.2). Tiap entri berbentuk
// `{ id, label, outcome }` dengan `outcome` sebagai pernyataan hasil singkat
// (Req 2.3). Diekspor sebagai ekspor internal agar dapat diuji tanpa render DOM.
export const scenarios = [
  {
    id: "tiket",
    label: "Penjualan tiket",
    outcome:
      "Tiket terjual tertib tanpa situs tumbang, pembeli dapat giliran yang adil.",
  },
  {
    id: "flashsale",
    label: "Flash sale",
    outcome:
      "Lonjakan menit pertama tertahan rapi, stok terbagi tanpa checkout gagal.",
  },
  {
    id: "registrasi",
    label: "Registrasi event",
    outcome: "Pendaftaran tetap lancar meski ribuan orang mendaftar bersamaan.",
  },
  {
    id: "peluncuran",
    label: "Peluncuran produk",
    outcome:
      "Momen rilis tetap mulus, pengunjung masuk bertahap sesuai kapasitas.",
  },
  {
    id: "musiman",
    label: "Puncak musiman",
    outcome:
      "Trafik libur atau hari besar terkendali, situs siap sepanjang puncak.",
    seasonal: true,
  },
];

// How_It_Works activation modes (Req 3.2, 3.3): tepat tiga mode aktivasi.
// Tiap entri berbentuk `{ id, title, description, when }`, dengan `when`
// menyatakan kapan mode sebaiknya dipakai (Req 3.3). Diekspor sebagai ekspor
// internal agar dapat diuji tanpa render DOM.
export const plays = [
  {
    id: "jaring-pengaman",
    title: "Jaring pengaman",
    description:
      "Antrean aktif otomatis hanya saat trafik melampaui ambang yang Anda tetapkan.",
    when: "Dipakai saat Anda ingin situs berjalan normal dan antrean berjaga hanya ketika lonjakan datang.",
  },
  {
    id: "terjadwal",
    title: "Pelepasan terjadwal",
    description:
      "Tahan semua pengunjung dengan hitung mundur, lalu buka gerbang pada waktu yang ditentukan.",
    when: "Dipakai untuk event dengan waktu mulai pasti, seperti penjualan tiket atau flash sale terjadwal.",
  },
  {
    id: "eksklusif",
    title: "Akses eksklusif",
    description:
      "Beri jalur masuk lewat undangan atau tautan unik untuk pengunjung terpilih.",
    when: "Dipakai saat hanya sebagian pengunjung boleh masuk, seperti pre-sale anggota atau akses terbatas.",
  },
];

// Fairness_Section data (Req 4): urutan FIFO (Req 4.1), pengacakan pre-queue
// untuk event dengan mulai terjadwal (Req 4.2), dan keadilan terhadap bot
// (Req 4.3) memakai frasa "mengurangi keuntungan tidak adil dari bot" tanpa
// mengklaim pemblokiran bot secara mutlak (Req 4.4). Tiap entri berbentuk
// `{ id, title, body }`. Diekspor sebagai ekspor internal agar dapat diuji
// tanpa render DOM.
export const fairnessPoints = [
  {
    id: "fifo",
    title: "Urutan FIFO yang jelas",
    body: "Antrean mendahulukan pengunjung yang datang lebih awal, sehingga giliran mengikuti waktu kedatangan.",
  },
  {
    id: "acak",
    title: "Pengacakan pre-queue",
    body: "Untuk event dengan mulai terjadwal, urutan peserta pre-queue diacak saat gerbang dibuka agar tak ada yang diuntungkan hanya karena membuka halaman lebih dulu.",
  },
  {
    id: "bot",
    title: "Lebih adil terhadap bot",
    body: "Mekanisme antrean mengurangi keuntungan tidak adil dari bot, sehingga pengunjung sungguhan mendapat peluang yang lebih setara.",
  },
];

// Traffic_Control_Section data (Req 5): kapasitas & laju keluar per menit
// (Req 5.1), penyesuaian laju saat event berjalan (Req 5.2), cakupan proteksi
// seluruh situs/path/aksi dinamis (Req 5.3), dan mode tampil antrean selalu
// tampil vs saat puncak (Req 5.4). Tiap entri berbentuk `{ id, title, body }`.
// Diekspor sebagai ekspor internal agar dapat diuji tanpa render DOM.
export const trafficControlPoints = [
  {
    id: "kapasitas",
    title: "Kapasitas & laju keluar",
    body: "Tetapkan kapasitas pengunjung situs dan laju keluar yang diukur dalam pengunjung per menit, sehingga arus masuk sesuai kemampuan situs.",
  },
  {
    id: "penyesuaian",
    title: "Sesuaikan saat event berjalan",
    body: "Naikkan atau turunkan laju keluar secara langsung saat event berlangsung untuk mengikuti kondisi trafik yang berubah.",
  },
  {
    id: "cakupan",
    title: "Cakupan proteksi fleksibel",
    body: "Lindungi seluruh situs, path tertentu seperti /checkout, atau aksi dinamis tertentu sesuai bagian yang perlu dijaga.",
  },
  {
    id: "tampil",
    title: "Mode tampil antrean",
    body: "Pilih antrean yang selalu tampil untuk setiap pengunjung, atau antrean yang hanya muncul saat trafik mencapai puncak.",
  },
];

// Features_Section data (Req 8): kontrol untuk tim. Mencakup penjadwalan
// pembukaan event dengan hitung mundur pre-queue (Req 8.1), pemantauan
// real-time atas pengunjung aktif, panjang antrean, dan estimasi waktu tunggu
// (Req 8.2), penyesuaian halaman antrean lewat custom HTML (Req 8.3), serta
// peran tim dan pemisahan room dalam workspace (Req 8.4). Tiap entri berbentuk
// `{ term, detail }` untuk dirender sebagai `<dt>`/`<dd>`. Diekspor sebagai
// ekspor internal agar dapat diuji tanpa render DOM.
export const features = [
  {
    term: "Jadwalkan momen pembukaan.",
    detail:
      "Siapkan pre-queue dengan hitung mundur sebelum event dibuka. Pilih urutan FIFO atau pengacakan peserta saat gerbang dibuka.",
  },
  {
    term: "Pantau situasi saat itu juga.",
    detail:
      "Lihat pengunjung aktif, panjang antrean, dan estimasi waktu tunggu secara real-time, lengkap dengan riwayat trafik dari dashboard.",
  },
  {
    term: "Ruang tunggu, identitas Anda.",
    detail:
      "Gunakan custom HTML untuk menyesuaikan halaman antrean dengan brand atau tema event Anda.",
  },
  {
    term: "Atur akses bersama tim.",
    detail:
      "Pisahkan room dalam workspace dan berikan peran admin atau akses pantau kepada anggota tim.",
  },
];

// Pure derived-value model for the QueueDemo, extracted so it can be unit /
// property tested without rendering React.
// FIXED model: the present population (visitors) stays constant and `released`
// counts queued visitors admitted into the site. `queued` drains as `released`
// grows, `active` stays pinned at `capacity` while a queue remains, and
// `remaining` (bound to the arrivals column) now shows the waiting queue.
export function computeDemoState({ visitors, released, capacity }) {
  const queued = Math.max(0, visitors - capacity - released);
  const active = Math.min(capacity, visitors - queued);
  const remaining = queued;
  return { visitors, released, capacity, remaining, active, queued };
}

function Brand() {
  return (
    <a className="lp-brand" href="/" aria-label={`${siteConfig.name}, beranda`}>
      <Mark />
      <span className="lp-wordmark">
        <span>{siteConfig.name}</span>
        <small>VIRTUAL WAITING ROOM</small>
      </span>
    </a>
  );
}

function QueueDemo() {
  const [level, setLevel] = useState(1);
  const [released, setReleased] = useState(0);
  const visitors = trafficLevels[level].visitors;
  const { remaining, active, queued } = computeDemoState({
    visitors,
    released,
    capacity,
  });

  function changeLevel(index) {
    setLevel(index);
    setReleased(0);
  }

  return (
    <figure className="lp-demo" aria-labelledby="demo-title">
      <figcaption className="lp-demo-heading">
        <span id="demo-title">Sedikit antrean. Banyak ketenangan.</span>
        <span className="lp-demo-label">Simulasi</span>
      </figcaption>
      <div className="lp-traffic-control">
        <span>Arus pengunjung</span>
        <div
          className="lp-segmented"
          role="group"
          aria-label="Pilih tingkat trafik simulasi"
        >
          {trafficLevels.map((traffic, index) => (
            <button
              key={traffic.label}
              type="button"
              aria-pressed={level === index}
              onClick={() => changeLevel(index)}
            >
              {traffic.label}
            </button>
          ))}
        </div>
      </div>
      <div className="lp-flow-visual" aria-hidden="true">
        <div className="lp-arrivals">
          <div className="lp-visitors">
            {Array.from({ length: 30 }, (_, i) => (
              <span key={i} className={i < remaining ? "is-present" : ""} />
            ))}
          </div>
          <span>Pengunjung</span>
        </div>
        <div className="lp-flow-connector">
          <Icon name="arrow" size={20} />
        </div>
        <div className="lp-gate">
          <div className="lp-gate-mark">
            <Mark />
          </div>
          <span>{siteConfig.name}</span>
        </div>
        <div className="lp-flow-connector">
          <Icon name="arrow" size={20} />
        </div>
        <div className="lp-destination">
          <div className="lp-site-slots">
            {Array.from({ length: capacity }, (_, i) => (
              <span key={i} className={i < active ? "is-active" : ""} />
            ))}
          </div>
          <span>Situs Anda</span>
        </div>
      </div>
      <div className="lp-demo-metrics" aria-live="polite" aria-atomic="true">
        <div>
          <span>Dalam antrean</span>
          <strong>
            {queued.toLocaleString("id-ID")}
            <small>pengunjung</small>
          </strong>
        </div>
        <div>
          <span>Di dalam situs</span>
          <strong>
            {active}
            <small>/ {capacity} slot</small>
          </strong>
        </div>
        <p>
          <Icon name="shield" size={16} />
          {queued > 0
            ? "Kapasitas situs tetap terjaga"
            : released > 0
              ? "Antrean selesai, semua sudah masuk"
              : "Slot tersedia, langsung masuk"}
        </p>
      </div>
      <div className="lp-demo-action">
        <span>
          {queued > 0 ? demoReleaseInstruction : demoEmptyQueuePrompt}
        </span>
        <button
          type="button"
          onClick={() => setReleased((value) => value + Math.min(4, queued))}
          disabled={queued === 0}
        >
          Loloskan antrean
          <Icon name="arrow" size={16} />
        </button>
      </div>
      <p className="lp-demo-note">
        Ilustrasi lokal dengan kapasitas 8 pengunjung, bukan data trafik
        langsung.
      </p>
    </figure>
  );
}

const integrations = {
  proxy: {
    title: "Satu gerbang sebelum situs Anda.",
    description:
      "Arahkan domain ke gateway Antosan. Setiap kunjungan melewati aturan antrean sebelum diteruskan ke server situs Anda.",
    path: ["Pengunjung", "Gateway Antosan", "Situs Anda"],
    details: [
      "Atur seluruh domain atau path tertentu",
      "Trafik diteruskan melalui reverse proxy",
      "Kapasitas dan sesi dikelola di gateway",
    ],
  },
  connector: {
    title: "Tetap di infrastruktur Anda.",
    description:
      "Pasang connector di edge Anda. Pengunjung diarahkan ke antrean saat diperlukan, lalu kembali dengan token akses yang diverifikasi di edge.",
    path: ["Pengunjung", "Edge + connector", "Situs Anda"],
    details: [
      "Jangkauan luas: sisi klien, sisi server, edge, dan seluler",
      "Terpasang di edge seperti Cloudflare Workers dan AWS CloudFront",
      "DNS tetap dikelola di sisi Anda, trafik situs tidak melewati gateway kami",
    ],
  },
};

// Trust_Section data (Req 10). Kutipan bergaya testimoni beserta atribusi
// (Req 10.1) dan pernyataan keandalan/skala (Req 10.2). Karena angka dan
// atribusi bukan data pelanggan nyata, keduanya ditandai `illustrative: true`
// (Req 10.3) sehingga UI dapat menampilkan penanda "Ilustrasi" dan tidak tampil
// sebagai klaim pelanggan nyata. Seluruh salinan berbahasa Indonesia (Req 10.4).
// Diekspor sebagai ekspor internal agar dapat diuji tanpa render DOM.
export const trustQuote = {
  quote:
    "Saat penjualan tiket dibuka, situs kami tetap tenang dan pelanggan mendapat giliran yang adil tanpa checkout gagal.",
  author: "Rani Prakoso",
  role: "Kepala Digital, contoh peritel (ilustrasi)",
  illustrative: true,
};

export const trustStats = [
  {
    value: "Jutaan",
    label: "pengunjung diantrekan pada satu event puncak (angka ilustrasi)",
    illustrative: true,
  },
  {
    value: "99,9%",
    label: "target ketersediaan layanan antrean (angka ilustrasi)",
    illustrative: true,
  },
  {
    value: "< 1 detik",
    label: "estimasi perpindahan dari antrean ke situs (angka ilustrasi)",
    illustrative: true,
  },
];

function Integrations() {
  const [mode, setMode] = useState("proxy");
  const tabs = useRef([]);
  const selected = integrations[mode];
  function onTabKey(event, index) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - index;
    setMode(next === 0 ? "proxy" : "connector");
    tabs.current[next].focus({ preventScroll: true });
  }
  return (
    <section
      className="lp-integrations lp-container"
      id="integrasi"
      aria-labelledby="integration-title"
    >
      <div className="lp-section-intro">
        <h2 id="integration-title">
          Masuk ke stack Anda.
          <br />
          Dengan cara yang pas.
        </h2>
        <p>
          Pilih integrasi sesuai arsitektur situs Anda. Pengaturan antreannya
          tetap dalam satu dashboard.
        </p>
      </div>
      <div className="lp-integration-layout">
        <div className="lp-integration-copy">
          <div
            className="lp-integration-tabs"
            role="tablist"
            aria-label="Mode integrasi"
          >
            {["proxy", "connector"].map((key, index) => (
              <button
                key={key}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                role="tab"
                id={`tab-${key}`}
                aria-selected={mode === key}
                aria-controls={`panel-${key}`}
                tabIndex={mode === key ? 0 : -1}
                onKeyDown={(event) => onTabKey(event, index)}
                onClick={() => setMode(key)}
              >
                {key === "proxy" ? "Reverse proxy" : "Edge connector"}
              </button>
            ))}
          </div>
          {Object.entries(integrations).map(([key, integration]) => (
            <div
              key={key}
              hidden={mode !== key}
              className="lp-integration-panel"
              id={`panel-${key}`}
              role="tabpanel"
              aria-labelledby={`tab-${key}`}
              tabIndex={0}
            >
              <h3>{integration.title}</h3>
              <p>{integration.description}</p>
              <ul>
                {integration.details.map((detail) => (
                  <li key={detail}>
                    <Icon name="check" size={17} />
                    {detail}
                  </li>
                ))}
              </ul>
              {key === "connector" ? (
                <a className="lp-text-link" href={siteConfig.connectorDocsUrl}>
                  {siteConfig.connectorDocsLabel}
                  <Icon name="arrow" size={17} />
                </a>
              ) : (
                <a className="lp-text-link" href={siteConfig.dashboardUrl}>
                  {siteConfig.dashboardInlineLabel}
                  <Icon name="arrow" size={17} />
                </a>
              )}
            </div>
          ))}
        </div>
        <div
          className="lp-integration-diagram"
          aria-label={`Alur ${mode === "proxy" ? "reverse proxy" : "edge connector"}`}
        >
          <div className="lp-integration-route">
            {selected.path.map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 && <Icon name="arrow" size={22} />}
                <div
                  className={
                    index === 1
                      ? "lp-route-node lp-route-node-main"
                      : "lp-route-node"
                  }
                >
                  <Icon
                    name={
                      index === 0 ? "members" : index === 1 ? "shield" : "globe"
                    }
                    size={25}
                  />
                  <span>{item}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          {mode === "connector" && (
            <div className="lp-connector-branch">
              <span aria-hidden="true">↕</span>
              <span>Halaman antrean Antosan</span>
            </div>
          )}
          <p>
            {mode === "proxy"
              ? "Antrean berada di depan server situs Anda."
              : "Antre saat diperlukan. Kembali saat giliran tiba."}
          </p>
        </div>
      </div>
    </section>
  );
}

// Navigation anchors (Req 12.1, 12.2). Daftar tautan navigasi utama hasil
// redesign sebagai satu sumber data agar nav desktop dan nav seluler memakai
// tautan yang sama. Tiap entri berbentuk `{ href, label }`. Diekspor sebagai
// ekspor internal agar dapat diperiksa oleh tes tanpa render DOM.
export const navLinkItems = [
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#keadilan", label: "Keadilan" },
  { href: "#kontrol-trafik", label: "Kontrol trafik" },
  { href: "#fitur", label: "Fitur" },
  { href: "#integrasi", label: "Integrasi" },
  { href: "#pertanyaan", label: "FAQ" },
];

export const faqs = [
  [
    "Kapan pengunjung mulai mengantre?",
    "Saat jumlah pengunjung aktif atau laju masuk mencapai batas yang Anda tetapkan. Selama kapasitas tersedia, pengunjung bisa langsung masuk. Anda juga dapat menahan semua pengunjung sebelum event dibuka.",
  ],
  [
    "Bagaimana urutan antrean ditentukan?",
    "Gunakan FIFO untuk mendahulukan pengunjung yang datang lebih awal. Untuk event terjadwal, Anda juga bisa mengacak urutan peserta pre-queue saat gerbang dibuka. Pengunjung yang datang setelahnya masuk di belakang antrean tersebut.",
  ],
  [
    "Bisa melindungi halaman checkout saja?",
    "Bisa. Room dapat diterapkan pada seluruh domain atau hanya path tertentu, seperti /checkout. Anda menentukan bagian situs yang perlu dilindungi saat menyiapkan room.",
  ],
  [
    "Apakah halaman antrean bisa memakai brand sendiri?",
    "Bisa. Setiap room mendukung custom HTML. Sesuaikan tampilan dengan identitas event atau brand Anda, sambil tetap menampilkan posisi antrean dan estimasi waktu tunggu.",
  ],
  [
    "Bagaimana cara mendapatkan akses?",
    "Akun dashboard disiapkan oleh administrator workspace Anda. Admin juga dapat menambahkan anggota tim untuk mengelola atau memantau room.",
  ],
];

// Scenario_Section (Req 2). Me-render section `#skenario` dengan heading `h2`
// (`aria-labelledby`) lalu me-map `scenarios` menjadi daftar (`ul`) skenario
// (Req 2.1). Tiap item menampilkan label sebagai `h3` (tanpa melompati level
// heading) plus kalimat hasil singkat dari `outcome` (Req 2.3). Entri musiman
// (`seasonal: true`, Req 2.2) ditandai dengan badge "Musiman" yang terlihat.
// Seluruh salinan berbahasa Indonesia (Req 2.4).
function Scenarios() {
  return (
    <section
      className="lp-scenarios lp-container"
      id="skenario"
      aria-labelledby="scenarios-title"
    >
      <div className="lp-section-intro">
        <h2 id="scenarios-title">Momen yang paling ramai dinanti.</h2>
        <p>
          Dari penjualan tiket sampai puncak musiman, Antosan menjaga situs
          tetap dapat diakses saat semua orang datang bersamaan.
        </p>
      </div>
      <ul className="lp-scenario-list">
        {scenarios.map((scenario, index) => (
          <li key={scenario.id} className="lp-scenario-item">
            <span className="lp-scenario-number" aria-hidden="true">
              0{index + 1}
            </span>
            <div className="lp-scenario-label">
              <h3>{scenario.label}</h3>
              {scenario.seasonal && (
                <span className="lp-scenario-tag">Musiman</span>
              )}
            </div>
            <p>{scenario.outcome}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// How_It_Works_Section (Req 3). Merefresh section `#cara-kerja` yang ada:
// mempertahankan intro + `ol.lp-steps` (alur kedatangan → ruang tunggu → masuk,
// Req 3.1) dan menambahkan blok tiga mode aktivasi dari `plays` sebagai
// `<article>` statis tanpa state (Req 3.2). Tiap mode menyatakan judul,
// deskripsi, dan "kapan digunakan" (Req 3.3). Sub-item memakai `h3` tanpa
// melompati level heading (heading section adalah `h2#workflow-title`). Seluruh
// salinan berbahasa Indonesia (Req 3.5); section dapat dijangkau lewat
// Section_Anchor `#cara-kerja` (Req 3.4).
function HowItWorks() {
  return (
    <section
      className="lp-workflow lp-container"
      id="cara-kerja"
      aria-labelledby="workflow-title"
    >
      <div className="lp-section-intro">
        <h2 id="workflow-title">
          Beri ruang untuk antusiasme.
          <br />
          Atur jalannya dari awal.
        </h2>
        <p>
          Dari sebelum gerbang dibuka sampai pengunjung masuk, Anda yang
          menentukan ritmenya.
        </p>
      </div>
      <ol className="lp-steps">
        <li>
          <span className="lp-step-number">01</span>
          <h3>Tentukan batas aman.</h3>
          <p>
            Pilih domain atau halaman yang dilindungi. Atur kapasitas
            pengunjung, laju masuk, dan durasi sesi sesuai kemampuan situs.
          </p>
          <span className="lp-step-detail">Kapasitas & laju masuk</span>
        </li>
        <li>
          <span className="lp-step-number">02</span>
          <h3>Sambut dalam antrean.</h3>
          <p>
            Saat trafik padat, pengunjung mendapat tempat di ruang tunggu dengan
            posisi antrean dan estimasi waktu yang diperbarui otomatis.
          </p>
          <span className="lp-step-detail">Antrean & estimasi waktu</span>
        </li>
        <li>
          <span className="lp-step-number">03</span>
          <h3>Masuk saat gilirannya.</h3>
          <p>
            Ketika slot tersedia, pengunjung diteruskan ke situs. Pantau arus
            masuk dan sesuaikan pengaturan selama event berjalan.
          </p>
          <span className="lp-step-detail">Admisi & pemantauan langsung</span>
        </li>
      </ol>
      <div className="lp-plays">
        {plays.map((play) => (
          <article key={play.id} className="lp-play">
            <h3>{play.title}</h3>
            <p className="lp-play-description">{play.description}</p>
            <p className="lp-play-when">
              <span className="lp-play-when-label">Kapan digunakan</span>
              {play.when}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

// Fairness_Section (Req 4). Me-render section `#keadilan` dengan heading `h2`
// (`aria-labelledby`) lalu me-map `fairnessPoints` menjadi daftar (`ul`) poin
// keadilan: urutan FIFO (Req 4.1), pengacakan pre-queue untuk mulai terjadwal
// (Req 4.2), dan keadilan terhadap bot (Req 4.3). Tiap item memakai `h3` (tanpa
// melompati level heading) untuk judul plus teks penjelas dari `body`. Salinan
// tidak mengklaim pemblokiran bot secara mutlak — frasa data memakai "mengurangi
// keuntungan tidak adil dari bot" (Req 4.4). Seluruh salinan berbahasa Indonesia.
function Fairness() {
  return (
    <section
      className="lp-fairness lp-container"
      id="keadilan"
      aria-labelledby="fairness-title"
    >
      <div className="lp-section-intro">
        <h2 id="fairness-title">Giliran yang adil untuk semua.</h2>
        <p>
          Antrean Antosan menjaga urutan tetap masuk akal: yang datang lebih
          awal didahulukan, event terjadwal dimulai secara setara, dan
          pengunjung sungguhan tidak kalah oleh bot.
        </p>
      </div>
      <ul className="lp-fairness-list">
        {fairnessPoints.map((point) => (
          <li key={point.id} className="lp-fairness-item">
            <h3>{point.title}</h3>
            <p>{point.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Traffic_Control_Section (Req 5). Me-render section `#kontrol-trafik` dengan
// heading `h2` (`aria-labelledby`) lalu me-map `trafficControlPoints` menjadi
// daftar (`ul`) poin: kapasitas & laju keluar per menit (Req 5.1), penyesuaian
// laju saat event berjalan (Req 5.2), cakupan proteksi seluruh situs/path/aksi
// dinamis (Req 5.3), dan mode tampil antrean selalu-tampil vs saat-puncak
// (Req 5.4). Tiap item memakai `h3` (tanpa melompati level heading) untuk judul
// plus teks penjelas dari `body`. Kelas kontainer memakai `lp-traffic-section`
// agar tidak bentrok dengan `.lp-traffic-control` internal QueueDemo, sementara
// id tetap `#kontrol-trafik` sesuai Section_Anchor. Seluruh salinan berbahasa
// Indonesia (Req 5.5).
function TrafficControl() {
  return (
    <section
      className="lp-traffic-section lp-container"
      id="kontrol-trafik"
      aria-labelledby="traffic-control-title"
    >
      <div className="lp-section-intro">
        <h2 id="traffic-control-title">Kendali penuh atas arus masuk.</h2>
        <p>
          Atur berapa banyak pengunjung yang masuk dan seberapa cepat, lalu
          tentukan bagian situs mana yang dijaga. Semua bisa disetel sebelum dan
          selama event berlangsung.
        </p>
      </div>
      <ul className="lp-traffic-list">
        {trafficControlPoints.map((point) => (
          <li key={point.id} className="lp-traffic-item">
            <h3>{point.title}</h3>
            <p>{point.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Brand_Experience_Section (Req 7). Me-render section `#brand` dengan heading
// `h2` (`aria-labelledby`), intro yang menjelaskan bahwa halaman antrean dapat
// disesuaikan dengan identitas brand pelanggan melalui custom HTML (Req 7.1),
// lalu daftar (`ul`) dengan sub-item `h3` (tanpa melompati level heading): satu
// item menegaskan kustomisasi tampilan via custom HTML, dan satu item menegaskan
// bahwa posisi antrean serta estimasi waktu tunggu tetap ditampilkan (Req 7.2).
// Seluruh salinan berbahasa Indonesia (Req 7.3). Statis, tanpa state.
function BrandExperience() {
  return (
    <section
      className="lp-brand-experience lp-container"
      id="brand"
      aria-labelledby="brand-experience-title"
    >
      <div className="lp-section-intro">
        <h2 id="brand-experience-title">Ruang tunggu dengan identitas Anda.</h2>
        <p>
          Halaman antrean bukan halaman asing bagi pengunjung Anda. Sesuaikan
          tampilannya dengan custom HTML sehingga logo, warna, dan gaya situs
          Anda ikut hadir saat pengunjung menunggu giliran masuk.
        </p>
      </div>
      <WaitingPreview />
      <ul className="lp-brand-list">
        <li className="lp-brand-item">
          <h3>Tampil sesuai brand Anda</h3>
          <p>
            Rancang halaman antrean dengan custom HTML: pasang logo, terapkan
            warna dan tipografi merek, serta tambahkan pesan Anda sendiri. Ruang
            tunggu terasa menyatu dengan situs Anda, bukan tempat perantara yang
            terpisah.
          </p>
        </li>
        <li className="lp-brand-item">
          <h3>Informasi antrean tetap tampil</h3>
          <p>
            Sekustom apa pun tampilannya, halaman antrean selalu menampilkan
            posisi pengunjung dalam antrean dan estimasi waktu tunggu.
            Pengunjung tahu di mana giliran mereka dan berapa lama lagi
            menunggu, sehingga tetap tenang sampai masuk.
          </p>
        </li>
      </ul>
    </section>
  );
}

// Features_Section (Req 8). Merender `section.lp-features#fitur` dengan
// `aria-labelledby` ke `h2#features-title`, sebuah `dl` dari data `features`
// (`dt`/`dd`), dan `a.lp-dark-link` menuju `siteConfig.dashboardUrl` dengan
// label `siteConfig.dashboardFeatureLabel` (Req 8.5). Anchor `#fitur` dirujuk
// Navigation (Req 8.6). Statis, tanpa state — pola sama seperti section lain.
function Features() {
  return (
    <section
      className="lp-features"
      id="fitur"
      aria-labelledby="features-title"
    >
      <div className="lp-feature-layout lp-container">
        <div className="lp-feature-heading">
          <Icon name="settings" size={30} />
          <h2 id="features-title">
            Di balik keramaian,
            <br />
            Anda pegang kendali.
          </h2>
          <p>
            Siapkan event bersama tim. Saat trafik mulai naik, semua pengaturan
            penting tetap dalam jangkauan.
          </p>
          <a className="lp-dark-link" href={siteConfig.dashboardUrl}>
            {siteConfig.dashboardFeatureLabel}
            <Icon name="arrow" size={18} />
          </a>
        </div>
        <dl className="lp-feature-list">
          {features.map((feature) => (
            <div key={feature.term}>
              <dt>{feature.term}</dt>
              <dd>{feature.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// Trust_Section (Req 10). Merender `section.lp-trust#kepercayaan` dengan
// `aria-labelledby` ke `h2#trust-title`. Menampilkan `trustQuote` sebagai
// `figure`/`blockquote` beserta atribusi (author + role) di band gelap
// `.lp-trust-quote` (Req 10.1), dan `trustStats` sebagai daftar pernyataan
// keandalan/skala (Req 10.2). Karena data bersifat ilustratif
// (`illustrative: true`), penanda "Ilustrasi" (`.lp-illustrative`) ditampilkan
// terlihat agar tidak terbaca sebagai klaim pelanggan nyata (Req 10.3).
// Seluruh salinan berbahasa Indonesia (Req 10.4). Statis, tanpa state.
function Trust() {
  return (
    <section
      className="lp-trust lp-container"
      id="kepercayaan"
      aria-labelledby="trust-title"
    >
      <div className="lp-section-intro">
        <h2 id="trust-title">Diandalkan saat momen paling penting.</h2>
        <p>
          Contoh cerita dan angka berikut menggambarkan bagaimana Antosan
          menjaga situs tetap tenang saat lonjakan trafik.
        </p>
      </div>
      <figure className="lp-trust-quote">
        <blockquote>
          <p>{trustQuote.quote}</p>
        </blockquote>
        <figcaption>
          <span className="lp-trust-author">{trustQuote.author}</span>
          <span className="lp-trust-role">{trustQuote.role}</span>
          {trustQuote.illustrative ? (
            <span className="lp-illustrative">Ilustrasi</span>
          ) : null}
        </figcaption>
      </figure>
      <ul className="lp-trust-stats">
        {trustStats.map((stat) => (
          <li key={stat.label} className="lp-trust-stat">
            <span className="lp-trust-stat-value">{stat.value}</span>
            <span className="lp-trust-stat-label">{stat.label}</span>
            {stat.illustrative ? (
              <span className="lp-illustrative">Ilustrasi</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function LandingPage() {
  const menuButtonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = (
    <>
      {navLinkItems.map(({ href, label }) => (
        <a key={href} href={href}>
          {label}
        </a>
      ))}
    </>
  );
  return (
    <div className="landing-page" id="atas">
      <a className="lp-skip" href="#konten">
        Lewati navigasi
      </a>
      <div className="lp-brand-ribbon">
        <span>Antrean yang adil. Kesempatan lebih luas.</span>
        <span className="lp-ribbon-signature">A fairer way to wait.</span>
      </div>
      <header
        className="lp-header"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setMenuOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false);
            menuButtonRef.current.focus();
          }
        }}
      >
        <div className="lp-nav lp-container">
          <Brand />
          <nav className="lp-desktop-nav" aria-label="Navigasi utama">
            {navLinks}
          </nav>
          <div className="lp-nav-actions">
            <a className="lp-nav-login" href={siteConfig.dashboardUrl}>
              {siteConfig.dashboardNavLabel}
              <Icon name="arrow" size={17} />
            </a>
            <button
              className="lp-menu-toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              ref={menuButtonRef}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>
        <nav
          className="lp-mobile-nav lp-container"
          id="mobile-navigation"
          aria-label="Navigasi seluler"
          hidden={!menuOpen}
          onClick={(event) => {
            if (event.target.closest("a")) setMenuOpen(false);
          }}
        >
          {navLinks}
        </nav>
      </header>

      <main id="konten" tabIndex={-1}>
        <section className="lp-hero lp-container" aria-labelledby="hero-title">
          <div className="lp-hero-copy">
            <p className="lp-product-type">
              <span aria-hidden="true" />
              Virtual waiting room · Antosan
            </p>
            <h1 id="hero-title">
              Ramai pengunjung.
              <br />
              <span>Tetap terkendali.</span>
            </h1>
            <p className="lp-hero-description">
              Sambut antusiasme tanpa kewalahan. Antosan mengatur arus masuk
              sesuai kapasitas situs, memberi pengunjung giliran yang adil, dan
              membantu menjaga checkout tetap lancar.
            </p>
            <div className="lp-hero-actions">
              <a className="lp-button" href={siteConfig.dashboardUrl}>
                {siteConfig.dashboardLabel}
                <Icon name="arrow" size={19} />
              </a>
              <a className="lp-secondary-link" href="#cara-kerja">
                Lihat cara kerja
                <Icon name="chevron" size={16} />
              </a>
            </div>
            <p className="lp-hero-note">
              <Icon name="shield" size={15} />
              Situs tetap tenang. Pengunjung tetap mendapat giliran.
            </p>
          </div>
          <HeroVisual />
        </section>

        <div
          className="lp-values-strip lp-container"
          aria-label="Nilai Antosan"
        >
          <span>
            <Icon name="members" size={20} />
            Akses yang adil
          </span>
          <span>
            <Icon name="activity" size={20} />
            Arus yang tertib
          </span>
          <span>
            <Icon name="shield" size={20} />
            Kapasitas terjaga
          </span>
          <span>
            <Icon name="clock" size={20} />
            Menunggu lebih tenang
          </span>
        </div>

        <Scenarios />

        <HowItWorks />

        <Fairness />

        <TrafficControl />

        <section
          className="lp-simulation lp-container"
          id="simulasi"
          aria-labelledby="simulation-title"
        >
          <div className="lp-simulation-copy">
            <p className="lp-eyebrow">LIHAT ANTOSAN BEKERJA</p>
            <h2 id="simulation-title">
              Trafik naik.
              <br />
              Anda atur ritmenya.
            </h2>
            <p>
              Ubah tingkat trafik dan lihat bagaimana antrean terbentuk. Lalu,
              loloskan pengunjung secara bertahap saat situs siap menerima
              mereka.
            </p>
            <div className="lp-simulation-hint">
              <Icon name="arrow" size={20} />
              <span>Coba pilih “Lonjakan” pada simulasi.</span>
            </div>
          </div>
          <QueueDemo />
        </section>

        <BrandExperience />

        <Features />

        <Integrations />

        <Trust />

        <section
          className="lp-faq lp-container"
          id="pertanyaan"
          aria-labelledby="faq-title"
        >
          <div>
            <h2 id="faq-title">
              Sebelum
              <br />
              gerbang dibuka.
            </h2>
            <p>
              Beberapa hal yang mungkin
              <br />
              ingin Anda ketahui.
            </p>
          </div>
          <div className="lp-faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Icon name="plus" size={18} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-closing">
            <h2>
              Biarkan ramai.
              <br />
              <span>Kami bantu atur antreannya.</span>
            </h2>
            <a className="lp-button" href={siteConfig.dashboardUrl}>
              {siteConfig.dashboardLabel}
              <Icon name="arrow" size={19} />
            </a>
          </div>
          <div className="lp-footer-bottom">
            <Brand />
            <p>
              A fairer way to wait.
              <br />
              <a href={siteConfig.url}>antosan.com</a> · Ruang untuk semua.
            </p>
            <a href="#atas">
              Kembali ke atas<span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
