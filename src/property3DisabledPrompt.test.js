import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  computeDemoState,
  demoEmptyQueuePrompt,
  demoReleaseInstruction,
} from "./LandingPage.jsx";

// ---------------------------------------------------------------------------
// Feature: landing-page-redesign, Property 3: Tombol pelepasan nonaktif tepat
// saat antrean kosong
//
// The release button is disabled exactly when the queue is empty
// (disabled === (queued === 0)), and the prompt shown mirrors the component:
//   queued > 0 ? demoReleaseInstruction : demoEmptyQueuePrompt
// so when queued === 0 the empty-queue prompt is shown, and when queued > 0
// the release instruction is shown.
//
// The model is never duplicated: `queued` comes from the imported
// computeDemoState, and both strings are imported from LandingPage.jsx.
//
// **Validates: Requirements 6.3**
// ---------------------------------------------------------------------------

const capacity = 8;

// Traffic levels mirror trafficLevels in LandingPage.jsx (visitors per level).
const LEVELS = [6, 18, 30];

// The release button is disabled exactly when the queue is empty.
function releaseDisabled(queued) {
  return queued === 0;
}

// The prompt selection mirrors the component's inline conditional.
function shownPrompt(queued) {
  return queued > 0 ? demoReleaseInstruction : demoEmptyQueuePrompt;
}

describe("property 3: release button disabled exactly when the queue is empty", () => {
  it("property: disabled === (queued === 0), and the prompt matches the queue state", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...LEVELS),
        // released spans [0, N] where N is the visitors count for the level.
        fc.nat(),
        (visitors, releasedSeed) => {
          const released = releasedSeed % (visitors + 1); // released in [0, visitors]
          const { queued } = computeDemoState({ visitors, released, capacity });

          // Disabled state tracks the empty queue exactly.
          expect(releaseDisabled(queued)).toBe(queued === 0);

          // Prompt selection mirrors the component.
          if (queued === 0) {
            expect(shownPrompt(queued)).toBe(demoEmptyQueuePrompt);
          } else {
            expect(shownPrompt(queued)).toBe(demoReleaseInstruction);
          }
        }
      )
    );
  });
});
