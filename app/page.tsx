"use client";

import { useState, useCallback } from "react";
import UrlForm from "@/components/UrlForm";
import ScoreCard from "@/components/ScoreCard";
import MetaTagTable from "@/components/MetaTagTable";
import FixSuggestions from "@/components/FixSuggestions";
import GooglePreview from "@/components/previews/GooglePreview";
import FacebookPreview from "@/components/previews/FacebookPreview";
import TwitterPreview from "@/components/previews/TwitterPreview";
import TelegramPreview from "@/components/previews/TelegramPreview";
import WhatsAppPreview from "@/components/previews/WhatsAppPreview";
import SlackPreview from "@/components/previews/SlackPreview";
import DiscordPreview from "@/components/previews/DiscordPreview";
import { useAnalysisHistory } from "@/lib/hooks/useAnalysisHistory";
import { downloadJson, printResult } from "@/lib/export";
import type { AnalyzeResponse, AnalyzeError } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { history, addEntry, clearHistory, removeEntry } = useAnalysisHistory();

  const handleSubmit = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errData = data as AnalyzeError;
        setError(errData.error || `Request failed with status ${res.status}`);
        return;
      }

      const resp = data as AnalyzeResponse;
      setResult(resp);
      addEntry(resp);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [addEntry]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            <span className="text-[#6c63ff]">Maddy</span>Meta
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Analyze, preview &amp; fix your meta tags.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-gray-500 hover:text-[#6c63ff] transition-colors"
            >
              History ({history.length})
            </button>
            <a href="/compare" className="text-xs text-gray-500 hover:text-[#6c63ff] transition-colors">
              Compare URLs
            </a>
          </div>
        </div>

        {showHistory && history.length > 0 && (
          <div className="max-w-2xl mx-auto mb-6 animate-slide-up">
            <div className="bg-[#111] border border-[#2a2a3e] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Recent Analyses</h3>
                <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300">Clear all</button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2">
                    <button
                      onClick={() => { setResult(entry.result); setShowHistory(false); }}
                      className="flex-1 text-left min-w-0"
                    >
                      <span className="text-xs text-gray-300 truncate block">{entry.url}</span>
                      <span className="text-[10px] text-gray-600">Score: {entry.score}/100 &middot; {new Date(entry.fetchedAt).toLocaleString()}</span>
                    </button>
                    <button onClick={() => removeEntry(entry.id)} className="text-gray-600 hover:text-red-400 ml-2 flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 animate-slide-up">
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-red-400 font-medium text-sm">Analysis Failed</p>
                  <p className="text-red-300/70 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="bg-[#111] border border-[#2a2a3e] rounded-xl p-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Fetching and analyzing page...</p>
                <div className="w-full max-w-md space-y-3">
                  <div className="h-4 bg-[#222] rounded animate-pulse" />
                  <div className="h-4 bg-[#222] rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-[#222] rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-slide-up">
            <ScoreCard score={result.score} findings={result.findings} />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => downloadJson(result)}
                className="px-3 py-1.5 text-xs bg-[#1a1a2e] hover:bg-[#222] border border-[#333] rounded-lg text-gray-400 transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={() => printResult(result)}
                className="px-3 py-1.5 text-xs bg-[#1a1a2e] hover:bg-[#222] border border-[#333] rounded-lg text-gray-400 transition-colors"
              >
                Print / PDF
              </button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                Platform Previews
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <GooglePreview meta={result.meta} />
                <FacebookPreview meta={result.meta} />
                <TwitterPreview meta={result.meta} />
                <TelegramPreview meta={result.meta} />
                <WhatsAppPreview meta={result.meta} />
                <SlackPreview meta={result.meta} />
                <DiscordPreview meta={result.meta} />
              </div>
            </div>

            <MetaTagTable meta={result.meta} />
            <FixSuggestions findings={result.findings} />
          </div>
        )}
      </main>

      <footer className="border-t border-[#1a1a2e] py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-600">
          <p>
            MaddyMeta &mdash; Open source meta tag analyzer. Built by{" "}
            <a
              href="https://github.com/Maddyrampant"
              className="text-[#6c63ff] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Maddyrampant
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
