/* eslint-disable @next/next/no-img-element */
import type { MetaResult } from "@/lib/types";

interface TwitterPreviewProps {
  meta: MetaResult;
}

export default function TwitterPreview({ meta }: TwitterPreviewProps) {
  const twitterImage = meta.twitter["twitter:image"] || meta.openGraph["og:image"];
  const twitterTitle = meta.twitter["twitter:title"] || meta.openGraph["og:title"] || meta.title?.value || "No Title";
  const twitterDescription = meta.twitter["twitter:description"] || meta.openGraph["og:description"] || meta.description?.value || "";
  const twitterCard = meta.twitter["twitter:card"] || "summary";

  return (
    <div className="bg-[#111] border border-[#2a2a3e] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2a2a3e]">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-xs text-gray-500">X (Twitter) Preview</span>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-[470px] bg-black/30 rounded-xl overflow-hidden border border-[#333]">
          {twitterImage ? (
            <div className="w-full h-48 bg-[#222] overflow-hidden">
              <img
                src={twitterImage}
                alt="Twitter Card Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
                  const placeholder = document.createElement("div");
                  placeholder.className = "text-gray-500 text-sm";
                  placeholder.textContent = "Image failed to load";
                  (e.target as HTMLImageElement).parentElement!.appendChild(placeholder);
                }}
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-[#333] to-[#222] flex items-center justify-center">
              <div className="text-center">
                <svg className="w-10 h-10 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 text-xs">No image</span>
              </div>
            </div>
          )}
          <div className="p-3">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
              {twitterCard === "summary_large_image" ? "Summary Large Image" : twitterCard === "summary" ? "Summary Card" : twitterCard}
            </div>
            <div className="text-sm font-semibold text-white leading-snug mb-1 line-clamp-2">
              {twitterTitle}
            </div>
            {twitterDescription && (
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {twitterDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
