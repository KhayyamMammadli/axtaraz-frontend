"use client";
import { useEffect, useSyncExternalStore } from "react";

const key = "axtar.product-favorites.v1";
const listeners = new Set<() => void>();
const initial = { ids: [] as number[], pending: [] as number[], ready: false };
let state = initial;
let initialized = false;
let queue: Promise<unknown> = Promise.resolve();
function notify() { listeners.forEach(listener => listener()); }
function read() {
  try { const ids = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(ids) ? [...new Set<number>(ids.filter((id: unknown) => Number.isSafeInteger(id) && Number(id) > 0))] : []; } catch { return []; }
}
function initialize() {
  if (initialized || typeof window === "undefined") return;
  initialized = true; state = { ...state, ids: read(), ready: true }; notify();
  window.addEventListener("storage", event => { if (event.key === key || event.key === null) { state = { ...state, ids: read() }; notify(); } });
}
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useProductFavorites() {
  useEffect(initialize, []);
  return useSyncExternalStore(subscribe, () => state, () => initial);
}
export async function toggleProductFavorite(id: number) {
  initialize();
  if (!Number.isSafeInteger(id) || id < 1 || state.pending.includes(id)) return;
  state = { ...state, pending: [...state.pending, id] }; notify();
  const task = queue.catch(() => {}).then(async () => {
    try {
      const response = await fetch("/api/product-favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: id, ids: state.ids }) });
      const payload = await response.json();
      if (!response.ok || payload.success !== true || typeof payload.data?.current !== "boolean" || !Array.isArray(payload.data.ids) || !payload.data.ids.every((value: unknown) => Number.isSafeInteger(value) && Number(value) > 0)) throw new Error(payload.message || "Favorit yenilənmədi.");
      const ids = [...new Set<number>(payload.data.ids)];
      state = { ...state, ids }; try { localStorage.setItem(key, JSON.stringify(ids)); } catch { /* Keep this session's selection in memory. */ }
    } finally { state = { ...state, pending: state.pending.filter(value => value !== id) }; notify(); }
  });
  queue = task;
  return task;
}
