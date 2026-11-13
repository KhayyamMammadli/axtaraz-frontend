import { listings as fallbackListings, type Listing } from "./data";

type Product = {
  id: number;
  id_slug: string;
  title: string;
  description?: string;
  price: number | string;
  image: string;
  images?: string[];
  city_id?: number | null;
  level?: string;
  status?: string;
  started_at?: string;
};

type ProductsResponse = {
  data?: Product[];
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
  success?: boolean;
};

const PRODUCTS_API_URL = "https://api.axtar.az/api/products";

function formatPrice(value: number | string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return String(value);
  return `${new Intl.NumberFormat("az-AZ", { maximumFractionDigits: 2 }).format(amount)} ₼`;
}

function formatAge(value?: string) {
  if (!value) return "";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "";

  const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
  if (days === 0) return "Bu gün";
  if (days === 1) return "Dünən";
  if (days < 7) return `${days} gün əvvəl`;
  if (days < 30) return `${Math.floor(days / 7)} həftə əvvəl`;
  if (days < 365) return `${Math.floor(days / 30)} ay əvvəl`;
  return `${Math.floor(days / 365)} il əvvəl`;
}

export function toListing(product: Product): Listing {
  return {
    id: String(product.id),
    slug: product.id_slug,
    title: product.title,
    price: formatPrice(product.price),
    location: product.city_id === 1 ? "Bakı" : "",
    age: formatAge(product.started_at),
    image: product.image || product.images?.[0] || "",
    level: product.level || "simple",
    description: product.description,
  };
}

export async function getProductBySlug(slug: string): Promise<{ listing: Listing; related: Listing[] } | null> {
  if (!slug || slug.length > 300 || /[\s/\\?#]/.test(slug)) return null;
  const response = await fetch(`${PRODUCTS_API_URL}/${encodeURIComponent(slug)}`, { headers: { Accept: "application/json" }, next: { revalidate: 60 }, signal: AbortSignal.timeout(12000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Elan məlumatları yüklənmədi.");
  const payload = await response.json();
  if (payload.success === false) return null;
  const params = payload.params;
  if (!Number.isInteger(payload.id) || payload.id_slug !== slug || !params || typeof params.title !== "string" || !["string", "number"].includes(typeof params.price)) throw new Error("Elan API cavabı düzgün deyil.");
  const images: string[] = (Array.isArray(params.images_full) && params.images_full.length ? params.images_full : Array.isArray(params.images) && params.images.length ? params.images : params.image ? [params.image] : []).filter((image: unknown) => typeof image === "string" && image);
  const owner = payload.ownership || payload.customer;
  const sellerName = owner ? owner.title || [owner.name, owner.last_name].filter(Boolean).join(" ") : "";
  const latitude = Number(params.latitude), longitude = Number(params.longitude);
  return {
    listing: {
      id: String(payload.id), slug: payload.id_slug, title: params.title, price: formatPrice(params.price),
      description: params.description || "", location: typeof params.city?.title === "string" ? params.city.title : "",
      image: images[0] || "", images, age: formatAge(payload.started_at || payload.created_at), level: payload.level || "simple",
      category: payload.category?.title || "", phone: params.contact_number || "", address: params.address || "",
      subway: params.subway?.title || "", views: typeof payload.view_count === "number" ? payload.view_count : 0,
      ...(params.latitude != null && params.longitude != null && Number.isFinite(latitude) && Math.abs(latitude) <= 90 && Number.isFinite(longitude) && Math.abs(longitude) <= 180 ? { latitude, longitude } : {}),
      ...(sellerName ? { seller: { id: owner.id, name: sellerName, image: owner.logo ? new URL(owner.logo, "https://api.axtar.az").href : undefined, href: payload.ownership ? `/ownerships/${owner.id}` : `/seller/${owner.id}` } } : {}),
      breadcrumb: Array.isArray(payload.breadcrumb) ? payload.breadcrumb.filter((item: { id: number; title: string }) => Number.isInteger(item.id) && typeof item.title === "string") : [],
    },
    related: Array.isArray(payload.same_category) ? payload.same_category.filter((product: Product) => product.id !== payload.id && (!product.status || product.status === "active")).map(toListing) : [],
  };
}

export async function getProducts(): Promise<Listing[]> {
  try {
    const response = await fetch(PRODUCTS_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) return fallbackListings;

    const payload = (await response.json()) as ProductsResponse;
    if (payload.success === false || !Array.isArray(payload.data)) {
      return fallbackListings;
    }

    return payload.data
      .filter((product) => !product.status || product.status === "active")
      .map(toListing);
  } catch (error) {
    console.error("Could not load Axtar.az products:", error);
    return fallbackListings;
  }
}
