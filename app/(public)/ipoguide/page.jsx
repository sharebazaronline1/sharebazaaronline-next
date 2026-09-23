// app/ipoguide/page.jsx

import IPOGuideClient from "@/components/IPOGuideClient";

const SITE_URL = "https://www.sharebazaaronline.com";

export const metadata = {
  title:
    "IPO Guide 2026 - Complete Guide to IPO Investing in India | ShareBazaarOnline",
  description:
    "Complete IPO guide for Indian investors. Learn about IPO types, allotment process, GMP, SME IPOs, taxation, and how to apply for IPOs online. Get expert insights on ShareBazaarOnline.",
  alternates: {
    canonical: `${SITE_URL}/ipoguide`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "IPO Guide - Master IPO Investing in India",
    description:
      "Learn everything about IPO investing in India. Complete guide covering IPO types, allotment, GMP, SME IPOs, taxation, and application process.",
    url: `${SITE_URL}/ipoguide`,
    type: "article",
    images: [{ url: `${SITE_URL}/og-image.jpg` }],
    siteName: "ShareBazaarOnline",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPO Guide - Complete IPO Investing Guide",
    description:
      "Learn everything about IPO investing in India. Complete guide for beginners and experienced investors.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  keywords:
    "IPO Guide, IPO Investing, IPO Allotment, SME IPO, IPO GMP, IPO Taxation, How to apply IPO, ShareBazaarOnline",
};

export default function IPOGuidePage() {
  const canonicalUrl = `${SITE_URL}/ipoguide`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline:
      "IPO Guide 2026 - Complete Guide to IPO Investing in India",
    description:
      "Complete IPO guide for Indian investors covering IPO types, allotment, GMP, SME IPOs, taxation, and how to apply for IPOs online.",
    url: canonicalUrl,
    image: [`${SITE_URL}/og-image.jpg`],
    articleSection: "IPO Guide",
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${canonicalUrl}#howto`,
    name: "How to Apply for an IPO in India",
    description:
      "Step-by-step guide to applying for an IPO in India using UPI or ASBA.",
    totalTime: "PT15M",
    supply: [
      {
        "@type": "HowToSupply",
        name: "PAN Card",
      },
      {
        "@type": "HowToSupply",
        name: "Bank Account",
      },
      {
        "@type": "HowToSupply",
        name: "Demat Account",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "UPI-enabled banking app",
      },
      {
        "@type": "HowToTool",
        name: "IPO application platform",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose an IPO",
        text: "Review the IPO details, price band, lot size, dates, and company information.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Open the IPO application",
        text: "Open the IPO application section through your broker or supported investment platform.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter your bid details",
        text: "Enter the required investor information, quantity, and bid price.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Submit the application",
        text: "Submit your IPO application using the available application method.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Complete the UPI mandate or ASBA process",
        text: "Complete the required payment authorization or ASBA blocking process.",
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Check IPO allotment",
        text: "Check the IPO allotment status after the allotment process is completed.",
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
        name: "IPO Guide",
        item: canonicalUrl,
      },
    ],
  };

  const safeJsonLd = (schema) =>
    JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(articleSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(howToSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(breadcrumbSchema),
        }}
      />

      <IPOGuideClient />
    </>
  );
}