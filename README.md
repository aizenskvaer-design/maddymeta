<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://via.placeholder.com/120x120/6c63ff/ffffff?text=M">
    <img alt="MaddyMeta" src="https://via.placeholder.com/120x120/6c63ff/ffffff?text=M" width="120" height="120" style="border-radius: 20px;">
  </picture>
</p>

<h1 align="center">MaddyMeta</h1>

<p align="center">
  <strong>Analyze, preview &amp; fix your meta tags.</strong><br>
  <em>SEO scoring engine with live social previews for Google, Facebook, Twitter/X, and Telegram.</em>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square"></a>
  <a href="https://github.com/Maddyrampant/maddymeta/actions"><img alt="Build Status" src="https://img.shields.io/github/actions/workflow/status/Maddyrampant/maddymeta/ci.yml?style=flat-square&label=build"></a>
  <a href="https://github.com/Maddyrampant/maddymeta"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/Maddyrampant/maddymeta?style=flat-square&label=stars&color=brightgreen"></a>
  <a href="https://github.com/Maddyrampant/maddymeta/issues"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square"></a>
  <a href="https://nextjs.org"><img alt="Next.js 14" src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js"></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript"></a>
</p>

<br>

<p align="center">
  <img src="https://via.placeholder.com/900x500/1a1a2e/6c63ff?text=MaddyMeta+Dashboard+Preview" alt="MaddyMeta Screenshot" width="90%" style="border-radius: 12px; border: 1px solid #333;">
</p>

<br>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Scoring Rules](#scoring-rules)
- [Security](#security)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**MaddyMeta** is a production-grade, open-source web application that analyzes any public URL's meta tags and provides:

- **Full meta tag extraction** &mdash; title, description, Open Graph, Twitter Cards, JSON-LD, canonical, robots, viewport, charset, lang, favicon
- **SEO scoring** &mdash; 0–100 score with 19 rules, categorized findings (pass / warning / error) and actionable fix snippets
- **7 live social previews** &mdash; Google Search, Facebook/LinkedIn, X/Twitter, Telegram/WhatsApp, WhatsApp, Slack, and Discord
- **URL comparison** &mdash; Side-by-side score, preview, and meta tag comparison across two URLs
- **History & export** &mdash; Local analysis history, JSON download, and print/PDF reports
- **Copyable fix snippets** &mdash; One-click copy for corrected `<meta>` code

Built for developers, SEO specialists, and content creators who need instant, accurate meta tag analysis without signing up or paying.

---

## Features

### Meta Tag Extraction
| Category | Tags Extracted |
|---|---|---|
| **Core** | `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta name="robots">` |
| **Technical** | `<meta name="viewport">`, `<meta charset>`, `<html lang>`, `<link rel="icon">` |
| **Open Graph** | `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name` |
| **Twitter Cards** | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` |
| **Structured Data** | JSON-LD blocks (`@context`, `@type` validation, syntax checking) |

### SEO Scoring Engine
- 19 rules covering every essential meta tag (including JSON-LD validation)
- Weighted deductions from -2 to -15 based on SEO impact
- Smart fallback detection (e.g., `twitter:image` uses `og:image` when missing)
- Human-readable findings with severity badges and copyable fix snippets

### Live Social Previews
- **Google Search** &mdash; Blue title link with green URL and description snippet
- **Facebook / LinkedIn** &mdash; Large OG card with image, title, description, and domain
- **X (Twitter)** &mdash; Summary card with large image, title, and description
- **Telegram / WhatsApp** &mdash; Compact inline preview with thumbnail
- **WhatsApp** &mdash; Inline preview with left thumbnail
- **Slack** &mdash; Large card with branded left border accent
- **Discord** &mdash; Compact embed with left thumbnail and URL

### Analysis History & Export
- **Local history** &mdash; Last 20 analyses saved in browser localStorage
- **JSON export** &mdash; Download full analysis report as JSON
- **Print / PDF** &mdash; Print-friendly report with all meta tags, JSON-LD, and findings

### URL Comparison
- **Side-by-side** &mdash; Compare scores, previews, meta tags, and fixes for two URLs
- **Score difference** &mdash; Color-coded score indicator showing which URL performs better

### Security & Reliability
- SSRF protection against internal network targeting
- Rate limiting (10 requests/minute/IP)
- 8-second timeout, 2 MB response limit
- Content-type validation (HTML only)

---

## Tech Stack

| Layer | Technology | Purpose |
|:---|---:|---:|
| **Framework** | [Next.js 14](https://nextjs.org) (App Router) | React framework with server components & API routes |
| **Language** | [TypeScript](https://www.typescriptlang.org) (strict mode) | Full type safety across the entire codebase |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) (dark theme) | Utility-first responsive design |
| **Parsing** | [cheerio](https://cheerio.js.org) | Server-side HTML parsing & meta tag extraction |
| **Validation** | [zod](https://zod.dev) | Runtime input validation with type inference |
| **Testing** | [Vitest](https://vitest.dev) | Unit tests for parser, scorer, and SSRF guard |
| **Deployment** | [Vercel](https://vercel.com) | Zero-configuration serverless deployment |

> **Zero external state.** No database, no authentication, no background jobs. Fully stateless and cache-friendly.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  UrlForm ──▶ ScoreCard ──▶ Previews ──▶ MetaTags    │   │
│  │                           ──▶ FixSuggestions         │   │
│  └──────────────────┬───────────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────────┘
                      │ POST /api/analyze { url }
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Route                         │
│                                                              │
│  1. Zod Validation ──▶ 2. Rate Limit Check ──▶ 3. SSRF     │
│                                                              │
│  4. Fetch URL (8s timeout, 2MB limit, 3 redirects)          │
│                                                              │
│  5. Parse HTML (cheerio) ──▶ 6. Score Meta (15 rules)       │
│                                                              │
│  7. Return JSON { meta, score, findings }                    │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Client** sends URL via `fetch()` to `POST /api/analyze`
2. **Zod** validates the URL (must be absolute `http://` or `https://`)
3. **Rate limiter** checks the in-memory sliding window (10 req/min/IP)
4. **SSRF guard** resolves hostname via DNS, blocks private/reserved IPs
5. **Fetcher** streams the response with safety limits (8s timeout, 2 MB cap)
6. **Parser** loads the HTML with cheerio and extracts all meta tags
7. **Scorer** evaluates 15 rules, calculates 0–100 score, generates fix snippets
8. **Response** is returned as JSON and rendered by React components

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Maddyrampant/maddymeta.git
cd maddymeta

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Enter any public URL to see its meta tag analysis.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run Vitest unit tests |
| `npm run lint` | Run ESLint |

---

## API Reference

### POST /api/analyze

Analyzes a URL's meta tags and returns a complete SEO report.

#### Request Body

```json
{
  "url": "https://example.com"
}
```

| Field | Type | Constraints |
|:---|---:|---:|
| `url` | `string` | Must be a valid absolute URL with `http://` or `https://` protocol |

#### Successful Response (200)

```json
{
  "url": "https://example.com",
  "fetchedAt": "2026-07-07T12:00:00.000Z",
  "meta": {
    "title": {
      "value": "Example Domain",
      "length": 14
    },
    "description": {
      "value": "This domain is for use in illustrative examples...",
      "length": 152
    },
    "canonical": "https://example.com",
    "robots": "index, follow",
    "viewport": "width=device-width, initial-scale=1",
    "charset": "utf-8",
    "lang": "en",
    "favicon": "https://example.com/favicon.ico",
    "jsonLd": [
      {
        "raw": "{\"@context\":\"https://schema.org\",\"@type\":\"WebPage\"}",
        "parsed": { "@context": "https://schema.org", "@type": "WebPage" },
        "hasContext": true,
        "hasType": true,
        "typeName": "WebPage"
      }
    ],
    "openGraph": {
      "og:title": "Example Domain",
      "og:description": null,
      "og:image": null,
      "og:url": null,
      "og:type": null,
      "og:site_name": null
    },
    "twitter": {
      "twitter:card": null,
      "twitter:title": null,
      "twitter:description": null,
      "twitter:image": null
    }
  },
  "score": 67,
  "findings": [
    {
      "id": "missing-og-image",
      "severity": "error",
      "message": "Missing og:image",
      "fix": "<meta property=\"og:image\" content=\"https://example.com/og-image.png\" />"
    },
    {
      "id": "missing-twitter-card",
      "severity": "error",
      "message": "Missing twitter:card",
      "fix": "<meta name=\"twitter:card\" content=\"summary_large_image\" />"
    }
  ]
}
```

#### Error Responses

| Status | Code | Meaning |
|:---:|---|---|
| `400` | `INVALID_INPUT` | Invalid URL format or JSON body |
| `403` | `SSRF_BLOCKED` | Blocked URL targeting internal/private networks |
| `408` | `TIMEOUT` | Request exceeded 8-second timeout |
| `422` | `UNSUPPORTED_CONTENT` | Non-HTML response or body exceeds 2 MB limit |
| `429` | `RATE_LIMITED` | Rate limit exceeded (10 requests/minute/IP) |
| `502` | `UPSTREAM_ERROR` | Target server unreachable or returned an error |

All error responses follow this format:

```json
{
  "error": "Human-readable error message"
}
```

#### Example Usage

```bash
curl -X POST https://maddymeta.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com"}' | jq '.score'
```

---

## Scoring Rules

| # | Rule | Deduction | Severity | Triggers When |
|:---:|---|:---:|:---:|---|
| 1 | Missing `<title>` | -15 | error | No `<title>` element found |
| 2 | Title length out of range | -5 | warning | `< 30` or `> 60` characters |
| 3 | Missing meta description | -15 | error | No `meta[name="description"]` found |
| 4 | Description length out of range | -5 | warning | `< 70` or `> 160` characters |
| 5 | Missing `og:title` | -8 | error | No Open Graph title property |
| 6 | Missing `og:description` | -5 | warning | No Open Graph description property |
| 7 | Missing `og:image` | -10 | error | No Open Graph image property |
| 8 | Missing `og:url` | -3 | warning | No Open Graph URL property |
| 9 | Missing `twitter:card` | -8 | error | No Twitter Card type meta tag |
| 10 | Missing `twitter:image` (no fallback) | -5 | warning | No Twitter image and no `og:image` fallback |
| 11 | Missing canonical URL | -5 | warning | No `link[rel="canonical"]` found |
| 12 | Missing viewport | -5 | warning | No viewport meta tag |
| 13 | Missing `lang` attribute | -3 | warning | No `lang` or `xml:lang` on `<html>` |
| 14 | Missing charset | -3 | warning | No charset meta tag |
| 15 | Missing favicon | -2 | warning | No favicon link found |
| 16 | Missing JSON-LD | -8 | warning | No JSON-LD structured data found |
| 17 | Invalid JSON-LD syntax | -4 | warning | JSON-LD block contains unparseable JSON |
| 18 | JSON-LD missing `@context` | -3 | warning | JSON-LD valid but no `@context` field |
| 19 | JSON-LD missing `@type` | -3 | warning | JSON-LD valid but no `@type` field |

**Score formula:** `MAX(0, MIN(100, 100 - SUM(deductions)))`

Every deduction produces a finding with a severity badge (error/warning) and a copyable fix snippet that uses actual values from the analyzed page.

---

## Security

MaddyMeta was designed with security as a first-class concern. Every request is sandboxed at multiple levels:

### SSRF Protection (`lib/ssrf-guard.ts`)

- **DNS pre-resolution**: Hostname is resolved before any fetch attempt
- **IPv4 blocks**: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`, `0.0.0.0`
- **IPv6 blocks**: `::1` (loopback), `fc00::/7` (unique local), `fe80::/10` (link-local)
- **Hostname blocks**: `localhost`, `*.local`, `*.internal` (case-insensitive)
- **Protocol enforcement**: Only `http:` and `https:` allowed

### Fetch Safety (`lib/fetcher.ts`)

| Protection | Implementation |
|---|---|
| **Timeout** | `AbortController` with 8-second timeout |
| **Size limit** | Streaming body reader, aborts at 2 MB |
| **Redirects** | Manual redirect following, max 3 hops, re-validated each hop |
| **Content type** | Only `text/html` and `application/xhtml+xml` accepted |
| **User-Agent** | `MaddyMetaBot/1.0 (+https://github.com/Maddyrampant/maddymeta)` |

### Rate Limiting

- **Algorithm**: In-memory sliding window
- **Limit**: 10 requests per minute per IP
- **Response**: HTTP 429 with `Retry-After` header (seconds until reset)

---

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMaddyrampant%2Fmaddymeta)

Zero configuration required. The repository includes a `vercel.json` with optimal defaults:

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### Docker (Self-Hosted Server)

A production-ready `Dockerfile` and `docker-compose.yml` are included for containerized deployment on any server:

```bash
# Build and start with Docker Compose
docker compose up -d

# Or build manually
docker build -t maddymeta .
docker run -d -p 3000:3000 maddymeta
```

The image uses a multi-stage build (deps → builder → runner) running as a non-root `nextjs` user. It includes health checks and automatic restarts.

### PM2 (Node.js Process Manager)

For direct Node.js deployment with process management:

```bash
npm run build

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Or manually
PORT=3000 pm2 start node_modules/next/dist/bin/next --name maddymeta -- start

# Save PM2 process list
pm2 save
pm2 startup
```

The repository includes `ecosystem.config.js` with log rotation, memory limits, and production defaults.

### Nginx Reverse Proxy

Example Nginx configuration for a production server:

```nginx
server {
    listen 80;
    server_name maddymeta.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
```

### Manual Deployment

```bash
npm run build
npm start
```

The application runs on port 3000 by default. Set the `PORT` environment variable to change it.

---

## Roadmap

### Phase 2 (Coming Next)

- [x] **Image dimension validation** &mdash; Check that `og:image` meets minimum size requirements (1200×630)
- [x] **JSON-LD / Schema.org validation** &mdash; Parse structured data, validate `@context` and `@type`
- [x] **URL comparison** &mdash; Compare meta tags between two URLs side by side (`/compare`)
- [x] **Export reports** &mdash; Download analysis results as JSON or print as PDF
- [x] **Docker deployment** &mdash; Self-host with Docker, Docker Compose, or PM2

### Phase 3 (Future)

- [ ] **Public REST API** &mdash; Rate-limited API with API keys for integration into CI/CD pipelines
- [ ] **Batch analysis** &mdash; Upload a CSV of URLs for bulk meta tag auditing
- [ ] **Lighthouse integration** &mdash; Pull in Core Web Vitals alongside meta tag analysis

---

## Contributing

Contributions are welcome and appreciated! Whether it's bug fixes, new features, or documentation improvements, please feel free to open a PR.

### Development Workflow

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feat/your-feature-name`
3. **Make your changes** following the existing code style
4. **Add tests** for any new functionality
5. **Run the test suite**: `npm test` (ensure all tests pass)
6. **Build the project**: `npm run build` (ensure zero TypeScript errors)
7. **Commit** using conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`
8. **Push** to your fork and open a Pull Request

### Code Style

- TypeScript strict mode is enabled &mdash; no `any` types allowed
- Components use `"use client"` only when necessary (client-side interactivity)
- Server-only logic (fetching, parsing, scoring) stays in `lib/`
- CSS uses Tailwind utility classes &mdash; no custom CSS files

### Commit Convention

| Prefix | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Tooling, dependencies, configuration |
| `docs:` | Documentation changes |
| `test:` | Adding or updating tests |

---

## License

[MIT](LICENSE) &copy; 2026 [Maddyrampant](https://github.com/Maddyrampant)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so.

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Maddyrampant">Maddyrampant</a></sub>
  <br>
  <sub>Found a bug? <a href="https://github.com/Maddyrampant/maddymeta/issues">Open an issue</a></sub>
</p>
