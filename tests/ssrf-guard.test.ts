import { describe, it, expect } from "vitest";
import { validateURL, SSRFError } from "../lib/ssrf-guard";

describe("validateURL", () => {
  it("rejects non-http protocols", async () => {
    await expect(validateURL("ftp://example.com")).rejects.toThrow(SSRFError);
    await expect(validateURL("file:///etc/passwd")).rejects.toThrow(SSRFError);
    await expect(validateURL("data:text/html,<p>hi</p>")).rejects.toThrow(SSRFError);
  });

  it("rejects invalid URL format", async () => {
    await expect(validateURL("not-a-url")).rejects.toThrow(SSRFError);
  });

  it("rejects localhost", async () => {
    await expect(validateURL("http://localhost:3000")).rejects.toThrow(SSRFError);
    await expect(validateURL("http://localhost")).rejects.toThrow(SSRFError);
  });

  it("rejects 127.0.0.1", async () => {
    await expect(validateURL("http://127.0.0.1")).rejects.toThrow(SSRFError);
    await expect(validateURL("http://127.0.0.1:8080")).rejects.toThrow(SSRFError);
  });

  it("rejects 0.0.0.0", async () => {
    await expect(validateURL("http://0.0.0.0")).rejects.toThrow(SSRFError);
  });

  it("rejects private IP ranges", async () => {
    await expect(validateURL("http://10.0.0.1")).rejects.toThrow(SSRFError);
    await expect(validateURL("http://192.168.1.1")).rejects.toThrow(SSRFError);
    await expect(validateURL("http://172.16.0.1")).rejects.toThrow(SSRFError);
  });

  it("rejects IPv6 localhost", async () => {
    await expect(validateURL("http://[::1]")).rejects.toThrow(SSRFError);
  });

  it("rejects .local and .internal hostnames", async () => {
    await expect(validateURL("http://myhost.local")).rejects.toThrow(SSRFError);
    await expect(validateURL("http://internal")).rejects.toThrow(SSRFError);
    await expect(validateURL("http://service.internal")).rejects.toThrow(SSRFError);
  });

  it("rejects 169.254.x.x link-local", async () => {
    await expect(validateURL("http://169.254.169.254")).rejects.toThrow(SSRFError);
  });

  it("allows valid public URLs", async () => {
    await expect(validateURL("https://example.com")).resolves.not.toThrow();
    await expect(validateURL("https://github.com")).resolves.not.toThrow();
    await expect(validateURL("http://httpbin.org")).resolves.not.toThrow();
  });

  it("allows URLs with valid public IPs", async () => {
    await expect(validateURL("https://8.8.8.8")).resolves.not.toThrow();
    await expect(validateURL("https://1.1.1.1")).resolves.not.toThrow();
  });
});
