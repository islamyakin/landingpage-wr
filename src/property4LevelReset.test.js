import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { computeDemoState } from "./LandingPage.jsx";

// ---------------------------------------------------------------------------
// Feature: landing-page-redesign, Property 4: Ganti tingkat mereset dan menghitung ulang
//
// Mengganti tingkat trafik pada QueueDemo memanggil changeLevel(index), yang
// mengatur level baru DAN mereset `released` ke 0. Untuk semua tingkat trafik,
// keadaan hasil (released = 0) harus:
//   - queued === max(0, visitors - capacity)  (antrean dihitung ulang dari
//     total pengunjung tingkat baru, tanpa pelepasan sebelumnya)
//   - released === 0                          (pelepasan direset)
//
// Test ini mengikat ke model NYATA dengan mengimpor `computeDemoState` dari
// LandingPage.jsx dan TIDAK menduplikasi formula internalnya — ia hanya
// memanggil fungsi yang diimpor lalu memeriksa hasil di atas.
//
// **Validates: Requirements 6.4**
// ---------------------------------------------------------------------------

const capacity = 8;

// Traffic levels mirror trafficLevels in LandingPage.jsx (visitors per level).
const TRAFFIC_LEVELS = [6, 18, 30];

describe("Property 4: ganti tingkat mereset dan menghitung ulang", () => {
  it("released = 0 menghasilkan queued === max(0, visitors - capacity) dan released === 0 untuk semua tingkat", () => {
    fc.assert(
      fc.property(fc.constantFrom(...TRAFFIC_LEVELS), (visitors) => {
        // Simulasikan efek changeLevel: level baru dipilih, released direset ke 0.
        const released = 0;
        const state = computeDemoState({ visitors, released, capacity });

        // Antrean dihitung ulang dari total pengunjung tingkat baru.
        expect(state.queued).toBe(Math.max(0, visitors - capacity));

        // Pelepasan direset ke nol.
        expect(state.released).toBe(0);
      })
    );
  });
});
