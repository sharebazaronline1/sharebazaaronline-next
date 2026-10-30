// app/corporate-actions/splits/page.jsx
import { fetchCorporateActionsByAliases } from "@/lib/corporateActionData";
import CorporateActionsClient from "@/components/CorporateActionsClient";
import { getTabConfig } from "@/lib/corporateActionUtils";

const SITE_URL = "https://www.sharebazaaronline.com";
const TAB_CONFIG = getTabConfig("splits");

// ✅ CHANGED: Increased to 1 hour to reduce ISR writes
export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: "Stock Split Calendar 2026: Ratios & Dates",
    description:
      "Track all upcoming stock splits in India. Get split ratios, old and new face values, record dates, ex-dates, and full analysis.",
    alternates: { canonical: `${SITE_URL}/corporate-actions/splits` },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Stock Split Calendar 2026 — Track Ratios & Record Dates",
      description:
        "Track all upcoming stock splits in India. Get split ratios, old and new face values, record dates, ex-dates, and full analysis.",
      url: `${SITE_URL}/corporate-actions/splits`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Stock Split Calendar 2026 — Track Ratios & Record Dates",
      description: "Track all upcoming stock splits in India.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    keywords:
      "Stock Split, Share Split, Split Ratio, Face Value, Record Date, Ex-Date, Corporate Actions, ShareBazaarOnline",
  };
}

export default async function SplitsPage() {
  const canonicalUrl = `${SITE_URL}/corporate-actions/splits`;
  const records = await fetchCorporateActionsByAliases(TAB_CONFIG.aliases);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: "Stock Split Calendar 2026 — Ratios, Record Dates | ShareBazaarOnline",
    description:
      "Track all upcoming stock splits in India. Get split ratios, old and new face values, record dates, ex-dates, and full analysis.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    about: { "@type": "Thing", name: "Stock Splits" },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.jpg`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Corporate Actions",
        item: `${SITE_URL}/corporate-actions`,
      },
      { "@type": "ListItem", position: 3, name: "Stock Split", item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <CorporateActionsClient activeTab="splits" records={records} />
    </>
  );
}