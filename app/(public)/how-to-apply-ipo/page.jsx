// app/how-to-apply-ipo/page.jsx
import HowToApplyIPOClient from '@/components/HowToApplyIPOClient';

const SITE_URL = "https://www.sharebazaaronline.com";

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "How to Apply for IPO - Step by Step Guide 2026 | ShareBazaarOnline",

    description:
      "Learn how to apply for IPO online in India through UPI & ASBA. Complete step-by-step guide with multiple bids, allotment process, and important tips for retail investors.",

    alternates: {
      canonical: `${SITE_URL}/how-to-apply-ipo`,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title:
        "How to Apply for IPO - Complete Guide for Indian Investors",

      description:
        "Learn how to apply for IPO online in India through UPI & ASBA. Complete step-by-step guide with multiple bids, allotment process, and important tips.",

      url: `${SITE_URL}/how-to-apply-ipo`,
      type: "article",

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
        "How to Apply for IPO - Step by Step Guide",

      description:
        "Learn how to apply for IPO online in India through UPI & ASBA. Complete guide for retail investors.",

      images: [`${SITE_URL}/og-image.jpg`],
    },

    keywords:
      "IPO Application, How to apply IPO, IPO process, UPI IPO, ASBA IPO, IPO allotment, IPO bidding, IPO for beginners, ShareBazaarOnline",
  };
}

// Main page component - SERVER COMPONENT
export default function HowToApplyIPOPage() {
  const canonicalUrl = `${SITE_URL}/how-to-apply-ipo`;

  // ==========================================
  // ARTICLE JSON-LD
  // ==========================================

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",

    "@id": `${canonicalUrl}#article`,

    headline:
      "How to Apply for IPO - Step by Step Guide 2026 | ShareBazaarOnline",

    description:
      "Learn how to apply for IPO online in India through UPI & ASBA. Complete step-by-step guide with multiple bids, allotment process, and important tips for retail investors.",

    url: canonicalUrl,

    image: [`${SITE_URL}/og-image.jpg`],

    articleSection: "IPO Guide",

    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },

    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
      url: canonicalUrl,
    },
  };

  // ==========================================
  // HOWTO JSON-LD
  // ==========================================

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",

    "@id": `${canonicalUrl}#howto`,

    name: "How to Apply for an IPO in India",

    description:
      "Step-by-step guide to applying for an IPO in India using UPI and ASBA.",

    totalTime: "PT15M",

    tool: [
      {
        "@type": "HowToTool",
        name: "UPI-enabled bank account",
      },
      {
        "@type": "HowToTool",
        name: "Demat account",
      },
    ],

    supply: [
      {
        "@type": "HowToSupply",
        name: "PAN card",
      },
      {
        "@type": "HowToSupply",
        name: "Bank account",
      },
    ],

    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose an IPO",
        text: "Select the IPO you want to apply for and check its price band, lot size, dates, and other offer details.",
        url: `${canonicalUrl}#step-1`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Open the IPO application",
        text: "Open the IPO application section through your broker or supported IPO application platform.",
        url: `${canonicalUrl}#step-2`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter your bid details",
        text: "Enter the required quantity and bid price according to the IPO price band and lot size.",
        url: `${canonicalUrl}#step-3`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Submit the application",
        text: "Review the application details and submit the IPO bid.",
        url: `${canonicalUrl}#step-4`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Complete UPI mandate or ASBA process",
        text: "Complete the applicable UPI mandate or ASBA authorization to block the required funds.",
        url: `${canonicalUrl}#step-5`,
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Check IPO allotment",
        text: "After the allotment process, check whether shares have been allotted to your application.",
        url: `${canonicalUrl}#step-6`,
      },
    ],
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
        name: "How to Apply for IPO",
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
  const articleSchemaJson = JSON.stringify(articleSchema).replace(
    /</g,
    "\\u003c"
  );

  const howToSchemaJson = JSON.stringify(howToSchema).replace(
    /</g,
    "\\u003c"
  );

  const breadcrumbSchemaJson = JSON.stringify(breadcrumbSchema).replace(
    /</g,
    "\\u003c"
  );

  return (
    <>
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: articleSchemaJson,
        }}
      />

      {/* HowTo JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: howToSchemaJson,
        }}
      />

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchemaJson,
        }}
      />

      <HowToApplyIPOClient />
    </>
  );
}

