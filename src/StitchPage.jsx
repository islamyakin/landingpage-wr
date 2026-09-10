import { useRef, useState } from "react";
import Icon from "./Icon.jsx";
import ArchitectureSimulator from "./ArchitectureSimulator.jsx";
import SubscribePanel from "./SubscribePanel.jsx";
import {
  siteConfig,
  entryPackage,
  entryPackagePriced,
  entryPackageLimits,
  entryPriceHeadline,
  formatIDR,
} from "./siteConfig.js";
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
          srcSet="/images/stitch/gateway-640.webp 640w, /images/stitch/gateway.webp 1280w"
          sizes="(min-width: 1024px) 545px, (min-width: 768px) 595px, 90vw"
          width="1280"
          height="720"
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
          <h2>Sebentar lagi giliran Anda. </h2>
          <p>
            Tempat Anda sudah aman. Akses akan diberikan secara bertahap saat kapasitas tersedia.
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
    ["#otomasi", "Otomasi"],
    ["#arsitektur", "Arsitektur"],
    ["#harga", "Harga"],
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
              Traffic rame? Santai,<span>Antosan yang atur.</span>
            </h1>
            <p className="st-hero-subtitle">Antosan dulu. Biar server nggak langsung diserbu.</p>
            <p className="st-hero-description">
              Antosan membantu mengatur lonjakan pengunjung lewat virtual waiting room. Akses dibuka bertahap sesuai kapasitas, jadi aplikasi tetap lancar meski banyak orang datang bersamaan.
            </p>
            <div className="st-hero-actions">
              <Action>{siteConfig.dashboardLabel}</Action>
              <Action href={siteConfig.subscribeUrl} secondary>
                {siteConfig.subscribeLabel}
              </Action>
            </div>
            <ul className="st-hero-highlights">
              <li className="st-highlight-price">
                <a href="#harga">
                  <Icon name="activity" size={17} />
                  {entryPriceHeadline()}
                </a>
              </li>
              <li>
                <Icon name="shield" size={17} />
                Batasi akses sesuai kapasitas
              </li>
              <li>
                <Icon name="members" size={17} />
                FIFO atau Random
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
                Terbitkan kode sekali pakai untuk anggota, mitra, atau pemegang
                tiket. Pemegang kode masuk lewat tautan tiket dan melewati
                antrean, tetap melalui verifikasi anti-bot.
              </p>
              <CheckList
                items={[
                  "Generate batch kode acak atau impor kode dari sistem tiket Anda.",
                  "Admisi prioritas mengabaikan batas kapasitas - beban diatur lewat jumlah kode yang diterbitkan.",
                  "Kode ditukar sekali pakai secara atomik, dan bisa dicabut kapan pun.",
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
          <div className="st-subheading">
            <h3>Proteksi bawaan, tanpa konfigurasi</h3>
            <p>
              Berlaku otomatis di setiap room, sebelum pengunjung menyentuh
              antrean.
            </p>
          </div>
          <div className="st-grid st-grid-three">
            <FeatureCard
              icon="clock"
              title="Rate limit per-IP"
              footer="429 + Retry-After"
            >
              Penerbitan dan verifikasi challenge dibatasi per alamat IP, jadi
              satu sumber tidak bisa membanjiri CPU gateway.
            </FeatureCard>
            <FeatureCard
              icon="shield"
              title="Token terikat IP"
              footer="Satu solve, satu sumber"
            >
              Challenge yang sudah dipecahkan tidak bisa dipakai ulang dari
              alamat lain. Cookie sesi sengaja tidak diikat IP agar pengguna
              seluler yang berpindah jaringan tidak terlempar keluar.
            </FeatureCard>
            <FeatureCard
              icon="settings"
              title="Rotasi kunci connector"
              footer="Overlap window"
            >
              Kunci connector dirotasi dengan masa tumpang tindih: kunci lama
              masih diterima sampai rotasi berikutnya, jadi deploy di edge Anda
              tidak perlu serentak.
            </FeatureCard>
          </div>
        </section>

        <section
          className="st-section st-container"
          id="operasional"
          aria-labelledby="ops-title"
        >
          <SectionHeading id="ops-title" title="Kendali selama event berjalan.">
            Ketika antrean sudah hidup, yang Anda butuhkan bukan konfigurasi
            baru - melainkan sakelar yang jelas dan angka yang jujur.
          </SectionHeading>
          <div className="st-grid st-grid-four">
            <FeatureCard
              icon="rooms"
              title="Tahan Barisan"
              footer="Mode maintenance"
            >
              Tahan seluruh pengunjung tanpa mengadmit siapa pun, untuk jendela
              pemeliharaan atau menunggu aba-aba manual sebelum dibuka.
            </FeatureCard>
            <FeatureCard
              icon="clock"
              title="Kendali Sesi"
              footer="Idle atau batas keras"
              highlight
            >
              Sesi diperpanjang selama pengunjung aktif, jadi durasi sesi
              berlaku sebagai batas diam. Pilih batas keras absolut bila giliran
              harus benar-benar bergulir.
            </FeatureCard>
            <FeatureCard
              icon="close"
              title="Halaman Tutup Sendiri"
              footer="Terpisah dari antrean"
            >
              Halaman "belum dibuka" punya template sendiri, terpisah dari
              halaman antrean - keduanya menyampaikan hal yang berlawanan, jadi
              masing-masing perlu dirancang.
            </FeatureCard>
            <FeatureCard
              icon="activity"
              title="Angka Operasional"
              footer="Yang dipantau saat ramai"
            >
              Laju admisi per menit, estimasi tunggu, dan penanda satu identitas
              yang terlihat dari perangkat berbeda - sinyal, bukan putusan.
            </FeatureCard>
          </div>
        </section>

        <section
          className="st-section st-container"
          id="otomasi"
          aria-labelledby="automation-title"
        >
          <SectionHeading
            id="automation-title"
            title="Beri kabar ke sistem Anda."
          >
            Antrean tidak perlu ditunggui. Ia mengabari sistem Anda saat keadaan
            berubah, dan bisa menjawab sebagai data ketika yang bertanya adalah
            aplikasi.
          </SectionHeading>
          <div className="st-grid st-grid-two">
            <article className="st-glass st-large-card">
              <span className="st-icon">
                <Icon name="activity" size={24} />
              </span>
              <h2>Webhook Events</h2>
              <p>
                Setiap transisi penting dikirim sebagai POST JSON ke endpoint
                Anda, ditandatangani HMAC-SHA256 agar bisa Anda verifikasi.
              </p>
              <div className="st-countdown-preview">
                <div>
                  <strong>Event per room</strong>
                  <span className="st-status">POST JSON</span>
                </div>
                <dl>
                  <div>
                    <dt>room.opened</dt>
                    <dd>Room terjadwal melewati waktu buka</dd>
                  </div>
                  <div>
                    <dt>queue.started</dt>
                    <dd>Antrean mulai terisi</dd>
                  </div>
                  <div>
                    <dt>queue.threshold</dt>
                    <dd>Antrean mencapai ambang Anda</dd>
                  </div>
                  <div>
                    <dt>queue.drained</dt>
                    <dd>Antrean kembali kosong</dd>
                  </div>
                </dl>
              </div>
              <CheckList
                items={[
                  "Tiap transisi terkirim tepat sekali, meski control plane direplikasi.",
                  "Pengiriman diulang dengan backoff sampai endpoint Anda membalas 2xx.",
                  "URL yang menunjuk alamat privat ditolak, dan redirect tidak diikuti.",
                ]}
              />
            </article>
            <article className="st-glass st-large-card">
              <span className="st-icon">
                <Icon name="settings" size={24} />
              </span>
              <h2>JSON Queue State</h2>
              <p>
                Client yang meminta JSON menerima keadaan antrean sebagai data,
                bukan halaman HTML - untuk SPA, aplikasi, atau integrasi API.
              </p>
              <div className="st-adaptive-example st-status-codes">
                <span>Status respons antrean</span>
                <div className="st-meter" aria-hidden="true">
                  <span />
                </div>
                <dl>
                  <div>
                    <dt>Default</dt>
                    <dd>200</dd>
                  </div>
                  <div>
                    <dt>Diproses</dt>
                    <dd>202</dd>
                  </div>
                  <div>
                    <dt>Ditahan</dt>
                    <dd>429</dd>
                  </div>
                </dl>
              </div>
              <CheckList
                items={[
                  "Aktifkan per room, dipicu oleh header Accept dari client.",
                  "Pilih status HTTP respons antrean sesuai cara client Anda menanganinya.",
                ]}
              />
            </article>
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
            title="Mulai dari satu event."
          >
            Antosan dijual per event, bukan langganan bulanan. Anda hanya
            membayar untuk momen yang perlu dijaga.
          </SectionHeading>
          <div className="st-grid st-grid-two st-needs">
            <article className="st-glass st-highlight st-package">
              <h3>{entryPackage.name}</h3>
              <div className="st-price">
                {entryPackagePriced ? (
                  <>
                    <strong>{formatIDR(entryPackage.priceIDR)}</strong>
                    <span>per event</span>
                  </>
                ) : (
                  <>
                    <strong>Buat hype-nya. Bukan chaos-nya.</strong>
                    <span>Biar antrean-nya Antosan yang atur.</span>
                  </>
                )}
              </div>
              <p>
                Cocok untuk ticketing, registrasi, atau event dengan lonjakan trafik menengah. Atur jadwal buka, kapasitas, dan mekanisme antrean dari awal supaya saat akses dibuka, pengunjung masuk bertahap tanpa langsung membebani origin.
              </p>
              <CheckList
                items={[
                  ...entryPackageLimits(),
                  "Pre-queue sebelum event mulai lengkap dengan countdown",
                  "FIFO atau random untuk User yang sudah menunggu",
                  "Anti-bot challenge dengan captcha, aritmetika, atau proof-of-work",
                  "Waiting room sesuai brand Anda dengan logo dan warna sendiri",
                  "Pantau antrean secara live plus histori hingga 24 jam",
                ]}
              />
              <Action href={siteConfig.subscribeUrl}>
                {siteConfig.subscribeLabel}
              </Action>
            </article>
            <article className="st-glass st-package">
              <h3>Skala lebih besar</h3>
              <div className="st-price">
                <strong>Penawaran per kebutuhan</strong>
                <span>beberapa room atau trafik rutin</span>
              </div>
              <p>
                Kapasitas lebih tinggi, beberapa room sekaligus, trafik rutin
                harian, atau operasional bersama anggota workspace.
              </p>
              <CheckList
                items={[
                  "Beberapa room dalam satu workspace",
                  "Kapasitas dan laju masuk sesuai origin Anda",
                  "Mode proxy atau connector di edge Anda",
                  "Webhook event dan mode JSON untuk otomasi",
                ]}
              />
              <Action href={siteConfig.subscribeUrl} secondary>
                Kirim detail event
              </Action>
            </article>
          </div>
        </section>

        <SubscribePanel />

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
              Antosan bantu atur antreannya.
            </h2>
            <p>
              Siapkan pengalaman akses yang tertib, tenang, dan sesuai kapasitas
              layanan Anda. Langganan diatur lewat email - kami balas dengan
              harga per event dan menyiapkan room-nya.
            </p>
            <div className="st-hero-actions">
              <Action href={siteConfig.subscribeUrl}>
                {siteConfig.subscribeLabel}
              </Action>
              <Action href={siteConfig.dashboardUrl} secondary>
                {siteConfig.dashboardLabel}
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
              <a href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            </div>
            <div>
              <h2>Produk</h2>
              <a href="#produk">Virtual Waiting Room</a>
              <a href="#metode-antrean">Metode antrean</a>
              <a href="#security-controls">Keamanan</a>
              <a href="#operasional">Kendali operasional</a>
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
              <a href="#otomasi">Webhook &amp; JSON</a>
              <a href="#pertanyaan">Pertanyaan umum</a>
              <a href={siteConfig.subscribeUrl}>Berlangganan</a>
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
