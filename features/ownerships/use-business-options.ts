"use client";

import { useEffect, useState } from "react";
type Option = { value: string; label: string };

export function useBusinessOptions(kind: "categories" | "cities" | "product-categories") {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    void (async () => {
      try {
        const response = await fetch(`/api/business-options/${kind}`, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok || payload.success !== true || !Array.isArray(payload.data)) throw new Error("Invalid options");
        const items: Option[] = payload.data.map((item: { id: number; title: string }) => {
          if (!Number.isInteger(item.id) || item.id < 1 || typeof item.title !== "string") throw new Error("Invalid option");
          return { value: String(item.id), label: item.title };
        });
        if (!controller.signal.aborted) setOptions(items);
      } catch {
        if (!controller.signal.aborted) setError(kind !== "cities" ? "Kateqoriyalar yüklənmədi." : "Şəhərlər yüklənmədi.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [kind, attempt]);
  return { options, loading, error, retry: () => setAttempt(value => value + 1) };
}
