// app/broker-analyzer/page.jsx
import BrokerAnalyzerClient from '@/components/BrokerAnalyzerClient';

const SITE_URL = "https://www.sharebazaaronline.com";

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "Broker Analyzer - Compare Top Stock Brokers in India 2026 | ShareBazaarOnline",
    description:
      "Compare top stock brokers in India side by side. Check brokerage charges, account opening fees, ratings, active users, and trading segments. Find the best broker for your trading needs.",

    alternates: {
      canonical: `${SITE_URL}/broker-analyzer`,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: "Broker Analyzer - Compare Top Stock Brokers in India",
      description:
        "Make the right choice by comparing brokerage charges, ratings, and features of India's top stock brokers side by side.",
      url: `${SITE_URL}/broker-analyzer`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title: "Broker Analyzer - Compare Stock Brokers",
      description:
        "Compare India's top stock brokers side by side. Check brokerage charges, ratings, and features.",
      images: [`${SITE_URL}/og-image.jpg`],
    },

    keywords:
      "Broker Analyzer, Compare Brokers, Stock Broker Comparison, Brokerage Charges, Best Stock Broker India, Discount Broker, Full Service Broker, ShareBazaarOnline",
  };
}

export default function BrokerAnalyzerPage() {
  const canonicalUrl = `${SITE_URL}/broker-analyzer`;
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",

    "@id": `${canonicalUrl}#webpage`,

    url: canonicalUrl,

    name:
      "Broker Analyzer - Compare Top Stock Brokers in India 2026 | ShareBazaarOnline",

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
        name: "Broker Analyzer",
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

      <BrokerAnalyzerClient />
    </>
  );
}
