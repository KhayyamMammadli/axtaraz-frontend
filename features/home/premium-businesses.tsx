import { getOwnerships } from "@/features/ownerships/api";
import { PremiumBusinessesCarousel } from "./premium-businesses-carousel";

export async function PremiumBusinesses() {
  const businesses = (await getOwnerships()).filter(
    (business) => business.status === "active",
  );

  if (businesses.length === 0) return null;

  return <PremiumBusinessesCarousel businesses={businesses} />;
}
