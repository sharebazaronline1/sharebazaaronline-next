// app/corporateactions/rights/page.jsx
import { fetchCorporateActionsByAliases } from "@/lib/corporateActionData";
import CorporateActionsClient from "@/components/CorporateActionsClient";
import { getTabConfig } from "@/lib/corporateActionUtils";

const SITE_URL = "https://www.sharebazaaronline.com";
const TAB_CONFIG = getTabConfig("rights");

// ✅ CHANGED: Increased to 1 hour to reduce ISR writes
export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: "Rights Issue Calendar 2026 — Ratios, Prices, Dates | ShareBazaarOnline",
    description:
      "Track all upcoming rights issues in India. Get rights ratios, offer prices, discounts to market price, record dates, and ex-dates.",
    alternates: { canonical: `${SITE_URL}/corporateactions/rights` },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Rights Issue Calendar 2026 — Track Ratios, Prices & Dates",
      description:
        "Track all upcoming rights issues in India. Get rights ratios, offer prices, discounts to market price, record dates, and ex-dates.",
      url: `${SITE_URL}/corporateactions/rights`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Rights Issue Calendar 2026 — Track Ratios, Prices & Dates",
      description: "Track all upcoming rights issues in India.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    keywords:
      "Rights Issue, Rights Entitlement, Rights Ratio, Record Date, Ex-Date, Corporate Actions, ShareBazaarOnline",
  };
}

export default async function RightsPage() {
  const canonicalUrl = `${SITE_URL}/corporateactions/rights`;
  const records = await fetchCorporateActionsByAliases(TAB_CONFIG.aliases);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: "Rights Issue Calendar 2026 — Ratios, Prices, Dates | ShareBazaarOnline",
    description:
      "Track all upcoming rights issues in India. Get rights ratios, offer prices, discounts to market price, record dates, and ex-dates.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    about: { "@type": "Thing", name: "Rights Issues" },
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
        item: `${SITE_URL}/corporateactions`,
      },
      { "@type": "ListItem", position: 3, name: "Rights Issue", item: canonicalUrl },
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
      <CorporateActionsClient activeTab="rights" records={records} />
    </>
  );
}