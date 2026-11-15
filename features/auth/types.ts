export type Customer = {
  id: number;
  name: string;
  last_name: string;
  full_name: string;
  email: string;
  mobile_number: string;
  logo: string | null;
  role: string;
  status: string;
  created_at: string;
};

export function parseCustomer(value: unknown): Customer {
  if (!value || typeof value !== "object") throw new Error("Profil məlumatları düzgün deyil.");
  const data = value as Record<string, unknown>;
  if (!Number.isInteger(data.id) || typeof data.name !== "string") throw new Error("Profil məlumatları düzgün deyil.");
  const text = (key: string) => typeof data[key] === "string" ? data[key] as string : "";
  let logo: string | null = null;
  if (text("logo")) {
    try { const url = new URL(text("logo"), "https://api.axtar.az"); if (["https:", "http:"].includes(url.protocol)) { if (url.hostname === "api.axtar.az") url.protocol = "https:"; logo = url.href; } } catch { /* Use the default avatar. */ }
  }
  return { id: data.id as number, name: text("name"), last_name: text("last_name"), full_name: text("full_name") || [text("name"), text("last_name")].filter(Boolean).join(" "), email: text("email"), mobile_number: text("mobile_number"), logo, role: text("role"), status: String(data.status ?? ""), created_at: text("created_at") };
}
