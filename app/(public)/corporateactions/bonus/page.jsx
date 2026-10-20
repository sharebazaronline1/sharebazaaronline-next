// app/corporateactions/bonus/page.jsx
import { fetchCorporateActionsByAliases } from "@/lib/corporateActionData";
import CorporateActionsClient from "@/components/CorporateActionsClient";
import { getTabConfig } from "@/lib/corporateActionUtils";

const SITE_URL = "https://www.sharebazaaronline.com";
const TAB_CONFIG = getTabConfig("bonus");

export const revalidate = 300;

export async function generateMetadata() {
  return {
    title: "Bonus Issue Calendar 2026 — Ratios, Record Dates | ShareBazaarOnline",
    description:
      "Track upcoming bonus issues announced by Indian listed companies. Get bonus ratios, record dates, ex-dates, and full analysis.",
    alternates: { canonical: `${SITE_URL}/corporateactions/bonus` },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Bonus Issue Calendar 2026 — Track Ratios & Record Dates",
      description:
        "Track upcoming bonus issues announced by Indian listed companies. Get bonus ratios, record dates, ex-dates, and full analysis.",
      url: `${SITE_URL}/corporateactions/bonus`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Bonus Issue Calendar 2026 — Track Ratios & Record Dates",
      description:
        "Track upcoming bonus issues announced by Indian listed companies.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    keywords:
      "Bonus Issue, Bonus Shares, Bonus Ratio, Record Date, Ex-Date, Corporate Actions, ShareBazaarOnline",
  };
}

export default async function BonusPage() {
  const canonicalUrl = `${SITE_URL}/corporateactions/bonus`;
  const records = await fetchCorporateActionsByAliases(TAB_CONFIG.aliases);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: "Bonus Issue Calendar 2026 — Ratios, Record Dates | ShareBazaarOnline",
    description:
      "Track upcoming bonus issues announced by Indian listed companies. Get bonus ratios, record dates, ex-dates, and full analysis.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    about: { "@type": "Thing", name: "Bonus Issues" },
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
      { "@type": "ListItem", position: 3, name: "Bonus Issue", item: canonicalUrl },
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
      <CorporateActionsClient activeTab="bonus" records={records} />
    </>
  );
}