import { NextResponse } from "next/server";
import { cookieOptions, sessionCookie, trustedOrigin } from "@/features/auth/server-session";
import { parseCustomer } from "@/features/auth/types";
import { mobileNumberPattern } from "@/features/auth/phone";

export async function POST(request: Request) {
  if (!trustedOrigin(request)) return NextResponse.json({ message: "Sorğu qəbul edilmədi." }, { status: 403 });
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Məlumatları yoxlayın." }, { status: 400 }); }
  if (typeof body.mobile_number !== "string" || !body.mobile_number.trim() || body.mobile_number.length > 40 || typeof body.password !== "string" || !body.password || body.password.length > 1024) return NextResponse.json({ message: "Mobil nömrə və şifrəni daxil edin." }, { status: 400 });
  if (!mobileNumberPattern.test(body.mobile_number)) return NextResponse.json({ message: "Mobil nömrəni (050) 000-00-00 formatında daxil edin." }, { status: 422 });
  try {
    const upstream = await fetch("https://api.axtar.az/auth/login", { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ mobile_number: body.mobile_number.trim(), password: body.password }), cache: "no-store", signal: AbortSignal.timeout(15000) });
    const payload = await upstream.json();
    if (!upstream.ok || payload.success !== true) {
      const status = [400, 401, 403, 422, 429].includes(upstream.status) ? upstream.status : 502;
      return NextResponse.json({ message: status === 429 ? "Çox sayda cəhd edildi. Bir az sonra yenidən yoxlayın." : status < 500 ? "Mobil nömrə və ya şifrə düzgün deyil." : "Giriş xidməti hazırda əlçatan deyil." }, { status });
    }
    const token = payload.data?.token;
    if (typeof token !== "string" || !token || token.length > 3800) throw new Error("Invalid session");
    const customer = parseCustomer(payload.data.customer);
    const response = NextResponse.json({ success: true, customer }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(sessionCookie, token, { ...cookieOptions, ...(body.remember === true ? { maxAge: 60 * 60 * 24 * 30 } : {}) });
    return response;
  } catch { return NextResponse.json({ message: "Giriş mümkün olmadı. Yenidən cəhd edin." }, { status: 502 }); }
}
