"use client";

import { useState } from "react";
import type { Finding } from "@/lib/types";

interface FixSuggestionsProps {
  findings: Finding[];
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <pre className="bg-black/50 border border-[#333] rounded-lg p-3 pr-10 text-xs font-mono text-gray-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-[#222] border border-[#444] hover:bg-[#333] transition-colors"
        title="Copy to clipboard"
      >
        {copied ? (
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function FixSuggestions({ findings }: FixSuggestionsProps) {
  const issues = findings.filter((f) => f.severity !== "pass");

  if (issues.length === 0) {
    return (
      <div className="bg-[#111] border border-[#2a2a3e] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Fix Suggestions</h2>
        <p className="text-gray-400 text-sm">No issues found. Great job!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#2a2a3e] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#2a2a3e]">
        <h2 className="text-lg font-semibold text-white">
          Fix Suggestions ({issues.length})
        </h2>
      </div>
      <div className="divide-y divide-[#2a2a3e]">
        {issues.map((finding) => (
          <div key={finding.id} className="p-6">
            <div className="flex items-start gap-3 mb-3">
              {finding.severity === "error" ? (
                <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-sm font-medium ${
                      finding.severity === "error"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {finding.severity === "error" ? "Error" : "Warning"}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {finding.id}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-1">{finding.message}</p>
              </div>
            </div>
            {finding.fix && (
              <div className="ml-8">
                <p className="text-xs text-gray-500 mb-1.5">Suggested fix:</p>
                <CodeBlock code={finding.fix} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
