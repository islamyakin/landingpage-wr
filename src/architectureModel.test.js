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
          expect(state.admitted).toBeLessThanOrEqual(capacity);
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
    expect(computeArchitecture({ ...input, gateOpen: true })).toMatchObject({
      admitted: 3000,
      queued: 4200,
      mode: "FAIR LOTTERY",
    });
  });
  it("models filtering and priority without inventing extra origin slots", () => {
    expect(
      computeArchitecture({ inflow: 13500, capacity: 3000, scenario: "ddos" }),
    ).toMatchObject({ blocked: 5670, admitted: 3000, queued: 4830 });
    expect(
      computeArchitecture({
        inflow: 9500,
        capacity: 3000,
        scenario: "vip",
        vipValid: true,
      }),
    ).toMatchObject({ admitted: 3000, queued: 6500, priority: 1 });
  });
});
