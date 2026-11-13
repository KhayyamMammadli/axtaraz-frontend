"use client";

import { useCallback, useEffect, useState } from "react";

export type Place = { id: number; title: string; country_id?: number; city_id?: number };
const cache = new Map<string, { data: Place[]; expires: number }>();
const pending = new Map<string, Promise<Place[]>>();
function getPlaces(path: string): Promise<Place[]> {
  const cached = cache.get(path);
  if (cached && cached.expires > Date.now()) return Promise.resolve(cached.data);
  const running = pending.get(path);
  if (running) return running;
  const request = fetch(`/api/places/${path}`, { headers: { Accept: "application/json" } })
    .then(async response => {
      if (!response.ok) throw new Error("Məkanlar yüklənmədi.");
      const payload = await response.json();
      if (payload.success !== true || !Array.isArray(payload.data)) throw new Error("Məkanlar yüklənmədi.");
      const data = payload.data as Place[];
      cache.set(path, { data, expires: Date.now() + 300000 });
      return data;
    }).finally(() => pending.delete(path));
  pending.set(path, request);
  return request;
}

export function usePlaces(path: string, enabled = true) {
  const [state, setState] = useState<{ path: string; data: Place[]; loading: boolean; error: string }>({ path, data: [], loading: false, error: "" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    setState(current => ({ path, data: current.path === path ? current.data : [], loading: true, error: "" }));
    getPlaces(path).then(data => { if (active) setState({ path, data, loading: false, error: "" }); }, () => { if (active) setState({ path, data: [], loading: false, error: "Yükləmək mümkün olmadı. Yenidən cəhd edin." }); });
    return () => { active = false; };
  }, [path, enabled, attempt]);
  return { data: state.path === path ? state.data : [], loading: enabled && (state.loading || state.path !== path), error: state.path === path ? state.error : "", retry };
}
