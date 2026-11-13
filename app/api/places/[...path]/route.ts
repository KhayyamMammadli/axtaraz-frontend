type Place = { id: number; title: string; country_id?: number; city_id?: number };

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const valid = (path.length === 1 && path[0] === "cities") || (path.length === 2 && path[0] === "subways" && /^[1-9]\d*$/.test(path[1]));
  if (!valid) return Response.json({ success: false, message: "Məkan sorğusu düzgün deyil." }, { status: 400 });
  try {
    const response = await fetch(`https://api.axtar.az/api/places/${path.join("/")}`, { headers: { Accept: "application/json" }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error("Places request failed");
    const payload = await response.json();
    if (payload.success !== true || !Array.isArray(payload.data) || !payload.data.every((item: Place) => item && Number.isInteger(item.id) && item.id > 0 && typeof item.title === "string" && item.title.trim())) throw new Error("Invalid places response");
    return Response.json({ success: true, data: payload.data });
  } catch {
    return Response.json({ success: false, message: "Məkanlar yüklənmədi. Yenidən cəhd edin." }, { status: 502 });
  }
}
