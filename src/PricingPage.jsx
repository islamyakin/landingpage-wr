import { useState } from "react";
import SiteLayout, { Action } from "./SiteLayout.jsx";
import Icon from "./Icon.jsx";
import SubscribePanel from "./SubscribePanel.jsx";
import {
  pricingPlans,
  pricingAddons,
  eventPack,
  formatIDR,
} from "./siteConfig.js";

const number = (value) => value.toLocaleString("id-ID");

export default function PricingPage() {
  const [selection, setSelection] = useState("");
  const choose =
    (item, unit = "event") =>
    () =>
      setSelection(
        `${item.name}${item.priceIDR !== null ? ` · ${formatIDR(item.priceIDR)} / ${unit}` : " · penawaran khusus"}`,
      );
  return (
    <SiteLayout page="harga">
      <section
        className="st-section st-container st-pricing-intro"
        aria-labelledby="pricing-title"
      >
        <p className="st-kicker">Harga per event</p>
        <h1 id="pricing-title">
          Pilih paket yang pas
          <br />
          <span>buat acara kamu.</span>
        </h1>
        <p>
          Bayar saat ada acara. Pilih kapasitas yang dibutuhkan, lalu tambahkan
          fitur seperlunya.
        </p>
        <div className="st-pricing-note">
          <Icon name="clock" size={19} />
          <span>Butuh antrean rutin atau bulanan?</span>
          <a
            href="#berlangganan"
            onClick={() => setSelection("Antrean rutin / bulanan")}
          >
            Minta penawaran <Icon name="arrow" size={16} />
          </a>
        </div>
      </section>

      <section
        className="st-container st-pricing-plans"
        aria-label="Pilihan paket Antosan"
      >
        {pricingPlans.map((plan, i) => (
          <article
            key={plan.name}
            className={`st-plan${plan.name === "Growth" ? " st-plan-featured" : ""}`}
          >
            {plan.name === "Growth" && (
              <span className="st-plan-badge">
                Untuk event yang lebih besar
              </span>
            )}
            <div className="st-plan-name">
              <h2>{plan.name}</h2>
              <span>Tier {i + 1}</span>
            </div>
            <p className="st-plan-description">{plan.description}</p>
            <div className="st-plan-price">
              <strong>
                {plan.priceIDR === null
                  ? "Kontrak kustom"
                  : formatIDR(plan.priceIDR)}
              </strong>
              <span>
                {plan.priceIDR === null ? "sesuai kesepakatan" : "/ event"}
              </span>
            </div>
            {plan.priceIDR !== null ? (
              <dl className="st-plan-limits">
                <div>
                  <dt>
                    <Icon name="members" />
                    Pengunjung bersamaan
                  </dt>
                  <dd>{number(plan.concurrentVisitors)}</dd>
                </div>
                <div>
                  <dt>
                    <Icon name="rooms" />
                    Ruang antrean
                  </dt>
                  <dd>{plan.rooms}</dd>
                </div>
                <div>
                  <dt>
                    <Icon name="members" />
                    Anggota tim
                  </dt>
                  <dd>{plan.members}</dd>
                </div>
                <div>
                  <dt>
                    <Icon name="clock" />
                    Retensi laporan
                  </dt>
                  <dd>{plan.retentionDays} hari</dd>
                </div>
              </dl>
            ) : (
              <ul className="st-checks st-enterprise-features">
                {[
                  "Kapasitas sesuai kebutuhan",
                  "Ruang dan anggota tim fleksibel",
                  "Retensi data sesuai kontrak",
                  "Pendampingan tim teknis",
                ].map((text) => (
                  <li key={text}>
                    <Icon name="check" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            )}
            <Action
              href="#berlangganan"
              secondary={plan.name !== "Growth"}
              onClick={choose(plan)}
            >
              {plan.priceIDR === null
                ? "Konsultasi khusus"
                : `Pilih ${plan.name}`}
            </Action>
          </article>
        ))}
      </section>

      <section
        className="st-container st-included"
        aria-labelledby="included-title"
      >
        <h2 id="included-title">Sudah termasuk di setiap paket</h2>
        <ul>
          {[
            "FIFO & fair queue",
            "Pre-queue & countdown",
            "Pemantauan real-time",
            "Tampilan responsif",
          ].map((text) => (
            <li key={text}>
              <Icon name="check" size={17} />
              {text}
            </li>
          ))}
        </ul>
      </section>

      <section
        className="st-section st-container"
        aria-labelledby="event-pack-title"
      >
        <div className="st-event-pack">
          <div>
            <p className="st-kicker">Tambahan kapasitas</p>
            <h2 id="event-pack-title">
              Ramainya cuma sebentar?
              <br />
              Tambahkan Event Pack.
            </h2>
            <p>
              Tambah{" "}
              <strong>
                {number(eventPack.concurrentVisitors)} pengunjung bersamaan
              </strong>{" "}
              selama {eventPack.days} hari. Bisa digabung dengan paket pilihan
              Anda.
            </p>
          </div>
          <div className="st-event-pack-price">
            <strong>{formatIDR(eventPack.priceIDR)}</strong>
            <span>/ event · aktif 7 hari</span>
            <Action href="#berlangganan" onClick={choose(eventPack)}>
              Pilih Event Pack
            </Action>
          </div>
        </div>
      </section>

      <section
        className="st-section st-container st-addons"
        id="addons"
        aria-labelledby="addons-title"
      >
        <div className="st-section-heading">
          <p className="st-kicker">Ambil yang dibutuhkan</p>
          <h2 id="addons-title">Lengkapi paketmu dengan add-on.</h2>
          <p>Buka detail untuk melihat kegunaan dan memilih tambahan.</p>
        </div>
        <div className="st-addon-grid">
          {pricingAddons.map((addon) => (
            <details className="st-addon" key={addon.name}>
              <summary>
                <span className="st-addon-name">
                  <Icon name={addon.icon} size={19} />
                  {addon.name}
                </span>
                <span className="st-addon-price">
                  {formatIDR(addon.priceIDR)}
                  <small>/ {addon.unit}</small>
                </span>
                <Icon name="plus" size={17} />
              </summary>
              <div className="st-addon-detail">
                <p>{addon.description}</p>
                <a href="#berlangganan" onClick={choose(addon, addon.unit)}>
                  Tanyakan {addon.name}
                  <Icon name="arrow" size={16} />
                </a>
              </div>
            </details>
          ))}
        </div>
      </section>
      <SubscribePanel selection={selection} />
    </SiteLayout>
  );
}
