import type { MetaResult } from "@/lib/types";

interface GooglePreviewProps {
  meta: MetaResult;
}

export default function GooglePreview({ meta }: GooglePreviewProps) {
  const title = meta.title?.value || "No Title";
  const description = meta.description?.value || "No description available for this page...";
  const url = meta.canonical || meta.openGraph["og:url"] || "https://example.com/page";

  return (
    <div className="bg-[#111] border border-[#2a2a3e] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2a2a3e]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-500">Google Search Preview</span>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-[600px] font-sans">
          <div className="text-sm text-[#8ab4f8] mb-0.5 truncate hover:underline cursor-pointer">
            {url}
          </div>
          <div className="text-xl text-[#8ab4f8] font-medium leading-tight mb-1 cursor-pointer hover:underline">
            {title}
          </div>
          <p className="text-sm text-[#bdc1c6] leading-5 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
