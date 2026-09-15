import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import LandingPage from "./LandingPage.jsx";

function pageAt(search = "") {
  vi.stubGlobal("location", { search });
  return renderToStaticMarkup(<LandingPage />);
}

afterEach(() => vi.unstubAllGlobals());

describe("business and technical product introductions", () => {
  it("introduces the product in business terms by default", () => {
    const page = pageAt();
    expect(page).toContain(
      "Antosan adalah ruang tunggu virtual untuk situs Anda",
    );
    expect(page).toContain('id="experience-title"');
    expect(page).toContain('id="demo-title"');
    expect(page).not.toContain('id="integration-title"');
    expect(page).not.toContain('id="architecture-simulation-title"');
  });

  it("restores the original integration and architecture views for a tech link", () => {
    const page = pageAt("?audience=tech");
    expect(page).toContain('id="integration-title"');
    expect(page).toContain('id="architecture-simulation-title"');
    expect(page).toContain("Webhook &amp; status JSON");
    expect(page).not.toContain('id="experience-title"');
  });

  it("keeps source pricing and the original brand artwork available to both audiences", () => {
    for (const query of ["", "?audience=tech"]) {
      const page = pageAt(query);
      expect(page).toContain("/images/stitch/gateway.webp");
      expect(page).toContain('id="home-pricing-title"');
      for (const price of ["Rp 2.900.000", "Rp 6.900.000", "Rp 21.000.000"]) {
        expect(page).toContain(price);
      }
      expect(page).toContain('href="/harga"');
      expect(page).toContain('href="#cara-kerja"');
    }
  });

  it("uses the business introduction for an unrecognized audience", () => {
    expect(pageAt("?audience=other")).toContain('id="experience-title"');
  });
});
