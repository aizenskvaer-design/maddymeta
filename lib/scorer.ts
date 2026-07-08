import type { MetaResult, Finding } from "./types";

interface Rule {
  id: string;
  severity: "error" | "warning";
  deduction: number;
  test: (meta: MetaResult) => boolean;
  message: (meta: MetaResult) => string;
  fix: (meta: MetaResult) => string | null;
}

const rules: Rule[] = [
  {
    id: "missing-title",
    severity: "error",
    deduction: 15,
    test: (m) => !m.title,
    message: () => "Missing <title> tag",
    fix: () => '<title>Your Page Title - Brand</title>',
  },
  {
    id: "title-length",
    severity: "warning",
    deduction: 5,
    test: (m) => {
      if (!m.title) return false;
      return m.title.length < 30 || m.title.length > 60;
    },
    message: (m) =>
      `Title is ${m.title!.length} chars (recommended 50-60)`,
    fix: (m) => {
      if (!m.title) return null;
      let fixed = m.title.value;
      if (fixed.length < 30) fixed = fixed + " - Brand Name";
      if (fixed.length > 60) fixed = fixed.slice(0, 57) + "...";
      return `<title>${fixed}</title>`;
    },
  },
  {
    id: "missing-description",
    severity: "error",
    deduction: 15,
    test: (m) => !m.description,
    message: () => "Missing meta description",
    fix: () =>
      '<meta name="description" content="A brief description of the page content within 150-160 characters." />',
  },
  {
    id: "description-length",
    severity: "warning",
    deduction: 5,
    test: (m) => {
      if (!m.description) return false;
      return m.description.length < 70 || m.description.length > 160;
    },
    message: (m) =>
      `Description is ${m.description!.length} chars (recommended 70-160)`,
    fix: (m) => {
      if (!m.description) return null;
      let fixed = m.description.value;
      if (fixed.length > 160) fixed = fixed.slice(0, 157) + "...";
      if (fixed.length < 70) fixed = fixed + " Learn more about our offerings and get started today.";
      return `<meta name="description" content="${fixed}" />`;
    },
  },
  {
    id: "missing-og-title",
    severity: "error",
    deduction: 8,
    test: (m) => !m.openGraph["og:title"],
    message: () => "Missing og:title",
    fix: (m) => {
      const t = m.title?.value || "Page Title";
      return `<meta property="og:title" content="${t}" />`;
    },
  },
  {
    id: "missing-og-description",
    severity: "warning",
    deduction: 5,
    test: (m) => !m.openGraph["og:description"],
    message: () => "Missing og:description",
    fix: (m) => {
      const d = m.description?.value || "Description of the page";
      return `<meta property="og:description" content="${d}" />`;
    },
  },
  {
    id: "missing-og-image",
    severity: "error",
    deduction: 10,
    test: (m) => !m.openGraph["og:image"],
    message: () => "Missing og:image",
    fix: (m) => {
      const base = m.favicon ? m.favicon.replace(/\/[^/]+$/, "") : "https://example.com";
      return `<meta property="og:image" content="${base}/og-image.png" />`;
    },
  },
  {
    id: "missing-og-url",
    severity: "warning",
    deduction: 3,
    test: (m) => !m.openGraph["og:url"],
    message: () => "Missing og:url",
    fix: (m) => `<meta property="og:url" content="${m.canonical || "https://example.com"}" />`,
  },
  {
    id: "missing-twitter-card",
    severity: "error",
    deduction: 8,
    test: (m) => !m.twitter["twitter:card"],
    message: () => "Missing twitter:card",
    fix: () => '<meta name="twitter:card" content="summary_large_image" />',
  },
  {
    id: "missing-twitter-image",
    severity: "warning",
    deduction: 5,
    test: (m) => !m.twitter["twitter:image"] && !m.openGraph["og:image"],
    message: () => "Missing twitter:image (and no og:image fallback)",
    fix: (m) => {
      const img = m.openGraph["og:image"] || "https://example.com/image.png";
      return `<meta name="twitter:image" content="${img}" />`;
    },
  },
  {
    id: "missing-canonical",
    severity: "warning",
    deduction: 5,
    test: (m) => !m.canonical,
    message: () => "Missing canonical URL",
    fix: () => `<link rel="canonical" href="https://example.com/page" />`,
  },
  {
    id: "missing-viewport",
    severity: "warning",
    deduction: 5,
    test: (m) => !m.viewport,
    message: () => "Missing viewport meta tag",
    fix: () => '<meta name="viewport" content="width=device-width, initial-scale=1" />',
  },
  {
    id: "missing-lang",
    severity: "warning",
    deduction: 3,
    test: (m) => !m.lang,
    message: () => "Missing lang attribute on <html>",
    fix: () => '<html lang="en">',
  },
  {
    id: "missing-charset",
    severity: "warning",
    deduction: 3,
    test: (m) => !m.charset,
    message: () => "Missing charset declaration",
    fix: () => '<meta charset="UTF-8" />',
  },
  {
    id: "missing-jsonld",
    severity: "warning",
    deduction: 8,
    test: (m) => !m.jsonLd || m.jsonLd.length === 0,
    message: () => "No JSON-LD structured data found",
    fix: () =>
      '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Page Title",\n  "description": "Page description"\n}\n</script>',
  },
  {
    id: "invalid-jsonld",
    severity: "warning",
    deduction: 4,
    test: (m) => {
      if (!m.jsonLd || m.jsonLd.length === 0) return false;
      return m.jsonLd.some((e) => e.parsed === null);
    },
    message: (m) => {
      const count = m.jsonLd.filter((e) => e.parsed === null).length;
      return `${count} JSON-LD block(s) contain invalid JSON`;
    },
    fix: () => "Fix the JSON syntax in your <script type=\"application/ld+json\"> blocks",
  },
  {
    id: "missing-jsonld-context",
    severity: "warning",
    deduction: 3,
    test: (m) => {
      if (!m.jsonLd || m.jsonLd.length === 0) return false;
      return m.jsonLd.some((e) => e.parsed !== null && !e.hasContext);
    },
    message: () => "JSON-LD block missing @context",
    fix: () => 'Add "@context": "https://schema.org" to your JSON-LD',
  },
  {
    id: "missing-jsonld-type",
    severity: "warning",
    deduction: 3,
    test: (m) => {
      if (!m.jsonLd || m.jsonLd.length === 0) return false;
      return m.jsonLd.some((e) => e.parsed !== null && !e.hasType);
    },
    message: () => "JSON-LD block missing @type",
    fix: () => 'Add "@type": "WebPage" (or appropriate schema type) to your JSON-LD',
  },
  {
    id: "missing-favicon",
    severity: "warning",
    deduction: 2,
    test: (m) => !m.favicon,
    message: () => "Missing favicon",
    fix: () => '<link rel="icon" href="/favicon.ico" type="image/x-icon" />',
  },
];

export function scoreMeta(meta: MetaResult): { score: number; findings: Finding[] } {
  let score = 100;
  const findings: Finding[] = [];

  for (const rule of rules) {
    if (rule.test(meta)) {
      score -= rule.deduction;
      findings.push({
        id: rule.id,
        severity: rule.severity,
        message: rule.message(meta),
        fix: rule.fix(meta),
      });
    }
  }

  score = Math.max(0, Math.min(100, score));

  return { score, findings };
}
