// app/corporateactions/dividends/page.jsx
import { fetchCorporateActionsByAliases } from "@/lib/corporateActionData";
import CorporateActionsClient from "@/components/CorporateActionsClient";
import { getTabConfig } from "@/lib/corporateActionUtils";

const SITE_URL = "https://www.sharebazaaronline.com";
const TAB_CONFIG = getTabConfig("dividends");

// ✅ CHANGED: Increased to 1 hour to reduce ISR writes
export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: "Dividends Calendar 2026 — Record Dates, Ex-Dates & Yield | ShareBazaarOnline",
    description:
      "Track upcoming dividend announcements across Indian listed companies. Get the latest record dates, ex-dividend dates, payout amounts, and yield analysis.",
    alternates: { canonical: `${SITE_URL}/corporateactions/dividends` },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Dividends Calendar 2026 — Track Record Dates & Yields",
      description:
        "Track upcoming dividend announcements across Indian listed companies. Get the latest record dates, ex-dividend dates, payout amounts, and yield analysis.",
      url: `${SITE_URL}/corporateactions/dividends`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Dividends Calendar 2026 — Track Record Dates & Yields",
      description:
        "Track upcoming dividend announcements across Indian listed companies.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    keywords:
      "Dividends, Dividend Calendar, Record Date, Ex-Date, Yield, Dividend Yield, Indian Stocks, ShareBazaarOnline",
  };
}

export default async function DividendsPage() {
  const canonicalUrl = `${SITE_URL}/corporateactions/dividends`;
  const records = await fetchCorporateActionsByAliases(TAB_CONFIG.aliases);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: "Dividends Calendar 2026 — Record Dates, Ex-Dates & Yield | ShareBazaarOnline",
    description:
      "Track upcoming dividend announcements across Indian listed companies. Get the latest record dates, ex-dividend dates, payout amounts, and yield analysis.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    about: { "@type": "Thing", name: "Dividends" },
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Dividends",
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
      <CorporateActionsClient activeTab="dividends" records={records} />
    </>
  );
}