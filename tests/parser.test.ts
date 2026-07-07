import { describe, it, expect } from "vitest";
import { parseMetaTags } from "../lib/parser";

const BASE_URL = "https://example.com";

const COMPLETE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test Page Title</title>
  <meta name="description" content="This is a test description for the page that should be long enough to pass.">
  <link rel="canonical" href="https://example.com/page">
  <meta name="robots" content="index, follow">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="/favicon.ico">
  <meta property="og:title" content="OG Test Title">
  <meta property="og:description" content="OG test description">
  <meta property="og:image" content="https://example.com/og.png">
  <meta property="og:url" content="https://example.com">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="TestSite">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Twitter Title">
  <meta name="twitter:description" content="Twitter description">
  <meta name="twitter:image" content="https://example.com/twitter.png">
</head>
<body></body>
</html>`;

const MISSING_TAGS_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Short</title>
</head>
<body></body>
</html>`;

const MALFORMED_HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Malformed Page</title>
  <meta name="viewport" content="width=device-width">
  <meta property="og:image" content="https://example.com/img.png">
</head>
<body></body>
</html>`;

describe("parseMetaTags", () => {
  describe("complete HTML", () => {
    const result = parseMetaTags(COMPLETE_HTML, BASE_URL);

    it("extracts title", () => {
      expect(result.title).toEqual({ value: "Test Page Title", length: 15 });
    });

    it("extracts description", () => {
      expect(result.description?.value).toBe(
        "This is a test description for the page that should be long enough to pass."
      );
    });

    it("extracts canonical", () => {
      expect(result.canonical).toBe("https://example.com/page");
    });

    it("extracts robots", () => {
      expect(result.robots).toBe("index, follow");
    });

    it("extracts viewport", () => {
      expect(result.viewport).toBe("width=device-width, initial-scale=1");
    });

    it("extracts charset", () => {
      expect(result.charset).toBe("UTF-8");
    });

    it("extracts lang", () => {
      expect(result.lang).toBe("en");
    });

    it("extracts favicon with absolute URL", () => {
      expect(result.favicon).toBe("https://example.com/favicon.ico");
    });

    it("extracts all Open Graph tags", () => {
      expect(result.openGraph["og:title"]).toBe("OG Test Title");
      expect(result.openGraph["og:description"]).toBe("OG test description");
      expect(result.openGraph["og:image"]).toBe("https://example.com/og.png");
      expect(result.openGraph["og:url"]).toBe("https://example.com");
      expect(result.openGraph["og:type"]).toBe("website");
      expect(result.openGraph["og:site_name"]).toBe("TestSite");
    });

    it("extracts all Twitter Card tags", () => {
      expect(result.twitter["twitter:card"]).toBe("summary_large_image");
      expect(result.twitter["twitter:title"]).toBe("Twitter Title");
      expect(result.twitter["twitter:description"]).toBe("Twitter description");
      expect(result.twitter["twitter:image"]).toBe("https://example.com/twitter.png");
    });
  });

  describe("missing tags HTML", () => {
    const result = parseMetaTags(MISSING_TAGS_HTML, BASE_URL);

    it("extracts title even when short", () => {
      expect(result.title).toEqual({ value: "Short", length: 5 });
    });

    it("returns null for missing description", () => {
      expect(result.description).toBeNull();
    });

    it("returns null for missing canonical", () => {
      expect(result.canonical).toBeNull();
    });

    it("returns null for missing viewport", () => {
      expect(result.viewport).toBeNull();
    });

    it("returns null for missing charset", () => {
      expect(result.charset).toBeNull();
    });

    it("returns null for missing lang", () => {
      expect(result.lang).toBeNull();
    });

    it("returns null for missing favicon", () => {
      expect(result.favicon).toBeNull();
    });

    it("returns null for missing OG tags", () => {
      expect(result.openGraph["og:title"]).toBeNull();
      expect(result.openGraph["og:description"]).toBeNull();
      expect(result.openGraph["og:image"]).toBeNull();
    });

    it("returns null for missing Twitter tags", () => {
      expect(result.twitter["twitter:card"]).toBeNull();
    });
  });

  describe("malformed HTML", () => {
    const result = parseMetaTags(MALFORMED_HTML, BASE_URL);

    it("extracts available tags from partial HTML", () => {
      expect(result.title).toEqual({ value: "Malformed Page", length: 14 });
      expect(result.charset).toBe("utf-8");
      expect(result.lang).toBe("fr");
    });

    it("extracts og:image with absolute URL", () => {
      expect(result.openGraph["og:image"]).toBe("https://example.com/img.png");
    });

    it("returns null for missing tags", () => {
      expect(result.description).toBeNull();
      expect(result.canonical).toBeNull();
      expect(result.twitter["twitter:card"]).toBeNull();
    });

    it("returns null for favicon since none exists", () => {
      expect(result.favicon).toBeNull();
    });
  });
});
