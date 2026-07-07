import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchPage, FetchError, TimeoutError, ContentTypeError, SizeLimitError } from "@/lib/fetcher";
import { parseMetaTags } from "@/lib/parser";
import { scoreMeta } from "@/lib/scorer";
import { SSRFError } from "@/lib/ssrf-guard";
import type { AnalyzeResponse, AnalyzeError } from "@/lib/types";

const requestSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Must be a valid URL")
    .refine(
      (val) => val.startsWith("http://") || val.startsWith("https://"),
      "Only http and https protocols are allowed"
    ),
});

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function getRateLimitKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true, retryAfter: 0 };
}

setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((entry, ip) => {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  });
}, 60_000);

export async function POST(request: NextRequest) {
  const ip = getRateLimitKey(request);
  const { allowed, retryAfter } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." } satisfies AnalyzeError,
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" } satisfies AnalyzeError,
      { status: 400 }
    );
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message || "Invalid input";
    return NextResponse.json(
      { error: firstError } satisfies AnalyzeError,
      { status: 400 }
    );
  }

  const { url } = parsed.data;

  try {
    const html = await fetchPage(url);
    const meta = parseMetaTags(html, url);
    const { score, findings } = scoreMeta(meta);

    const response: AnalyzeResponse = {
      url,
      fetchedAt: new Date().toISOString(),
      meta,
      score,
      findings,
    };

    return NextResponse.json(response);
  } catch (err) {
    if (err instanceof SSRFError) {
      return NextResponse.json(
        { error: err.message } satisfies AnalyzeError,
        { status: 403 }
      );
    }
    if (err instanceof TimeoutError) {
      return NextResponse.json(
        { error: err.message } satisfies AnalyzeError,
        { status: 408 }
      );
    }
    if (err instanceof ContentTypeError) {
      return NextResponse.json(
        { error: err.message } satisfies AnalyzeError,
        { status: 422 }
      );
    }
    if (err instanceof SizeLimitError) {
      return NextResponse.json(
        { error: err.message } satisfies AnalyzeError,
        { status: 422 }
      );
    }
    if (err instanceof FetchError) {
      const status = err.statusCode || 502;
      return NextResponse.json(
        { error: err.message } satisfies AnalyzeError,
        { status }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" } satisfies AnalyzeError,
      { status: 500 }
    );
  }
}
