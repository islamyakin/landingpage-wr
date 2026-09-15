import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// A `var(--missing-token)` does not warn and does not throw - the browser just
// drops the whole declaration, so a background silently renders transparent and
// a `border: 1px solid var(--x)` collapses to `0px none`. That is exactly how
// the hero price chip and the subscribe panel's recessed box lost their fills.
// This walks every stylesheet and fails if any consumed token is undefined.
// ---------------------------------------------------------------------------

const SHEETS = [
  "tokens.css",
  "src/tokens.css",
  "src/stitch.css",
  "src/landing.css",
  "src/redesign.css",
  "src/gateway.css",
];

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

function definedTokens() {
  const names = new Set();
  for (const file of SHEETS) {
    for (const m of read(file).matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)) {
      names.add(m[1]);
    }
  }
  return names;
}

describe("CSS custom properties", () => {
  it("has no dangling var() reference in any stylesheet", () => {
    const defined = definedTokens();
    const dangling = [];
    for (const file of SHEETS) {
      const text = read(file);
      for (const m of text.matchAll(/var\((--[a-z0-9-]+)/g)) {
        if (!defined.has(m[1])) {
          const line = text.slice(0, m.index).split("\n").length;
          dangling.push(`${file}:${line} → ${m[1]}`);
        }
      }
    }
    expect(dangling).toEqual([]);
  });

  it("still defines the palette tokens the pages lean on", () => {
    const defined = definedTokens();
    for (const token of [
      "--color-primary",
      "--color-canvas",
      "--color-card",
      "--color-rule",
      "--color-chip-bg",
      "--color-chip-rule",
      "--font-body",
      "--font-mono",
    ]) {
      expect(defined.has(token), `${token} is not defined`).toBe(true);
    }
  });
});
