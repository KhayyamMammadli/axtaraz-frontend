import type { Metadata } from "next";
import { BusinessLanding } from "@/features/ownerships/business-landing";
export const metadata: Metadata = { title: "Biznesinizi Axtar.az-da yaradın", description: "Biznes səhifənizi yaradın, məhsul və xidmətlərinizi nümayiş etdirin." };
export default function BusinessCreatePage() { return <BusinessLanding/>; }
