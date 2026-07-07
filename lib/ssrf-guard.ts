import { lookup } from "dns/promises";
import { isIP, isIPv4 } from "net";

export class SSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SSRFError";
  }
}

const PRIVATE_RANGES_V4 = [
  { prefix: "10.", mask: 8 },
  { prefix: "172.16.", mask: 12 },
  { prefix: "192.168.", mask: 16 },
  { prefix: "127.", mask: 8 },
  { prefix: "169.254.", mask: 16 },
  { prefix: "0.", mask: 8 },
];

function isPrivateIPv4(ip: string): boolean {
  for (const range of PRIVATE_RANGES_V4) {
    if (ip.startsWith(range.prefix)) return true;
  }
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) return true;
  return false;
}

function isReservedIP(ip: string): boolean {
  if (isIPv4(ip)) {
    return isPrivateIPv4(ip);
  }
  return isPrivateIPv6(ip);
}

function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === "localhost" ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal") ||
    lower === "127.0.0.1" ||
    lower === "::1" ||
    lower === "0.0.0.0"
  ) {
    return true;
  }
  return false;
}

export async function validateURL(urlString: string): Promise<void> {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    throw new SSRFError("Invalid URL format");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new SSRFError("Only http and https protocols are allowed");
  }

  const hostname = url.hostname;

  if (isBlockedHostname(hostname)) {
    throw new SSRFError("Access to local/internal resources is blocked");
  }

  if (isIP(hostname)) {
    if (isReservedIP(hostname)) {
      throw new SSRFError("Access to private/reserved IP ranges is blocked");
    }
    return;
  }

  try {
    const addresses = await lookup(hostname);
    const ip = addresses.address;
    if (isReservedIP(ip)) {
      throw new SSRFError("Access to private/reserved IP ranges is blocked");
    }
  } catch (err) {
    if (err instanceof SSRFError) throw err;
    throw new SSRFError("DNS resolution failed for the given hostname");
  }
}
