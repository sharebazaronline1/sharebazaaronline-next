// app/skill-up/page.jsx
import SkillUpClient from "@/components/SkillUpClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.sharebazaaronline.com";

export const metadata = {
  title: "SkillUp - Stock Market Courses & Trading Education | ShareBazaarOnline",
  description:
    "Master stock market investing, trading strategies, IPO analysis, and financial literacy with expert-led courses. Launching early 2026 on ShareBazaarOnline.",
  keywords:
    "stock market courses, trading education, IPO analysis, financial literacy, investing courses, ShareBazaarOnline SkillUp",
  alternates: {
    canonical: `${SITE_URL}/skill-up`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SkillUp - Stock Market Courses & Trading Education",
    description:
      "Master stock market investing, trading strategies, IPO analysis, and financial literacy with expert-led courses.",
    url: `${SITE_URL}/skill-up`,
    type: "website",
    siteName: "ShareBazaarOnline",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillUp - Stock Market Courses & Trading Education",
    description:
      "Master stock market investing, trading strategies, IPO analysis, and financial literacy with expert-led courses.",
  },
};

export const revalidate = 3600;

export default function SkillUpPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/skill-up#webpage`,
    url: `${SITE_URL}/skill-up`,
    name: "SkillUp - Stock Market Courses & Trading Education",
    description:
      "Master stock market investing, trading strategies, IPO analysis, and financial literacy with expert-led courses. Launching early 2026.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "ShareBazaarOnline",
    },
    about: {
      "@type": "Thing",
      name: "Stock Market Education and Financial Literacy",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        name: "SkillUp",
        item: `${SITE_URL}/skill-up`,
      },
    ],
  };

  const safeJsonLd = (schema) =>
    JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />

      <SkillUpClient />
    </>
  );
}