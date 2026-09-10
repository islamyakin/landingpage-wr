import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  architectureScenarios,
  computeArchitecture,
} from "./architectureModel.js";

describe("architecture simulation", () => {
  it("accounts for every visitor and never exceeds origin capacity", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 500, max: 15000 }),
        fc.integer({ min: 1000, max: 8000 }),
        fc.constantFrom(...architectureScenarios.map((s) => s.id)),
        fc.boolean(),
        fc.boolean(),
        (inflow, capacity, scenario, gateOpen, vipValid) => {
          const state = computeArchitecture({
            inflow,
            capacity,
            scenario,
            gateOpen,
            vipValid,
          });
          expect(state.blocked + state.admitted + state.queued).toBe(inflow);
          // Priority admissions sit OUTSIDE the concurrency ceiling: the
          // gateway's VIP redeem script adds the holder to the active set
          // without consulting max_active at all
          // (waitingroom/internal/queue/vip.go). So the ceiling binds the
          // regular lane, and total admissions may exceed it by the number of
          // priority admissions.
          expect(state.regular).toBeLessThanOrEqual(capacity);
          expect(state.admitted).toBeLessThanOrEqual(capacity + state.priority);
          expect(state.priority).toBeLessThanOrEqual(state.admitted);
          expect(state.queued).toBeGreaterThanOrEqual(0);
        },
      ),
    );
  });
  it("does not treat a legitimate flash sale as bot traffic", () => {
    expect(
      computeArchitecture({ inflow: 15000, capacity: 3000, scenario: "surge" }),
    ).toMatchObject({
      blocked: 0,
      admitted: 3000,
      queued: 12000,
      mode: "FIFO",
    });
  });
  it("holds the whole pre-queue until opening", () => {
    const input = {
      inflow: 7200,
      capacity: 3000,
      scenario: "lottery",
      vipValid: true,
    };
    expect(computeArchitecture(input)).toMatchObject({
      admitted: 0,
      queued: 7200,
      priority: 0,
      mode: "PRE-QUEUE",
    });
    // Once the gate opens the priority code takes effect, and it admits on top
    // of the ceiling rather than inside it (see the VIP note above).
    expect(computeArchitecture({ ...input, gateOpen: true })).toMatchObject({
      regular: 3000,
      admitted: 3001,
      queued: 4199,
      priority: 1,
      mode: "FAIR LOTTERY",
    });
  });
  it("models filtering, and lets a priority code skip past the ceiling", () => {
    expect(
      computeArchitecture({ inflow: 13500, capacity: 3000, scenario: "ddos" }),
    ).toMatchObject({ blocked: 5670, admitted: 3000, queued: 4830 });

    // This assertion previously expected admitted === 3000, i.e. the priority
    // holder taking one of the 3.000 capacity slots. That contradicted the
    // product: `redeemScript` in waitingroom/internal/queue/vip.go ZADDs the
    // holder into the active set with no max_active check, and the README says
    // VIP admission "mengabaikan max_active (itulah gunanya)". The regular lane
    // still fills exactly the ceiling; the priority admission is on top.
    expect(
      computeArchitecture({
        inflow: 9500,
        capacity: 3000,
        scenario: "vip",
        vipValid: true,
      }),
    ).toMatchObject({ regular: 3000, admitted: 3001, queued: 6499, priority: 1 });
  });
});
