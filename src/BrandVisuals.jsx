import React from "react";
import Mark from "./Mark.jsx";
import Icon from "./Icon.jsx";

export function HeroVisual() {
  return (
    <figure className="lp-hero-visual">
      <img
        className="lp-hero-image"
        src="/images/antosan-doorway.webp"
        alt="Antrean yang tertib menuju pintu terbuka dengan cahaya hangat."
        width="1448"
        height="1086"
        fetchPriority="high"
        decoding="async"
      />
      <figcaption>
        <span>A fairer way to wait.</span>
        <span className="lp-art-caption-detail">Ruang untuk semua.</span>
      </figcaption>
    </figure>
  );
}

// A static example of the customer-facing waiting screen, clearly labelled.
export function WaitingPreview() {
  return (
    <figure
      className="lp-waiting-preview"
      aria-labelledby="waiting-preview-label"
    >
      <figcaption id="waiting-preview-label">
        Contoh tampilan ruang tunggu
      </figcaption>
      <div className="lp-waiting-screen">
        <div className="lp-waiting-logo">
          <Mark />
          <span>Antosan</span>
        </div>
        <p className="lp-waiting-title">Giliran baik segera tiba.</p>
        <p>Terima kasih sudah menunggu dengan tertib.</p>
        <div className="lp-people-row" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} className={index === 0 ? "is-first" : ""}>
              <i />
              <b />
            </span>
          ))}
        </div>
        <dl>
          <div>
            <dt>Posisi antrean Anda</dt>
            <dd>128</dd>
          </div>
          <div>
            <dt>Estimasi menunggu</dt>
            <dd>
              ± 4 <small>menit</small>
            </dd>
          </div>
        </dl>
        <div className="lp-waiting-message">
          <Icon name="clock" size={23} />
          <span>
            Tetap di halaman ini.
            <br />
            Anda akan masuk secara otomatis.
          </span>
        </div>
      </div>
      <p className="lp-waiting-disclaimer">
        Posisi dan waktu pada contoh ini merupakan ilustrasi.
      </p>
    </figure>
  );
}
