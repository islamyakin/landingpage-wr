import { useRef, useState } from "react";
import Icon from "./Icon.jsx";
import Mark from "./Mark.jsx";
import { siteConfig } from "./siteConfig.js";
import "./stitch.css";
import "./marketing.css";

function Brand() {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <a className="st-brand" href="/" aria-label="Antosan, beranda">
      {imageFailed ? (
        <Mark />
      ) : (
        <img
          onError={() => setImageFailed(true)}
          src="https://kratos.antosan.com/logo/antosan-mark-C0BvW3PW.png"
          width="40"
          height="40"
          alt=""
        />
      )}
      <span>
        <strong>Antosan</strong>
        <small>Virtual Waiting Room</small>
      </span>
    </a>
  );
}

export function Action({ children, href, secondary = false, onClick }) {
  return (
    <a
      className={`st-button${secondary ? " st-button-secondary" : ""}`}
      href={href}
      onClick={onClick}
    >
      {children}
      <Icon name="arrow" size={17} />
    </a>
  );
}

export default function SiteLayout({ children, page = "home" }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const links = [
    ["/#produk", "Produk"],
    ["/#cara-kerja", "Cara kerja"],
    ["/harga", "Harga"],
    ["/simulasi", "Simulasi"],
  ];
  const contact = page === "harga" ? "#berlangganan" : "/harga#berlangganan";
  const navLinks = links.map(([href, label]) => (
    <a
      href={href}
      key={href}
      aria-current={href === `/${page}` ? "page" : undefined}
    >
      {label}
    </a>
  ));
  return (
    <div className={`stitch-page st-marketing st-${page}`} id="atas">
      <a className="st-skip" href="#konten">
        Lewati navigasi
      </a>
      <header
        className="st-header st-container"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false);
            toggle.current?.focus();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpen(false);
        }}
      >
        <div className="st-nav">
          <Brand />
          <nav className="st-desktop-nav" aria-label="Navigasi utama">
            {navLinks}
          </nav>
          <div className="st-nav-actions">
            <a className="st-button st-nav-cta" href={contact}>
              Hubungi kami
            </a>
            <button
              className="st-menu-toggle"
              ref={toggle}
              type="button"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              aria-controls="st-mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? "close" : "menu"} size={23} />
            </button>
          </div>
        </div>
        <nav
          className="st-mobile-nav"
          id="st-mobile-navigation"
          aria-label="Navigasi seluler"
          hidden={!open}
          onClick={(event) => {
            if (event.target.closest("a")) setOpen(false);
          }}
        >
          {navLinks}
          <a href={contact}>Hubungi kami</a>
        </nav>
      </header>
      <main id="konten" tabIndex={-1}>
        {children}
      </main>
      <footer className="st-footer st-footer-compact">
        <div className="st-container">
          <div className="st-footer-line">
            <Brand />
            <p>Antrean yang tertib. Akses yang lebih baik.</p>
            <a href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
          </div>
          <div className="st-footer-bottom">
            <span>© {new Date().getFullYear()} Antosan.</span>
            <nav aria-label="Navigasi footer">
              <a href="/harga">Harga</a>
              <a href="/simulasi">Simulasi</a>
              {siteConfig.dashboardNavLabel === "Dashboard" && (
                <a href={siteConfig.dashboardUrl}>Masuk konsol</a>
              )}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
