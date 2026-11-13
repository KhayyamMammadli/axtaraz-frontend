import { notFound } from "next/navigation";
import { getOwnershipById } from "@/features/ownerships/api";
import { BusinessProfile } from "@/features/ownerships/business-profile";

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getOwnershipById(id);
  if (!business) notFound();
  return <BusinessProfile business={business}/>;
}
