import { describe, it, expect } from "vitest";
import { scenarios, plays, trustQuote } from "./LandingPage.jsx";

// ---------------------------------------------------------------------------
// Task 1.4 - Example tests for the new static content data structures.
//
// These verify the redesign's content model WITHOUT rendering React, by
// importing the real exported data (`scenarios`, `plays`, `trustQuote`) from
// LandingPage.jsx. Binding to the actual source means the assertions track the
// real content rather than duplicated literals. Node environment, no DOM.
//
// _Requirements: 2.1, 2.2, 2.3, 3.2, 3.3, 10.3_
// ---------------------------------------------------------------------------

describe("content model: scenarios (req 2.1, 2.2, 2.3)", () => {
  it("has at least five scenarios", () => {
    expect(scenarios.length).toBeGreaterThanOrEqual(5);
  });

  it("includes the four required base scenario labels (req 2.1)", () => {
    const labels = scenarios.map((s) => s.label);
    for (const required of [
      "Penjualan tiket",
      "Flash sale",
      "Registrasi event",
      "Peluncuran produk",
    ]) {
      expect(labels).toContain(required);
    }
  });

  it("includes exactly one seasonal scenario (req 2.2)", () => {
    const seasonal = scenarios.filter((s) => s.seasonal === true);
    expect(seasonal.length).toBe(1);
  });

  it("gives every scenario a non-empty outcome statement (req 2.3)", () => {
    for (const scenario of scenarios) {
      expect(typeof scenario.outcome).toBe("string");
      expect(scenario.outcome.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("content model: plays / activation modes (req 3.2, 3.3)", () => {
  it("has exactly three activation modes", () => {
    expect(plays.length).toBe(3);
  });

  it("uses the required activation mode ids (req 3.2)", () => {
    const ids = plays.map((p) => p.id);
    for (const required of ["jaring-pengaman", "terjadwal", "eksklusif"]) {
      expect(ids).toContain(required);
    }
  });

  it("states when each mode should be used via a non-empty `when` (req 3.3)", () => {
    for (const play of plays) {
      expect(typeof play.when).toBe("string");
      expect(play.when.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("content model: trust quote (req 10.3)", () => {
  it("is flagged as illustrative", () => {
    expect(trustQuote.illustrative).toBe(true);
  });
});
