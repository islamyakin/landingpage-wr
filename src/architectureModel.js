// A local, single-batch teaching model. Counts represent visitors, not live
// requests per second. Filtering is an explicit scenario assumption.
export const architectureScenarios = [
  {
    id: "normal",
    label: "Normal Traffic",
    inflow: 1200,
    capacity: 3000,
    note: "Kapasitas tersedia. Pengunjung langsung diteruskan ke origin.",
  },
  {
    id: "surge",
    label: "Flash Sale Surge",
    inflow: 9500,
    capacity: 3000,
    note: "Lonjakan pengunjung ditahan dalam antrean. Origin tetap menerima sesuai kapasitas.",
  },
  {
    id: "lottery",
    label: "Pre-Queue Rush",
    inflow: 7200,
    capacity: 3000,
    note: "Semua pengunjung menunggu pembukaan. Buka gerbang untuk memulai alokasi fair lottery.",
  },
  {
    id: "spike",
    label: "Origin Latency Spike",
    inflow: 4500,
    capacity: 1800,
    note: "Kapasitas efektif diturunkan menjadi 1.800 slot untuk menggambarkan respons terhadap latensi origin.",
  },
  {
    id: "ddos",
    label: "Bot Traffic",
    inflow: 13500,
    capacity: 3000,
    note: "Dalam contoh ini, 42% pengunjung diasumsikan gagal verifikasi. Ini bukan tingkat deteksi bot aktual.",
  },
  {
    id: "vip",
    label: "VIP Access",
    inflow: 9500,
    capacity: 3000,
    note: "Validasi kode contoh untuk memberi satu pengunjung slot prioritas dalam batas kapasitas.",
  },
];

export function computeArchitecture({
  inflow,
  capacity,
  scenario = "normal",
  gateOpen = false,
  vipValid = false,
}) {
  const blocked = scenario === "ddos" ? Math.floor(inflow * 0.42) : 0;
  const eligible = inflow - blocked;
  const preQueue = scenario === "lottery" && !gateOpen;
  const admitted = preQueue ? 0 : Math.min(eligible, capacity);
  const queued = eligible - admitted;
  const priority = vipValid && admitted > 0 ? 1 : 0;
  const mode = preQueue
    ? "PRE-QUEUE"
    : scenario === "lottery"
      ? "FAIR LOTTERY"
      : queued > 0
        ? "FIFO"
        : "PASSTHROUGH";
  return {
    inflow,
    blocked,
    eligible,
    admitted,
    queued,
    priority,
    mode,
    preQueue,
  };
}
