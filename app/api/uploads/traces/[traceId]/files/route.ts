import { cookies } from "next/headers";
import { sessionCookie, trustedOrigin } from "@/features/auth/server-session";

export async function POST(request: Request, { params }: { params: Promise<{ traceId: string }> }) {
  const headers = { "Cache-Control": "no-store" };
  if (!trustedOrigin(request)) return Response.json({ message: "Sorğu qəbul edilmədi." }, { status: 403, headers });
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return Response.json({ message: "Hesabınıza daxil olun." }, { status: 401, headers });
  const { traceId } = await params;
  if (!/^[a-zA-Z0-9._-]{1,150}$/.test(traceId)) return Response.json({ message: "Yükləmə sessiyası düzgün deyil." }, { status: 400, headers });
  try {
    const form = await request.formData();
    const file = form.get("filex");
    if (!(file instanceof File) || !["image/jpeg", "image/png"].includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024) return Response.json({ message: "5 MB-dək JPG və ya PNG şəkil seçin." }, { status: 422, headers });
    const body = new FormData();
    body.append("filex", file, file.name);
    const upstream = await fetch(`https://api.axtar.az/uploads/traces/${encodeURIComponent(traceId)}/files`, { method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, body, cache: "no-store", signal: AbortSignal.timeout(60000) });
    const payload = await upstream.json();
    if (!upstream.ok || payload.success === false) return Response.json({ message: typeof payload.message === "string" ? payload.message : "Şəkil yüklənmədi." }, { status: [400,401,403,404,413,422,429].includes(upstream.status) ? upstream.status : 502, headers });
    const name = payload.data?.file_name;
    if (typeof name !== "string" || !/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png)$/i.test(name)) throw new Error("Invalid uploaded filename");
    return Response.json({ success: true, data: { file_name: name } }, { status: 201, headers });
  } catch { return Response.json({ message: "Şəkil yüklənmədi. Yenidən cəhd edin." }, { status: 502, headers }); }
}
