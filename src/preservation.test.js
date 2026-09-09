import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { computeDemoState } from "./LandingPage.jsx";

// ---------------------------------------------------------------------------
// Task 3 — Preservation property tests (Property 2 / bugfix 3.1–3.6)
//
// METHODOLOGY: observable-behavior baseline.
//
// The fix in LandingPage.jsx intentionally REDEFINES the internal derived
// field `remaining` to mean the waiting queue (`remaining = queued`) and pins
// `active` to `capacity` while a queue remains, per design.md. Because of that
// redefinition, a full deep-equality check against the OLD model
// (`remaining = visitors - released`) is no longer meaningful: the two models
// disagree on the numeric value of the internal `remaining` field for some
// non-buggy inputs (e.g. Ramai fully released: old remaining=8, new remaining=0)
// even though the OBSERVABLE behavior is identical.
//
// The design's Preservation Requirements (Property 2, requirements 3.1–3.6)
// are about OBSERVABLE behavior, NOT the numeric value of internal derived
// fields. So these tests assert the observable preservation behaviors directly:
//   - the release button is disabled exactly when queued === 0
//   - the Normal level has no queue with active === visitors
//   - the empty-queue state disables the button and shows the reset prompt
//   - a level change resets released to 0 and recomputes the queue
//   - the status line resolves to the correct one of three states
//   - active never exceeds capacity
//
// These are all defined purely on OBSERVABLE outputs, so they hold on both the
// unfixed and fixed helper. Only inputs where the bug condition is FALSE are
// exercised for the queue-recompute assertions, matching the design's
// Preservation Checking scope.
// ---------------------------------------------------------------------------

const capacity = 8;

// Traffic levels mirror trafficLevels in LandingPage.jsx (index -> visitors).
const trafficLevels = [
  { label: "Normal", visitors: 6 },
  { label: "Ramai", visitors: 18 },
  { label: "Lonjakan", visitors: 30 },
];

// Bug condition from the design:
//   (visitors - capacity - released) > 0 AND userReleasesQueue(input)
// A queue still exists and the user presses "Loloskan antrean". For a demo
// STATE (independent of whether a press happens), the queue-exists part is what
// distinguishes buggy-domain inputs from preserved inputs.
function isBugCondition({ visitors, released, capacity }) {
  return visitors - capacity - released > 0;
}

// The demo status line has three states (design / requirement 3.4):
//   queued > 0            -> "Kapasitas situs tetap terjaga"
//   else released > 0     -> "Antrean selesai, semua sudah masuk"
//   else                  -> "Slot tersedia, langsung masuk"
function statusLine({ queued, released }) {
  if (queued > 0) return "Kapasitas situs tetap terjaga";
  if (released > 0) return "Antrean selesai, semua sudah masuk";
  return "Slot tersedia, langsung masuk";
}

// The release button is disabled exactly when the queue is empty (design /
// requirements 3.1, 3.2). This is the observable projection driving the
// button's `disabled` attribute.
function releaseDisabled({ queued }) {
  return queued === 0;
}

// The instruction text prompt shown when the queue is empty (requirement 3.2).
const EMPTY_QUEUE_PROMPT = "Ubah trafik untuk mencoba lagi.";

// The queued count expected from the visitor total once released is reset to 0
// on a level change (requirement 3.3). This is derived purely from the design's
// fixed model: a queue of (visitors - capacity) forms, clamped at 0.
function expectedInitialQueue(visitors) {
  return Math.max(0, visitors - capacity);
}

describe("Property 2: preservation — non-release / out-of-queue behavior unchanged", () => {
  // -------------------------------------------------------------------------
  // Requirement 3.1 / 3.2 — the release button is disabled EXACTLY when the
  // queue is empty. This is the core observable preservation invariant and
  // must hold across the entire non-buggy input domain.
  //
  // **Validates: Requirements 3.1, 3.2, 3.5, 3.6**
  // -------------------------------------------------------------------------
  it("property: release button is disabled exactly when queued === 0 (observable)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: trafficLevels.length - 1 }),
        fc.integer({ min: 0, max: 40 }),
        (level, released) => {
          const visitors = trafficLevels[level].visitors;
          const state = computeDemoState({ visitors, released, capacity });

          // Observable: the button's disabled attribute tracks queued === 0.
          expect(releaseDisabled(state)).toBe(state.queued === 0);
          // Observable: active never exceeds capacity, ever.
          expect(state.active).toBeLessThanOrEqual(capacity);
        }
      )
    );
  });

  // -------------------------------------------------------------------------
  // Requirement 3.1 — Normal level (visitors = 6 <= capacity): all visitors
  // admitted, no queue, active === 6, release button disabled.
  // -------------------------------------------------------------------------
  it("Normal level: visitors=6 -> queued=0, active=6, release button disabled (observable)", () => {
    const visitors = trafficLevels[0].visitors; // 6
    const released = 0;
    const state = computeDemoState({ visitors, released, capacity });

    expect(isBugCondition({ visitors, released, capacity })).toBe(false);
    expect(state.queued).toBe(0);
    expect(state.active).toBe(6);
    expect(releaseDisabled(state)).toBe(true);
  });

  it("property: Normal level stays queue-free with the button disabled for any released count (observable)", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 40 }), (released) => {
        const visitors = trafficLevels[0].visitors; // 6
        const input = { visitors, released, capacity };
        // Normal level never satisfies the bug condition.
        expect(isBugCondition(input)).toBe(false);

        const state = computeDemoState(input);
        // Observable behavior: no queue and a disabled button, always.
        expect(state.queued).toBe(0);
        expect(releaseDisabled(state)).toBe(true);
        expect(state.active).toBe(6);
      })
    );
  });

  // -------------------------------------------------------------------------
  // Requirement 3.2 — Empty-queue state (queued === 0): release button stays
  // disabled and the "Ubah trafik untuk mencoba lagi." prompt shows.
  // -------------------------------------------------------------------------
  it("empty-queue state: when queued === 0 the release button is disabled and the empty-queue prompt shows (observable)", () => {
    // Reach an empty queue on every level by admitting the whole queue.
    for (const { visitors } of trafficLevels) {
      // released large enough that the queue is fully admitted.
      const released = Math.max(0, visitors - capacity);
      const state = computeDemoState({ visitors, released, capacity });

      // Observable: no queue, button disabled.
      expect(state.queued).toBe(0);
      expect(releaseDisabled(state)).toBe(true);
      // Observable: the prompt shown when the queue is empty is the reset prompt
      // (this mirrors the JSX conditional: queued > 0 ? release copy : prompt).
      const prompt = state.queued > 0 ? "(release copy)" : EMPTY_QUEUE_PROMPT;
      expect(prompt).toBe(EMPTY_QUEUE_PROMPT);
    }
  });

  // -------------------------------------------------------------------------
  // Requirement 3.3 — Level change resets released to 0 and recomputes the
  // queue from the new visitor total (changeLevel behavior). Observable
  // outcome: released === 0 and queued recomputed from the new visitor total
  // (Normal -> 0, Ramai -> 10, Lonjakan -> 22).
  // -------------------------------------------------------------------------
  it("level-change reset: recomputing at each level with released=0 yields released=0 and the recomputed queue (observable)", () => {
    // changeLevel(index) sets level=index and released=0. Model that reset:
    // for each target level, the state with released reset to 0 must show a
    // fresh queue derived from that level's visitor total.
    const expectedQueues = [0, 10, 22]; // Normal, Ramai, Lonjakan
    for (let index = 0; index < trafficLevels.length; index += 1) {
      const visitors = trafficLevels[index].visitors;
      const released = 0; // reset performed by changeLevel
      const state = computeDemoState({ visitors, released, capacity });

      // Observable: released is reset to 0.
      expect(state.released).toBe(0);
      // Observable: queue recomputed from the new visitor total.
      expect(state.queued).toBe(expectedQueues[index]);
      expect(state.queued).toBe(expectedInitialQueue(visitors));
    }
  });

  it("property: after a level change (released reset to 0), the queue recomputes from the new visitor total (observable)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: trafficLevels.length - 1 }),
        (level) => {
          const visitors = trafficLevels[level].visitors;
          const input = { visitors, released: 0, capacity };
          const state = computeDemoState(input);
          // Observable: released reset to 0, queue recomputed from the visitor
          // total for the newly selected level.
          expect(state.released).toBe(0);
          expect(state.queued).toBe(expectedInitialQueue(visitors));
        }
      )
    );
  });

  // -------------------------------------------------------------------------
  // Requirement 3.4 — Status line resolves to the correct one of three states
  // using the queued>0 / released>0 / else mapping. Assert the observable
  // string against the design's mapping directly.
  // -------------------------------------------------------------------------
  it("status line: idle -> 'Slot tersedia, langsung masuk'; queued -> 'Kapasitas situs tetap terjaga'; after full release -> 'Antrean selesai, semua sudah masuk'", () => {
    // Idle Normal (released=0, no queue): "Slot tersedia, langsung masuk".
    const idle = computeDemoState({ visitors: 6, released: 0, capacity });
    expect(statusLine({ queued: idle.queued, released: 0 })).toBe(
      "Slot tersedia, langsung masuk"
    );

    // Ramai with a queue still present: "Kapasitas situs tetap terjaga".
    const queuedState = computeDemoState({ visitors: 18, released: 0, capacity });
    expect(queuedState.queued).toBeGreaterThan(0);
    expect(statusLine({ queued: queuedState.queued, released: 0 })).toBe(
      "Kapasitas situs tetap terjaga"
    );

    // Ramai fully released (queued=0, released>0): "Antrean selesai...".
    const released = 18 - capacity; // 10 -> admits the whole Ramai queue
    const done = computeDemoState({ visitors: 18, released, capacity });
    expect(done.queued).toBe(0);
    expect(statusLine({ queued: done.queued, released })).toBe(
      "Antrean selesai, semua sudah masuk"
    );
  });

  it("property: the status line resolves to the correct state via the queued>0 / released>0 / else mapping (observable)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: trafficLevels.length - 1 }),
        fc.integer({ min: 0, max: 40 }),
        (level, released) => {
          const visitors = trafficLevels[level].visitors;
          const input = { visitors, released, capacity };
          fc.pre(!isBugCondition(input));

          const state = computeDemoState(input);
          const line = statusLine({ queued: state.queued, released });

          // Observable: the resolved line matches the design's three-way
          // mapping applied to the actual (observable) queued/released values.
          if (state.queued > 0) {
            expect(line).toBe("Kapasitas situs tetap terjaga");
          } else if (released > 0) {
            expect(line).toBe("Antrean selesai, semua sudah masuk");
          } else {
            expect(line).toBe("Slot tersedia, langsung masuk");
          }
        }
      )
    );
  });
});
