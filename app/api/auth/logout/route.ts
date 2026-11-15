import { NextResponse } from "next/server";
import { cookieOptions, sessionCookie, trustedOrigin } from "@/features/auth/server-session";

export async function POST(request: Request) {
  if (!trustedOrigin(request)) return NextResponse.json({ message: "Sorğu qəbul edilmədi." }, { status: 403 });
  const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
