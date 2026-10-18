export type Ownership = {
  id: number;
  status: string;
  level: string;
  recommended: number | boolean;
  title: string;
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
