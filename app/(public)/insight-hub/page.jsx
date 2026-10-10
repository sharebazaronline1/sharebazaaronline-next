// app/insight-hub/page.jsx
import InsightHub from "../../../src/components/InsightHub";
import { createClient } from "@supabase/supabase-js";
import { fetchInsightDetails } from "@/api/mockApi";

const SITE_URL = "https://www.sharebazaaronline.com";

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

export const metadata = {
  title: "Insight Hub | ShareBazaarOnline",
  description:
    "Market insights, IPO updates, investment strategies and educational guides.",
  alternates: { canonical: `${SITE_URL}/insight-hub` },
  openGraph: {
    title: "Insight Hub | ShareBazaarOnline",
    description:
      "Market insights, IPO updates, investment strategies and educational guides.",
    url: `${SITE_URL}/insight-hub`,
    type: "website",
    siteName: "ShareBazaarOnline",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insight Hub | ShareBazaarOnline",
    description:
      "Market insights, IPO updates, investment strategies and educational guides.",
  },
};

// Always fetch fresh — no stale ISR cache while we debug
export const dynamic = "force-dynamic";
export const revalidate = 0;

function slugify(text) {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getDBBlogs() {
  try {
    const { data, error } = await supabasePublic
      .from("blogs")
      .select(
        "id, title, heading, image_url, published_at, updated_at, category, status"
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("[getDBBlogs] supabase error:", error.message);
      return [];
    }
    console.log("[getDBBlogs] fetched", data?.length || 0, "rows");
    return data || [];
  } catch (err) {
    console.error("[getDBBlogs] exception:", err?.message || err);
    return [];
  }
}

async function getMockBlogs() {
  try {
    return (await fetchInsightDetails()) || [];
  } catch (err) {
    console.error("[getMockBlogs] error:", err?.message || err);
    return [];
  }
}

export default async function InsightHubPage() {
  const [dbData, mockData] = await Promise.all([getDBBlogs(), getMockBlogs()]);

  const formattedDB = (dbData || []).map((item) => ({ ...item, source: "db" }));

  const formattedMock = (mockData || []).map((item) => ({
    id: `mock-${item.id}`,
    title: item.title,
    heading: item.heading || item.title,
    image_url: item.image,
    published_at: item.date,
    updated_at: item.updated_at || item.date,
    reading_time: item.readTime,
    category: item.category,
    source: "mock",
  }));

  const merged = [...formattedDB, ...formattedMock];

  const seen = new Set();
  const unique = merged.filter((item) => {
    const key = item.id
      ? `id-${item.id}`
      : `t-${String(item.title || item.heading || "").toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  unique.sort(
    (a, b) =>
      new Date(b.published_at || 0).getTime() -
      new Date(a.published_at || 0).getTime()
  );

  console.log(
    "[InsightHubPage] total unique:",
    unique.length,
    "| db:",
    formattedDB.length,
    "| mock:",
    formattedMock.length
  );

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/insight-hub#webpage`,
    url: `${SITE_URL}/insight-hub`,
    name: "Insight Hub | ShareBazaarOnline",
    description:
      "Market insights, IPO updates, investment strategies and educational guides.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "ShareBazaarOnline",
    },
    about: {
      "@type": "Thing",
      name: "Market Insights and Investment Education",
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
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Insight Hub",
        item: `${SITE_URL}/insight-hub`,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Insight Hub — Market Insights & Investment Guides",
    url: `${SITE_URL}/insight-hub`,
    numberOfItems: unique.length,
    itemListElement: unique.slice(0, 24).map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/insight-hub/${post.id}/${slugify(
        post.heading || post.title
      )}`,
      name: post.heading || post.title,
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListSchema) }}
      />
      <InsightHub initialBlogs={unique} />
    </>
  );
}