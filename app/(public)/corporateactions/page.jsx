// app/corporateactions/page.jsx
import { createClient } from "@supabase/supabase-js";
import CorporateActionsClient from '@/components/CorporateActionsClient';

const SITE_URL = "https://www.sharebazaaronline.com";

// Anonymous client — no cookies, safe for RSC / SSR
const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

// Revalidate every 5 minutes
export const revalidate = 300;

// ==========================================
// SERVER-SIDE DATA FETCH
// ==========================================

async function getCorporateActions() {
  try {
    const { data, error } = await supabasePublic
      .from("corporate_actions")
      .select(
        `
        *,
        blog:blogs (
          id,
          slug,
          heading
        )
      `
      )
      .order("ex_date", { ascending: false })
      .limit(2000);

    if (error) {
      console.error("[getCorporateActions] supabase error:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("[getCorporateActions] exception:", err?.message || err);
    return [];
  }
}

// ==========================================
// METADATA
// ==========================================

export async function generateMetadata() {
  return {
    title: "Corporate Actions - Buyback, Dividends, Bonus, Split | ShareBazaarOnline",

    description:
      "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",

    alternates: {
      canonical: `${SITE_URL}/corporateactions`,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: "Corporate Actions Calendar - Track Buybacks, Dividends & More",

      description:
        "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",

      url: `${SITE_URL}/corporateactions`,
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

      title: "Corporate Actions Calendar - Track All Corporate Events",

      description:
        "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more.",

      images: [`${SITE_URL}/og-image.jpg`],
    },

    keywords:
      "Corporate Actions, Buyback, Dividends, Bonus Issue, Stock Split, Rights Issue, Record Date, Ex Date, Corporate Events, ShareBazaarOnline",
  };
}

// ==========================================
// MAIN PAGE — SERVER COMPONENT
// ==========================================

export default async function CorporateActionsPage() {
  const canonicalUrl = `${SITE_URL}/corporateactions`;

  // Fetch once on the server
  const records = await getCorporateActions();

const grouped = (records || []).reduce((acc, row) => {
  const type = (row.action_type || "other").toLowerCase().trim();
  if (!acc[type]) acc[type] = [];
  acc[type].push(row);
  return acc;
}, {});

  // ==========================================
  // WEBPAGE JSON-LD
  // ==========================================

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",

    "@id": `${canonicalUrl}#webpage`,

    url: canonicalUrl,

    name:
      "Corporate Actions - Buyback, Dividends, Bonus, Split | ShareBazaarOnline",

    description:
      "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },

    about: {
      "@type": "Thing",
      name: "Corporate Actions",
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

  // ==========================================
  // BREADCRUMB JSON-LD
  // ==========================================

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
        name: "Corporate Actions",
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

      {/* Client component receives SSR data — no client fetch needed */}
      <CorporateActionsClient initialGrouped={grouped} />
    </>
  );
}