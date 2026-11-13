"use client";

import { useSyncExternalStore } from "react";

const key = "axtar.mock-session.v1";
const eventName = "axtar-session-change";
export const mockUser = { name: "Xəyyam Məmmədli", email: "xeyyam.memmedli.1996@mail.ru" };
function subscribe(callback: () => void) {
  window.addEventListener(eventName, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener("storage", callback);
  };
}
function getSnapshot() {
  return localStorage.getItem(key) === "active" || sessionStorage.getItem(key) === "active";
}
export function useMockSession() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
export function loginMock(remember: boolean) {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
  (remember ? localStorage : sessionStorage).setItem(key, "active");
  window.dispatchEvent(new Event(eventName));
}
export function logoutMock() {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
  window.dispatchEvent(new Event(eventName));
}
