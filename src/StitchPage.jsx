import { useRef, useState } from "react";
import Icon from "./Icon.jsx";
import ArchitectureSimulator from "./ArchitectureSimulator.jsx";
import { siteConfig } from "./siteConfig.js";
import "./stitch.css";

function Brand({ footer = false }) {
  return (
    <a
      className={`st-brand${footer ? " st-brand-footer" : ""}`}
      href="#atas"
      aria-label="Antosan, beranda"
    >
      <img src="/images/stitch/app-icon.webp" width="44" height="44" alt="" />
      <span>
        <strong>Antosan</strong>
        <small>Virtual Waiting Room</small>
      </span>
    </a>
  );
}
function Action({
  children,
  href = siteConfig.dashboardUrl,
  secondary = false,
}) {
  return (
    <a
      className={`st-button${secondary ? " st-button-secondary" : ""}`}
      href={href}
    >
      {children}
      <Icon name="arrow" size={17} />
    </a>
  );
}
function SectionHeading({ title, children, id }) {
  return (
    <div className="st-section-heading">
      <h2 id={id}>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
function FeatureCard({ icon, title, children, footer, highlight = false }) {
  return (
    <article
      className={`st-glass st-feature-card${highlight ? " st-highlight" : ""}`}
    >
      <span className="st-icon">
        <Icon name={icon} size={24} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {footer && (
        <span className="st-card-footer">
          {footer}
          <Icon name="check" size={16} />
        </span>
      )}
    </article>
  );
}
function CheckList({ items }) {
  return (
    <ul className="st-checks">
      {items.map((item) => (
        <li key={item}>
          <Icon name="check" size={17} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
function HeroPreview() {
  return (
    <figure
      className="st-glass st-hero-preview"
      aria-labelledby="hero-preview-caption"
    >
      <div className="st-hero-art">
        <img
          src="/images/stitch/gateway.webp"
          width="512"
          height="288"
          alt="Pengunjung mengantre menuju gerbang Antosan berwarna teal"
          fetchPriority="high"
        />
        <span className="st-art-label">
          <i />
          Gateway Room
        </span>
        <span className="st-art-caption">Akses yang teratur</span>
      </div>
      <div className="st-waiting-card">
        <div className="st-waiting-header">
          <img
            src="/images/stitch/app-icon.webp"
            width="34"
            height="34"
            alt=""
          />
          <div>
            <strong>Live Queue Chamber</strong>
            <span>Ruang tunggu Antosan</span>
          </div>
          <span className="st-status">Giliran berikutnya</span>
        </div>
        <div className="st-waiting-message">
          <h2>Mohon bersiap, gerbang segera terbuka.</h2>
          <p>
            Anda sudah mendapat tempat. Pengunjung masuk secara bertahap saat
            kapasitas tersedia.
          </p>
        </div>
        <div className="st-waiting-progress">
          <span>
            Progres antrean <strong>99%</strong>
          </span>
          <div className="st-meter" aria-hidden="true">
            <span />
          </div>
        </div>
        <dl className="st-waiting-metrics">
          <div>
            <dt>Posisi antrean</dt>
            <dd>
              #1 <small>Berikutnya</small>
            </dd>
          </div>
          <div>
            <dt>Estimasi menunggu</dt>
            <dd>
              &lt; 1 <small>menit</small>
            </dd>
          </div>
        </dl>
        <p className="st-info">
          <Icon name="alert" size={18} />
          Tetap di halaman antrean. Anda akan masuk saat giliran tiba.
        </p>
      </div>
      <figcaption id="hero-preview-caption">
        Contoh tampilan ruang tunggu · angka ilustrasi
      </figcaption>
      <div className="st-protection-note">
        <span className="st-icon">
          <Icon name="shield" size={23} />
        </span>
        <span>
          <strong>Edge Protection</strong>
          <small>Menjaga arus menuju layanan</small>
        </span>
      </div>
    </figure>
  );
}

export default function StitchPage({
  queueDemo,
  integrations,
  faqs,
  scenarios,
  features,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const nav = [
    ["#produk", "Produk"],
    ["#solusi", "Solusi"],
    ["#metode-antrean", "Metode"],
    ["#security-controls", "Keamanan"],
    ["#arsitektur", "Arsitektur"],
    ["#harga", "Kebutuhan"],
  ];
  return (
    <div className="stitch-page" id="atas">
      <a className="st-skip" href="#konten">
        Lewati navigasi
      </a>
      <header
        className="st-header st-container"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuOpen(false);
            menuRef.current?.focus();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setMenuOpen(false);
        }}
      >
        <div className="st-nav">
          <Brand />
          <nav className="st-desktop-nav" aria-label="Navigasi utama">
            {nav.map(([href, label]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="st-nav-actions">
            <a className="st-nav-docs" href={siteConfig.connectorDocsUrl}>
              Dokumentasi
            </a>
            <a className="st-button st-nav-cta" href={siteConfig.dashboardUrl}>
              {siteConfig.dashboardNavLabel}
            </a>
            <button
              ref={menuRef}
              className="st-menu-toggle"
              type="button"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              aria-controls="st-mobile-navigation"
              onClick={() => setMenuOpen((value) => !value)}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={23} />
            </button>
          </div>
        </div>
        <nav
          className="st-mobile-nav"
          id="st-mobile-navigation"
          aria-label="Navigasi seluler"
          hidden={!menuOpen}
          onClick={(event) => {
            if (event.target.closest("a")) setMenuOpen(false);
          }}
        >
          {nav.map(([href, label]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
          <a href={siteConfig.connectorDocsUrl}>Dokumentasi</a>
        </nav>
      </header>
      <main id="konten" tabIndex={-1}>
        <section
          className="st-hero st-container"
          id="produk"
          aria-labelledby="st-hero-title"
        >
          <div className="st-hero-copy">
            <p className="st-product-label">
              <i />
              Virtual Waiting Room
            </p>
            <h1 id="st-hero-title">
              Tetap Tenang dan Stabil <span>di Saat Trafik Memuncak</span>
            </h1>
            <p className="st-hero-subtitle">
              Antrean tertib, akses lebih baik.
            </p>
            <p className="st-hero-description">
              Antosan membantu Anda mengelola lonjakan pengunjung dengan antrean
              digital yang tenang, transparan, dan teratur. Beri origin server
              ruang untuk melayani.
            </p>
            <div className="st-hero-actions">
              <Action>{siteConfig.dashboardLabel}</Action>
              <Action href={siteConfig.connectorDocsUrl} secondary>
                Lihat dokumentasi
              </Action>
            </div>
            <ul className="st-hero-highlights">
              <li>
                <Icon name="shield" size={17} />
                Kapasitas terkendali
              </li>
              <li>
                <Icon name="check" size={17} />
                Integrasi fleksibel
              </li>
              <li>
                <Icon name="members" size={17} />
                Giliran yang adil
              </li>
            </ul>
          </div>
          <HeroPreview />
        </section>

        <section
          className="st-section st-container"
          id="solusi"
          aria-labelledby="benefits-title"
        >
          <SectionHeading
            id="benefits-title"
            title="Tenang di depan. Terkendali di belakang."
          >
            Pengalaman yang lebih nyaman untuk pengunjung, dengan kendali yang
            jelas untuk tim Anda.
          </SectionHeading>
          <div className="st-grid st-grid-four">
            <FeatureCard
              icon="shield"
              title="Server Overload Protection"
              footer="Lindungi kapasitas origin"
            >
              Batasi pengunjung aktif dan atur laju masuk agar beban mengikuti
              kapasitas layanan Anda.
            </FeatureCard>
            <FeatureCard
              icon="members"
              title="Deterministic FIFO Queue"
              footer="Urutan yang transparan"
            >
              Berikan giliran berdasarkan kedatangan, lengkap dengan posisi
              antrean dan estimasi menunggu.
            </FeatureCard>
            <FeatureCard
              icon="globe"
              title="Edge Integration"
              footer="Masuk ke stack Anda"
            >
              Hubungkan antrean melalui reverse proxy atau connector di edge
              seperti Cloudflare Workers dan CloudFront.
            </FeatureCard>
            <FeatureCard
              icon="settings"
              title="Bot & Access Controls"
              footer="Verifikasi sebelum masuk"
            >
              Kurangi keuntungan tidak adil dari bot dengan challenge dan aturan
              akses yang dapat Anda sesuaikan.
            </FeatureCard>
          </div>
        </section>

        <section
          className="st-section st-container"
          id="brand"
          aria-labelledby="gate-title"
        >
          <div className="st-glass st-brand-story">
            <div>
              <h2 id="gate-title">
                Satu gerbang.
                <br />
                Ruang untuk semua.
              </h2>
              <p>
                Bentuk huruf A menjadi simbol akses yang terkontrol. Pengunjung
                mendapat tempat yang jelas, sementara layanan Anda tetap punya
                ruang untuk menerima mereka.
              </p>
              <CheckList
                items={[
                  "Halaman antrean dapat mengikuti logo, warna, dan identitas brand Anda.",
                  "Posisi antrean dan estimasi menunggu memberi kejelasan sepanjang perjalanan.",
                ]}
              />
            </div>
            <div className="st-logo-showcase">
              <figure>
                <img
                  src="/images/stitch/wordmark.webp"
                  width="512"
                  height="384"
                  alt="Logo Antosan Gate"
                  loading="lazy"
                />
                <figcaption>
                  Antosan Gate<span>Akses yang teratur</span>
                </figcaption>
              </figure>
              <figure>
                <img
                  src="/images/stitch/app-icon.webp"
                  width="112"
                  height="112"
                  alt="Ikon Antosan"
                  loading="lazy"
                />
                <figcaption>
                  Simbol Antosan<span>Ruang untuk menunggu</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section
          className="st-section st-container"
          id="arsitektur"
          aria-labelledby="flow-title"
        >
          <span id="cara-kerja" className="st-anchor" />
          <SectionHeading
            id="flow-title"
            title="Cara Antosan menjaga alur layanan Anda."
          >
            Antrean berada sebelum origin. Pengunjung masuk ketika layanan Anda
            siap menerima.
          </SectionHeading>
          <ol className="st-grid st-grid-three st-steps">
            <li className="st-glass">
              <span className="st-step">1</span>
              <h3>Deteksi trafik masuk</h3>
              <p>
                Tentukan batas kapasitas dan laju masuk. Saat ambang tercapai,
                pengunjung baru diarahkan ke ruang tunggu.
              </p>
              <span className="st-card-footer">Aktif ketika dibutuhkan</span>
            </li>
            <li className="st-glass st-highlight">
              <span className="st-step">2</span>
              <h3>Antre dengan teratur</h3>
              <p>
                Pengunjung mendapat giliran dan informasi antrean, tanpa
                langsung menambah beban transaksi pada origin.
              </p>
              <span className="st-card-footer">Pengalaman yang informatif</span>
            </li>
            <li className="st-glass">
              <span className="st-step">3</span>
              <h3>Masuk saat ada ruang</h3>
              <p>
                Akses diberikan bertahap sesuai pengaturan. Pantau kondisi dan
                sesuaikan laju selama event berlangsung.
              </p>
              <span className="st-card-footer">Kapasitas tetap terkendali</span>
            </li>
          </ol>
        </section>

        <section
          className="st-section st-container"
          id="metode-antrean"
          aria-labelledby="methods-title"
        >
          <span id="keadilan" className="st-anchor" />
          <SectionHeading
            id="methods-title"
            title="Pilih ritme antrean yang paling tepat."
          >
            Momen yang berbeda memerlukan cara masuk yang berbeda. Atur metode
            sesuai kebutuhan room.
          </SectionHeading>
          <div className="st-grid st-grid-four">
            <FeatureCard
              icon="members"
              title="First-Come, First-Served"
              footer="FIFO"
            >
              Dahulukan pengunjung yang datang lebih awal. Cocok untuk arus
              pengunjung yang berjalan sepanjang hari.
            </FeatureCard>
            <FeatureCard
              icon="rooms"
              title="Fair Lottery"
              footer="Pengacakan pre-queue"
              highlight
            >
              Acak urutan peserta yang menunggu sebelum pembukaan, agar setiap
              peserta awal mendapat kesempatan setara.
            </FeatureCard>
            <FeatureCard
              icon="arrow"
              title="Passthrough Mode"
              footer="Akses langsung"
            >
              Teruskan pengunjung tanpa antrean ketika Anda memilih akses
              terbuka. Gunakan sesuai kesiapan origin.
            </FeatureCard>
            <FeatureCard
              icon="shield"
              title="Reject Safety Mode"
              footer="Gerbang ditutup"
            >
              Tutup akses room sementara dan tampilkan halaman informasi saat
              layanan belum siap menerima pengunjung.
            </FeatureCard>
          </div>
        </section>

        <section
          className="st-section st-container"
          id="kontrol-trafik"
          aria-label="Akses prioritas dan kapasitas adaptif"
        >
          <div className="st-grid st-grid-two">
            <article className="st-glass st-large-card">
              <span className="st-icon">
                <Icon name="members" size={24} />
              </span>
              <h2>
                Priority Access &<br />
                Invitation Codes
              </h2>
              <p>
                Sediakan jalur masuk khusus bagi anggota, mitra, atau pemegang
                kode undangan. Kelola akses prioritas sesuai kebutuhan event
                Anda.
              </p>
              <CheckList
                items={[
                  "Kode undangan untuk pengunjung yang memenuhi syarat.",
                  "Akses khusus dikelola bersama aturan room Anda.",
                ]}
              />
              <a className="st-card-footer st-text-link" href="#simulasi">
                Coba kode VIP pada simulasi
                <Icon name="arrow" size={17} />
              </a>
            </article>
            <article className="st-glass st-large-card">
              <span className="st-icon">
                <Icon name="activity" size={24} />
              </span>
              <h2>
                Adaptive
                <br />
                Concurrency Control
              </h2>
              <p>
                Dalam mode reverse proxy, kapasitas efektif dapat mengikuti
                kesehatan origin. Saat latensi atau tingkat error meningkat,
                batas diturunkan; saat pulih, kapasitas dinaikkan bertahap.
              </p>
              <div className="st-adaptive-example">
                <span>Contoh batas pengunjung aktif</span>
                <div className="st-meter" aria-hidden="true">
                  <span />
                </div>
                <dl>
                  <div>
                    <dt>Floor limit</dt>
                    <dd>500</dd>
                  </div>
                  <div>
                    <dt>Effective limit</dt>
                    <dd>3.000</dd>
                  </div>
                  <div>
                    <dt>Max active</dt>
                    <dd>8.000</dd>
                  </div>
                </dl>
              </div>
              <span className="st-card-footer">
                Menyesuaikan kondisi origin
                <Icon name="activity" size={17} />
              </span>
            </article>
          </div>
        </section>

        <section
          className="st-section st-container"
          id="security-controls"
          aria-labelledby="security-title"
        >
          <SectionHeading
            id="security-title"
            title="Kontrol trafik dan verifikasi berlapis."
          >
            Siapkan jadwal peluncuran, pilih challenge, dan tentukan siapa yang
            dapat mengakses layanan.
          </SectionHeading>
          <div className="st-glass st-schedule">
            <div>
              <h3>
                Event Scheduling &<br />
                Pre-Queue Countdown
              </h3>
              <p>
                Buka gerbang pada waktu yang tepat. Pengunjung awal menunggu
                dalam pre-queue sebelum pembukaan yang Anda tentukan.
              </p>
              <CheckList
                items={[
                  "Tetapkan tanggal dan waktu pembukaan untuk setiap room.",
                  "Gunakan FIFO atau pengacakan peserta awal sesuai metode antrean.",
                ]}
              />
            </div>
            <div className="st-countdown-preview">
              <div>
                <strong>Contoh jadwal room</strong>
                <span className="st-status">Terjadwal</span>
              </div>
              <dl>
                <div>
                  <dt>Mode</dt>
                  <dd>Opens at</dd>
                </div>
                <div>
                  <dt>Tanpa jadwal</dt>
                  <dd>Selalu terbuka</dd>
                </div>
              </dl>
              <div className="st-countdown">
                <span>PRE-QUEUE COUNTDOWN</span>
                <strong>00 : 14 : 59</strong>
                <small>Ilustrasi tampilan sebelum pembukaan</small>
              </div>
            </div>
          </div>
          <div className="st-subheading">
            <h3>Adaptive Bot Challenge Engine</h3>
            <p>
              Pilih verifikasi sesuai kebutuhan pengunjung dan tingkat
              perlindungan layanan.
            </p>
          </div>
          <div className="st-grid st-grid-four">
            <FeatureCard
              icon="plus"
              title="Math Challenge"
              footer="Verifikasi sederhana"
            >
              Pertanyaan aritmetika ringan untuk menyaring otomatisasi sederhana
              sebelum masuk antrean.
            </FeatureCard>
            <FeatureCard
              icon="settings"
              title="Proof of Work"
              footer="Beban komputasi adaptif"
              highlight
            >
              Tantangan komputasi di peramban, dengan tingkat kesulitan yang
              mengikuti kedalaman antrean.
            </FeatureCard>
            <FeatureCard
              icon="activity"
              title="Cloudflare Turnstile"
              footer="Verifikasi di server"
            >
              Integrasikan widget Turnstile menggunakan konfigurasi dan
              kredensial provider Anda.
            </FeatureCard>
            <FeatureCard
              icon="shield"
              title="hCaptcha"
              footer="Pilihan provider"
            >
              Gunakan challenge hCaptcha dengan hasil yang diverifikasi sebelum
              pengunjung diteruskan.
            </FeatureCard>
          </div>
          <div className="st-glass st-access-rules">
            <h3>Edge Deny Lists & Access Rules</h3>
            <p>
              Atur batas akses sebelum pengunjung memasuki antrean atau aplikasi
              utama.
            </p>
            <div className="st-grid st-grid-three">
              <div>
                <Icon name="shield" size={23} />
                <h4>Blocked IPs / CIDR</h4>
                <p>
                  Tolak alamat atau rentang IP yang Anda tetapkan melalui deny
                  list.
                </p>
                <code>403 Forbidden</code>
              </div>
              <div>
                <Icon name="globe" size={23} />
                <h4>Blocked Countries</h4>
                <p>
                  Batasi negara berdasarkan header geolokasi ketika domain
                  berada di belakang Cloudflare.
                </p>
                <code>ISO 3166-1 alpha-2</code>
              </div>
              <div>
                <Icon name="arrow" size={23} />
                <h4>Bypass Paths</h4>
                <p>
                  Berikan jalur langsung untuk aset, webhook, atau path yang
                  tidak perlu antre.
                </p>
                <code>/assets/*</code>
              </div>
            </div>
          </div>
        </section>

        <ArchitectureSimulator />
        <section
          className="st-simple-demo st-container"
          aria-label="Simulasi antrean sederhana"
        >
          <details>
            <summary>
              Ingin mulai dari contoh yang lebih sederhana?
              <Icon name="plus" size={20} />
            </summary>
            <div className="st-simple-demo-body">
              <p>
                Ubah tingkat trafik, lalu loloskan pengunjung sedikit demi
                sedikit.
              </p>
              {queueDemo}
            </div>
          </details>
        </section>

        <section
          className="st-section st-container"
          id="skenario"
          aria-labelledby="usecases-title"
        >
          <SectionHeading
            id="usecases-title"
            title="Siap menyambut momen yang dinanti."
          >
            Dari pembukaan penjualan sampai puncak musiman, beri antusiasme
            pengunjung jalur yang teratur.
          </SectionHeading>
          <div className="st-usecases">
            {scenarios.map((item) => (
              <article className="st-glass" key={item.id}>
                <h3>{item.label}</h3>
                <p>
                  {item.id === "tiket"
                    ? "Atur pembukaan penjualan dan beri pembeli giliran yang jelas."
                    : item.id === "flashsale"
                      ? "Kendalikan pengunjung menuju checkout saat promosi dimulai."
                      : item.id === "registrasi"
                        ? "Beri pendaftar akses bertahap sesuai kapasitas portal."
                        : item.id === "peluncuran"
                          ? "Siapkan pre-queue sebelum produk yang dinanti dirilis."
                          : "Sesuaikan kapasitas untuk libur, hari besar, dan periode ramai."}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="st-section st-container"
          id="fitur"
          aria-labelledby="team-title"
        >
          <div className="st-glass st-team">
            <div>
              <h2 id="team-title">
                Satu dashboard.
                <br />
                Kendali bersama tim.
              </h2>
              <p>
                Siapkan room sebelum event, pantau saat ramai, dan hadirkan
                ruang tunggu yang terasa seperti brand Anda.
              </p>
              <Action>{siteConfig.dashboardFeatureLabel}</Action>
            </div>
            <dl>
              {features.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>{item.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <div className="st-integrations">{integrations}</div>

        <section
          className="st-section st-container"
          id="harga"
          aria-labelledby="needs-title"
        >
          <SectionHeading
            id="needs-title"
            title="Sesuaikan dengan kebutuhan Anda."
          >
            Mulai dari skenario penggunaan, kapasitas origin, dan cara
            integrasi. Rincian paket dan harga belum dipublikasikan.
          </SectionHeading>
          <div className="st-grid st-grid-three st-needs">
            <article className="st-glass">
              <h3>Untuk satu event</h3>
              <p>
                Persiapkan satu momen pembukaan dengan jadwal, pre-queue, dan
                kapasitas yang terukur.
              </p>
              <CheckList
                items={[
                  "Penjualan tiket atau registrasi",
                  "Jadwal pembukaan",
                  "Identitas event pada antrean",
                ]}
              />
              <Action href="#simulasi" secondary>
                Coba skenario event
              </Action>
            </article>
            <article className="st-glass st-highlight">
              <h3>Untuk trafik rutin</h3>
              <p>
                Tempatkan antrean sebagai penjaga ketika kunjungan harian
                melewati kapasitas layanan.
              </p>
              <CheckList
                items={[
                  "Antrean aktif sesuai ambang",
                  "Pemantauan trafik",
                  "Pengaturan laju masuk",
                ]}
              />
              <Action href="#integrasi">Pelajari integrasi</Action>
            </article>
            <article className="st-glass">
              <h3>Untuk banyak layanan</h3>
              <p>
                Atur kebutuhan beberapa room dan kolaborasikan operasional
                bersama anggota workspace.
              </p>
              <CheckList
                items={[
                  "Room dan workspace",
                  "Akses anggota tim",
                  "Kontrol per layanan",
                ]}
              />
              <Action href={siteConfig.connectorDocsUrl} secondary>
                Baca panduan
              </Action>
            </article>
          </div>
        </section>

        <section
          className="st-section st-container st-faq"
          id="pertanyaan"
          aria-labelledby="faq-title"
        >
          <div>
            <h2 id="faq-title">Sebelum gerbang dibuka.</h2>
            <p>Beberapa hal yang mungkin ingin Anda ketahui.</p>
          </div>
          <div>
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Icon name="plus" size={20} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section
          className="st-section st-container"
          id="hubungi"
          aria-labelledby="cta-title"
        >
          <div className="st-final-cta">
            <h2 id="cta-title">
              Beri ruang untuk antusiasme.
              <br />
              Kami bantu atur antreannya.
            </h2>
            <p>
              Siapkan pengalaman akses yang tertib, tenang, dan sesuai kapasitas
              layanan Anda.
            </p>
            <div className="st-hero-actions">
              <Action>{siteConfig.dashboardLabel}</Action>
              <Action href={siteConfig.connectorDocsUrl} secondary>
                Lihat dokumentasi
              </Action>
            </div>
          </div>
        </section>
      </main>
      <footer className="st-footer">
        <div className="st-container">
          <div className="st-footer-grid">
            <div>
              <Brand footer />
              <p>
                Antrean yang tertib, akses yang lebih baik.
                <br />
                Ruang untuk semua.
              </p>
              <a href={siteConfig.url}>antosan.com</a>
            </div>
            <div>
              <h2>Produk</h2>
              <a href="#produk">Virtual Waiting Room</a>
              <a href="#metode-antrean">Metode antrean</a>
              <a href="#security-controls">Keamanan</a>
              <a href="#simulasi">Simulasi interaktif</a>
            </div>
            <div>
              <h2>Solusi</h2>
              <a href="#skenario">Penjualan tiket</a>
              <a href="#skenario">Flash sale</a>
              <a href="#skenario">Registrasi event</a>
              <a href="#brand">Identitas antrean</a>
            </div>
            <div>
              <h2>Pelajari</h2>
              <a href="#arsitektur">Cara kerja</a>
              <a href="#integrasi">Integrasi</a>
              <a href={siteConfig.connectorDocsUrl}>Dokumentasi</a>
              <a href="#pertanyaan">Pertanyaan umum</a>
            </div>
          </div>
          <div className="st-footer-bottom">
            <span>© {new Date().getFullYear()} Antosan.</span>
            <span>Antrean yang adil. Kesempatan lebih terbuka.</span>
            <a href="#atas">Kembali ke atas ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
