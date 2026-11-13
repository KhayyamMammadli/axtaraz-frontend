import { toListing } from "@/features/listings/api";

const endpoint = "https://api.axtar.az/api/products/favorites";
const cookiePrefix = "axtar_fav_";
function upstreamCookies(request: Request) {
  return (request.headers.get("cookie") || "").split(";").map(cookie => cookie.trim()).filter(cookie => cookie.startsWith(cookiePrefix)).map(cookie => cookie.slice(cookiePrefix.length)).join("; ");
}
function relayCookies(upstream: Response, outgoing: Response) {
  for (const cookie of upstream.headers.getSetCookie()) {
    const parts = cookie.split(";").map(part => part.trim());
    const first = parts.shift()!;
    const safe = parts.filter(part => !/^(domain|path|samesite|secure)=?/i.test(part));
    outgoing.headers.append("set-cookie", `${cookiePrefix}${first}; ${safe.join("; ")}; Path=/api/product-favorites; SameSite=Lax; HttpOnly`);
  }
  return outgoing;
}
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("ids") || "";
  if (raw && !/^\d+(,\d+)*$/.test(raw)) return Response.json({ message: "Favorit ID-ləri düzgün deyil." }, { status: 400 });
  const ids = [...new Set(raw.split(",").filter(Boolean).map(Number))];
  if (ids.length > 500 || ids.some(id => !Number.isSafeInteger(id) || id < 1)) return Response.json({ message: "Favorit siyahısı düzgün deyil." }, { status: 400 });
  if (!ids.length) return Response.json({ ids: [], products: [] });
  try {
    const response = await fetch(`${endpoint}?${new URLSearchParams({ ids: ids.join(",") })}`, { cache: "no-store", headers: { Accept: "application/json", Cookie: upstreamCookies(request) }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error();
    const payload = await response.json();
    if (payload.success !== true || !Array.isArray(payload.data?.products)) throw new Error();
    const products = payload.data.products.filter((item: { id: number; id_slug: string }) => Number.isInteger(item.id) && ids.includes(item.id) && typeof item.id_slug === "string").map(toListing);
    return relayCookies(response, Response.json({ ids: payload.data.ids, products }));
  } catch { return Response.json({ message: "Favorit elanlar yüklənmədi." }, { status: 502 }); }
}
export async function POST(request: Request) {
  let id: number;
  let ids: number[];
  try { const body = await request.json(); id = body.product_id; ids = body.ids ?? []; } catch { return Response.json({ message: "Sorğu düzgün deyil." }, { status: 400 }); }
  if (!Number.isSafeInteger(id) || id < 1) return Response.json({ message: "Elan ID-si düzgün deyil." }, { status: 400 });
  if (!Array.isArray(ids) || ids.length > 500 || ids.some(value => !Number.isSafeInteger(value) || value < 1)) return Response.json({ message: "Favorit siyahısı düzgün deyil." }, { status: 400 });
  try {
    const response = await fetch(endpoint, { method: "POST", cache: "no-store", headers: { Accept: "application/json", "Content-Type": "application/json", Cookie: upstreamCookies(request) }, body: JSON.stringify({ product_id: id, ids: [...new Set(ids)] }), signal: AbortSignal.timeout(12000) });
    if (!response.ok) return Response.json({ message: response.status === 401 ? "Favorit üçün hesabınıza daxil olun." : "Favorit yenilənmədi." }, { status: response.status === 401 ? 401 : 502 });
    const payload = await response.json();
    if (payload.success !== true || typeof payload.data?.current !== "boolean" || !Array.isArray(payload.data.ids)) throw new Error();
    return relayCookies(response, Response.json(payload));
  } catch { return Response.json({ message: "Favorit yenilənmədi. Yenidən cəhd edin." }, { status: 502 }); }
}
