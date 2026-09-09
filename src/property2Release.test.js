import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { computeDemoState } from "./LandingPage.jsx";

// ---------------------------------------------------------------------------
// Feature: landing-page-redesign, Property 2: Pelepasan memasukkan pengunjung antrean
//
// For queued > 0, a single release admits min(4, queued) waiting visitors:
//   queued -> max(0, queued - 4),
//   active stays pinned to capacity while a queue remains after the release,
//   and the present population (visitors) is unchanged.
//
// The release handler is modeled exactly as the component wires it:
//   setReleased((value) => value + Math.min(4, queued))
// i.e. released -> released + Math.min(4, queued). We never duplicate the
// computeDemoState formula; both the before and after states come from the
// imported computeDemoState.
//
// **Validates: Requirements 6.2, 6.6**
// ---------------------------------------------------------------------------

const capacity = 8;

// Traffic levels mirror trafficLevels in LandingPage.jsx (visitors per level).
const LEVELS = [6, 18, 30];

describe("Property 2: releasing admits queued visitors", () => {
  it("one release drains queued by min(4, queued), pins active to capacity while a queue remains, and leaves visitors unchanged", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LEVELS),
        fc.integer({ min: 0, max: 40 }),
        (visitors, released) => {
          const before = computeDemoState({ visitors, released, capacity });

          // Only assert the property when a queue exists before the release.
          fc.pre(before.queued > 0);

          // Model one release exactly as the component handler does.
          const newReleased = released + Math.min(4, before.queued);
          const after = computeDemoState({
            visitors,
            released: newReleased,
            capacity,
          });

          // queued -> max(0, queued - 4) (drops by min(4, before.queued)).
          expect(after.queued).toBe(Math.max(0, before.queued - 4));

          // active stays pinned to capacity while a queue remains.
          if (after.queued > 0) {
            expect(after.active).toBe(capacity);
          }

          // Present population (visitors) is unchanged.
          expect(after.visitors).toBe(before.visitors);
        }
      ),
      { numRuns: 200 }
    );
  });
});
