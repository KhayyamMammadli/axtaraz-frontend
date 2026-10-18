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

function toListing(product: Product): Listing {
  return {
    id: String(product.id),
    slug: product.id_slug,
    title: product.title,
    price: formatPrice(product.price),
    location: product.city_id === 1 ? "Bakı" : "",
    age: formatAge(product.started_at),
    image: product.image || product.images?.[0] || "",
    level: product.level || "simple",
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
