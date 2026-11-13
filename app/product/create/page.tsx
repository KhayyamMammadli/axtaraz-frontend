import type { Metadata } from "next";
import { CreateListing } from "@/features/listings/create-listing";
import { cabinetListings } from "@/features/listings/data";
type Props = { searchParams: Promise<{ type?: string; edit?: string }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { type } = await searchParams;
  return { title: type === "lost" ? "Yeni itkin elan yarat" : type === "wanted" ? "Elan axtar" : "Yeni elan yerləşdir", robots: { index: false, follow: false } };
}
export default async function CreateProductPage({ searchParams }: Props) {
  const { type, edit } = await searchParams;
  const initialListing = edit ? cabinetListings.find(item => item.id === edit) : undefined;
  const variant = initialListing?.adType || (type === "lost" ? "lost" : type === "wanted" ? "wanted" : "offer");
  return <CreateListing key={`${variant}-${edit || "new"}`} variant={variant} initialListing={initialListing}/>;
}
