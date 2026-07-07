# MaddyMeta

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**Analyze, preview & fix your meta tags.** MaddyMeta is a free, open-source web tool that fetches any public URL, extracts all meta tags, scores them for SEO, shows live social previews, and generates copyable fix snippets.

![MaddyMeta Screenshot](https://via.placeholder.com/800x450/1a1a2e/6c63ff?text=MaddyMeta+Preview)

## Features

- **Meta Tag Extraction** — Title, description, canonical, robots, viewport, charset, lang, favicon, Open Graph, and Twitter Card tags
- **SEO Scoring Engine** — 0–100 score with categorized findings (pass / warning / error) based on 15 rules
- **Live Social Previews** — See how your page looks on Google Search, Facebook/LinkedIn, X (Twitter), and Telegram/WhatsApp
- **Fix Suggestions** — Auto-generated corrected `<meta>` snippets with one-click copy
- **Rate Limiting** — 10 requests/minute per IP to prevent abuse
- **SSRF Protection** — Blocks private IPs, localhost, and internal networks
- **Dark Theme** — Modern, developer-friendly UI with dark mode by default

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14 (App Router)** | React framework with server components |
| **TypeScript** (strict mode) | Type safety |
| **Tailwind CSS** | Styling (dark theme) |
| **cheerio** | HTML parsing (server-side) |
| **zod** | Input validation |
| **Vitest** | Unit testing |

- No database. No authentication. Fully stateless.
- Deployable to Vercel with zero configuration.

## Local Setup

```bash
# Clone the repository
git clone https://github.com/Maddyrampant/maddymeta.git
cd maddymeta

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

### POST /api/analyze

Analyze a URL's meta tags.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response (200):**
```json
{
  "url": "https://example.com",
  "fetchedAt": "2026-07-07T00:00:00.000Z",
  "meta": {
    "title": { "value": "Example Domain", "length": 14 },
    "description": null,
    "canonical": null,
    "robots": null,
    "viewport": null,
    "charset": "utf-8",
    "lang": "en",
    "favicon": null,
    "openGraph": { ... },
    "twitter": { ... }
  },
  "score": 67,
  "findings": [ ... ]
}
```

**Error Responses:**
| Status | Meaning |
|---|---|
| `400` | Invalid URL or JSON |
| `403` | Blocked URL (SSRF protection) |
| `408` | Request timeout (8s limit) |
| `422` | Non-HTML content or too large (>2MB) |
| `429` | Rate limit exceeded |
| `502` | Target unreachable |

**curl example:**
```bash
curl -X POST https://maddymeta.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com"}'
```

## Scoring Rules

| Rule | Deduction | Severity |
|---|---|---|
| Missing `<title>` | -15 | error |
| Title < 30 or > 60 chars | -5 | warning |
| Missing meta description | -15 | error |
| Description < 70 or > 160 chars | -5 | warning |
| Missing og:title | -8 | error |
| Missing og:description | -5 | warning |
| Missing og:image | -10 | error |
| Missing og:url | -3 | warning |
| Missing twitter:card | -8 | error |
| Missing twitter:image (no og:image fallback) | -5 | warning |
| Missing canonical URL | -5 | warning |
| Missing viewport tag | -5 | warning |
| Missing lang attribute | -3 | warning |
| Missing charset | -3 | warning |
| Missing favicon | -2 | warning |

Score is clamped to 0–100. Every deduction produces a finding with a fix suggestion.

## Security

- **SSRF Protection:** Resolves hostnames via DNS before fetching. Blocks localhost, `*.local`, `*.internal`, all private/reserved IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16, 0.0.0.0, and IPv6 equivalents).
- **Redirect Safety:** Follows max 3 redirects, re-validating each target.
- **Timeout:** 8-second fetch timeout via AbortController.
- **Size Limit:** Max 2 MB response body.
- **Content-Type Check:** Only parses `text/html` responses.
- **Rate Limiting:** 10 requests/minute/IP in-memory sliding window.

## Deployment

### Vercel (one-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMaddyrampant%2Fmaddymeta)

Zero configuration required. The project includes a `vercel.json` that works out of the box.

## Roadmap

- [ ] og:image dimension check
- [ ] JSON-LD structured data analysis
- [ ] URL comparison tool (compare two pages)
- [ ] Public REST API with API keys
- [ ] Batch analysis
- [ ] Lighthouse integration

## Contributing

PRs are welcome! Please follow the existing code style and add tests for any new features.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE) © 2026 Maddyrampant
