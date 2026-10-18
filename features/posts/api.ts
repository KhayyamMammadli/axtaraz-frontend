export type BlogAuthor = {
  id: number;
  name?: string | null;
  last_name?: string | null;
  logo?: string | null;
  created_at?: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  attachment?: string | null;
  attachment_full?: string | null;
  status?: string;
  view_count?: number;
  ownership_id?: number | null;
  created_by?: BlogAuthor | null;
  ownership?: unknown;
  created_at?: string;
};

type PostsResponse = {
  data?: BlogPost[];
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
  success?: boolean;
};

const POSTS_API_URL = "https://api.axtar.az/api/posts";

export function getPostAuthor(post: BlogPost): string {
  return [post.created_by?.name, post.created_by?.last_name]
    .filter(Boolean)
    .join(" ");
}

export function getPostImage(post: BlogPost): string {
  return post.attachment || post.attachment_full || "";
}

export function formatPostDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(POSTS_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as PostsResponse;
    if (payload.success === false || !Array.isArray(payload.data)) return [];

    return payload.data.filter(
      (post) => post.status === undefined || post.status === "active",
    );
  } catch (error) {
    console.error("Could not load Axtar.az posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
