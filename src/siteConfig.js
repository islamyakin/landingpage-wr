// These are public links, supplied at build time by Vite/Vercel.
const dashboardUrl = import.meta.env.VITE_DASHBOARD_URL?.trim() || "";
const connectorDocsUrl = import.meta.env.VITE_CONNECTOR_DOCS_URL?.trim() || "";

export const siteConfig = {
  dashboardUrl: dashboardUrl || "#simulasi",
  dashboardLabel: dashboardUrl ? "Buka dashboard" : "Coba simulasi",
  dashboardNavLabel: dashboardUrl ? "Dashboard" : "Simulasi",
  dashboardInlineLabel: dashboardUrl ? "Atur di dashboard" : "Lihat simulasi",
  dashboardFeatureLabel: dashboardUrl
    ? "Kelola waiting room"
    : "Lihat simulasi",
  connectorDocsUrl:
    connectorDocsUrl ||
    "https://github.com/islamyakin/landingpage-wr#integrasi",
  connectorDocsLabel: connectorDocsUrl
    ? "Baca protokol connector"
    : "Panduan integrasi",
};
