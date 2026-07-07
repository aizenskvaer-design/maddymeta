import * as cheerio from "cheerio";
import type { MetaResult } from "./types";

export function parseMetaTags(html: string, url: string): MetaResult {
  const $ = cheerio.load(html);

  const titleTag = $("title").first().text().trim();
  const title = titleTag
    ? { value: titleTag, length: titleTag.length }
    : null;

  const descriptionTag =
    $('meta[name="description"]').attr("content") ||
    $('meta[name="Description"]').attr("content") ||
    null;
  const description = descriptionTag
    ? { value: descriptionTag, length: descriptionTag.length }
    : null;

  const canonical = $('link[rel="canonical"]').attr("href") || null;
  const robots = $('meta[name="robots"]').attr("content") || null;
  const viewport = $('meta[name="viewport"]').attr("content") || null;
  const charset =
    $('meta[charset]').attr("charset") ||
    $('meta[http-equiv="Content-Type"]')
      .attr("content")
      ?.match(/charset=([\w-]+)/i)?.[1] ||
    null;

  const lang =
    $("html").attr("lang") ||
    $("html").attr("xml:lang") ||
    null;

  const favicon =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    $('link[rel="apple-touch-icon"]').attr("href") ||
    null;

  const faviconAbsolute = favicon
    ? favicon.startsWith("http")
      ? favicon
      : new URL(favicon, url).toString()
    : null;

  const openGraph = {
    "og:title": $('meta[property="og:title"]').attr("content") || $('meta[name="og:title"]').attr("content") || null,
    "og:description": $('meta[property="og:description"]').attr("content") || $('meta[name="og:description"]').attr("content") || null,
    "og:image": $('meta[property="og:image"]').attr("content") || $('meta[name="og:image"]').attr("content") || null,
    "og:url": $('meta[property="og:url"]').attr("content") || $('meta[name="og:url"]').attr("content") || null,
    "og:type": $('meta[property="og:type"]').attr("content") || $('meta[name="og:type"]').attr("content") || null,
    "og:site_name": $('meta[property="og:site_name"]').attr("content") || $('meta[name="og:site_name"]').attr("content") || null,
  };

  const twitter = {
    "twitter:card": $('meta[name="twitter:card"]').attr("content") || null,
    "twitter:title": $('meta[name="twitter:title"]').attr("content") || null,
    "twitter:description": $('meta[name="twitter:description"]').attr("content") || null,
    "twitter:image": $('meta[name="twitter:image"]').attr("content") || null,
  };

  return {
    title,
    description,
    canonical,
    robots,
    viewport,
    charset,
    lang,
    favicon: faviconAbsolute,
    openGraph,
    twitter,
  };
}
