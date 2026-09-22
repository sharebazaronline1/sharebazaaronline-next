
// app/comparebrokers/page.jsx
import { Suspense } from "react";
import CompareBrokerClient from "@/components/CompareBrokerClient";

const SITE_URL = "https://www.sharebazaaronline.com";

export async function generateMetadata() {
  return {
    title:
      "Compare Best Stock Brokers in India 2026 - Brokerage Charges & Ratings | ShareBazaarOnline",

    description:
      "Compare top stock brokers in India side by side. Check brokerage charges, account opening fees, ratings, active users, and trading segments to find the best broker for your needs.",

    alternates: {
      canonical: `${SITE_URL}/comparebrokers`,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title:
        "Compare Top Stock Brokers in India - Brokerage & Fees Comparison",

      description:
        "Make the right choice by comparing brokerage charges, ratings, and features of India's top stock brokers side by side. Find the best broker for your trading needs.",

      url: `${SITE_URL}/comparebrokers`,
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

      title:
        "Compare Stock Brokers - Brokerage & Fees Comparison",

      description:
        "Compare India's top stock brokers side by side. Check brokerage charges, ratings, and features.",

      images: [`${SITE_URL}/og-image.jpg`],
    },

    keywords:
      "broker comparison, broker app, compare stock brokers, online broker comparison, compare stock broker, brokers with lowest fees, best broker for stock trading, broker comparison india, broker demat account, broker commodity, broker futures, broker options, broker type, demat account broker list, demat account comparison, top brokers comparison, best broker comparison, broker review, broker app, broker account opening, broker customer service, broker currency, broker equity, brokerage account comparison, how to choose the best broker, best brokers for beginner investors, broker for beginners, best demat account broker",
  };
}

export default function CompareBrokerPage() {
  const canonicalUrl = `${SITE_URL}/comparebrokers`;

  // ==========================================
  // JSON-LD STRUCTURED DATA
  // ==========================================

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",

    "@id": `${canonicalUrl}#webpage`,

    url: canonicalUrl,

    name:
      "Compare Best Stock Brokers in India 2026 - Brokerage Charges & Ratings | ShareBazaarOnline",

    description:
      "Compare top stock brokers in India side by side. Check brokerage charges, account opening fees, ratings, active users, and trading segments.",

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },

    about: {
      "@type": "Thing",
      name: "Stock Broker Comparison",
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
        name: "Compare Brokers",
        item: canonicalUrl,
      },
    ],
  };

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

      <Suspense fallback={null}>
        <CompareBrokerClient />
      </Suspense>
    </>
  );
}
