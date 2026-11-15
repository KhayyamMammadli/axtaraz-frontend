import { notFound, redirect } from "next/navigation";
import { getSessionCustomer } from "@/features/auth/server-session";
import { AccountCabinet } from "@/features/account/account-cabinet";

export default async function AccountPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!["profile", "listings", "businesses", "posts"].includes(section)) notFound();
  const customer = await getSessionCustomer();
  if (!customer) redirect("/login");
  return <AccountCabinet section={section} initialCustomer={customer}/>;
}
