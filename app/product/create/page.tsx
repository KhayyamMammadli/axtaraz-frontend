import type { Metadata } from "next";
import { CreateListing } from "@/features/listings/create-listing";
type Props = { searchParams: Promise<{ type?: string }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { type } = await searchParams;
  return { title: type === "lost" ? "Yeni itkin elan yarat" : type === "wanted" ? "Elan axtar" : "Yeni elan yerləşdir", robots: { index: false, follow: false } };
}
export default async function CreateProductPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const variant = type === "lost" ? "lost" : type === "wanted" ? "wanted" : "offer";
  return <CreateListing key={variant} variant={variant}/>;
}
