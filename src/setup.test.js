import { describe, it, expect } from "vitest";
import { computeDemoState } from "./LandingPage.jsx";

// Trivial smoke test to confirm the Vitest runner is wired up correctly, plus
// a snapshot of the extracted computeDemoState helper for the Normal level.
describe("test runner setup", () => {
  it("runs a trivial passing assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("imports the extracted computeDemoState helper", () => {
    // FIXED model output for the Normal level: `remaining` now mirrors the
    // waiting queue (queued === 0 here), so remaining is 0 rather than the OLD
    // model's `visitors - released` (6).
    const state = computeDemoState({ visitors: 6, released: 0, capacity: 8 });
    expect(state).toEqual({
      visitors: 6,
      released: 0,
      capacity: 8,
      remaining: 0,
      active: 6,
      queued: 0,
    });
  });
});
