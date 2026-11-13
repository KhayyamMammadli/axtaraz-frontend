import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/features/listings/api";
import { ProductDetail } from "@/features/listings/product-detail";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = (await getProductBySlug(slug))?.listing;
  return { title: item?.title || "Elan tapılmadı" };
}
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getProductBySlug(slug);
  if (!detail) notFound();
  return <ProductDetail listing={detail.listing} related={detail.related.slice(0, 15)}/>;
}
