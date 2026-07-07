import type { MetaResult } from "@/lib/types";

interface MetaTagTableProps {
  meta: MetaResult;
}

interface TagRow {
  name: string;
  value: string | null;
  status: "present" | "missing";
}

export default function MetaTagTable({ meta }: MetaTagTableProps) {
  const rows: TagRow[] = [
    { name: "Title", value: meta.title?.value || null, status: meta.title ? "present" : "missing" },
    { name: "Meta Description", value: meta.description?.value || null, status: meta.description ? "present" : "missing" },
    { name: "Canonical URL", value: meta.canonical, status: meta.canonical ? "present" : "missing" },
    { name: "Robots", value: meta.robots, status: meta.robots ? "present" : "missing" },
    { name: "Viewport", value: meta.viewport, status: meta.viewport ? "present" : "missing" },
    { name: "Charset", value: meta.charset, status: meta.charset ? "present" : "missing" },
    { name: "Language (lang)", value: meta.lang, status: meta.lang ? "present" : "missing" },
    { name: "Favicon", value: meta.favicon, status: meta.favicon ? "present" : "missing" },
    { name: "og:title", value: meta.openGraph["og:title"], status: meta.openGraph["og:title"] ? "present" : "missing" },
    { name: "og:description", value: meta.openGraph["og:description"], status: meta.openGraph["og:description"] ? "present" : "missing" },
    { name: "og:image", value: meta.openGraph["og:image"], status: meta.openGraph["og:image"] ? "present" : "missing" },
    { name: "og:url", value: meta.openGraph["og:url"], status: meta.openGraph["og:url"] ? "present" : "missing" },
    { name: "og:type", value: meta.openGraph["og:type"], status: meta.openGraph["og:type"] ? "present" : "missing" },
    { name: "og:site_name", value: meta.openGraph["og:site_name"], status: meta.openGraph["og:site_name"] ? "present" : "missing" },
    { name: "twitter:card", value: meta.twitter["twitter:card"], status: meta.twitter["twitter:card"] ? "present" : "missing" },
    { name: "twitter:title", value: meta.twitter["twitter:title"], status: meta.twitter["twitter:title"] ? "present" : "missing" },
    { name: "twitter:description", value: meta.twitter["twitter:description"], status: meta.twitter["twitter:description"] ? "present" : "missing" },
    { name: "twitter:image", value: meta.twitter["twitter:image"], status: meta.twitter["twitter:image"] ? "present" : "missing" },
  ];

  return (
    <div className="bg-[#111] border border-[#2a2a3e] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2a2a3e]">
        <h2 className="text-lg font-semibold text-white">Meta Tags</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a3e] bg-black/30">
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Tag</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Value</th>
              <th className="text-right px-6 py-3 text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a3e]">
            {rows.map((row) => (
              <tr key={row.name} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-3 text-gray-300 font-mono text-xs whitespace-nowrap">
                  {row.name}
                </td>
                <td className="px-6 py-3 text-gray-400 font-mono text-xs max-w-md truncate">
                  {row.value || <span className="italic text-gray-600">Not set</span>}
                </td>
                <td className="px-6 py-3 text-right">
                  {row.status === "present" ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-800">
                      Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-400 border border-red-800">
                      Missing
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
