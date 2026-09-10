// A local, single-batch teaching model. Counts represent visitors, not live
// requests per second. Filtering is an explicit scenario assumption.
export const architectureScenarios = [
  {
    id: "normal",
    label: "Normal Traffic",
    inflow: 1200,
    capacity: 3000,
    premise: "Gelombang normal dengan kapasitas origin yang masih lapang.",
  },
  {
    id: "surge",
    label: "Flash Sale Surge",
    inflow: 9500,
    capacity: 3000,
    premise: "Lonjakan flash sale. Semua pengunjung dianggap sah, tanpa filter verifikasi.",
  },
  {
    id: "lottery",
    label: "Pre-Queue Rush",
    inflow: 7200,
    capacity: 3000,
    premise: "Semua pengunjung tiba sebelum gerbang dibuka, lalu dialokasikan lewat fair lottery.",
  },
  {
    id: "spike",
    label: "Origin Latency Spike",
    inflow: 4500,
    capacity: 1800,
    premise: "Adaptive concurrency menurunkan batas efektif ke arah floor saat latensi origin memburuk, lalu menaikkannya lagi saat origin pulih.",
  },
  {
    id: "ddos",
    label: "Bot Traffic",
    inflow: 13500,
    capacity: 3000,
    premise: "Dalam contoh ini, 42% pengunjung diasumsikan gagal verifikasi. Ini bukan tingkat deteksi bot aktual.",
  },
  {
    id: "vip",
    label: "VIP Access",
    inflow: 9500,
    capacity: 3000,
    premise: "Pemegang kode undangan masuk tanpa antre. Admisi prioritas mengabaikan batas kapasitas - beban dikendalikan lewat jumlah kode yang diterbitkan.",
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
  // A redeemed priority code admits its holder immediately and deliberately
  // *ignores* the capacity limit: the gateway's redeem script ZADDs straight
  // into the active set with no max_active check at all
  // (waitingroom/internal/queue/vip.go). Operators cap the blast radius by
  // limiting how many codes they issue, not by the concurrency ceiling - so
  // admitted may exceed `capacity` by the number of priority admissions.
  const priority = vipValid && !preQueue && eligible > 0 ? 1 : 0;
  const regular = preQueue ? 0 : Math.min(eligible - priority, capacity);
  const admitted = regular + priority;
  const queued = eligible - admitted;
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
    regular,
    queued,
    priority,
    mode,
    preQueue,
  };
}

const count = (value) => value.toLocaleString("id-ID");

// Renders the *current* flow as a sentence. Everything it claims is read back
// out of `flow` and `capacity`, so moving a slider or opening the gate can
// never leave it asserting something the four nodes contradict.
export function describeFlow(flow, capacity) {
  const filtered =
    flow.blocked > 0
      ? `${count(flow.blocked)} pengunjung gagal verifikasi dan tidak diteruskan. `
      : "";
  const priority =
    flow.priority > 0
      ? ` Ditambah ${count(flow.priority)} admisi prioritas dari kode undangan, di luar batas kapasitas.`
      : "";

  if (flow.preQueue) {
    return `${filtered}Gerbang masih tertutup: seluruh ${count(flow.queued)} pengunjung menunggu dan origin belum menerima siapa pun. Buka gerbang untuk memulai alokasi fair lottery.`;
  }
  if (flow.mode === "FAIR LOTTERY") {
    const waiting =
      flow.queued > 0
        ? `${count(flow.admitted)} pengunjung mendapat slot origin lewat fair lottery, ${count(flow.queued)} masih menunggu giliran`
        : `seluruh ${count(flow.admitted)} pengunjung mendapat slot origin lewat fair lottery`;
    return `${filtered}Gerbang terbuka. ${waiting}.${priority}`;
  }
  if (flow.queued > 0) {
    return `${filtered}Antrean FIFO aktif. Origin menerima ${count(flow.regular)} dari ${count(capacity)} slot, ${count(flow.queued)} pengunjung menunggu giliran.${priority}`;
  }
  return `${filtered}Kapasitas cukup. Seluruh ${count(flow.admitted)} pengunjung diteruskan langsung ke origin, memakai ${count(flow.admitted)} dari ${count(capacity)} slot.${priority}`;
}
