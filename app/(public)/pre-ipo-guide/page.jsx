// app/unlisted-guide/page.jsx

import UnlistedGuideClient from "@/components/UnlistedGuideClient";

const SITE_URL = "https://www.sharebazaaronline.com";

export const metadata = {
  title:
    "Unlisted Shares Guide - Pre-IPO Investing, Taxation & Risks | ShareBazaarOnline",
  description:
    "Complete guide to unlisted shares in India. Learn about pre-IPO investing, valuation, taxation, risks, regulations, and how to buy unlisted shares. Expert insights for investors.",
  keywords:
    "unlisted shares, pre-IPO shares, unlisted shares India, buy unlisted shares, unlisted shares taxation, pre-IPO investing, unlisted shares guide",
  alternates: {
    canonical: `${SITE_URL}/unlisted-guide`,
  },
  openGraph: {
    title: "Unlisted Shares Guide - Pre-IPO Investing, Taxation & Risks",
    description:
      "Complete guide to unlisted shares in India. Learn about pre-IPO investing, valuation, taxation, risks, and regulations.",
    url: `${SITE_URL}/unlisted-guide`,
    type: "article",
    images: [{ url: `${SITE_URL}/og-image.jpg` }],
    siteName: "ShareBazaarOnline",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlisted Shares Guide - Pre-IPO Investing",
    description:
      "Complete guide to unlisted shares in India. Learn about pre-IPO investing, valuation, taxation, and risks.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function UnlistedGuidePage() {
  const canonicalUrl = `${SITE_URL}/unlisted-guide`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline:
      "Unlisted Shares Guide - Pre-IPO Investing, Taxation & Risks",
    description:
      "Complete guide to unlisted shares in India covering pre-IPO investing, valuation, taxation, risks, regulations, and how to buy unlisted shares.",
    url: canonicalUrl,
    image: [`${SITE_URL}/og-image.jpg`],
    articleSection: "Unlisted Shares Guide",
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
        name: "Unlisted Shares Guide",
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
          __html: safeJsonLd(breadcrumbSchema),
        }}
      />

      <UnlistedGuideClient />
    </>
  );
}