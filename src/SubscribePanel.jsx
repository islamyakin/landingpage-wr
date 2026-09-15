import { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";
import { siteConfig } from "./siteConfig.js";

// The conversion path has to survive a visitor with no mail client. A bare
// `mailto:` link does nothing at all in that case - no error, no new window -
// so this panel gives three independent routes to the same address and always
// leaves the address itself on screen as selectable text.
export const detailsToSend = [
  "Domain atau situs yang dilindungi",
  "Tanggal dan jam pembukaan event",
  "Perkiraan jumlah pengunjung",
  "Kapasitas origin saat ini",
];

// Clipboard write, with a selection-based fallback for browsers that refuse
// navigator.clipboard (older Safari, or any non-secure context).
async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(field);
    return ok;
  } catch {
    return false;
  }
}

export default function SubscribePanel() {
  const [copied, setCopied] = useState("idle");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    const ok = await copyText(siteConfig.contactEmail);
    setCopied(ok ? "done" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied("idle"), 4000);
  };

  return (
    <section
      className="st-section st-container"
      id="berlangganan"
      aria-labelledby="subscribe-title"
    >
      <div className="st-glass st-subscribe">
        <div className="st-subscribe-copy">
          <span className="st-kicker">Berlangganan</span>
          <h2 id="subscribe-title">Kirim detail event Anda.</h2>
          <p>
            Langganan diatur langsung lewat email. Kami balas dengan harga per
            event dan menyiapkan room-nya untuk Anda.
          </p>
          <p className="st-subscribe-detail-label">
            Sertakan ini supaya kami bisa langsung menghitung:
          </p>
          <ul className="st-checks">
            {detailsToSend.map((item) => (
              <li key={item}>
                <Icon name="check" size={17} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="st-subscribe-actions">
          <span className="st-subscribe-label">Alamat email kami</span>
          <p className="st-subscribe-address">
            <a href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
          </p>
          <button
            type="button"
            className="st-button st-subscribe-primary"
            onClick={handleCopy}
          >
            {copied === "done"
              ? "Alamat tersalin"
              : copied === "failed"
                ? "Salin manual dari atas"
                : "Salin alamat email"}
            <Icon name={copied === "done" ? "check" : "plus"} size={17} />
          </button>
          <p className="st-subscribe-status" role="status">
            {copied === "done"
              ? "Tempel di aplikasi email Anda, lalu kirimkan detail di samping."
              : copied === "failed"
                ? "Peramban menolak akses papan klip. Alamat di atas bisa disalin manual."
                : "Atau buka langsung lewat salah satu pilihan di bawah."}
          </p>
          <div className="st-subscribe-links">
            <a
              className="st-button st-button-secondary"
              href={siteConfig.gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tulis di Gmail
              <Icon name="arrow" size={17} />
            </a>
            <a
              className="st-button st-button-secondary"
              href={siteConfig.outlookComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tulis di Outlook
              <Icon name="arrow" size={17} />
            </a>
            <a
              className="st-button st-button-secondary"
              href={siteConfig.mailtoUrl}
            >
              Aplikasi email saya
              <Icon name="arrow" size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
