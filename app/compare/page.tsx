"use client";

import { useState, useCallback } from "react";
import CompareForm from "@/components/CompareForm";
import ScoreCard from "@/components/ScoreCard";
import MetaTagTable from "@/components/MetaTagTable";
import FixSuggestions from "@/components/FixSuggestions";
import GooglePreview from "@/components/previews/GooglePreview";
import FacebookPreview from "@/components/previews/FacebookPreview";
import TwitterPreview from "@/components/previews/TwitterPreview";
import TelegramPreview from "@/components/previews/TelegramPreview";
import type { AnalyzeResponse, AnalyzeError } from "@/lib/types";

interface CompareResult {
  a: AnalyzeResponse;
  b: AnalyzeResponse;
}

export default function ComparePage() {
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = useCallback(async (urlA: string, urlB: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const [resA, resB] = await Promise.all([
        fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: urlA }) }),
        fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: urlB }) }),
      ]);

      const [dataA, dataB] = await Promise.all([resA.json(), resB.json()]);

      if (!resA.ok) { setError((dataA as AnalyzeError).error || "First URL failed"); return; }
      if (!resB.ok) { setError((dataB as AnalyzeError).error || "Second URL failed"); return; }

      setResult({ a: dataA as AnalyzeResponse, b: dataB as AnalyzeResponse });
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const diffClass = (aVal: number | string | null | undefined, bVal: number | string | null | undefined, reverse = false) => {
    if (aVal == null && bVal == null) return "";
    if (aVal == null) return "text-green-400";
    if (bVal == null) return "text-red-400";
    if (typeof aVal === "number" && typeof bVal === "number") {
      if (aVal > bVal) return reverse ? "text-red-400" : "text-green-400";
      if (aVal < bVal) return reverse ? "text-green-400" : "text-red-400";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <a href="/" className="text-[#6c63ff] text-sm hover:underline">&larr; Back to single analysis</a>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">Compare URLs</h1>
          <p className="text-gray-500 text-sm">Compare meta tags and scores across two pages</p>
        </div>

        <div className="mb-8 max-w-3xl mx-auto">
          <CompareForm onCompare={handleCompare} isLoading={isLoading} />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#111] border border-[#2a2a3e] rounded-xl p-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Analyzing both pages...</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs text-gray-500 font-medium mb-2 truncate">A: {result.a.url}</h3>
                <ScoreCard score={result.a.score} findings={result.a.findings} />
              </div>
              <div>
                <h3 className="text-xs text-gray-500 font-medium mb-2 truncate">B: {result.b.url}</h3>
                <ScoreCard score={result.b.score} findings={result.b.findings} />
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 p-4 bg-[#111] border border-[#2a2a3e] rounded-xl">
              <span className={`text-3xl font-bold ${diffClass(result.a.score, result.b.score)}`}>{result.a.score}</span>
              <span className="text-gray-600 text-sm">vs</span>
              <span className={`text-3xl font-bold ${diffClass(result.b.score, result.a.score)}`}>{result.b.score}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GooglePreview meta={result.a.meta} />
              <GooglePreview meta={result.b.meta} />
              <FacebookPreview meta={result.a.meta} />
              <FacebookPreview meta={result.b.meta} />
              <TwitterPreview meta={result.a.meta} />
              <TwitterPreview meta={result.b.meta} />
              <TelegramPreview meta={result.a.meta} />
              <TelegramPreview meta={result.b.meta} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetaTagTable meta={result.a.meta} />
              <MetaTagTable meta={result.b.meta} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FixSuggestions findings={result.a.findings} />
              <FixSuggestions findings={result.b.findings} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
