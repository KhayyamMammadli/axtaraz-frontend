import type { Metadata } from "next";
import { MessagesPage } from "@/features/messages/messages-page";

export const metadata: Metadata = {
  title: "Mesajlar",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MessagesPage />;
}
