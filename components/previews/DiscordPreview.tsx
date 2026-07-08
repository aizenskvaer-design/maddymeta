/* eslint-disable @next/next/no-img-element */
import type { MetaResult } from "@/lib/types";

interface DiscordPreviewProps {
  meta: MetaResult;
}

export default function DiscordPreview({ meta }: DiscordPreviewProps) {
  const image = meta.openGraph["og:image"] || meta.twitter["twitter:image"];
  const title = meta.openGraph["og:title"] || meta.twitter["twitter:title"] || meta.title?.value || "No Title";
  const description = meta.openGraph["og:description"] || meta.twitter["twitter:description"] || meta.description?.value || "";
  const url = meta.openGraph["og:url"] || meta.canonical || "";

  return (
    <div className="bg-[#111] border border-[#2a2a3e] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2a2a3e]">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#5865f2]" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
          </svg>
          <span className="text-xs text-gray-500">Discord Preview</span>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-[440px] bg-black/30 rounded-lg overflow-hidden border border-[#333] flex">
          {image ? (
            <div className="w-24 h-24 flex-shrink-0 bg-[#222] overflow-hidden">
              <img src={image} alt="" className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="text-gray-600 text-[10px] text-center">No img</div>';
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
            <div className="text-sm font-semibold text-[#e4e6eb] leading-snug mb-0.5 line-clamp-2">{title}</div>
            {description && <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{description}</p>}
            {url && <div className="text-[10px] text-gray-600 mt-1 truncate">{url}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
