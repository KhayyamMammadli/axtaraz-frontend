export type Ownership = {
  id: number;
  status: string;
  level: string;
  recommended: number | boolean;
  title: string;
  address?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  slogan?: string | null;
  description?: string | null;
  mobile_number?: string | null;
  subdomain?: string | null;
  url?: string | null;
  template?: string | null;
  category_id?: number | null;
  category?: { id: number; title: string } | null;
  active_menu_links?: string[];
  work_days?: string[];
  work_day_names?: string[];
  socials?: Record<string, string>;
  main_image?: string | null;
  main_image_full?: string | null;
  images?: string[];
  images_full?: string[];
  products_count?: number;
  created_at?: string;
};

type OwnershipsResponse = {
  data?: Ownership[];
  success?: boolean;
};

const OWNERSHIPS_API_URL = "https://api.axtar.az/api/ownerships";

export async function getOwnershipById(id: string): Promise<Ownership | null> {
  if (!/^[1-9]\d*$/.test(id)) return null;
  const response = await fetch(`${OWNERSHIPS_API_URL}/${id}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(12000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Biznes məlumatları yüklənmədi.");
  const payload = await response.json();
  if (payload.success === false) return null;
  if (!Number.isInteger(payload.id) || String(payload.id) !== id || typeof payload.title !== "string") throw new Error("Biznes API cavabı düzgün deyil.");
  return payload as Ownership;
}

export async function getOwnerships(): Promise<Ownership[]> {
  try {
    const response = await fetch(OWNERSHIPS_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as OwnershipsResponse;
    return payload.success === false || !Array.isArray(payload.data)
      ? []
      : payload.data;
  } catch (error) {
    console.error("Could not load Axtar.az ownerships:", error);
    return [];
  }
}
