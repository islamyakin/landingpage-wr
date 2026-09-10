import { useEffect, useReducer, useRef } from "react";
import Icon from "./Icon.jsx";
import {
  architectureScenarios,
  computeArchitecture,
  describeFlow,
} from "./architectureModel.js";

const number = (value) => value.toLocaleString("id-ID");
const firstLog = "Sistem simulasi siap. Pilih skenario atau ubah parameter.";
const initialState = {
  scenario: "normal",
  inflow: 1200,
  capacity: 3000,
  gateOpen: false,
  code: "",
  validation: "idle",
  custom: false,
  logSeq: 1,
  logs: [{ n: 1, message: firstLog }],
};
function reducer(state, action) {
  // `logSeq` is carried past every `...initialState` spread below, so the
  // numbering in the log panel keeps counting instead of resetting to 01 each
  // time the 8-entry window slides.
  const record = (next, message) => {
    const n = state.logSeq + 1;
    return {
      ...next,
      logSeq: n,
      logs: [...state.logs.slice(-7), { n, message }],
    };
  };
  if (action.type === "scenario") {
    const selected = architectureScenarios.find(
      (item) => item.id === action.id,
    );
    return record(
      {
        ...initialState,
        scenario: selected.id,
        inflow: selected.inflow,
        capacity: selected.capacity,
        code: selected.id === "vip" ? "VIP-ANTOSAN" : "",
      },
      `Skenario ${selected.label} dipilih. ${selected.premise}`,
    );
  }
  if (action.type === "parameter")
    return record(
      { ...state, [action.name]: action.value, custom: true },
      `${action.name === "inflow" ? "Pengunjung masuk" : "Kapasitas origin"} diubah menjadi ${number(action.value)}.`,
    );
  if (action.type === "open")
    return record(
      { ...state, gateOpen: true },
      "Gerbang dibuka. Kuota origin dialokasikan untuk peserta pre-queue; sisanya menunggu.",
    );
  if (action.type === "code")
    return { ...state, code: action.value, validation: "idle" };
  if (action.type === "validate") {
    const valid = state.code.trim().toUpperCase() === "VIP-ANTOSAN";
    return record(
      { ...state, validation: valid ? "valid" : "invalid" },
      valid
        ? "Kode contoh valid. Pemegang kode masuk tanpa antre; admisi prioritas mengabaikan batas kapasitas."
        : "Kode contoh tidak valid. Jalur antrean biasa tetap digunakan.",
    );
  }
  if (action.type === "reset")
    return record(
      { ...initialState },
      "Simulasi direset ke skenario Normal Traffic.",
    );
  return state;
}

export default function ArchitectureSimulator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [state.logs]);
  const flow = computeArchitecture({
    ...state,
    vipValid: state.validation === "valid",
  });
  const selected = architectureScenarios.find(
    (item) => item.id === state.scenario,
  );
  const liveDescription = describeFlow(flow, state.capacity);
  const feedback =
    state.validation === "valid"
      ? flow.preQueue
        ? "Kode contoh valid. Admisi prioritas berlaku setelah gerbang dibuka."
        : "Kode contoh valid. Pemegang kode masuk tanpa antre, di luar batas kapasitas origin."
      : state.validation === "invalid"
        ? "Kode tidak valid. Coba gunakan VIP-ANTOSAN."
        : "Gunakan kode VIP-ANTOSAN untuk mencoba jalur prioritas.";
  // Every meter is a share of the same inbound wave, so the three downstream
  // bars decompose the inbound bar exactly (blocked + queued + admitted ===
  // inflow). Origin capacity is a different quantity, so it is stated as text
  // on the node instead of being smuggled into a bar with its own scale.
  const share = (value) => (flow.inflow > 0 ? value / flow.inflow : 0);
  const percent = (value) => `${Math.round(share(value) * 100)}% gelombang`;
  const nodes = [
    {
      icon: "members",
      title: "Inbound Traffic",
      value: flow.inflow,
      status: "Pengunjung datang",
      label: "pengunjung · seluruh gelombang",
      ratio: 1,
    },
    {
      icon: "shield",
      title: "Edge Protection",
      value: flow.blocked,
      status: flow.blocked ? "Verifikasi aktif" : "Siaga",
      label: `tidak diteruskan · ${percent(flow.blocked)}`,
      ratio: share(flow.blocked),
    },
    {
      icon: "rooms",
      title: "Virtual Waiting Room",
      value: flow.queued,
      status: flow.mode,
      label: `dalam antrean · ${percent(flow.queued)}`,
      ratio: share(flow.queued),
    },
    {
      icon: "globe",
      title: "Origin Server",
      value: flow.admitted,
      status: flow.preQueue
        ? "Menunggu pembukaan"
        : flow.queued
          ? "Kapasitas terjaga"
          : "Slot tersedia",
      label: `masuk origin · ${percent(flow.admitted)}`,
      ratio: share(flow.admitted),
      extra: `${number(flow.regular)} dari ${number(state.capacity)} slot origin terpakai${
        flow.priority > 0
          ? ` · +${number(flow.priority)} admisi prioritas di luar batas`
          : ""
      }`,
    },
  ];
  return (
    <section
      className="st-section st-container"
      id="simulasi"
      aria-labelledby="architecture-simulation-title"
    >
      <span id="simulator" className="st-anchor" />
      <div className="st-section-heading">
        <span className="st-kicker">Interactive architecture simulation</span>
        <h2 id="architecture-simulation-title">
          Coba alurnya. Lihat cara Antosan bekerja.
        </h2>
        <p>
          Ubah trafik, uji verifikasi, dan amati pembagian kapasitas origin.
          Semua perubahan langsung terlihat dalam simulasi.
        </p>
      </div>
      <div className="st-glass st-simulator">
        <div
          className="st-scenario-controls"
          role="group"
          aria-label="Pilih skenario arsitektur"
        >
          {architectureScenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={state.scenario === item.id}
              onClick={() => dispatch({ type: "scenario", id: item.id })}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="st-scenario-note" role="status">
          {state.custom ? `Parameter kustom · ${selected.label}. ` : ""}
          {liveDescription}
        </p>
        {/* The preset's standing assumption. Kept separate from the status
            line above so a custom parameter can never make it read as a claim
            about the numbers currently on screen. */}
        <p className="st-scenario-premise">
          <Icon name="alert" size={14} />
          <span>
            <strong>Asumsi skenario</strong> · {selected.premise}
          </span>
        </p>
        <div className="st-flow-nodes">
          {nodes.map((node, index) => (
            <div className="st-flow-node" key={node.title}>
              <div className="st-node-top">
                <Icon name={node.icon} size={23} />
                <span>{node.status}</span>
              </div>
              <h3>{node.title}</h3>
              <strong data-metric={index}>{number(node.value)}</strong>
              <span className="st-node-unit">{node.label}</span>
              <div className="st-meter" aria-hidden="true">
                <span style={{ transform: `scaleX(${node.ratio})` }} />
              </div>
              {node.extra && (
                <span className="st-node-extra">{node.extra}</span>
              )}
              {index < 3 && (
                <Icon name="arrow" className="st-node-arrow" size={20} />
              )}
            </div>
          ))}
        </div>
        <p className="st-sr-only" aria-live="polite" aria-atomic="true">
          {number(flow.inflow)} pengunjung masuk, {number(flow.blocked)} ditahan
          verifikasi, {number(flow.queued)} mengantre, {number(flow.admitted)}{" "}
          di origin. Mode {flow.mode}.
        </p>
        <div className="st-simulator-bottom">
          <div className="st-parameter-panel">
            <div className="st-panel-heading">
              <h3>Kontrol parameter</h3>
              <button
                type="button"
                className="st-reset"
                onClick={() => dispatch({ type: "reset" })}
              >
                Reset
              </button>
            </div>
            <label className="st-range" htmlFor="inflow">
              <span>
                Pengunjung masuk <output>{number(state.inflow)}</output>
              </span>
              <input
                id="inflow"
                type="range"
                min="500"
                max="15000"
                step="100"
                value={state.inflow}
                onChange={(e) =>
                  dispatch({
                    type: "parameter",
                    name: "inflow",
                    value: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="st-range" htmlFor="origin-capacity">
              <span>
                Kapasitas origin <output>{number(state.capacity)} slot</output>
              </span>
              <input
                id="origin-capacity"
                type="range"
                min="1000"
                max="8000"
                step="200"
                value={state.capacity}
                onChange={(e) =>
                  dispatch({
                    type: "parameter",
                    name: "capacity",
                    value: Number(e.target.value),
                  })
                }
              />
            </label>
            {state.scenario === "lottery" && (
              <button
                className="st-button st-small-button"
                type="button"
                disabled={state.gateOpen}
                onClick={() => dispatch({ type: "open" })}
              >
                {state.gateOpen ? "Gerbang sudah dibuka" : "Buka gerbang"}
                <Icon name="arrow" />
              </button>
            )}
            <form
              className="st-vip-form"
              onSubmit={(event) => {
                event.preventDefault();
                dispatch({ type: "validate" });
              }}
            >
              <label htmlFor="vip-code">Kode undangan contoh</label>
              <div>
                <input
                  id="vip-code"
                  value={state.code}
                  onChange={(event) =>
                    dispatch({ type: "code", value: event.target.value })
                  }
                  placeholder="VIP-ANTOSAN"
                  maxLength={40}
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={state.validation === "invalid"}
                  aria-describedby="vip-feedback"
                />
                <button className="st-button st-small-button" type="submit">
                  Validasi
                </button>
              </div>
              <p
                id="vip-feedback"
                className={`st-feedback is-${state.validation}`}
                role="status"
              >
                {feedback}
              </p>
            </form>
          </div>
          <div className="st-telemetry">
            <div className="st-panel-heading">
              <h3>Log simulasi</h3>
              <span>
                <i /> Lokal
              </span>
            </div>
            <ol
              ref={logRef}
              tabIndex={0}
              aria-label="Riwayat perubahan simulasi"
            >
              {state.logs.map((log) => (
                <li key={log.n}>
                  <span>{String(log.n).padStart(2, "0")}</span>
                  {log.message}
                </li>
              ))}
            </ol>
            <div className="st-telemetry-status">
              <span>
                Mode <strong>{flow.mode}</strong>
              </span>
              <span>
                {flow.priority
                  ? `${number(flow.priority)} admisi prioritas`
                  : "Kapasitas terkendali"}
              </span>
            </div>
          </div>
        </div>
        <p className="st-demo-disclaimer">
          <Icon name="alert" size={16} />
          Simulasi satu gelombang pengunjung. Angka dan verifikasi kode hanya
          contoh lokal, bukan trafik atau token akses nyata.
        </p>
      </div>
    </section>
  );
}
