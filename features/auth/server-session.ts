import { cookies } from "next/headers";
import { parseCustomer } from "./types";

export const sessionCookie = "axtar_session";
export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
export function trustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return request.headers.get("sec-fetch-site") !== "cross-site" && (!origin || origin === new URL(request.url).origin);
}
export async function getSessionCustomer() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;
  const response = await fetch("https://api.axtar.az/profile", { headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(12000) });
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error("Profil məlumatları yüklənmədi.");
  const payload = await response.json();
  if (payload.success === false) throw new Error("Profil məlumatları yüklənmədi.");
  return parseCustomer(payload.data?.customer || payload.data || payload);
}
