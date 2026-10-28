// app/ipo/[id]/[slug]/page.jsx

import { notFound, permanentRedirect } from "next/navigation";
import { fetchIPOs } from "@/api/mockApi";
import IPODetailsClient from "@/components/IPODetailsClient";
import { cache } from "react"; 

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.sharebazaaronline.com";

export const revalidate = 604800;
export const dynamicParams = true;

function slugify(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ✅ NEW HELPER: Strip redundant "IPO" from the company name
function cleanIPOName(name) {
  if (!name) return "";
  return name.replace(/\s*IPO\s*$/i, "").trim();
}

// ✅ NEW HELPER: Remove duplicate currency symbols
function cleanPrice(price) {
  if (!price) return "";
  return String(price).replace(/₹/g, "").trim();
}

function getIPOName(ipo) {
  return (
    ipo.name ||
    ipo.fullName ||
    ipo.company_information?.company_name ||
    ipo.company_name ||
    "IPO"
  );
}

function getOfficialSlug(ipo) {
  if (ipo.slug && ipo.slug.trim() !== "") {
    return ipo.slug.trim();
  }
  return slugify(getIPOName(ipo));
}

const getIPOData = cache(async (id) => {
  try {
    const ipos = await fetchIPOs();
    const selected = ipos.find((ipo) => String(ipo.id) === String(id));

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
});

function buildIPODescription(ipo, ipoName) {
  const rawDesc = ipo.about_company?.description;
  let baseDesc = "";

  if (typeof rawDesc === "string" && rawDesc.trim().length > 20) {
    baseDesc = rawDesc.replace(/\s+/g, " ").trim();
  }

  if (baseDesc.length < 50) {
    const priceMin = ipo.ipo_basic_details?.price_band_min;
    const priceMax = ipo.ipo_basic_details?.price_band_max;
    const lotSize = ipo.ipo_basic_details?.lot_size || ipo.market_lot_details?.retail_minimum?.shares;
    const openDate = ipo.ipo_basic_details?.issue_open_date || ipo.important_dates?.ipo_open_date;

    const parts = [`${ipoName} IPO complete details.`];
    
    if (priceMin && priceMax) parts.push(`Price Band: ₹${priceMin} - ₹${priceMax}.`);
    if (lotSize) parts.push(`Lot Size: ${lotSize} shares.`);
    if (openDate) parts.push(`Opens: ${openDate}.`);

    if (parts.length === 1) {
      parts.push(`Track live GMP, subscription status, allotment, and financial details on ShareBazaarOnline.`);
    } else {
      parts.push(`Track live GMP, subscription, and allotment.`);
    }

    baseDesc = parts.join(" ");
  }

  if (baseDesc.length > 155) {
    baseDesc = baseDesc.substring(0, 155);
    const lastSpace = baseDesc.lastIndexOf(" ");
    if (lastSpace > 130) {
      baseDesc = baseDesc.substring(0, lastSpace);
    }
    baseDesc = baseDesc.replace(/[,.;:]$/, "") + "...";
  }

  return baseDesc;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const ipo = await getIPOData(id);

  if (!ipo) {
    return {
      title: "IPO Not Found",
      robots: { index: false, follow: false },
    };
  }

  const rawIpoName = getIPOName(ipo);
  const ipoName = cleanIPOName(rawIpoName);
  
  const officialSlug = getOfficialSlug(ipo);
  const canonical = `${SITE_URL}/ipo/${id}/${officialSlug}`;
  const description = buildIPODescription(ipo, ipoName);

  // ✅ CHANGED: Title is now just the company name + IPO. 
  // Root layout will append " | ShareBazaarOnline"
  const pageTitle = `${ipoName} IPO`;

  const imageUrl = ipo.logo
    ? ipo.logo.startsWith("http")
      ? ipo.logo
      : `${SITE_URL}${ipo.logo.startsWith("/") ? "" : "/"}${ipo.logo}`
    : `${SITE_URL}/og-image.jpg`;

  const ipoDate = ipo.ipo_basic_details?.issue_open_date || ipo.created_at || undefined;

  return {
    title: pageTitle,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: pageTitle,
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
      title: pageTitle,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }) {
  const { id, slug } = await params;
  const ipo = await getIPOData(id);

  if (!ipo) {
    notFound();
  }

  const rawIpoName = getIPOName(ipo);
  const ipoName = cleanIPOName(rawIpoName);
  const officialSlug = getOfficialSlug(ipo);

  if (slug.toLowerCase() !== officialSlug.toLowerCase()) {
    permanentRedirect(`/ipo/${encodeURIComponent(String(id))}/${officialSlug}`);
  }

  const canonicalUrl = `${SITE_URL}/ipo/${id}/${officialSlug}`;
  const description = buildIPODescription(ipo, ipoName);

  const priceMin = ipo.ipo_basic_details?.price_band_min;
  const priceMax = ipo.ipo_basic_details?.price_band_max;

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
      ? { datePublished: ipo.ipo_basic_details.issue_open_date }
      : ipo.created_at
        ? { datePublished: ipo.created_at }
        : {}),
    ...(ipo.updated_at ? { dateModified: ipo.updated_at } : {}),
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
            availability: "https://schema.org/InStock",
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(financialProductSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />
      <IPODetailsClient initialIpo={ipo} id={id} slug={officialSlug} />
    </>
  );
}