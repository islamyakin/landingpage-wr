import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { computeDemoState } from "./LandingPage.jsx";

// ---------------------------------------------------------------------------
// Task 6 - Remaining unit and property-based tests from the Testing Strategy.
//
// These tests bind to the REAL fixed model by importing computeDemoState from
// LandingPage.jsx; the formulas are never duplicated here. The release handler
// is modeled exactly as the component wires it:
//   setReleased((value) => value + Math.min(4, queued))
// i.e. released -> released + min(4, queued), after which computeDemoState is
// re-run to obtain the "after" state.
//
// Covers (design.md → Testing Strategy):
//   - Unit: derived values per traffic level at released = 0
//   - Unit: release handler advances by min(4, queued) and never overshoots
//   - Unit: queued === 0 disables the button and release is a no-op
//   - Unit: active never exceeds capacity across the domain
//   - Unit: the status-line conditional resolves to the correct string
//   - Fix-checking property (isBugCondition domain)
//   - Property-based: active === capacity while queued > 0, queued monotonically
//     non-increasing across releases, and visitors invariant
// _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_
// ---------------------------------------------------------------------------

const capacity = 8;

// Traffic levels mirror trafficLevels in LandingPage.jsx (index -> visitors).
const NORMAL = 6;
const RAMAI = 18;
const LONJAKAN = 30;
const LEVELS = [NORMAL, RAMAI, LONJAKAN];

// Bug condition from the design:
//   (visitors - capacity - released) > 0 AND userReleasesQueue(input)
// For a demo STATE the queue-exists part distinguishes buggy-domain inputs.
function isBugCondition({ visitors, released, capacity }) {
  return visitors - capacity - released > 0;
}

// Model the release handler exactly as the component wires it:
//   setReleased((value) => value + Math.min(4, queued))
// and re-run computeDemoState to get the "after" state.
function pressRelease(visitors, released) {
  const { queued } = computeDemoState({ visitors, released, capacity });
  return released + Math.min(4, queued);
}

// The release button is disabled exactly when the queue is empty.
function releaseDisabled({ queued }) {
  return queued === 0;
}

// The demo status line has three states (design / requirement 3.4).
function statusLine({ queued, released }) {
  if (queued > 0) return "Kapasitas situs tetap terjaga";
  if (released > 0) return "Antrean selesai, semua sudah masuk";
  return "Slot tersedia, langsung masuk";
}

// -------------------------------------------------------------------------
// Unit tests - derived-value computation per traffic level at released = 0.
// _Requirements: 2.1, 2.2_
// -------------------------------------------------------------------------
describe("unit: derived values per traffic level at released = 0", () => {
  it("Normal (6): queued 0, active 6", () => {
    const state = computeDemoState({ visitors: NORMAL, released: 0, capacity });
    expect(state.queued).toBe(0);
    expect(state.active).toBe(6);
  });

  it("Ramai (18): queued 10, active 8", () => {
    const state = computeDemoState({ visitors: RAMAI, released: 0, capacity });
    expect(state.queued).toBe(10);
    expect(state.active).toBe(8);
  });

  it("Lonjakan (30): queued 22, active 8", () => {
    const state = computeDemoState({
      visitors: LONJAKAN,
      released: 0,
      capacity,
    });
    expect(state.queued).toBe(22);
    expect(state.active).toBe(8);
  });
});

// -------------------------------------------------------------------------
// Unit tests - release handler advances by min(4, queued) and never overshoots.
// _Requirements: 2.1, 2.2_
// -------------------------------------------------------------------------
describe("unit: release handler advances by min(4, queued) and never overshoots", () => {
  it("Ramai first release admits 4 and drains the queue by 4 (10 -> 6)", () => {
    const visitors = RAMAI;
    const before = computeDemoState({ visitors, released: 0, capacity });
    const released = pressRelease(visitors, 0);

    expect(released).toBe(Math.min(4, before.queued)); // admitted min(4, 10) = 4
    const after = computeDemoState({ visitors, released, capacity });
    expect(after.queued).toBe(before.queued - 4);
    expect(after.active).toBe(capacity);
  });

  it("a final release with fewer than 4 waiting admits only the remainder and never goes negative", () => {
    // Ramai near the end: released = 8 -> queued = 2. A press admits min(4,2)=2.
    const visitors = RAMAI;
    const before = computeDemoState({ visitors, released: 8, capacity });
    expect(before.queued).toBe(2);

    const released = pressRelease(visitors, 8);
    expect(released - 8).toBe(2); // only the 2 remaining are admitted, not 4
    const after = computeDemoState({ visitors, released, capacity });
    expect(after.queued).toBe(0);
    expect(after.queued).toBeGreaterThanOrEqual(0);
  });

  it("draining the queue never overshoots: queued stays >= 0 and the total admitted equals the initial queue", () => {
    for (const visitors of LEVELS) {
      const initialQueue = computeDemoState({ visitors, released: 0, capacity })
        .queued;
      let released = 0;
      for (let step = 0; step < 40; step += 1) {
        const state = computeDemoState({ visitors, released, capacity });
        if (state.queued === 0) break;
        released = pressRelease(visitors, released);
        const after = computeDemoState({ visitors, released, capacity });
        // Never overshoots below zero.
        expect(after.queued).toBeGreaterThanOrEqual(0);
      }
      // Total admitted equals exactly the queue that existed at the start.
      expect(released).toBe(initialQueue);
      expect(
        computeDemoState({ visitors, released, capacity }).queued
      ).toBe(0);
    }
  });
});

// -------------------------------------------------------------------------
// Unit tests - queued === 0 disables the button and release is a no-op.
// _Requirements: 3.1, 3.2_
// -------------------------------------------------------------------------
describe("unit: queued === 0 disables the button and release is a no-op", () => {
  it("Normal level (no queue): button disabled and release does not advance released", () => {
    const visitors = NORMAL;
    const state = computeDemoState({ visitors, released: 0, capacity });
    expect(state.queued).toBe(0);
    expect(releaseDisabled(state)).toBe(true);

    // release is a no-op: min(4, 0) === 0, released unchanged.
    const released = pressRelease(visitors, 0);
    expect(released).toBe(0);
  });

  it("fully-drained queue on every level: button disabled and release leaves released unchanged", () => {
    for (const visitors of LEVELS) {
      const released = Math.max(0, visitors - capacity); // fully admitted
      const state = computeDemoState({ visitors, released, capacity });
      expect(state.queued).toBe(0);
      expect(releaseDisabled(state)).toBe(true);

      // A further press is a no-op.
      const next = pressRelease(visitors, released);
      expect(next).toBe(released);
    }
  });
});

// -------------------------------------------------------------------------
// Unit test - active never exceeds capacity across the domain.
// _Requirements: 2.1, 2.2_
// -------------------------------------------------------------------------
describe("unit: active never exceeds capacity", () => {
  it("active <= capacity for every level and released count in range", () => {
    for (const visitors of LEVELS) {
      for (let released = 0; released <= 40; released += 1) {
        const state = computeDemoState({ visitors, released, capacity });
        expect(state.active).toBeLessThanOrEqual(capacity);
      }
    }
  });
});

// -------------------------------------------------------------------------
// Unit test - the status-line conditional resolves to the correct string.
// _Requirements: 3.4_
// -------------------------------------------------------------------------
describe("unit: status-line conditional resolves to the correct one of three strings", () => {
  it("queued > 0 -> 'Kapasitas situs tetap terjaga'", () => {
    const state = computeDemoState({ visitors: RAMAI, released: 0, capacity });
    expect(state.queued).toBeGreaterThan(0);
    expect(statusLine({ queued: state.queued, released: 0 })).toBe(
      "Kapasitas situs tetap terjaga"
    );
  });

  it("queued === 0 && released > 0 -> 'Antrean selesai, semua sudah masuk'", () => {
    const released = RAMAI - capacity; // 10 -> admits the whole Ramai queue
    const state = computeDemoState({ visitors: RAMAI, released, capacity });
    expect(state.queued).toBe(0);
    expect(statusLine({ queued: state.queued, released })).toBe(
      "Antrean selesai, semua sudah masuk"
    );
  });

  it("queued === 0 && released === 0 -> 'Slot tersedia, langsung masuk'", () => {
    const state = computeDemoState({ visitors: NORMAL, released: 0, capacity });
    expect(state.queued).toBe(0);
    expect(statusLine({ queued: state.queued, released: 0 })).toBe(
      "Slot tersedia, langsung masuk"
    );
  });
});

// -------------------------------------------------------------------------
// Fix-checking property (design → Fix Checking pseudocode):
//   FOR ALL input WHERE isBugCondition(input):
//     after one release, active == capacity while a queue remains,
//     queued(after) == max(0, queued(before) - 4),
//     and present population (visitors) unchanged.
//
// **Validates: Requirements 2.1, 2.2**
// -------------------------------------------------------------------------
describe("fix-checking property: releasing while a queue exists admits queued visitors", () => {
  it("property: over the bug-condition domain, one release keeps active pinned to capacity, drains queued by up to 4, and leaves visitors unchanged", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LEVELS),
        fc.integer({ min: 0, max: 40 }),
        (visitors, released) => {
          const input = { visitors, released, capacity };
          // Only exercise inputs where the bug condition holds (a queue exists).
          fc.pre(isBugCondition(input));

          const before = computeDemoState(input);
          const admitted = Math.min(4, before.queued);
          const afterReleased = pressRelease(visitors, released);
          const after = computeDemoState({
            visitors,
            released: afterReleased,
            capacity,
          });

          // queued(after) == max(0, queued(before) - 4)
          expect(after.queued).toBe(Math.max(0, before.queued - 4));
          expect(after.queued).toBe(before.queued - admitted);

          // active == capacity while a queue remains (a queue existed before
          // and, since visitors > capacity here, one press cannot drain a
          // 4+-deep queue below the point where active must stay at capacity).
          if (after.queued > 0) {
            expect(after.active).toBe(capacity);
          } else {
            // Queue just emptied: everyone that fits is inside the site.
            expect(after.active).toBe(Math.min(capacity, visitors));
          }

          // Present population (visitors) unchanged.
          expect(after.visitors).toBe(before.visitors);
        }
      )
    );
  });
});

// -------------------------------------------------------------------------
// Property-based tests over random (level, sequenceOfReleases).
//   - active === capacity whenever queued > 0
//   - queued is monotonically non-increasing across releases
//   - present population (visitors) is invariant across any number of releases
//
// **Validates: Requirements 2.1, 2.2**
// -------------------------------------------------------------------------
describe("property-based: release sequences preserve the model invariants", () => {
  it("property: active === capacity whenever queued > 0 and queued is monotonically non-increasing across a release sequence", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LEVELS),
        fc.integer({ min: 0, max: 30 }), // number of release presses
        (visitors, presses) => {
          let released = 0;
          let prevQueued = computeDemoState({
            visitors,
            released,
            capacity,
          }).queued;

          for (let i = 0; i < presses; i += 1) {
            released = pressRelease(visitors, released);
            const state = computeDemoState({ visitors, released, capacity });

            // Monotonically non-increasing queue.
            expect(state.queued).toBeLessThanOrEqual(prevQueued);
            prevQueued = state.queued;

            // Site stays full while any queue remains.
            if (state.queued > 0) {
              expect(state.active).toBe(capacity);
            }
            // active never exceeds capacity.
            expect(state.active).toBeLessThanOrEqual(capacity);
          }
        }
      )
    );
  });

  it("property: present population (visitors) is invariant across any number of releases", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LEVELS),
        fc.integer({ min: 0, max: 30 }),
        (visitors, presses) => {
          let released = 0;
          for (let i = 0; i < presses; i += 1) {
            released = pressRelease(visitors, released);
          }
          const state = computeDemoState({ visitors, released, capacity });
          // The present pool never changes regardless of how many releases.
          expect(state.visitors).toBe(visitors);
        }
      )
    );
  });
});
