import SiteLayout, { Action } from "./SiteLayout.jsx";
import Icon from "./Icon.jsx";
import { entryPriceHeadline } from "./siteConfig.js";

export default function StitchPage({ queueDemo }) {
  return (
    <SiteLayout>
      <section
        className="st-hero st-container"
        id="produk"
        aria-labelledby="home-title"
      >
        <div className="st-hero-copy">
          <p className="st-kicker">Virtual Waiting Room</p>
          <h1 id="home-title">
            Traffic rame?
            <br />
            <span>Antosan yang atur.</span>
          </h1>
          <p className="st-home-description">
            Jaga situs tetap siap saat tiket, flash sale, atau pendaftaran
            dibuka. Antosan mengatur giliran masuk sesuai kapasitas situs Anda.
          </p>
          <div className="st-hero-actions">
            <Action href="/harga">Lihat harga & paket</Action>
            <Action href="/simulasi" secondary>
              Coba simulasi
            </Action>
          </div>
          <a className="st-home-price" href="/harga">
            {entryPriceHeadline()}
            <Icon name="arrow" size={16} />
          </a>
        </div>
        <div className="st-home-demo">{queueDemo}</div>
      </section>

      <section
        className="st-container st-home-benefits"
        aria-label="Manfaat Antosan"
      >
        {[
          [
            "shield",
            "Situs punya ruang bernapas",
            "Atur jumlah pengunjung yang masuk sesuai kapasitas.",
          ],
          [
            "members",
            "Giliran lebih jelas",
            "Pengunjung melihat posisi antrean dan estimasi tunggu.",
          ],
          [
            "clock",
            "Pakai saat dibutuhkan",
            "Bayar per event, bukan langganan bulanan.",
          ],
        ].map(([icon, title, body]) => (
          <div key={title}>
            <Icon name={icon} size={22} />
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </section>

      <section
        className="st-section st-container st-home-how"
        id="cara-kerja"
        aria-labelledby="how-title"
      >
        <div className="st-section-heading">
          <h2 id="how-title">Dari ramai, jadi teratur.</h2>
          <p>Tiga langkah untuk menyambut pengunjung.</p>
        </div>
        <ol className="st-home-steps">
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
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="st-container st-home-cta"
        aria-labelledby="home-cta-title"
      >
        <div>
          <h2 id="home-cta-title">Siap menyambut keramaian?</h2>
          <p>
            Mulai dari Starter. Tambah kapasitas dan fitur sesuai acara Anda.
          </p>
        </div>
        <Action href="/harga">Pilih paket acara</Action>
      </section>
    </SiteLayout>
  );
}
