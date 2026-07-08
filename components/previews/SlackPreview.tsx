/* eslint-disable @next/next/no-img-element */
import type { MetaResult } from "@/lib/types";

interface SlackPreviewProps {
  meta: MetaResult;
}

export default function SlackPreview({ meta }: SlackPreviewProps) {
  const image = meta.openGraph["og:image"] || meta.twitter["twitter:image"];
  const title = meta.openGraph["og:title"] || meta.twitter["twitter:title"] || meta.title?.value || "No Title";
  const description = meta.openGraph["og:description"] || meta.twitter["twitter:description"] || meta.description?.value || "";
  const color = meta.twitter["twitter:card"] === "summary_large_image" ? "#611f69" : "#e01e5a";

  return (
    <div className="bg-[#111] border border-[#2a2a3e] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2a2a3e]">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#611f69]" fill="currentColor">
            <path d="M5.042 15.166a2.52 2.52 0 01-2.52 2.52A2.521 2.521 0 010 15.166a2.521 2.521 0 012.52-2.52h2.522v2.52zM6.313 15.166a2.521 2.521 0 012.52-2.52 2.521 2.521 0 012.52 2.52v6.313a2.521 2.521 0 01-2.52 2.52 2.521 2.521 0 01-2.52-2.52v-6.313zM8.833 5.042a2.521 2.521 0 01-2.52-2.52A2.521 2.521 0 018.833 0a2.521 2.521 0 012.52 2.52v2.522H8.833zM8.833 6.313a2.521 2.521 0 012.52 2.52 2.521 2.521 0 01-2.52 2.52H2.52A2.521 2.521 0 010 8.833a2.521 2.521 0 012.52-2.52h6.313zM18.958 8.833a2.521 2.521 0 012.52-2.52A2.521 2.521 0 0124 8.833a2.521 2.521 0 01-2.52 2.52h-2.522v-2.52zM17.687 8.833a2.521 2.521 0 01-2.52 2.52 2.521 2.521 0 01-2.52-2.52V2.52A2.521 2.521 0 0115.166 0a2.521 2.521 0 012.52 2.52v6.313zM15.166 18.958a2.521 2.521 0 012.52 2.52 2.521 2.521 0 01-2.52 2.52 2.521 2.521 0 01-2.52-2.52v-2.522h2.52zM15.166 17.687a2.521 2.521 0 01-2.52-2.52 2.521 2.521 0 012.52-2.52h6.313a2.521 2.521 0 012.52 2.52 2.521 2.521 0 01-2.52 2.52h-6.313z" />
          </svg>
          <span className="text-xs text-gray-500">Slack Preview</span>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-[480px] bg-black/30 rounded-lg overflow-hidden border border-[#333]">
          {image ? (
            <div className="w-full h-40 bg-[#222] overflow-hidden">
              <img src={image} alt="" className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.classList.add("flex", "items-center", "justify-center");
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="text-gray-500 text-sm">Image failed to load</div>';
                }}
              />
            </div>
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-[#333] to-[#222] flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div style={{ borderLeft: `4px solid ${color}` }} className="p-3">
            <div className="text-sm font-semibold text-[#e4e6eb] leading-snug mb-1 line-clamp-2">{title}</div>
            {description && <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
