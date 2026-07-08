import { describe, it, expect } from "vitest";
import { scoreMeta } from "../lib/scorer";
import type { MetaResult } from "../lib/types";

function makeMeta(overrides: Partial<MetaResult> = {}): MetaResult {
  return {
    title: { value: "A Proper Title Length That Is Good Enough", length: 42 },
    description: { value: "A good description that is long enough to pass all the checks for length requirements.", length: 80 },
    canonical: "https://example.com",
    robots: "index, follow",
    viewport: "width=device-width, initial-scale=1",
    charset: "UTF-8",
    lang: "en",
    favicon: "https://example.com/favicon.ico",
    jsonLd: [{ raw: '{"@context":"https://schema.org","@type":"WebPage"}', parsed: { "@context": "https://schema.org", "@type": "WebPage" }, hasContext: true, hasType: true, typeName: "WebPage" }],
    openGraph: {
      "og:title": "OG Title",
      "og:description": "OG Description",
      "og:image": "https://example.com/og.png",
      "og:url": "https://example.com",
      "og:type": "website",
      "og:site_name": "TestSite",
    },
    twitter: {
      "twitter:card": "summary_large_image",
      "twitter:title": "Twitter Title",
      "twitter:description": "Twitter Description",
      "twitter:image": "https://example.com/twitter.png",
    },
    ...overrides,
  };
}

describe("scoreMeta", () => {
  it("returns 100 for perfect meta tags", () => {
    const { score, findings } = scoreMeta(makeMeta({ title: { value: "A Proper Title Length That Is Good Enough", length: 42 } }));
    expect(score).toBe(100);
    expect(findings.length).toBe(0);
  });

  it("deducts for missing title (error -15)", () => {
    const { score, findings } = scoreMeta(makeMeta({ title: null }));
    expect(score).toBe(85);
    expect(findings).toContainEqual(
      expect.objectContaining({ id: "missing-title", severity: "error" })
    );
  });

  it("deducts for short title (warning -5)", () => {
    const { score, findings } = scoreMeta(makeMeta({ title: { value: "Hi", length: 2 } }));
    expect(score).toBe(95);
    expect(findings).toContainEqual(
      expect.objectContaining({ id: "title-length", severity: "warning" })
    );
  });

  it("deducts for long title (warning -5)", () => {
    const { score } = scoreMeta(
      makeMeta({ title: { value: "A".repeat(70), length: 70 } })
    );
    expect(score).toBe(95);
  });

  it("deducts for missing description (error -15)", () => {
    const { score, findings } = scoreMeta(makeMeta({ description: null }));
    expect(score).toBe(85);
    expect(findings).toContainEqual(
      expect.objectContaining({ id: "missing-description", severity: "error" })
    );
  });

  it("deducts for short description (warning -5)", () => {
    const { score } = scoreMeta(
      makeMeta({ description: { value: "Short", length: 5 } })
    );
    expect(score).toBe(95);
  });

  it("deducts for long description (warning -5)", () => {
    const { score } = scoreMeta(
      makeMeta({ description: { value: "A".repeat(200), length: 200 } })
    );
    expect(score).toBe(95);
  });

  it("deducts for missing og:title (error -8)", () => {
    const { score } = scoreMeta(
      makeMeta({ openGraph: { ...makeMeta().openGraph, "og:title": null } })
    );
    expect(score).toBe(92);
  });

  it("deducts for missing og:image (error -10)", () => {
    const { score } = scoreMeta(
      makeMeta({ openGraph: { ...makeMeta().openGraph, "og:image": null } })
    );
    expect(score).toBe(90);
  });

  it("deducts for missing twitter:card (error -8)", () => {
    const { score } = scoreMeta(
      makeMeta({ twitter: { ...makeMeta().twitter, "twitter:card": null } })
    );
    expect(score).toBe(92);
  });

  it("deducts for missing twitter:image when no og:image fallback (warning -5)", () => {
    const { score } = scoreMeta(
      makeMeta({
        twitter: { ...makeMeta().twitter, "twitter:image": null },
        openGraph: { ...makeMeta().openGraph, "og:image": null },
      })
    );
    expect(score).toBe(85);
  });

  it("deducts for missing canonical (warning -5)", () => {
    const { score } = scoreMeta(makeMeta({ canonical: null }));
    expect(score).toBe(95);
  });

  it("deducts for missing viewport (warning -5)", () => {
    const { score } = scoreMeta(makeMeta({ viewport: null }));
    expect(score).toBe(95);
  });

  it("deducts for missing lang (warning -3)", () => {
    const { score } = scoreMeta(makeMeta({ lang: null }));
    expect(score).toBe(97);
  });

  it("deducts for missing charset (warning -3)", () => {
    const { score } = scoreMeta(makeMeta({ charset: null }));
    expect(score).toBe(97);
  });

  it("deducts for missing favicon (warning -2)", () => {
    const { score } = scoreMeta(makeMeta({ favicon: null }));
    expect(score).toBe(98);
  });

  it("clamps score to 0 minimum", () => {
    const { score } = scoreMeta(
      makeMeta({
        title: null,
        description: null,
        canonical: null,
        viewport: null,
        charset: null,
        lang: null,
        favicon: null,
        jsonLd: [],
        openGraph: {
          "og:title": null,
          "og:description": null,
          "og:image": null,
          "og:url": null,
          "og:type": null,
          "og:site_name": null,
        },
        twitter: {
          "twitter:card": null,
          "twitter:title": null,
          "twitter:description": null,
          "twitter:image": null,
        },
      })
    );
    expect(score).toBe(5);
  });

  it("produces findings with fix suggestions", () => {
    const { findings } = scoreMeta(makeMeta({ title: null }));
    const titleFinding = findings.find((f) => f.id === "missing-title");
    expect(titleFinding).toBeDefined();
    expect(titleFinding!.fix).toBeTruthy();
    expect(titleFinding!.fix).toContain("<title>");
  });

  it("handles fixture scenario: minimal page (score should be low)", () => {
    const { score, findings } = scoreMeta(
      makeMeta({
        title: { value: "Hi", length: 2 },
        description: null,
        canonical: null,
        viewport: null,
        charset: null,
        lang: null,
        favicon: null,
        jsonLd: [],
        openGraph: {
          "og:title": null,
          "og:description": null,
          "og:image": null,
          "og:url": null,
          "og:type": null,
          "og:site_name": null,
        },
        twitter: {
          "twitter:card": null,
          "twitter:title": null,
          "twitter:description": null,
          "twitter:image": null,
        },
      })
    );
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThan(30);
    expect(findings.length).toBeGreaterThan(10);
  });

  it("deducts for missing JSON-LD (warning -8)", () => {
    const { score, findings } = scoreMeta(makeMeta({ jsonLd: [] }));
    expect(score).toBe(92);
    expect(findings).toContainEqual(expect.objectContaining({ id: "missing-jsonld" }));
  });

  it("does not deduct for valid JSON-LD", () => {
    const { score, findings } = scoreMeta(makeMeta({
      jsonLd: [{ raw: '{"@context":"https://schema.org","@type":"WebPage"}', parsed: { "@context": "https://schema.org", "@type": "WebPage" }, hasContext: true, hasType: true, typeName: "WebPage" }],
    }));
    expect(findings.find((f) => f.id === "missing-jsonld")).toBeUndefined();
    expect(score).toBe(100);
  });

  it("deducts for invalid JSON-LD (warning -4)", () => {
    const { score, findings } = scoreMeta(makeMeta({
      jsonLd: [
        { raw: "invalid json", parsed: null, hasContext: false, hasType: false, typeName: null },
        { raw: '{"@context":"https://schema.org","@type":"WebPage"}', parsed: { "@context": "https://schema.org", "@type": "WebPage" }, hasContext: true, hasType: true, typeName: "WebPage" },
      ],
    }));
    expect(findings).toContainEqual(expect.objectContaining({ id: "invalid-jsonld" }));
    expect(score).toBe(96);
  });

  it("deducts for JSON-LD missing @context (warning -3)", () => {
    const { score, findings } = scoreMeta(makeMeta({
      jsonLd: [{ raw: '{"@type":"WebPage"}', parsed: { "@type": "WebPage" }, hasContext: false, hasType: true, typeName: "WebPage" }],
    }));
    expect(findings).toContainEqual(expect.objectContaining({ id: "missing-jsonld-context" }));
    expect(score).toBe(97);
  });

  it("deducts for JSON-LD missing @type (warning -3)", () => {
    const { score, findings } = scoreMeta(makeMeta({
      jsonLd: [{ raw: '{"@context":"https://schema.org"}', parsed: { "@context": "https://schema.org" }, hasContext: true, hasType: false, typeName: null }],
    }));
    expect(findings).toContainEqual(expect.objectContaining({ id: "missing-jsonld-type" }));
    expect(score).toBe(97);
  });

  it("does not deduct twitter:image when og:image exists as fallback", () => {
    const { score, findings } = scoreMeta(
      makeMeta({
        twitter: { ...makeMeta().twitter, "twitter:image": null },
        openGraph: { ...makeMeta().openGraph, "og:image": "https://example.com/og.png" },
      })
    );
    expect(findings.find((f) => f.id === "missing-twitter-image")).toBeUndefined();
    expect(score).toBe(100);
  });
});
