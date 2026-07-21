"use client";

import { useCallback, useState } from "react";
import type { TestResult } from "@/types";

const STORAGE_KEY = "typeking-history";
const MAX_RESULTS = 20;

function loadHistory(): TestResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useLocalHistory() {
  const [history, setHistory] = useState<TestResult[]>(loadHistory);

  const addResult = useCallback((result: TestResult) => {
    setHistory((prev) => {
      const updated = [result, ...prev].slice(0, MAX_RESULTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addResult, clearHistory };
}
