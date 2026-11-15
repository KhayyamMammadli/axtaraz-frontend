export async function GET(_request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const path = (kind === "categories" || kind === "product-categories") ? "/categories" : kind === "cities" ? "/places/cities" : null;
  if (!path) return Response.json({ message: "Sorğu düzgün deyil." }, { status: 404 });
  try {
    const response = await fetch(`https://api.axtar.az${path}`, { headers: { Accept: "application/json" }, next: { revalidate: 3600 }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error("Options request failed");
    const payload = await response.json();
    if (payload.success !== true || !Array.isArray(payload.data)) throw new Error("Invalid options response");
    type Category = { id: number; title: string; children?: Category[] };
    function leaves(items: Category[], prefix = ""): { id: number; title: string }[] {
      return items.flatMap(item => {
        const title = prefix ? `${prefix} / ${item.title}` : item.title;
        return item.children?.length ? leaves(item.children, title) : [{ id: item.id, title }];
      });
    }
    const data = kind === "product-categories" ? leaves(payload.data) : payload.data.filter((item: { parent_id?: unknown }) => kind !== "categories" || item?.parent_id === null);
    if (!data.every((item: { id?: unknown; title?: unknown }) => item && Number.isInteger(item.id) && Number(item.id) > 0 && typeof item.title === "string" && item.title.trim())) throw new Error("Invalid option");
    return Response.json({ success: true, data: data.map((item: { id: number; title: string }) => ({ id: item.id, title: item.title })) });
  } catch {
    return Response.json({ message: kind === "categories" ? "Kateqoriyalar yüklənmədi." : "Şəhərlər yüklənmədi." }, { status: 502 });
  }
}
