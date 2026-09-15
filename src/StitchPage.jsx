import { useState } from "react";
import ArchitectureSimulator from "./ArchitectureSimulator.jsx";
import SiteLayout, { Action } from "./SiteLayout.jsx";
import Icon from "./Icon.jsx";
import { WaitingPreview } from "./BrandVisuals.jsx";
import { entryPriceHeadline, pricingPlans, formatIDR } from "./siteConfig.js";

const businessFaqs = [
  [
    "Apa itu Antosan?",
    "Antosan adalah ruang tunggu virtual yang mengatur giliran masuk ke situs Anda. Ketika banyak pengunjung datang bersamaan, sebagian menunggu agar situs dapat melayani sesuai kapasitasnya.",
  ],
  [
    "Apakah semua pengunjung harus mengantre?",
    "Tidak. Saat kapasitas masih tersedia, pengunjung bisa langsung masuk. Antrean dapat diaktifkan ketika ramai atau dijadwalkan sebelum acara dimulai.",
  ],
  [
    "Bisa dipakai untuk satu acara saja?",
    "Bisa. Paket Antosan dihitung per event. Pilih kapasitas dan tambahan fitur sesuai kebutuhan acara; detailnya tersedia di halaman Harga.",
  ],
  [
    "Apakah perlu melibatkan tim teknis?",
    "Ya, untuk menghubungkan situs dan menentukan kapasitas awal. Setelah terpasang, tim operasional dapat memantau antrean dan mengelola jadwal lewat dashboard.",
  ],
];

export default function StitchPage({ queueDemo, faqs, integrations }) {
  const [audience, setAudience] = useState(() =>
    new URLSearchParams(globalThis.location?.search).get("audience") === "tech"
      ? "technical"
      : "business",
  );
  function showAudience(next) {
    setAudience(next);
    const url = new URL(window.location.href);
    if (next === "technical") url.searchParams.set("audience", "tech");
    else url.searchParams.delete("audience");
    window.history.replaceState(null, "", url);
  }
  const isTechnical = audience === "technical";
  return (
    <SiteLayout>
      <div className="st-container st-audience-picker">
        <div>
          <p>Kenali Antosan dari sisi Anda.</p>
          <span role="status">
            {isTechnical
              ? "Arsitektur, integrasi, dan kontrol untuk tim engineering."
              : "Manfaat dan pengalaman produk untuk bisnis Anda."}
          </span>
        </div>
        <div
          className="st-audience-options"
          role="group"
          aria-label="Anda tech atau non-tech?"
        >
          <button
            type="button"
            aria-pressed={!isTechnical}
            aria-controls="audience-content"
            onClick={() => showAudience("business")}
          >
            <Icon name="members" size={18} />
            Bisnis / Non-tech
          </button>
          <button
            type="button"
            aria-pressed={isTechnical}
            aria-controls="audience-content"
            onClick={() => showAudience("technical")}
          >
            <Icon name="settings" size={18} />
            Teknis / Tech
          </button>
        </div>
      </div>
      <section
        className="st-hero st-container"
        id="produk"
        aria-labelledby="home-title"
      >
        <div className="st-hero-copy">
          <p className="st-product-label">
            <i aria-hidden="true" />
            Virtual Waiting Room
          </p>
          <h1 id="home-title">
            Traffic rame?
            <br />
            <span>Antosan yang atur.</span>
          </h1>
          <p className="st-hero-subtitle">
            {isTechnical
              ? "Kontrol akses sebelum menyentuh origin."
              : "Acara tetap jalan. Pengunjung tahu gilirannya."}
          </p>
          <p className="st-home-description">
            {isTechnical
              ? "Pasang virtual waiting room melalui reverse proxy atau edge connector. Atur kapasitas, laju admisi, dan verifikasi sebelum pengunjung masuk ke aplikasi."
              : "Antosan adalah ruang tunggu virtual untuk situs Anda. Saat pengunjung datang bersamaan, akses diatur bergiliran agar sesuai kapasitas layanan."}
          </p>
          <div className="st-hero-actions">
            <Action href="/harga">Lihat harga & paket</Action>
            <Action href="#cara-kerja" secondary>
              {isTechnical ? "Lihat arsitektur" : "Coba antreannya"}
            </Action>
          </div>
          <a className="st-home-price" href="/harga">
            {entryPriceHeadline()}
            <Icon name="arrow" size={16} />
          </a>
          <ul className="st-home-assurances">
            <li>
              <Icon name="shield" size={16} />
              Kapasitas terkendali
            </li>
            <li>
              <Icon name="members" size={16} />
              Giliran transparan
            </li>
          </ul>
        </div>
        <figure className="st-home-art" aria-labelledby="home-art-caption">
          <img
            src="/images/stitch/gateway.webp"
            srcSet="/images/stitch/gateway-640.webp 640w, /images/stitch/gateway.webp 1280w"
            sizes="(min-width: 1280px) 584px, (min-width: 901px) 45vw, 90vw"
            width="1280"
            height="720"
            alt="Pengunjung mengantre melalui gerbang Antosan berwarna teal"
            fetchPriority="high"
          />
          <figcaption id="home-art-caption">
            <span>
              <Icon name="members" size={21} />
              Pengunjung
            </span>
            <Icon name="arrow" size={18} />
            <span>
              <Icon name="shield" size={21} />
              Antosan
            </span>
            <Icon name="arrow" size={18} />
            <span>
              <Icon name="globe" size={21} />
              Situs Anda
            </span>
          </figcaption>
          <p>Satu pintu masuk. Giliran yang lebih tertib.</p>
        </figure>
      </section>

      <div id="audience-content">
        {isTechnical ? (
          <TechnicalOverview integrations={integrations} />
        ) : (
          <>
            <section
              className="st-home-occasions"
              aria-labelledby="occasions-title"
            >
              <div className="st-container">
                <h2 id="occasions-title">Untuk momen yang ramai dinanti.</h2>
                <div className="st-occasion-list">
                  {[
                    [
                      "members",
                      "Tiket & konser",
                      "Saat penjualan dibuka serentak.",
                    ],
                    [
                      "activity",
                      "Flash sale",
                      "Saat promo menarik banyak pembeli.",
                    ],
                    [
                      "rooms",
                      "Pendaftaran",
                      "Saat peserta berebut waktu masuk.",
                    ],
                    ["globe", "Layanan publik", "Saat akses datang bersamaan."],
                  ].map(([icon, title, body]) => (
                    <article key={title}>
                      <Icon name={icon} size={24} />
                      <div>
                        <h3>{title}</h3>
                        <p>{body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section
              className="st-section st-container st-home-experience"
              id="fitur"
              aria-labelledby="experience-title"
            >
              <div className="st-experience-copy">
                <h2 id="experience-title">
                  Tenang di depan.
                  <br />
                  Terkendali di belakang.
                </h2>
                <p>
                  Pengunjung tahu kapan gilirannya. Tim Anda tetap memegang
                  kendali atas arus masuk.
                </p>
                <div className="st-experience-features">
                  {[
                    [
                      "settings",
                      "Kapasitas mengikuti kemampuan situs",
                      "Tentukan jumlah pengunjung aktif dan laju masuk, lalu sesuaikan saat acara berjalan.",
                    ],
                    [
                      "members",
                      "Urutan yang jelas, akses lebih adil",
                      "Dahulukan yang datang lebih awal, atau acak giliran peserta yang sudah menunggu sebelum pembukaan.",
                    ],
                    [
                      "shield",
                      "Verifikasi sebelum masuk",
                      "Tambahkan verifikasi untuk mengurangi akses otomatis dari bot.",
                    ],
                    [
                      "globe",
                      "Tetap terasa seperti brand Anda",
                      "Sesuaikan halaman antrean, logo, dan pesan dengan identitas acara.",
                    ],
                  ].map(([icon, title, body]) => (
                    <div key={title}>
                      <Icon name={icon} size={22} />
                      <div>
                        <h3>{title}</h3>
                        <p>{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a className="st-home-text-link" href="/harga#addons">
                  Lihat pilihan fitur & add-on
                  <Icon name="arrow" size={17} />
                </a>
              </div>
              <WaitingPreview />
            </section>

            <section
              className="st-home-workflow"
              id="cara-kerja"
              aria-labelledby="how-title"
            >
              <div className="st-container st-home-workflow-grid">
                <div>
                  <h2 id="how-title">
                    Dari ramai,
                    <br />
                    jadi teratur.
                  </h2>
                  <p className="st-workflow-lead">
                    Pilih tingkat keramaian di demo dan lihat bagaimana Antosan
                    membagi pengunjung.
                  </p>
                  <ol className="st-workflow-steps">
                    {[
                      [
                        "Siapkan acara",
                        "Pilih halaman yang dilindungi, jadwal buka, dan kapasitas situs.",
                      ],
                      [
                        "Antosan mengatur antrean",
                        "Saat kapasitas penuh, pengunjung menunggu dengan giliran yang jelas.",
                      ],
                      [
                        "Masuk saat gilirannya",
                        "Pengunjung diteruskan ke situs ketika tempat tersedia.",
                      ],
                    ].map(([title, body], index) => (
                      <li key={title}>
                        <span aria-hidden="true">0{index + 1}</span>
                        <div>
                          <h3>{title}</h3>
                          <p>{body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <a className="st-home-text-link" href="/simulasi">
                    Buka simulasi lengkap
                    <Icon name="arrow" size={17} />
                  </a>
                </div>
                <div className="st-home-demo">{queueDemo}</div>
              </div>
            </section>
          </>
        )}
      </div>

      <section
        className="st-section st-container st-home-packages"
        id="harga"
        aria-labelledby="home-pricing-title"
      >
        <div className="st-home-section-top">
          <div>
            <h2 id="home-pricing-title">Acara sekali? Bayarnya juga.</h2>
            <p>Bayar per event, bukan langganan bulanan.</p>
          </div>
          <a className="st-home-text-link" href="/harga">
            Bandingkan paket
            <Icon name="arrow" size={17} />
          </a>
        </div>
        <div className="st-home-package-grid">
          {pricingPlans.map((plan) => (
            <a className="st-home-package" href="/harga" key={plan.name}>
              <span className="st-home-package-name">
                {plan.name}
                <Icon name="arrow" size={17} />
              </span>
              <strong>
                {plan.priceIDR === null
                  ? "Sesuai kebutuhan"
                  : formatIDR(plan.priceIDR)}
              </strong>
              <span>
                {plan.priceIDR === null
                  ? "Kontrak & kapasitas khusus"
                  : "/ event"}
              </span>
              <p>
                {plan.priceIDR === null
                  ? "Untuk kebutuhan organisasi Anda."
                  : `${plan.concurrentVisitors.toLocaleString("id-ID")} pengunjung bersamaan`}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section
        className="st-section st-container st-faq st-home-faq"
        id="pertanyaan"
        aria-labelledby="faq-title"
      >
        <div>
          <h2 id="faq-title">
            Sebelum mulai,
            <br />
            kenali dulu.
          </h2>
          <p>Beberapa hal yang sering ditanyakan tentang antrean Antosan.</p>
          <a className="st-home-text-link" href="/harga#berlangganan">
            Tanyakan kebutuhan Anda
            <Icon name="arrow" size={17} />
          </a>
        </div>
        <div>
          {(isTechnical ? faqs : businessFaqs)
            .slice(0, 4)
            .map(([question, answer]) => (
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

      <section
        className="st-container st-home-cta"
        aria-labelledby="home-cta-title"
      >
        <div>
          <h2 id="home-cta-title">Siap menyambut keramaian?</h2>
          <p>Ceritakan rencana acara Anda. Kita siapkan antrean yang pas.</p>
        </div>
        <Action href="/harga#berlangganan">Rencanakan acara</Action>
      </section>
    </SiteLayout>
  );
}

function TechnicalOverview({ integrations }) {
  return (
    <>
      <div className="st-integrations st-home-integrations" id="cara-kerja">
        {integrations}
      </div>
      <section
        className="st-section st-container st-tech-controls"
        aria-labelledby="controls-title"
      >
        <div>
          <h2 id="controls-title">
            Kendali yang dibutuhkan
            <br />
            saat trafik memuncak.
          </h2>
          <p>
            Atur perilaku setiap room. Buka detail untuk melihat cara kerja dan
            batas masing-masing fitur.
          </p>
        </div>
        <div className="st-tech-details">
          {[
            [
              "Metode antrean & jadwal pembukaan",
              "Gunakan FIFO, fair lottery untuk peserta pre-queue, passthrough, atau reject. Jadwal pembukaan dan countdown diatur per room.",
            ],
            [
              "Kapasitas & adaptive concurrency",
              "Tetapkan batas pengunjung aktif dan laju admisi. Dalam mode reverse proxy, kapasitas efektif dapat turun saat latensi atau error origin meningkat, lalu pulih bertahap.",
            ],
            [
              "Verifikasi bot & aturan akses",
              "Tersedia Math Challenge, Proof-of-Work, Turnstile, dan hCaptcha. Atur deny list IP/CIDR, pembatasan negara di belakang Cloudflare, dan bypass path untuk aset atau webhook.",
            ],
            [
              "Kode undangan & jalur prioritas",
              "Buat atau impor kode sekali pakai untuk akses VIP. Admisi prioritas melewati antrean dan batas kapasitas; kendalikan beban lewat jumlah kode yang diterbitkan.",
            ],
            [
              "Kontrol sesi & operasional",
              "Tahan antrean untuk maintenance, atur masa aktif sesi atau batas waktu absolut, dan pantau laju admisi serta estimasi tunggu dari dashboard.",
            ],
            [
              "Webhook & status JSON",
              "Kirim perubahan status antrean ke sistem Anda lewat webhook. Mode JSON menyajikan status antrean sebagai data untuk integrasi aplikasi.",
            ],
          ].map(([title, description]) => (
            <details key={title}>
              <summary>
                {title}
                <Icon name="plus" size={18} />
              </summary>
              <p>{description}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="st-home-architecture">
        <ArchitectureSimulator />
      </div>
    </>
  );
}
