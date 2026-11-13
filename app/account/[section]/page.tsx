import { notFound } from "next/navigation";
import { AccountCabinet } from "@/features/account/account-cabinet";

export default async function AccountPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!["profile", "listings", "businesses", "posts"].includes(section)) notFound();
  return <AccountCabinet section={section}/>;
}
