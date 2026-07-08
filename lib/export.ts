import type { AnalyzeResponse } from "./types";

export function downloadJson(result: AnalyzeResponse): void {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `maddymeta-${result.url.replace(/[^a-z0-9]/gi, "-")}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function printResult(result: AnalyzeResponse): void {
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>MaddyMeta Report - ${result.url}</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #222; }
  h1 { font-size: 24px; border-bottom: 2px solid #6c63ff; padding-bottom: 8px; }
  .score { font-size: 36px; font-weight: bold; color: #6c63ff; }
  .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
  h2 { font-size: 18px; margin-top: 24px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; font-size: 13px; }
  th { background: #f5f5f5; font-weight: 600; }
  .present { color: #16a34a; font-weight: 600; }
  .missing { color: #dc2626; font-weight: 600; }
  .finding { padding: 8px 0; border-bottom: 1px solid #eee; }
  .finding-error { border-left: 3px solid #dc2626; padding-left: 12px; }
  .finding-warning { border-left: 3px solid #eab308; padding-left: 12px; }
  pre { background: #f5f5f5; padding: 8px; border-radius: 4px; font-size: 12px; overflow-x: auto; }
  .jsonld { background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 12px; margin-top: 8px; }
  .jsonld h3 { margin: 0 0 4px 0; font-size: 14px; color: #166534; }
  .jsonld p { margin: 2px 0; font-size: 13px; color: #333; }
  @media print { body { margin: 0; padding: 15px; } }
</style></head><body>
<h1>MaddyMeta SEO Report</h1>
<div class="meta">URL: ${result.url}<br>Analyzed: ${new Date(result.fetchedAt).toLocaleString()}</div>
<div class="score">${result.score}/100</div>
<h2>Meta Tags</h2>
<table>
<thead><tr><th>Tag</th><th>Value</th><th>Status</th></tr></thead>
<tbody>
${(() => {
  const m = result.meta;
  const rows: { name: string; value: string; status: string }[] = [
    { name: "Title", value: m.title?.value || "-", status: m.title ? "present" : "missing" },
    { name: "Description", value: m.description?.value || "-", status: m.description ? "present" : "missing" },
    { name: "Canonical", value: m.canonical || "-", status: m.canonical ? "present" : "missing" },
    { name: "Robots", value: m.robots || "-", status: m.robots ? "present" : "missing" },
    { name: "Viewport", value: m.viewport || "-", status: m.viewport ? "present" : "missing" },
    { name: "Charset", value: m.charset || "-", status: m.charset ? "present" : "missing" },
    { name: "Lang", value: m.lang || "-", status: m.lang ? "present" : "missing" },
    { name: "Favicon", value: m.favicon || "-", status: m.favicon ? "present" : "missing" },
    { name: "JSON-LD", value: m.jsonLd ? m.jsonLd.length + " block(s)" : "-", status: m.jsonLd?.length ? "present" : "missing" },
    { name: "og:title", value: m.openGraph["og:title"] || "-", status: m.openGraph["og:title"] ? "present" : "missing" },
    { name: "og:description", value: m.openGraph["og:description"] || "-", status: m.openGraph["og:description"] ? "present" : "missing" },
    { name: "og:image", value: m.openGraph["og:image"] || "-", status: m.openGraph["og:image"] ? "present" : "missing" },
    { name: "og:url", value: m.openGraph["og:url"] || "-", status: m.openGraph["og:url"] ? "present" : "missing" },
    { name: "og:type", value: m.openGraph["og:type"] || "-", status: m.openGraph["og:type"] ? "present" : "missing" },
    { name: "og:site_name", value: m.openGraph["og:site_name"] || "-", status: m.openGraph["og:site_name"] ? "present" : "missing" },
    { name: "twitter:card", value: m.twitter["twitter:card"] || "-", status: m.twitter["twitter:card"] ? "present" : "missing" },
    { name: "twitter:title", value: m.twitter["twitter:title"] || "-", status: m.twitter["twitter:title"] ? "present" : "missing" },
    { name: "twitter:description", value: m.twitter["twitter:description"] || "-", status: m.twitter["twitter:description"] ? "present" : "missing" },
    { name: "twitter:image", value: m.twitter["twitter:image"] || "-", status: m.twitter["twitter:image"] ? "present" : "missing" },
  ];
  return rows.map(r => '<tr><td>' + r.name + '</td><td>' + r.value + '</td><td class="' + r.status + '">' + r.status + '</td></tr>').join("");
})()}
</tbody>
</table>
<h2>JSON-LD / Structured Data</h2>
${(() => { const jm = result.meta; return jm.jsonLd && jm.jsonLd.length > 0
  ? jm.jsonLd.map((e, i) => '<div class="jsonld"><h3>Block ' + (i + 1) + '</h3><p>Type: <strong>' + (e.typeName || "N/A") + '</strong></p><p>@context: ' + (e.hasContext ? '✅' : '❌') + ' | @type: ' + (e.hasType ? '✅' : '❌') + '</p><pre>' + (e.raw.length > 500 ? e.raw.slice(0, 500) + "..." : e.raw) + '</pre></div>').join("")
  : '<p>No JSON-LD structured data found</p>'; })()}
<h2>Findings & Fix Suggestions</h2>
${result.findings.length > 0
  ? result.findings.map(f => '<div class="finding finding-' + f.severity + '"><strong>' + f.id + '</strong> (' + f.severity + ')<br>' + f.message + (f.fix ? '<pre>' + f.fix + '</pre>' : '') + '</div>').join("")
  : '<p>No issues found</p>'}
</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}
