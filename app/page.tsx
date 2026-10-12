import type { Metadata } from "next";
import { HomePage } from "@/features/home/home-page";

export const metadata: Metadata = {
  title: "Elanlar, bizneslər və xidmətlər",
  description: "Axtar.az-da ən son elanları, premium biznesləri və faydalı bloqları kəşf edin.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HomePage />;
}
