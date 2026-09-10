import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { computeDemoState } from "./LandingPage.jsx";

// ---------------------------------------------------------------------------
// Feature: landing-page-redesign, Property 1: Batas model selalu terjaga
//
// Untuk semua tingkat trafik (visitors ∈ {6, 18, 30}) dan nilai `released`
// yang valid, invarian model QueueDemo selalu terjaga:
//   - active <= capacity  (situs tidak pernah melebihi kapasitas)
//   - queued >= 0          (antrean tidak pernah negatif)
//   - remaining === queued (kolom "menunggu" mencerminkan antrean)
//
// Test ini mengikat ke model NYATA dengan mengimpor `computeDemoState` dari
// LandingPage.jsx dan TIDAK menduplikasi formula apa pun - ia hanya memanggil
// fungsi yang diimpor lalu memeriksa invarian di atas.
//
// **Validates: Requirements 6.1, 6.6**
// ---------------------------------------------------------------------------

const capacity = 8;

// Traffic levels mirror trafficLevels in LandingPage.jsx (visitors per level).
const TRAFFIC_LEVELS = [6, 18, 30];

describe("Property 1: batas model selalu terjaga", () => {
  it("active <= capacity, queued >= 0, dan remaining === queued untuk semua tingkat trafik dan released valid", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...TRAFFIC_LEVELS),
        fc.nat({ max: 40 }),
        (visitors, released) => {
          const state = computeDemoState({ visitors, released, capacity });

          // active tidak pernah melebihi kapasitas situs.
          expect(state.active).toBeLessThanOrEqual(capacity);

          // antrean tidak pernah negatif.
          expect(state.queued).toBeGreaterThanOrEqual(0);

          // kolom "menunggu" selalu mencerminkan antrean.
          expect(state.remaining).toBe(state.queued);
        }
      )
    );
  });
});
