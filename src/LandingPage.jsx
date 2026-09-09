import React, { useRef, useState } from "react";
import Mark from "./Mark.jsx";
import Icon from "./Icon.jsx";
import { siteConfig } from "./siteConfig.js";
import "./landing.css";

const trafficLevels = [
  { label: "Normal", visitors: 6 },
  { label: "Ramai", visitors: 18 },
  { label: "Lonjakan", visitors: 30 },
];
const capacity = 8;

function Brand() {
  return (
    <a className="lp-brand" href="/" aria-label="waitingroom, beranda">
      <Mark />
      <span>
        waitingroom<span className="lp-period">.</span>
      </span>
    </a>
  );
}

function QueueDemo() {
  const [level, setLevel] = useState(1);
  const [released, setReleased] = useState(0);
  const visitors = trafficLevels[level].visitors;
  const remaining = visitors - released;
  const active = Math.min(remaining, capacity);
  const queued = Math.max(0, remaining - capacity);

  function changeLevel(index) {
    setLevel(index);
    setReleased(0);
  }

  return (
    <figure className="lp-demo" id="simulasi" aria-labelledby="demo-title">
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
          <span>waitingroom</span>
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
          {queued > 0
            ? "Coba kosongkan 4 slot di situs."
            : "Ubah trafik untuk mencoba lagi."}
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
      "Arahkan domain ke gateway waitingroom. Setiap kunjungan melewati aturan antrean sebelum diteruskan ke server situs Anda.",
    path: ["Pengunjung", "Gateway waitingroom", "Situs Anda"],
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
      "DNS tetap dikelola di sisi Anda",
      "Cloudflare Workers dan AWS CloudFront",
      "Trafik situs tidak melewati gateway kami",
    ],
  },
};

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
              <span>Halaman antrean waitingroom</span>
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

const faqs = [
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
    "Masuk ke dashboard menggunakan akun dari administrator Anda. Akun dikelola oleh administrator platform, dan admin workspace dapat menambahkan anggota tim untuk mengelola atau memantau room.",
  ],
];

export default function LandingPage() {
  const menuButtonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = (
    <>
      <a href="#cara-kerja">Cara kerja</a>
      <a href="#fitur">Fitur</a>
      <a href="#integrasi">Integrasi</a>
      <a href="#pertanyaan">FAQ</a>
    </>
  );
  return (
    <div className="landing-page" id="atas">
      <a className="lp-skip" href="#konten">
        Lewati navigasi
      </a>
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
              Antrean virtual untuk momen besar
            </p>
            <h1 id="hero-title">
              Ramai pengunjung.
              <br />
              <span>Tetap terkendali.</span>
            </h1>
            <p className="lp-hero-description">
              Sambut lonjakan trafik dengan antrean yang tertata. Jaga kapasitas
              situs, beri setiap pengunjung giliran, dan kendalikan arus masuk
              dari satu tempat.
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
              Kapasitas Anda. Aturan Anda.
            </p>
          </div>
          <QueueDemo />
        </section>

        <div className="lp-use-cases lp-container">
          <p>
            Siap untuk momen
            <br />
            <strong>yang ramai dinanti.</strong>
          </p>
          <ul aria-label="Contoh penggunaan">
            <li>
              Penjualan tiket
              <Icon name="arrow" size={17} />
            </li>
            <li>
              Flash sale
              <Icon name="arrow" size={17} />
            </li>
            <li>
              Registrasi event
              <Icon name="arrow" size={17} />
            </li>
            <li>
              Peluncuran produk
              <Icon name="arrow" size={17} />
            </li>
          </ul>
        </div>

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
                Saat trafik padat, pengunjung mendapat tempat di ruang tunggu
                dengan posisi antrean dan estimasi waktu yang diperbarui
                otomatis.
              </p>
              <span className="lp-step-detail">Antrean & estimasi waktu</span>
            </li>
            <li>
              <span className="lp-step-number">03</span>
              <h3>Masuk saat gilirannya.</h3>
              <p>
                Ketika slot tersedia, pengunjung diteruskan ke situs. Pantau
                arus masuk dan sesuaikan pengaturan selama event berjalan.
              </p>
              <span className="lp-step-detail">
                Admisi & pemantauan langsung
              </span>
            </li>
          </ol>
        </section>

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
                Siapkan event bersama tim. Saat trafik mulai naik, semua
                pengaturan penting tetap dalam jangkauan.
              </p>
              <a className="lp-dark-link" href={siteConfig.dashboardUrl}>
                {siteConfig.dashboardFeatureLabel}
                <Icon name="arrow" size={18} />
              </a>
            </div>
            <dl className="lp-feature-list">
              <div>
                <dt>Jadwalkan momen pembukaan.</dt>
                <dd>
                  Pre-queue dengan hitung mundur. Pilih urutan FIFO atau
                  pengacakan peserta sebelum event dimulai.
                </dd>
              </div>
              <div>
                <dt>Pantau situasi saat itu juga.</dt>
                <dd>
                  Lihat pengunjung aktif, panjang antrean, estimasi tunggu, dan
                  riwayat trafik 24 jam dari dashboard.
                </dd>
              </div>
              <div>
                <dt>Ruang tunggu, identitas Anda.</dt>
                <dd>
                  Gunakan custom HTML untuk menyesuaikan halaman antrean dengan
                  brand atau tema event.
                </dd>
              </div>
              <div>
                <dt>Atur akses bersama tim.</dt>
                <dd>
                  Pisahkan room dalam workspace. Berikan peran admin atau akses
                  pantau kepada anggota tim.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <Integrations />

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
            <p>Ruang untuk semua. Giliran untuk setiap orang.</p>
            <a href="#atas">
              Kembali ke atas<span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
