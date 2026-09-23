// app/pre-ipo-stocks/page.jsx

import PreIPOList from "../../../src/components/PreIPOList";
import { fetchPreIPODetails } from "@/api/mockApi";
import { supabase } from "@/lib/supabase";

const SITE_URL = "https://www.sharebazaaronline.com";

export const metadata = {
  title: "Pre-IPO & Unlisted Shares | ShareBazaarOnline",
  description:
    "Discover pre-IPO and unlisted companies, track pricing and availability before they list. Find private company opportunities and market insights.",
  alternates: {
    canonical: `${SITE_URL}/pre-ipo-stocks`,
  },
  openGraph: {
    title: "Pre-IPO & Unlisted Shares | ShareBazaarOnline",
    description:
      "Discover pre-IPO and unlisted companies, track pricing and availability before they list.",
    url: `${SITE_URL}/pre-ipo-stocks`,
    siteName: "ShareBazaarOnline",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pre-IPO & Unlisted Shares | ShareBazaarOnline",
    description:
      "Discover pre-IPO and unlisted companies, track pricing and availability before they list.",
  },
};

export const revalidate = 300;

const normalizeName = (str = "") => {
  return str
    .toLowerCase()
    .replace(
      /limited|ltd|llp|private|unlisted|shares?|share/gi,
      ""
    )
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

function buildJsonLd(merged) {
  const canonicalUrl = `${SITE_URL}/pre-ipo-stocks`;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${canonicalUrl}#itemlist`,
    name: "Pre-IPO & Unlisted Shares in India",
    description:
      "Discover pre-IPO and unlisted companies, track pricing and availability before they list.",
    url: canonicalUrl,
    numberOfItems: merged.length,
    itemListElement: merged.slice(0, 50).map((item, index) => {
      const name = item.name || "Unlisted Company";
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const itemUrl = `${SITE_URL}/pre-ipo-stocks/${item.id}/${slug}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "FinancialProduct",
          name: `${name} Unlisted Shares`,
          url: itemUrl,
          category: "Unlisted Shares",
          ...(item.price
            ? {
                offers: {
                  "@type": "Offer",
                  priceCurrency: "INR",
                  price: Number(item.price),
                  availability: "https://schema.org/InStock",
                  url: itemUrl,
                },
              }
            : {}),
        },
      };
    }),
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: "Pre-IPO & Unlisted Shares | ShareBazaarOnline",
    description:
      "Discover pre-IPO and unlisted companies, track pricing and availability before they list. Find private company opportunities and market insights.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "ShareBazaarOnline",
    },
    about: {
      "@type": "Thing",
      name: "Pre-IPO and Unlisted Shares",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
  };

  const breadcrumb = {
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
        name: "Pre-IPO Stocks",
        item: canonicalUrl,
      },
    ],
  };

  return {
    itemList,
    webPage,
    breadcrumb,
  };
}

export default async function Page() {
  const detailedData = await fetchPreIPODetails();

  const { data: dbData, error } = await supabase
    .from("pre_ipo_companies")
    .select("name, price, lot_size");

  if (error) {
    console.error("Supabase error:", error);
  }

  const dbMap = {};

  dbData?.forEach((db) => {
    const key = normalizeName(db.name);
    dbMap[key] = db;
  });

  const merged = (detailedData || []).map((item) => {
    const key = normalizeName(item.name);

    let dbItem = dbMap[key];

    if (!dbItem) {
      const bestMatch = Object.keys(dbMap).find(
        (dbKey) =>
          dbKey.includes(key) || key.includes(dbKey)
      );

      if (bestMatch) {
        dbItem = dbMap[bestMatch];
      }
    }

    return {
      ...item,

      price:
        dbItem?.price != null
          ? Number(dbItem.price)
          : Number(item.price || 0),

      minLotSize:
        dbItem?.lot_size != null
          ? String(dbItem.lot_size)
          : item.minLotSize || "-",

      depository:
        item.shareDetails?.depository ||
        item.depository ||
        "NSDL & CDSL",
    };
  });

  const { itemList, webPage, breadcrumb } =
    buildJsonLd(merged);

  const safeJsonLd = (schema) =>
    JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(itemList),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(webPage),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(breadcrumb),
        }}
      />

      <PreIPOList initialIPOs={merged} />
    </>
  );
}