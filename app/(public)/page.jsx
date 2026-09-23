// app/page.jsx

import Home from "../../src/components/home/Home";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.sharebazaaronline.com";

export const metadata = {
  title:
    "ShareBazaarOnline | IPO Tracker, Unlisted Shares & Broker Comparison",
  description:
    "Track IPOs, GMP, IPO allotment status, unlisted shares, corporate actions, broker comparisons and investment insights in one place.",

  alternates: {
    canonical: `${siteUrl}/`,
  },

  openGraph: {
    title: "ShareBazaarOnline",
    description:
      "India's platform for IPO tracking, unlisted shares and investment research.",
    url: `${siteUrl}/`,
    siteName: "ShareBazaarOnline",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ShareBazaarOnline",
    description:
      "IPO Tracker, Unlisted Shares, Broker Comparison and Investment Insights.",
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function Page() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "ShareBazaarOnline",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/og-image.jpg`,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "ShareBazaarOnline",
    url: `${siteUrl}/`,
    description:
      "India's platform for IPO tracking, unlisted shares and investment research.",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: `${siteUrl}/`,
    name:
      "ShareBazaarOnline | IPO Tracker, Unlisted Shares & Broker Comparison",
    description:
      "Track IPOs, GMP, IPO allotment status, unlisted shares, corporate actions, broker comparisons and investment insights in one place.",
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@type": "Thing",
      name: "Indian IPO and Investment Research",
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
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
          __html: safeJsonLd(organizationSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(websiteSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(webPageSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(breadcrumbSchema),
        }}
      />

      <Home />
    </>
  );
}