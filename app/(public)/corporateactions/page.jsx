// app/corporateactions/page.jsx
import { fetchCorporateActionsByAliases } from "@/lib/corporateActionData";
import CorporateActionsClient from "@/components/CorporateActionsClient";
import { getTabConfig } from "@/lib/corporateActionUtils";

const SITE_URL = "https://www.sharebazaaronline.com";
const TAB_CONFIG = getTabConfig("buyback");

// Increased to 1 hour to reduce ISR writes
export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title:
      "Corporate Actions - Buyback, Dividends, Bonus, Split | ShareBazaarOnline",
    description:
      "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",
    alternates: {
      canonical: `${SITE_URL}/corporateactions`,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Corporate Actions Calendar - Track Buybacks, Dividends & More",
      description:
        "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",
      url: `${SITE_URL}/corporateactions`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Corporate Actions Calendar - Track All Corporate Events",
      description:
        "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    keywords:
      "Corporate Actions, Buyback, Dividends, Bonus Issue, Stock Split, Rights Issue, Record Date, Ex Date, Corporate Events, ShareBazaarOnline",
  };
}

export default async function CorporateActionsPage() {
  const canonicalUrl = `${SITE_URL}/corporateactions`;
  const records = await fetchCorporateActionsByAliases(TAB_CONFIG.aliases);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: "Corporate Actions - Buyback, Dividends, Bonus, Split | ShareBazaarOnline",
    description:
      "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    about: { "@type": "Thing", name: "Corporate Actions" },
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
        item: canonicalUrl,
      },
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
      <CorporateActionsClient activeTab="buyback" records={records} />
    </>
  );
}