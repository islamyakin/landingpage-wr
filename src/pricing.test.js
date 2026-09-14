import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  siteConfig,
  pricingPlans,
  eventPack,
  pricingAddons,
  subscriptionLinks,
  entryPackage,
  entryPackagePriced,
  entryPackageLimits,
  entryPriceHeadline,
  formatIDR,
} from "./siteConfig.js";
import { detailsToSend } from "./SubscribePanel.jsx";

// ---------------------------------------------------------------------------
// Published prices come from Stitch Antosan-harga. Contact stays email-based;
// custom-contract pricing must not become a fake number or checkout.
// ---------------------------------------------------------------------------

describe("subscription contact", () => {
  it("routes the CTAs to an in-page anchor, not a protocol handler", () => {
    // A bare mailto: does nothing at all when the visitor has no mail client
    // registered - no error, no window - so it must never be the only route a
    // CTA offers. Same-document anchors cannot fail to activate.
    expect(siteConfig.subscribeUrl).toBe("#berlangganan");
  });

  it("offers three independent ways to reach halo@antosan.com", () => {
    expect(siteConfig.contactEmail).toBe("halo@antosan.com");
    expect(siteConfig.mailtoUrl.startsWith("mailto:halo@antosan.com?")).toBe(
      true,
    );
    for (const url of [
      siteConfig.gmailComposeUrl,
      siteConfig.outlookComposeUrl,
    ]) {
      expect(url.startsWith("https://")).toBe(true);
      expect(decodeURIComponent(url)).toContain("halo@antosan.com");
    }
  });

  it("prefills a subject and an event-details body on every route", () => {
    for (const url of [
      siteConfig.mailtoUrl,
      siteConfig.gmailComposeUrl,
      siteConfig.outlookComposeUrl,
    ]) {
      const decoded = decodeURIComponent(url);
      expect(decoded).toContain("paket per event");
      expect(decoded).toContain("Tanggal dan jam pembukaan event:");
      expect(decoded).toContain("Kapasitas origin saat ini:");
    }
  });

  it("asks the panel and the prefilled body for the same details", () => {
    for (const detail of detailsToSend) {
      expect(siteConfig.subscribeBody).toContain(detail);
    }
  });
});

describe("entry package never invents a figure", () => {
  it("is only treated as priced when a real number is set", () => {
    expect(entryPackagePriced).toBe(typeof entryPackage.priceIDR === "number");
  });

  it("omits every limit that is still unset", () => {
    expect(entryPackageLimits({})).toEqual([]);
    expect(
      entryPackageLimits({
        maxActive: null,
        rooms: null,
        eventWindowHours: null,
        challengeTypes: null,
        vipCodes: null,
        automation: null,
      }),
    ).toEqual([]);
  });

  it("renders the real limits once they are filled in", () => {
    expect(
      entryPackageLimits({
        maxActive: 5000,
        rooms: 1,
        eventWindowHours: 24,
        challengeTypes: ["math", "pow"],
        vipCodes: 200,
        automation: true,
      }),
    ).toEqual([
      "5.000 pengunjung aktif bersamaan",
      "1 room aktif",
      "Jendela event 24 jam",
      "Challenge anti-bot: math, pow",
      "200 kode prioritas",
      "Webhook event dan mode JSON",
    ]);
  });

  it("never emits a partially-filled row", () => {
    for (const row of entryPackageLimits({
      maxActive: 5000,
      rooms: null,
      challengeTypes: [],
      vipCodes: null,
      automation: false,
    })) {
      expect(row).not.toMatch(/null|undefined|NaN/);
    }
  });

  it("formats rupiah in Indonesian grouping", () => {
    expect(formatIDR(2500000)).toBe("Rp 2.500.000");
  });
});

describe("the unpriced state reads as a quote, not as an unfinished page", () => {
  const page = readFileSync(
    new URL("./StitchPage.jsx", import.meta.url),
    "utf8",
  );

  it("never tells visitors the price is undecided", () => {
    // "harga belum dipublikasikan" / "sedang difinalkan" is honest but it
    // advertises that the business has not settled its own pricing.
    for (const phrase of [
      "belum dipublikasikan",
      "sedang difinalkan",
      "akan dipublikasikan",
      "coming soon",
      "TBA",
    ]) {
      expect(page).not.toContain(phrase);
    }
  });

  it("states the pricing model somewhere in the section", () => {
    // Deliberately not pinned to a particular headline: the cards carry
    // marketing copy that gets rewritten often. What has to survive is that the
    // page says how Antosan is sold, so a visitor knows it is priced per event
    // rather than as a monthly subscription.
    expect(page).toContain("per event");
    expect(page).toContain("bukan langganan bulanan");
  });
});

describe("the price-led hero highlight", () => {
  it("never shows a figure while none is set", () => {
    const text = entryPriceHeadline({ priceIDR: null });
    expect(text).not.toMatch(/\d/);
    expect(text).toContain("per event");
  });

  it("shows the real figure once it is set", () => {
    expect(entryPriceHeadline({ priceIDR: 2500000 })).toBe(
      "Mulai Rp 2.500.000 per event",
    );
  });

  it("makes no comparative claim this repo cannot substantiate", () => {
    for (const pkg of [{ priceIDR: null }, { priceIDR: 2500000 }]) {
      // "termurah"/"paling murah"/"terbaik" would be a claim against other
      // vendors, and nothing here has their pricing.
      expect(entryPriceHeadline(pkg)).not.toMatch(
        /termurah|paling murah|terbaik|termahal|no\.?\s*1/i,
      );
    }
  });
});

describe("Antosan-harga published pricing", () => {
  it("preserves the source prices and commercial allowances", () => {
    expect(
      pricingPlans.map(
        ({
          name,
          priceIDR,
          concurrentVisitors,
          rooms,
          members,
          retentionDays,
        }) => [
          name,
          priceIDR,
          concurrentVisitors,
          rooms,
          members,
          retentionDays,
        ],
      ),
    ).toEqual([
      ["Starter", 2900000, 2000, 2, 3, 14],
      ["Growth", 6900000, 10000, 10, 10, 60],
      ["Scale", 21000000, 50000, 25, 25, 90],
      ["Enterprise", null, undefined, undefined, undefined, undefined],
    ]);
    expect(eventPack).toMatchObject({
      priceIDR: 7500000,
      concurrentVisitors: 25000,
      days: 7,
    });
    expect(entryPackage.priceIDR).toBe(pricingPlans[0].priceIDR);
    expect(entryPackage.maxActive).toBeNull();
  });

  it("keeps per-event add-ons separate from per-room and per-account rates", () => {
    expect(
      pricingAddons.map(({ name, priceIDR, unit }) => [name, priceIDR, unit]),
    ).toEqual([
      ["Bot Defense", 499000, "event"],
      ["Custom Branding", 799000, "event"],
      ["Akses VIP", 350000, "event"],
      ["Webhook", 299000, "event"],
      ["Adaptive Concurrency", 699000, "event"],
      ["Laporan & Ekspor", 250000, "event"],
      ["Ruang Antrean", 150000, "room"],
      ["Anggota Tim", 75000, "akun"],
    ]);
  });

  it("encodes the chosen package or add-on intact in all email routes", () => {
    for (const choice of [
      "Growth · Rp 6.900.000 / event",
      "Laporan & Ekspor · Rp 250.000 / event",
      "Enterprise · penawaran khusus",
    ]) {
      for (const link of Object.values(subscriptionLinks(choice))) {
        const url = new URL(link);
        expect(url.searchParams.get("body")).toBe(
          `${siteConfig.subscribeBody}\n\nPilihan: ${choice}`,
        );
        expect(url.searchParams.has("Ekspor")).toBe(false);
      }
    }
  });
});
