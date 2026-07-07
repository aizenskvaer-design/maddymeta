/* eslint-disable @next/next/no-img-element */
import type { MetaResult } from "@/lib/types";

interface TelegramPreviewProps {
  meta: MetaResult;
}

export default function TelegramPreview({ meta }: TelegramPreviewProps) {
  const image = meta.openGraph["og:image"] || meta.twitter["twitter:image"];
  const title = meta.openGraph["og:title"] || meta.twitter["twitter:title"] || meta.title?.value || "No Title";
  const description = meta.openGraph["og:description"] || meta.twitter["twitter:description"] || meta.description?.value || "";

  return (
    <div className="bg-[#111] border border-[#2a2a3e] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2a2a3e]">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#0088cc]" fill="currentColor">
            <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          <span className="text-xs text-gray-500">Telegram / WhatsApp Preview</span>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-[420px] bg-black/30 rounded-lg overflow-hidden border border-[#333] flex">
          {image ? (
            <div className="w-24 h-24 flex-shrink-0 bg-[#222] overflow-hidden">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
                  const placeholder = document.createElement("div");
                  placeholder.className = "text-gray-600 text-[10px] text-center";
                  placeholder.textContent = "No img";
                  (e.target as HTMLImageElement).parentElement!.appendChild(placeholder);
                }}
              />
            </div>
          ) : (
            <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-[#333] to-[#222] flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="p-2.5 flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#e4e6eb] leading-snug mb-0.5 line-clamp-2">
              {title}
            </div>
            {description && (
              <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
