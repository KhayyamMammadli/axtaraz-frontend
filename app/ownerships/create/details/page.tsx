import type { Metadata } from "next";
import { BusinessEditor } from "@/features/ownerships/business-editor";
export const metadata: Metadata = { title: "Yeni biznes yarat", robots: { index: false, follow: false } };
export default async function BusinessDetailsPage({ searchParams }: { searchParams: Promise<{ package?: string; period?: string }> }) {
  const params = await searchParams;
  const plan = ["start", "business", "premium"].includes(params.package ?? "") ? params.package! : "business";
  const period = [30, 60, 90, 180].includes(Number(params.period)) ? Number(params.period) : 30;
  return <BusinessEditor initialPlan={plan} initialPeriod={period}/>;
}
