// app/ipo/[id]/[slug]/page.jsx

import { notFound } from "next/navigation";
import { fetchIPOs } from "@/api/mockApi";
import IPODetailsClient from "@/components/IPODetailsClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.sharebazaaronline.com";

// Slugify helper function
function slugify(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Server-side function to fetch IPO data
async function getIPOData(id) {
  try {
    const ipos = await fetchIPOs();

    const selected = ipos.find(
      (ipo) => String(ipo.id) === String(id)
    );

    if (!selected) {
      return null;
    }

    return {
      ...selected,
      about_company: selected.about_company || {},
      ipo_basic_details: selected.ipo_basic_details || {},
      important_dates: selected.important_dates || {},
      investor_reservation: selected.investor_reservation || {},
      market_lot_details: selected.market_lot_details || {},
      key_indicators: selected.key_indicators || {},
      financials: selected.financials || { data: [] },
      gmp: selected.gmp || {},
      subscription: selected.subscription || {},
      intermediaries: selected.intermediaries || {},
      company_info: selected.company_info || {},
      strengths: selected.strengths || [],
      risks: selected.risks || [],
      ipo_objectives: selected.ipo_objectives || [],
      lead_managers: selected.lead_managers || [],
      documents: selected.documents || [],
      faq: selected.faq || [],
    };
  } catch (error) {
    console.error("Error fetching IPO data:", error);
    return null;
  }
}

// Generate static params for SSG
export async function generateStaticParams() {
  try {
    const ipos = await fetchIPOs();

    return ipos.map((ipo) => {
      const name = ipo.name || ipo.fullName || "";
      const slug = slugify(name);

      return {
        id: String(ipo.id),
        slug,
      };
    });
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { id, slug } = await params;
  const ipo = await getIPOData(id);

  if (!ipo) {
    return {
      title: "IPO Not Found | ShareBazaarOnline",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const ipoName = ipo.name || ipo.fullName || "IPO";

  const priceBand =
    ipo.ipo_basic_details?.price_band_min &&
    ipo.ipo_basic_details?.price_band_max
      ? `₹${ipo.ipo_basic_details.price_band_min} - ₹${ipo.ipo_basic_details.price_band_max}`
      : "";

  const description =
    typeof ipo.about_company?.description === "string"
      ? ipo.about_company.description.slice(0, 160)
      : `Get complete details about ${ipoName} IPO including price band, lot size, financials, GMP, and subscription data.`;

  const canonical = `${SITE_URL}/ipo/${id}/${slug}`;

  const imageUrl = ipo.logo
    ? ipo.logo.startsWith("http")
      ? ipo.logo
      : `${SITE_URL}${ipo.logo.startsWith("/") ? "" : "/"}${ipo.logo}`
    : `${SITE_URL}/og-image.jpg`;

  const ipoDate =
    ipo.ipo_basic_details?.issue_open_date ||
    ipo.created_at ||
    undefined;

  return {
    title: `${ipoName} IPO - Price Band ${priceBand}, Lot Size, GMP & Details | ShareBazaarOnline`,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: `${ipoName} IPO - Complete Details`,
      description,
      url: canonical,
      type: "article",
      images: [{ url: imageUrl }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
      ...(ipoDate ? { publishedTime: ipoDate } : {}),
      ...(ipo.updated_at ? { modifiedTime: ipo.updated_at } : {}),
    },

    twitter: {
      card: "summary_large_image",
      title: `${ipoName} IPO - Price, Lot Size & GMP`,
      description,
      images: [imageUrl],
    },
  };
}

// Main page component - SERVER COMPONENT
export default async function Page({ params }) {
  const { id, slug } = await params;

  const ipo = await getIPOData(id);

  if (!ipo) {
    notFound();
  }

  const ipoName = ipo.name || ipo.fullName || "IPO";
  const canonicalUrl = `${SITE_URL}/ipo/${id}/${slug}`;

  const priceMin = ipo.ipo_basic_details?.price_band_min;
  const priceMax = ipo.ipo_basic_details?.price_band_max;

  const description =
    typeof ipo.about_company?.description === "string"
      ? ipo.about_company.description.slice(0, 160)
      : `Complete details about ${ipoName} IPO including price band, lot size, GMP, financials, and subscription data.`;

  const imageUrl = ipo.logo
    ? ipo.logo.startsWith("http")
      ? ipo.logo
      : `${SITE_URL}${ipo.logo.startsWith("/") ? "" : "/"}${ipo.logo}`
    : `${SITE_URL}/og-image.jpg`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: `${ipoName} IPO - Price, Lot Size, GMP & Details`,
    description,
    url: canonicalUrl,
    image: [imageUrl],
    articleSection: "IPO",
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
    ...(ipo.ipo_basic_details?.issue_open_date
      ? {
          datePublished:
            ipo.ipo_basic_details.issue_open_date,
        }
      : ipo.created_at
        ? {
            datePublished: ipo.created_at,
          }
        : {}),
    ...(ipo.updated_at
      ? {
          dateModified: ipo.updated_at,
        }
      : {}),
  };

  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "@id": `${canonicalUrl}#financialproduct`,
    name: `${ipoName} IPO`,
    description,
    url: canonicalUrl,
    category: "IPO",
    brand: {
      "@type": "Brand",
      name: ipoName,
    },
    ...(priceMin && priceMax
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            lowPrice: Number(priceMin),
            highPrice: Number(priceMax),
            availability:
              "https://schema.org/InStock",
            url: canonicalUrl,
          },
        }
      : {}),
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
        name: "IPO Tracker",
        item: `${SITE_URL}/ipo`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${ipoName} IPO`,
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
          __html: safeJsonLd(financialProductSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(breadcrumbSchema),
        }}
      />

      <IPODetailsClient
        initialIpo={ipo}
        id={id}
        slug={slug}
      />
    </>
  );
}