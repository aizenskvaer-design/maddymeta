"use client";

import { useState, useEffect, useCallback } from "react";
import type { AnalyzeResponse } from "@/lib/types";

const STORAGE_KEY = "maddymeta-history";
const MAX_ITEMS = 20;

export interface HistoryEntry {
  id: string;
  url: string;
  score: number;
  fetchedAt: string;
  result: AnalyzeResponse;
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useAnalysisHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addEntry = useCallback((result: AnalyzeResponse) => {
    setHistory((prev) => {
      const entry: HistoryEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        url: result.url,
        score: result.score,
        fetchedAt: result.fetchedAt,
        result,
      };
      const next = [entry, ...prev.filter((e) => e.url !== result.url)].slice(0, MAX_ITEMS);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, []);

  return { history, addEntry, clearHistory, removeEntry };
}
