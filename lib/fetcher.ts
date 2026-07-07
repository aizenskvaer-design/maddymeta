import { validateURL, SSRFError } from "./ssrf-guard";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 3;
const USER_AGENT = "MaddyMetaBot/1.0 (+https://github.com/Maddyrampant/maddymeta)";

export class FetchError extends Error {
  public statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "FetchError";
    this.statusCode = statusCode;
  }
}

export class TimeoutError extends FetchError {
  constructor() {
    super("Request timed out after 8 seconds", 408);
    this.name = "TimeoutError";
  }
}

export class ContentTypeError extends FetchError {
  constructor() {
    super("URL does not return HTML content", 422);
    this.name = "ContentTypeError";
  }
}

export class SizeLimitError extends FetchError {
  constructor() {
    super("Response body exceeds 2 MB limit", 422);
    this.name = "SizeLimitError";
  }
}

async function fetchWithRedirects(url: string, redirectCount = 0): Promise<Response> {
  if (redirectCount > MAX_REDIRECTS) {
    throw new FetchError("Too many redirects", 502);
  }

  await validateURL(url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html, application/xhtml+xml",
      },
      redirect: "manual",
    });

    clearTimeout(timeoutId);

    if (
      response.status >= 300 &&
      response.status < 400 &&
      response.headers.has("location")
    ) {
      const location = response.headers.get("location")!;
      const redirectUrl = new URL(location, url).toString();
      return fetchWithRedirects(redirectUrl, redirectCount + 1);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new ContentTypeError();
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_SIZE) {
      throw new SizeLimitError();
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new FetchError("No response body", 502);
    }

    const chunks: Uint8Array[] = [];
    let totalSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalSize += value.length;
      if (totalSize > MAX_SIZE) {
        reader.cancel();
        throw new SizeLimitError();
      }
      chunks.push(value);
    }

    const decoder = new TextDecoder();
    const body = chunks.map((chunk) => decoder.decode(chunk, { stream: true })).join("");
    const finalDecoder = new TextDecoder();
    const fullBody = chunks.length > 0
      ? body + finalDecoder.decode(new Uint8Array(0))
      : body;

    return new Response(fullBody, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof FetchError) throw err;
    if (err instanceof SSRFError) throw err;
    if ((err as Error).name === "AbortError") {
      throw new TimeoutError();
    }
    throw new FetchError("Failed to fetch URL: " + (err as Error).message, 502);
  }
}

export async function fetchPage(url: string): Promise<string> {
  const response = await fetchWithRedirects(url);
  return await response.text();
}
