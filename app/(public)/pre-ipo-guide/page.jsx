// app/pre-ipo-guide/page.jsx

import UnlistedGuideClient from "@/components/UnlistedGuideClient";

const SITE_URL = "https://www.sharebazaaronline.com";

export const metadata = {
  title:
    "Unlisted Shares Guide",
  description:
    "Complete guide to unlisted shares in India. Learn about pre-IPO investing, valuation, taxation, risks, regulations, and how to buy unlisted shares. Expert insights for investors.",
  keywords:
    "unlisted shares, pre-IPO shares, unlisted shares India, buy unlisted shares, unlisted shares taxation, pre-IPO investing, unlisted shares guide",
  alternates: {
    canonical: `${SITE_URL}/pre-ipo-guide`,
  },
  authors: [
    { name: "Manjunath Talanki", url: `${SITE_URL}/about` },
  ],
  openGraph: {
    title: "Unlisted Shares Guide - Pre-IPO Investing, Taxation & Risks",
    description:
      "Complete guide to unlisted shares in India. Learn about pre-IPO investing, valuation, taxation, risks, and regulations.",
    url: `${SITE_URL}/pre-ipo-guide`,
    type: "article",
    images: [{ url: `${SITE_URL}/og-image.jpg` }],
    siteName: "ShareBazaarOnline",
    locale: "en_IN",
    authors: ["Manjunath Talanki"],
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
  const canonicalUrl = `${SITE_URL}/pre-ipo-guide`;

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
    datePublished: "2024-01-15",
    dateModified: "2026-10-13",
    articleSection: "Unlisted Shares Guide",
    inLanguage: "en-IN",
    author: {
      "@type": "Person",
      name: "Manjunath Talanki",
      jobTitle: "Founder & CEO",
      url: `${SITE_URL}/about`,
      image: `${SITE_URL}/images/team/manjunath-talanki.jpg`,
      sameAs: [
        "https://twitter.com/Sharebazaaronli",
        "https://www.linkedin.com/company/sharebazaaronline",
      ],
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/sharebazaar.png`,
        width: 512,
        height: 512,
      },
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