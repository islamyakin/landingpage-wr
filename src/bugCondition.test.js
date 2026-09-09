import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { computeDemoState } from "./LandingPage.jsx";

// ---------------------------------------------------------------------------
// Task 2 — Bug condition exploration test (Property 1 / bugfix 2.1, 2.2)
//
// CRITICAL: This test encodes the EXPECTED (correct) behavior of QueueDemo.
// It is EXPECTED TO FAIL on the current (unfixed) computeDemoState, and that
// failure CONFIRMS the bug: releasing the queue must ADMIT queued visitors
// into the site's open slots, but the unfixed formula (remaining = visitors -
// released) instead SHRINKS the present pool, making visitors vanish and
// eventually dropping "Di dalam situs" (active) below capacity.
//
// DO NOT fix the test or the code here. When the fix lands in a later task,
// this same test will PASS and validate the corrected behavior.
// ---------------------------------------------------------------------------

const capacity = 8;

// The concrete failing traffic levels from the design (both capacity = 8).
const RAMAI = 18;
const LONJAKAN = 30;

// Bug condition from the design:
//   (visitors - capacity - released) > 0 AND userReleasesQueue(input)
// i.e. a queue still exists and the user presses "Loloskan antrean".
function isBugCondition({ visitors, released, capacity }) {
  return visitors - capacity - released > 0;
}

// The release handler admits up to 4 queued visitors per press. This mirrors
// the real handler: setReleased((value) => value + Math.min(4, queued)).
function pressRelease(visitors, released) {
  const { queued } = computeDemoState({ visitors, released, capacity });
  return released + Math.min(4, queued);
}

// What the user SEES in the arrivals column ("Pengunjung") is rendered from
// `remaining` via `i < remaining`, and the site ("Di dalam situs") is rendered
// from `active` via `i < active`.
//
// In the CORRECT model, releasing the queue reclassifies a waiting visitor as
// admitted: the arrivals column shows ONLY the visitors still waiting in the
// queue, i.e. `remaining === queued`, while `active` stays pinned at capacity.
//
// In the BUGGY model, `remaining = visitors - released`, so the arrivals column
// shows the queue PLUS the people who should already be inside the site
// (`remaining === queued + capacity` while a queue exists). Each release shrinks
// that pool — present visitors visibly vanish from the simulation instead of
// flowing into the site.

describe("Property 1: releasing the queue admits waiting visitors into the site", () => {
  it("after a release while a queue remains, active stays at capacity and no visitor vanishes (Ramai, first press)", () => {
    const visitors = RAMAI;
    const released = 0;

    // Bug condition holds: a queue exists and we release.
    expect(isBugCondition({ visitors, released, capacity })).toBe(true);

    const before = computeDemoState({ visitors, released, capacity });
    const afterReleased = pressRelease(visitors, released);
    const after = computeDemoState({
      visitors,
      released: afterReleased,
      capacity,
    });

    const admitted = afterReleased - released; // number released this press

    // Expected behavior properties:
    // 1. active ("Di dalam situs") stays at capacity while a queue remains.
    expect(after.active).toBe(capacity);
    // 2. queued strictly decreases by the number released (up to 4).
    expect(after.queued).toBe(before.queued - admitted);
    // 3. No visitor disappears: the arrivals column shows exactly the waiting
    //    queue (admitted visitors are inside the site, not vanished). On the
    //    buggy code `remaining = visitors - released = queued + capacity`, so
    //    this fails — the arrivals pool still carries the people who should be
    //    inside, and shrinks on release as visitors vanish.
    expect(after.remaining).toBe(after.queued);
  });

  it("draining the queue keeps active pinned at capacity until the queue empties, present population invariant (Ramai)", () => {
    const visitors = RAMAI;
    let released = 0;

    // Drain the whole queue one press at a time.
    // Guard the loop so a buggy model can't spin forever.
    for (let step = 0; step < 20; step += 1) {
      const state = computeDemoState({ visitors, released, capacity });
      if (state.queued === 0) break;

      // Bug condition holds on every press while a queue remains.
      expect(isBugCondition({ visitors, released, capacity })).toBe(true);

      const admitted = Math.min(4, state.queued);
      released = pressRelease(visitors, released);
      const after = computeDemoState({ visitors, released, capacity });

      // active only falls below capacity once queued === 0 and visitors <
      // capacity. While a queue remains, active must stay at capacity.
      if (after.queued > 0) {
        expect(after.active).toBe(capacity);
      }
      // queued strictly decreases by exactly the number admitted.
      expect(after.queued).toBe(state.queued - admitted);
      // Nobody vanishes: arrivals column shows exactly the waiting queue.
      expect(after.remaining).toBe(after.queued);
    }

    // Once fully drained, everyone that fits is inside the site and the
    // arrivals column is empty (no leftover "present" visitors lingering).
    const end = computeDemoState({ visitors, released, capacity });
    expect(end.queued).toBe(0);
    expect(end.active).toBe(Math.min(capacity, visitors));
    expect(end.remaining).toBe(0);
  });

  it("Lonjakan: repeated release never drops Di dalam situs below capacity while a queue is draining", () => {
    const visitors = LONJAKAN;
    let released = 0;

    for (let step = 0; step < 40; step += 1) {
      const state = computeDemoState({ visitors, released, capacity });
      if (state.queued === 0) break;

      released = pressRelease(visitors, released);
      const after = computeDemoState({ visitors, released, capacity });

      // While a queue remains, the site must stay full.
      if (after.queued > 0) {
        expect(after.active).toBe(capacity);
      }
      // No visitor disappears: arrivals column shows exactly the waiting queue.
      expect(after.remaining).toBe(after.queued);
    }

    const end = computeDemoState({ visitors, released, capacity });
    expect(end.queued).toBe(0);
    expect(end.remaining).toBe(0);
  });

  // Scoped property-based version across the concrete failing levels and any
  // number of release presses. active === capacity whenever a queue remains,
  // and the present population is invariant across releases.
  //
  // **Validates: Requirements 2.1, 2.2**
  it("property: for Ramai/Lonjakan, active === capacity while queued > 0 and visitors is invariant across any release sequence", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(RAMAI, LONJAKAN),
        fc.integer({ min: 0, max: 30 }), // number of release presses
        (visitors, presses) => {
          let released = 0;
          for (let i = 0; i < presses; i += 1) {
            released = pressRelease(visitors, released);
          }
          const state = computeDemoState({ visitors, released, capacity });

          // No visitor vanishes: the arrivals column shows exactly the waiting
          // queue, so admitted visitors are inside the site rather than
          // lingering as "present" in the arrivals pool.
          expect(state.remaining).toBe(state.queued);
          // Site stays full while any queue remains.
          if (state.queued > 0) {
            expect(state.active).toBe(capacity);
          }
          // active never exceeds capacity.
          expect(state.active).toBeLessThanOrEqual(capacity);
        }
      )
    );
  });
});
