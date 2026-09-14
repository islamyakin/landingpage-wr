import SiteLayout, { Action } from "./SiteLayout.jsx";
import ArchitectureSimulator from "./ArchitectureSimulator.jsx";

export default function SimulationPage() {
  return (
    <SiteLayout page="simulasi">
      <section className="st-container st-simulation-intro">
        <p className="st-kicker">Coba sebelum acara dimulai</p>
        <h1>Lihat antrean bekerja.</h1>
        <p>
          Ubah trafik, kapasitas, dan skenario. Semua angka di sini adalah
          simulasi lokal.
        </p>
      </section>
      <ArchitectureSimulator />
      <section className="st-container st-simulation-outro">
        <p>Sudah menemukan gambaran kebutuhan acara Anda?</p>
        <Action href="/harga">Lihat harga & paket</Action>
      </section>
    </SiteLayout>
  );
}
