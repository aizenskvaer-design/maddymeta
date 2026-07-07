"use client";

import { useState, FormEvent } from "react";

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please enter a URL");
      return;
    }

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        setError("Only http and https URLs are supported");
        return;
      }
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <label htmlFor="url-input" className="sr-only">
            Enter URL to analyze
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            placeholder="https://example.com"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-[#111] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6c63ff] focus:border-transparent disabled:opacity-50 text-sm"
            autoFocus
          />
          {error && (
            <p className="absolute -bottom-6 left-1 text-red-400 text-xs">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-[#6c63ff] hover:bg-[#5a52d5] disabled:bg-[#4a44b0] text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#6c63ff] focus:ring-offset-2 focus:ring-offset-black disabled:opacity-60 whitespace-nowrap"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze"
          )}
        </button>
      </div>
    </form>
  );
}
