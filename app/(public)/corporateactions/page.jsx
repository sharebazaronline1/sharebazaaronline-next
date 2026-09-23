
// app/corporateactions/page.jsx
import CorporateActionsClient from '@/components/CorporateActionsClient';

const SITE_URL = "https://www.sharebazaaronline.com";

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "Corporate Actions - Buyback, Dividends, Bonus, Split | ShareBazaarOnline",

    description:
      "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",

    alternates: {
      canonical: `${SITE_URL}/corporateactions`,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: "Corporate Actions Calendar - Track Buybacks, Dividends & More",

      description:
        "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",

      url: `${SITE_URL}/corporateactions`,
      type: "website",

      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
        },
      ],

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

// Main page component - SERVER COMPONENT
export default function CorporateActionsPage() {
  const canonicalUrl = `${SITE_URL}/corporateactions`;

  // ==========================================
  // WEBPAGE JSON-LD
  // ==========================================

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",

    "@id": `${canonicalUrl}#webpage`,

    url: canonicalUrl,

    name:
      "Corporate Actions - Buyback, Dividends, Bonus, Split | ShareBazaarOnline",

    description:
      "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },

    about: {
      "@type": "Thing",
      name: "Corporate Actions",
    },

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

  // ==========================================
  // BREADCRUMB JSON-LD
  // ==========================================

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    "@id": `${canonicalUrl}#breadcrumb`,

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Corporate Actions",
        item: canonicalUrl,
      },
    ],
  };

  /*
   * Safely serialize JSON-LD.
   *
   * Prevents a "<" character inside dynamic values
   * from interfering with the script element.
   */
  const webPageSchemaJson = JSON.stringify(webPageSchema).replace(
    /</g,
    "\\u003c"
  );

  const breadcrumbSchemaJson = JSON.stringify(breadcrumbSchema).replace(
    /</g,
    "\\u003c"
  );

  return (
    <>
      {/* WebPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: webPageSchemaJson,
        }}
      />

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchemaJson,
        }}
      />

      <CorporateActionsClient />
    </>
  );
}
