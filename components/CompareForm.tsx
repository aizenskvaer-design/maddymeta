"use client";

import { useState } from "react";

interface CompareFormProps {
  onCompare: (urlA: string, urlB: string) => void;
  isLoading: boolean;
}

export default function CompareForm({ onCompare, isLoading }: CompareFormProps) {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlA.trim() || !urlB.trim() || isLoading) return;
    onCompare(urlA.trim(), urlB.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium">First URL</label>
          <input
            type="url"
            value={urlA}
            onChange={(e) => setUrlA(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-black/40 border border-[#333] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6c63ff] transition-colors"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium">Second URL</label>
          <input
            type="url"
            value={urlB}
            onChange={(e) => setUrlB(e.target.value)}
            placeholder="https://example.org"
            className="w-full px-4 py-3 bg-black/40 border border-[#333] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#6c63ff] transition-colors"
            disabled={isLoading}
            required
          />
        </div>
      </div>
      <div className="text-center">
        <button
          type="submit"
          disabled={isLoading || !urlA.trim() || !urlB.trim()}
          className="px-6 py-2.5 bg-[#6c63ff] hover:bg-[#5a52e0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
        >
          {isLoading ? "Analyzing..." : "Compare URLs"}
        </button>
      </div>
    </form>
  );
}
