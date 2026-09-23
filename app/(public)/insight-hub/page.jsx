// app/insight-hub/page.jsx

import InsightHub from "../../../src/components/InsightHub";
import { createClient } from "@/lib/supabase/server";
import { fetchInsightDetails } from "@/api/mockApi";

const SITE_URL = "https://www.sharebazaaronline.com";

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

export default async function InsightHubPage() {
  const supabase = await createClient();

  const { data: dbData, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("status", "published");

  if (error) {
    console.error("Supabase error:", error);
  }

  let mockData = [];

  try {
    mockData = await fetchInsightDetails();
  } catch (error) {
    console.error("Error loading mock insights:", error);
  }

  const formattedMock = mockData.map((item) => ({
    id: `mock-${item.id}`,
    title: item.title,
    image_url: item.image,
    published_at: item.date,
    reading_time: item.readTime,
    category: item.category,
    content: item.content,
    source: "mock",
  }));

  const formattedDB = (dbData || []).map((item) => ({
    ...item,
    source: "db",
  }));

  let merged = [...formattedDB, ...formattedMock];

  const uniqueMap = new Map();

  merged.forEach((item) => {
    if (!uniqueMap.has(item.title)) {
      uniqueMap.set(item.title, item);
    }
  });

  merged = Array.from(uniqueMap.values());

  merged.sort(
    (a, b) =>
      new Date(b.published_at || 0) -
      new Date(a.published_at || 0)
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
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

      <InsightHub initialBlogs={merged} />
    </>
  );
}