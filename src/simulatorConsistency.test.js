import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  architectureScenarios,
  computeArchitecture,
  describeFlow,
} from "./architectureModel.js";

// ---------------------------------------------------------------------------
// The architecture simulator's numbers were always internally consistent, but
// the copy and the meters around them were not. These lock the fixes:
//
//  1. The status line is derived from the flow, so no slider move or gate press
//     can leave it asserting the opposite of the four node values.
//  2. Every meter shares one denominator (the inbound wave), so the three
//     downstream bars decompose the inbound bar instead of using three scales.
//  3. No scenario copy hardcodes a number a slider can invalidate.
// ---------------------------------------------------------------------------

const count = (v) => v.toLocaleString("id-ID");
const share = (value, inflow) => (inflow > 0 ? value / inflow : 0);

const anyInput = () =>
  fc.record({
    inflow: fc.integer({ min: 500, max: 15000 }),
    capacity: fc.integer({ min: 1000, max: 8000 }),
    scenario: fc.constantFrom(...architectureScenarios.map((s) => s.id)),
    gateOpen: fc.boolean(),
    vipValid: fc.boolean(),
  });

describe("scenario copy cannot go stale", () => {
  it("no premise hardcodes a visitor or slot count the sliders can change", () => {
    for (const scenario of architectureScenarios) {
      expect(scenario.premise, scenario.id).toBeTypeOf("string");
      // The old note said "diturunkan menjadi 1.800 slot" and kept saying it
      // after the capacity slider moved to 8.000.
      expect(scenario.premise, scenario.id).not.toMatch(/\d[\d.,]*\s*slot/i);
      expect(scenario.premise, scenario.id).not.toMatch(/\d[\d.,]*\s*pengunjung/i);
    }
  });

  it("the retired `note` field is gone so nothing can render the stale copy", () => {
    for (const scenario of architectureScenarios) {
      expect(scenario.note, scenario.id).toBeUndefined();
    }
  });
});

describe("the live description always matches the computed flow", () => {
  it("states the real queue and origin counts for every reachable state", () => {
    fc.assert(
      fc.property(anyInput(), (input) => {
        const flow = computeArchitecture(input);
        const text = describeFlow(flow, input.capacity);

        // A queue is never described as a straight pass-through, and an empty
        // queue is never described as people still waiting.
        if (flow.queued > 0) {
          expect(text).not.toMatch(/langsung ke origin/);
          expect(text).toContain(count(flow.queued));
        } else {
          expect(text).not.toMatch(/menunggu giliran/);
          expect(text).toMatch(/Kapasitas cukup|seluruh .* fair lottery/);
        }
        // Filtered visitors are only ever mentioned when some were filtered.
        expect(/gagal verifikasi/.test(text)).toBe(flow.blocked > 0);
        if (flow.blocked > 0) expect(text).toContain(count(flow.blocked));
        // A priority admission is only claimed when the model granted one, and
        // it must be described as sitting outside the capacity ceiling - that
        // is what the gateway's VIP redeem path actually does.
        expect(/admisi prioritas/.test(text)).toBe(flow.priority > 0);
        if (flow.priority > 0) {
          expect(text).toContain("di luar batas kapasitas");
          expect(flow.admitted).toBe(flow.regular + flow.priority);
        }
      }),
    );
  });

  it("stops telling the user to open a gate that is already open", () => {
    const input = { inflow: 7200, capacity: 3000, scenario: "lottery" };
    const closed = computeArchitecture({ ...input, gateOpen: false });
    const open = computeArchitecture({ ...input, gateOpen: true });

    expect(describeFlow(closed, input.capacity)).toContain("Buka gerbang");
    expect(describeFlow(open, input.capacity)).not.toContain("Buka gerbang");
    expect(describeFlow(open, input.capacity)).toContain("Gerbang terbuka");
  });

  it("drops the pass-through claim once a raised inflow creates a queue", () => {
    const base = { capacity: 3000, scenario: "normal" };
    const quiet = computeArchitecture({ ...base, inflow: 1200 });
    const busy = computeArchitecture({ ...base, inflow: 15000 });

    expect(describeFlow(quiet, base.capacity)).toContain("langsung ke origin");
    // The old static note kept saying "langsung diteruskan ke origin" here,
    // while the waiting-room node showed 12.000 queued.
    expect(describeFlow(busy, base.capacity)).not.toContain("langsung ke origin");
    expect(describeFlow(busy, base.capacity)).toContain(count(12000));
  });
});

describe("meters share one denominator", () => {
  it("the three downstream shares sum to the inbound bar", () => {
    fc.assert(
      fc.property(anyInput(), (input) => {
        const flow = computeArchitecture(input);
        const bars = {
          inbound: 1,
          edge: share(flow.blocked, flow.inflow),
          waiting: share(flow.queued, flow.inflow),
          origin: share(flow.admitted, flow.inflow),
        };
        expect(bars.edge + bars.waiting + bars.origin).toBeCloseTo(
          bars.inbound,
          10,
        );
        for (const value of Object.values(bars)) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        }
      }),
    );
  });

  it("a larger count never renders a shorter bar than a smaller one", () => {
    fc.assert(
      fc.property(anyInput(), (input) => {
        const flow = computeArchitecture(input);
        // The old code scaled origin by capacity and inbound by a hardcoded
        // 15000, so 3.000 admitted drew a 100% bar next to 12.000 queued at 80%.
        const pairs = [
          [flow.queued, share(flow.queued, flow.inflow)],
          [flow.admitted, share(flow.admitted, flow.inflow)],
          [flow.blocked, share(flow.blocked, flow.inflow)],
        ];
        for (const [countA, barA] of pairs) {
          for (const [countB, barB] of pairs) {
            if (countA > countB) expect(barA).toBeGreaterThan(barB);
          }
        }
      }),
    );
  });
});
