export interface MetaResult {
  title: { value: string; length: number } | null;
  description: { value: string; length: number } | null;
  canonical: string | null;
  robots: string | null;
  viewport: string | null;
  charset: string | null;
  lang: string | null;
  favicon: string | null;
  openGraph: {
    "og:title": string | null;
    "og:description": string | null;
    "og:image": string | null;
    "og:url": string | null;
    "og:type": string | null;
    "og:site_name": string | null;
  };
  twitter: {
    "twitter:card": string | null;
    "twitter:title": string | null;
    "twitter:description": string | null;
    "twitter:image": string | null;
  };
}

export type Severity = "error" | "warning" | "pass";

export interface Finding {
  id: string;
  severity: Severity;
  message: string;
  fix: string | null;
}

export interface AnalyzeResponse {
  url: string;
  fetchedAt: string;
  meta: MetaResult;
  score: number;
  findings: Finding[];
}

export interface AnalyzeError {
  error: string;
}
