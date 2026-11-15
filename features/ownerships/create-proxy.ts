import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sessionCookie, trustedOrigin } from "@/features/auth/server-session";

export async function proxyBusinessCreate(request: Request, path: "/uploads/traces" | "/my/ownerships" | "/my/products") {
  const headers = { "Cache-Control": "no-store" };
  if (!trustedOrigin(request)) return NextResponse.json({ message: "Sorğu qəbul edilmədi." }, { status: 403, headers });
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return NextResponse.json({ message: "Davam etmək üçün hesabınıza daxil olun." }, { status: 401, headers });
  try {
    let body: Record<string, unknown> | undefined;
    if (path !== "/uploads/traces") {
      try { const input: unknown = await request.json(); if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid body"); body = input as Record<string, unknown>; } catch { return NextResponse.json({ message: "Məlumatları yoxlayın." }, { status: 400, headers }); }
      if (typeof body.trace_id !== "string" || !body.trace_id || typeof body[path === "/my/products" ? "title_product" : "title"] !== "string" || !String(body[path === "/my/products" ? "title_product" : "title"]).trim() || !Number.isInteger(body.category_id)) return NextResponse.json({ message: "Məlumatlar və trace ID tələb olunur." }, { status: 422, headers });
      if (path === "/my/products" && (!Number.isInteger(body.city_id) || typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0 || !Array.isArray(body.images) || !body.images.length || !body.images.every(image => typeof image === "string" && /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png)$/i.test(image)))) return NextResponse.json({ message: "Elan məlumatlarını və yüklənmiş şəkilləri yoxlayın." }, { status: 422, headers });
      const allowed = path === "/my/products" ? ["category_id", "city_id", "subway_id", "description", "price", "ownership_id", "longitude", "latitude", "title_product", "trace_id", "images", "fields", "apply_type", "apply_value"] : ["title", "mobile_number", "subdomain", "active_menu_links", "slogan", "category_id", "city_id", "description", "work_days", "template", "social_instagram", "trace_id", "main_image"];
      const input = body;
      body = Object.fromEntries(allowed.filter(key => input[key] !== undefined).map(key => [key, input[key]]));
    }
    const upstream = await fetch(`https://api.axtar.az${path}`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}` }, ...(body ? { body: JSON.stringify(body) } : {}), cache: "no-store", signal: AbortSignal.timeout(20000) });
    const payload = await upstream.json();
    if (!upstream.ok || payload.success === false) {
      const status = [400, 401, 403, 409, 422, 429].includes(upstream.status) ? upstream.status : 502;
      return NextResponse.json({ success: false, message: typeof payload.message === "string" ? payload.message : "Sorğu tamamlanmadı. Yenidən cəhd edin.", errors: payload.errors }, { status, headers });
    }
    if (path === "/uploads/traces") {
      const trace = payload.data?.trace_id;
      if (typeof trace !== "string" || !trace) throw new Error("Invalid trace response");
      return NextResponse.json({ data: { trace_id: trace }, success: true }, { headers });
    }
    return NextResponse.json({ success: true }, { headers, status: 201 });
  } catch { return NextResponse.json({ message: "Serverlə əlaqə qurulmadı. Yenidən cəhd edin." }, { status: 502, headers }); }
}
