"use client";
import { useEffect, useSyncExternalStore } from "react";
import { parseCustomer, type Customer } from "./types";

const initial = { customer: null as Customer | null, loading: true, error: "" };
let state = initial;
let initialized = false;
let revision = 0;
let pending: Promise<void> | null = null;
const listeners = new Set<() => void>();
function notify() { listeners.forEach(listener => listener()); }
function broadcast() { try { localStorage.setItem("axtar-auth-event", String(Date.now())); } catch { /* Cookies remain the session source. */ } }
export async function refreshSession() {
  if (pending) return pending;
  const current = revision;
  pending = (async () => {
    try {
      const response = await fetch("/api/auth/profile", { cache: "no-store" });
      const payload = await response.json();
      if (current !== revision) return;
      if (response.status === 401) state = { customer: null, loading: false, error: "" };
      else if (!response.ok) throw new Error("Profil məlumatları yüklənmədi.");
      else state = { customer: payload.customer === null ? null : parseCustomer(payload.customer), loading: false, error: "" };
    } catch { if (current === revision) state = { ...state, loading: false, error: "Profil məlumatları yüklənmədi." }; }
    finally { pending = null; notify(); }
  })();
  return pending;
}
function initialize() {
  if (initialized) return;
  initialized = true; void refreshSession();
  window.addEventListener("focus", () => { void refreshSession(); });
  window.addEventListener("storage", event => { if (event.key === "axtar-auth-event") { const running = pending; revision++; if (running) void running.then(() => refreshSession()); else void refreshSession(); } });
}
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useSession() { useEffect(initialize, []); return useSyncExternalStore(subscribe, () => state, () => initial); }
export async function login(mobile_number: string, password: string, remember: boolean) {
  const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile_number, password, remember }) });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || "Giriş mümkün olmadı.");
  const customer = parseCustomer(payload.customer);
  revision++; state = { customer, loading: false, error: "" }; notify(); broadcast();
}
export async function logout() {
  const response = await fetch("/api/auth/logout", { method: "POST" });
  if (!response.ok) throw new Error("Çıxış mümkün olmadı. Yenidən cəhd edin.");
  revision++; state = { customer: null, loading: false, error: "" }; notify(); broadcast();
}
