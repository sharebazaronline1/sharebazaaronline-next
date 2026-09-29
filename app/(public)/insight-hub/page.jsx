// app/insight-hub/page.jsx
import InsightHub from "../../../src/components/InsightHub";
import { createClient } from "@supabase/supabase-js";
import { fetchInsightDetails } from "@/api/mockApi";

const SITE_URL = "https://www.sharebazaaronline.com";

// Anonymous client — no cookies, makes route cacheable via ISR
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
  alternates: {
    canonical: `${SITE_URL}/insight-hub`,
  },
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

export const revalidate = 300;

async function getDBBlogs() {
  try {
    const { data, error } = await supabasePublic
      .from("blogs")
      .select(
        "id, title, heading, image_url, published_at, category, status, content"
      )
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(60);

    if (error) {
      console.error("Supabase blogs error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Supabase blogs exception:", err?.message || err);
    return [];
  }
}

async function getMockBlogs() {
  try {
    return (await fetchInsightDetails()) || [];
  } catch (err) {
    console.error("Mock insights error:", err?.message || err);
    return [];
  }
}

export default async function InsightHubPage() {
  // Fetch both sources in parallel
  const [dbData, mockData] = await Promise.all([
    getDBBlogs(),
    getMockBlogs(),
  ]);

  const formattedDB = (dbData || []).map((item) => ({
    ...item,
    source: "db",
  }));

  const formattedMock = (mockData || []).map((item) => ({
    id: `mock-${item.id}`,
    title: item.title,
    heading: item.heading || item.title,
    image_url: item.image,
    published_at: item.date,
    reading_time: item.readTime,
    category: item.category,
    content: item.content,
    source: "mock",
  }));

  const merged = [...formattedDB, ...formattedMock];

  // Dedupe by id, fallback to title
  const seen = new Set();
  const unique = merged.filter((item) => {
    const key = item.id
      ? `id-${item.id}`
      : `t-${String(item.title || item.heading || "").toLowerCase().trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Newest first
  unique.sort(
    (a, b) =>
      new Date(b.published_at || 0).getTime() -
      new Date(a.published_at || 0).getTime()
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
      <InsightHub initialBlogs={unique} />
    </>
  );
}