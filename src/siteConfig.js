// These are public links, supplied at build time by Vite/Vercel.
const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL?.trim() || "";
const connectorDocsUrl = import.meta.env.VITE_CONNECTOR_DOCS_URL?.trim() || "";

// Subscription goes through email for now: there is no self-serve billing in
// the product yet, so the CTA opens a prefilled message rather than a checkout.
const contactEmail = "halo@antosan.com";
const subscribeSubject = "Berlangganan Antosan - paket per event";
const subscribeBody = [
  "Halo Antosan,",
  "",
  "Saya ingin berlangganan paket per event.",
  "",
  "Domain atau situs yang dilindungi:",
  "Tanggal dan jam pembukaan event:",
  "Perkiraan jumlah pengunjung:",
  "Kapasitas origin saat ini:",
  "",
  "Terima kasih.",
].join("\n");

export const siteConfig = {
  name: "Antosan",
  url: "https://antosan.com/",
  contactEmail,
  // `mailto:` silently does nothing when the visitor has no mail handler
  // registered, so it is never the only route: the CTAs point at the
  // #berlangganan panel, which offers copy-to-clipboard and a webmail compose
  // link alongside this one.
  mailtoUrl: `mailto:${contactEmail}?subject=${encodeURIComponent(
    subscribeSubject,
  )}&body=${encodeURIComponent(subscribeBody)}`,
  gmailComposeUrl:
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(contactEmail)}` +
    `&su=${encodeURIComponent(subscribeSubject)}` +
    `&body=${encodeURIComponent(subscribeBody)}`,
  outlookComposeUrl:
    "https://outlook.live.com/mail/0/deeplink/compose" +
    `?to=${encodeURIComponent(contactEmail)}` +
    `&subject=${encodeURIComponent(subscribeSubject)}` +
    `&body=${encodeURIComponent(subscribeBody)}`,
  subscribeSubject,
  subscribeBody,
  // In-page anchor: a same-document link cannot fail to activate, unlike a
  // protocol handler.
  subscribeUrl: "#berlangganan",
  subscribeLabel: "Berlangganan per event",
  dashboardUrl: dashboardUrl || "#simulasi",
  dashboardLabel: dashboardUrl ? "Buka dashboard" : "Coba simulasi",
  dashboardNavLabel: dashboardUrl ? "Dashboard" : "Simulasi",
  dashboardInlineLabel: dashboardUrl ? "Atur di dashboard" : "Lihat simulasi",
  dashboardFeatureLabel: dashboardUrl ? "Kelola antrean" : "Lihat simulasi",
  // Nothing renders these right now - every documentation link and button was
  // removed from the page on request. The env-driven values are kept so
  // VITE_CONNECTOR_DOCS_URL stays wired and restoring the links is a one-liner.
  connectorDocsUrl:
    connectorDocsUrl ||
    "https://github.com/islamyakin/landingpage-wr#integrasi",
  connectorDocsLabel: connectorDocsUrl
    ? "Baca protokol connector"
    : "Panduan integrasi",
};

// ---------------------------------------------------------------------------
// Entry package, sold per event. Subscription is by email for now, so this is
// the only published price point; anything larger is quoted.
//
// Every limit below must be something a room can actually enforce - the field
// names map onto waitingroom/internal/model/model.go, so support can set the
// room up to match exactly what was sold.
//
// `null` means "not decided yet" and the pricing card renders an honest
// "harga belum dipublikasikan" state instead of inventing a figure. Fill these
// in and the card starts showing real numbers with no other change needed.
// ---------------------------------------------------------------------------
export const entryPackage = {
  name: "Event Starter",
  // Harga per event, dalam rupiah penuh (mis. 2500000 untuk Rp 2.500.000).
  priceIDR: null,
  // max_active - pengunjung aktif bersamaan di origin.
  maxActive: null,
  // Jumlah room aktif yang termasuk.
  rooms: null,
  // Lama jendela event berlaku, dalam jam.
  eventWindowHours: null,
  // Tier challenge yang termasuk: "math" | "pow" | "turnstile" | "hcaptcha".
  challengeTypes: null,
  // Jumlah kode prioritas (VIP) yang bisa diterbitkan.
  vipCodes: null,
  // Apakah webhook event + mode JSON termasuk di paket ini.
  automation: null,
};

// True only when there is a real figure to show.
export const entryPackagePriced = typeof entryPackage.priceIDR === "number";

export function formatIDR(value) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

// Turns the package limits into display rows, skipping anything still unset so
// a half-filled config never renders "null pengunjung".
export function entryPackageLimits(pkg = entryPackage) {
  const rows = [];
  if (typeof pkg.maxActive === "number")
    rows.push(`${pkg.maxActive.toLocaleString("id-ID")} pengunjung aktif bersamaan`);
  if (typeof pkg.rooms === "number")
    rows.push(`${pkg.rooms} room aktif`);
  if (typeof pkg.eventWindowHours === "number")
    rows.push(`Jendela event ${pkg.eventWindowHours} jam`);
  if (Array.isArray(pkg.challengeTypes) && pkg.challengeTypes.length > 0)
    rows.push(`Challenge anti-bot: ${pkg.challengeTypes.join(", ")}`);
  if (typeof pkg.vipCodes === "number")
    rows.push(`${pkg.vipCodes.toLocaleString("id-ID")} kode prioritas`);
  if (pkg.automation === true) rows.push("Webhook event dan mode JSON");
  return rows;
}

// The price-led hero highlight. Until a real figure exists it leads on the
// pricing *model* - per event, no monthly commitment - which is true of how
// Antosan is sold. It deliberately avoids a comparative like "termurah":
// nothing in this repo can substantiate a claim against other vendors.
export function entryPriceHeadline(pkg = entryPackage) {
  return typeof pkg.priceIDR === "number"
    ? `Mulai ${formatIDR(pkg.priceIDR)} per event`
    : "No Subs, Bayar per event";
}
