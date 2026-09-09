import { describe, it, expect } from "vitest";
import {
  faqs,
  demoReleaseInstruction,
  demoEmptyQueuePrompt,
} from "./LandingPage.jsx";

// ---------------------------------------------------------------------------
// Task 5.4 — Static string assertions for the phrasing changes
// (bugfix requirements 2.3, 2.4, 2.5).
//
// These verify the phrasing corrections WITHOUT rendering React, by importing
// the real strings from LandingPage.jsx (the exported `faqs` array and the
// exported demo instruction constants). Binding to the actual source means the
// assertions track real code rather than duplicated literals.
// ---------------------------------------------------------------------------

// Look up an FAQ answer by its question text.
function faqAnswer(question) {
  const entry = faqs.find(([q]) => q === question);
  expect(entry, `FAQ question not found: ${question}`).toBeDefined();
  return entry[1];
}

describe("phrasing: corrected FAQ answer for 'Bagaimana cara mendapatkan akses?' (req 2.4)", () => {
  const question = "Bagaimana cara mendapatkan akses?";

  it("no longer contains the old redundant 'administrator platform' phrasing", () => {
    const answer = faqAnswer(question);
    expect(answer).not.toContain("administrator platform");
  });

  it("does not repeat 'administrator' three times", () => {
    const answer = faqAnswer(question);
    const occurrences = (answer.match(/administrator/gi) || []).length;
    expect(occurrences).toBeLessThan(3);
  });

  it("still conveys the meaning (mentions 'administrator workspace' and 'anggota tim')", () => {
    const answer = faqAnswer(question);
    expect(answer).toContain("administrator workspace");
    expect(answer).toContain("anggota tim");
  });
});

describe("phrasing: demo instruction matches the release action (req 2.3, 2.5)", () => {
  it("the queued > 0 copy is NOT the old contradictory 'Coba kosongkan 4 slot di situs.'", () => {
    expect(demoReleaseInstruction).not.toBe("Coba kosongkan 4 slot di situs.");
  });

  it("the queued > 0 copy IS the new 'Loloskan 4 pengunjung ke dalam situs.'", () => {
    expect(demoReleaseInstruction).toBe("Loloskan 4 pengunjung ke dalam situs.");
  });

  it("the empty-queue prompt is preserved as 'Ubah trafik untuk mencoba lagi.'", () => {
    expect(demoEmptyQueuePrompt).toBe("Ubah trafik untuk mencoba lagi.");
  });
});
