import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const siteUrl = "https://axtar.az";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Axtar.az — Azərbaycanın elan platforması", template: "%s | Axtar.az" },
  description: "Axtar.az-da yeni və işlənmiş məhsullar, xidmətlər, daşınmaz əmlak və biznes elanlarını axtarın. Alış-verişinizi rahatlıqla edin.",
  applicationName: "Axtar.az",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "az_AZ",
    siteName: "Axtar.az",
    title: "Axtar.az — Azərbaycanın elan platforması",
    description: "Elanlar, bizneslər və faydalı bloqlar bir ünvanda.",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image", title: "Axtar.az — Azərbaycanın elan platforması", description: "Elanlar, bizneslər və faydalı bloqlar bir ünvanda." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#ffffff" };

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Axtar.az",
  url: siteUrl,
  logo: "https://axtar.az/img/logo.svg",
  areaServed: { "@type": "Country", name: "Azerbaijan" },
  sameAs: ["https://www.instagram.com/axtar.az/"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Axtar.az",
  url: siteUrl,
  inLanguage: "az",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/full-search?title={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="az">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
