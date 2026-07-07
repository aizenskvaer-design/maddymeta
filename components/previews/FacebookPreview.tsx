/* eslint-disable @next/next/no-img-element */
import type { MetaResult } from "@/lib/types";

interface FacebookPreviewProps {
  meta: MetaResult;
}

export default function FacebookPreview({ meta }: FacebookPreviewProps) {
  const ogImage = meta.openGraph["og:image"];
  const ogTitle = meta.openGraph["og:title"] || meta.title?.value || "No Title";
  const ogDescription = meta.openGraph["og:description"] || meta.description?.value || "";
  const ogUrl = meta.openGraph["og:url"] || meta.canonical || "https://example.com";
  const ogSiteName = meta.openGraph["og:site_name"];

  return (
    <div className="bg-[#111] border border-[#2a2a3e] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2a2a3e]">
        <span className="text-xs text-gray-500 font-medium text-[#1877f2]">
          Facebook / LinkedIn Preview
        </span>
      </div>
      <div className="p-6">
        <div className="max-w-[500px] bg-black/30 rounded-lg overflow-hidden border border-[#333]">
          {ogImage ? (
            <div className="w-full h-52 bg-[#222] overflow-hidden">
              <img
                src={ogImage}
                alt="OG Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="text-gray-500 text-sm">Image failed to load</div>';
                }}
              />
            </div>
          ) : (
            <div className="w-full h-52 bg-gradient-to-br from-[#333] to-[#222] flex items-center justify-center">
              <div className="text-center">
                <svg className="w-10 h-10 text-gray-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 text-xs">No og:image</span>
              </div>
            </div>
          )}
          <div className="p-3">
            {ogSiteName && (
              <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                {ogSiteName}
              </div>
            )}
            <div className="text-sm font-semibold text-[#e4e6eb] leading-snug mb-1 line-clamp-2">
              {ogTitle}
            </div>
            {ogDescription && (
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {ogDescription}
              </p>
            )}
            <div className="text-[10px] text-gray-600 mt-1.5 truncate">
              {ogUrl}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
