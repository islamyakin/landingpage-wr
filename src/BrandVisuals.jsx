import React, { useId } from "react";
import Mark from "./Mark.jsx";
import Icon from "./Icon.jsx";

export function HeroVisual() {
  const id = useId().replaceAll(":", "");
  return (
    <figure
      className="lp-hero-visual gateway-diagram"
      aria-labelledby={`${id}-caption`}
    >
      <div className="gateway-diagram-label">
        <span>ILUSTRASI ALUR AKSES</span>
        <span>
          <Icon name="shield" size={16} />
          Kapasitas tetap dalam kendali
        </span>
      </div>
      <svg
        className="gateway-scene"
        viewBox="0 0 1100 300"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--art-white)" />
            <stop offset="1" stopColor="var(--art-floor)" />
          </linearGradient>
          <linearGradient id={`${id}-light`} x1="1" y1="0" x2="0" y2="1">
            <stop stopColor="var(--art-peach)" />
            <stop offset="1" stopColor="var(--art-peach)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-person`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--art-figure)" />
            <stop offset="1" stopColor="var(--art-figure-side)" />
          </linearGradient>
          <g id={`${id}-person-shape`}>
            <ellipse cy="5" rx="24" ry="6" fill="var(--art-shadow)" />
            <circle cy="-52" r="14" fill={`url(#${id}-person)`} />
            <path
              d="M-23-19C-23-45 23-45 23-19V1Q23 8 0 8Q-23 8-23 1Z"
              fill={`url(#${id}-person)`}
            />
            <path
              d="M5-37Q23-36 23-19V1Q23 6 13 7V-19Q13-33 5-37Z"
              fill="var(--art-figure-side)"
              opacity=".6"
            />
          </g>
        </defs>
        <path d="m100 211 412-104 470 117-415 75Z" fill={`url(#${id}-floor)`} />
        <path d="m526 178-327 99h255l155-90Z" fill={`url(#${id}-light)`} />
        <path
          d="M65 198 491 94M109 225 539 117M666 114 1015 202M696 140 1040 229"
          fill="none"
          stroke="var(--art-grid)"
          strokeWidth="1"
        />
        <path
          d="m289 247 260-68 301 64"
          fill="none"
          stroke="var(--art-line)"
          strokeWidth="2"
          strokeDasharray="5 7"
        />
        <ellipse
          cx="555"
          cy="213"
          rx="135"
          ry="17"
          fill="var(--art-shadow)"
          opacity=".45"
        />
        <image
          href="/brand-gateway.svg"
          x="444"
          y="-2"
          width="210"
          height="225"
        />
        <g opacity=".22">
          <use
            href={`#${id}-person-shape`}
            transform="translate(174 156) scale(.55)"
          />
          <use
            href={`#${id}-person-shape`}
            transform="translate(219 143) scale(.5)"
          />
          <use
            href={`#${id}-person-shape`}
            transform="translate(259 132) scale(.45)"
          />
        </g>
        <use
          href={`#${id}-person-shape`}
          transform="translate(271 262) scale(.92)"
        />
        <use
          href={`#${id}-person-shape`}
          transform="translate(343 240) scale(.83)"
        />
        <use
          href={`#${id}-person-shape`}
          transform="translate(407 222) scale(.75)"
        />
        <use
          href={`#${id}-person-shape`}
          transform="translate(465 206) scale(.66)"
        />
        <g transform="translate(832 119)">
          <path
            d="m-71 104 76 21 99-28-75-20Z"
            fill="var(--art-shadow)"
            opacity=".5"
          />
          <path
            d="m-66 47 77 21 76-21v39l-76 22-77-22Z"
            fill="var(--art-floor)"
            stroke="var(--art-line)"
          />
          <path
            d="m-66 47 77-22 76 22-76 21Z"
            fill="var(--art-white)"
            stroke="var(--art-line)"
          />
          <path
            d="m-66 8 77 21 76-21v30L11 60-66 39Z"
            fill="var(--art-paper)"
            stroke="var(--art-line)"
          />
          <path
            d="m-66 8 77-22L87 8 11 29Z"
            fill="var(--art-white)"
            stroke="var(--art-line)"
          />
          <path d="M11 30v30m0 9v38" stroke="var(--art-line)" />
          <g fill="var(--brand-orange)">
            <circle cx="-47" cy="27" r="3" />
            <circle cx="-34" cy="31" r="3" />
            <circle cx="-47" cy="67" r="3" />
          </g>
          <path
            d="m29 44 39-12m-39 54 39-12"
            stroke="var(--art-muted)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(694 226)">
          <circle r="18" fill="var(--brand-orange)" />
          <path
            d="m-7 0 5 5 10-11"
            fill="none"
            stroke="var(--brand-navy)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      <figcaption id={`${id}-caption`} className="gateway-flow-legend">
        <span>
          <b>01</b>
          <span>
            Pengunjung datang<small>Antusiasme terus mengalir</small>
          </span>
        </span>
        <span>
          <b>02</b>
          <span>
            Antosan mengatur<small>Masuk sesuai kapasitas</small>
          </span>
        </span>
        <span>
          <b>03</b>
          <span>
            Situs melayani<small>Pengalaman tetap nyaman</small>
          </span>
        </span>
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
        <p className="lp-waiting-title">Anda sudah dalam antrean.</p>
        <p>Kami sedang menyiapkan giliran Anda.</p>
        <div className="gateway-wait-progress" aria-hidden="true">
          <span />
        </div>
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
