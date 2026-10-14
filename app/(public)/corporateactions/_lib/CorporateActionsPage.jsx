// app/corporateactions/_lib/CorporateActionsPage.jsx
import { createClient } from "@supabase/supabase-js";
import CorporateActionsClient from "@/components/CorporateActionsClient";
import { findTab, filterRowsForTab } from "./tabs";

const SITE_URL = "https://www.sharebazaaronline.com";

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

async function getCorporateActions() {
  try {
    const { data, error } = await supabasePublic
      .from("corporate_actions")
      .select(
        `
        id,
        company,
        action_type,
        type,
        record,
        ex_date,
        announcement,
        payment_date,
        ratio_or_percentage,
        buyback_price,
        cmp,
        premium,
        size,
        rights_price,
        market_price,
        discount,
        old_fv,
        new_fv,
        action_type_detail,
        key_detail,
        status,
        blog:blogs ( id, slug, heading )
      `
      )
      .order("ex_date", { ascending: false })
      .limit(1000);

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

export default async function CorporateActionsPage({
  tabId = "buyback",
  yearOverride = null,
}) {
  const tab = findTab(tabId);
  const records = await getCorporateActions();
  const rows = filterRowsForTab(records, tab.dbType);

  const defaultYear = yearOverride || String(new Date().getFullYear());

  const canonicalUrl = `${SITE_URL}${tab.href}`;

  const pageTitle = `Upcoming ${tab.label} Records — Record Dates & Ex-Dates | ShareBazaarOnline`;
  const pageDescription = `Track upcoming ${tab.label.toLowerCase()} records for Indian listed companies — record dates, ex-dates, and announcements. Updated daily.`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pageTitle,
    description: pageDescription,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    about: { "@type": "Thing", name: `${tab.label} Corporate Actions` },
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
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Corporate Actions",
        item: `${SITE_URL}/corporateactions`,
      },
      ...(tab.id === "buyback"
        ? []
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: tab.label,
              item: canonicalUrl,
            },
          ]),
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
      <CorporateActionsClient
        rows={rows}
        activeTab={tab.id}
        defaultYear={defaultYear}
      />
    </>
  );
}