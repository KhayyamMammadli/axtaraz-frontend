import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionCustomer, sessionCookie } from "@/features/auth/server-session";

export async function GET() {
  try {
    if (!(await cookies()).get(sessionCookie)?.value) {
      return NextResponse.json({ customer: null }, { headers: { "Cache-Control": "no-store" } });
    }
    const customer = await getSessionCustomer();
    if (!customer) {
      return NextResponse.json({ customer: null }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json({ customer }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ message: "Profil məlumatları yüklənmədi." }, { status: 502, headers: { "Cache-Control": "no-store" } }); }
}
