// app/sitemap.js
import { createClient } from "@supabase/supabase-js";
import { fetchIPOs, fetchPreIPODetails } from "@/api/mockApi";

const BASE_URL = "https://www.sharebazaaronline.com";

export const revalidate = 3600;

// Categories that live under /corporate-actions, not /insight-hub
const CORPORATE_ACTION_CATEGORIES = [
  "Buyback",
  "Dividend",
  "Bonus Issue",
  "Stock Split",
  "Rights Issue",
];

/**
 * Slugifies string for readable canonical URLs
 */
function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Safely converts a value to a Date
 */
function getValidDate(dateStr) {
  if (!dateStr) return undefined;

  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap() {
  const fallbackDate = new Date();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // --------------------------------------------------
  // STATIC PAGES — only routes that actually exist
  // --------------------------------------------------
  const staticPages = [
    {
      url: `${BASE_URL}`,
      lastModified: fallbackDate,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/ipo`,
      lastModified: fallbackDate,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/pre-ipo`,
      lastModified: fallbackDate,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/insight-hub`,
      lastModified: fallbackDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/corporate-actions`,
      lastModified: fallbackDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
     {
      url: `${BASE_URL}/corporate-actions/bonus`,
      lastModified: fallbackDate,
      changeFrequency: "daily",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/corporate-actions/dividends`,
      lastModified: fallbackDate,
      changeFrequency: "daily",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/corporate-actions/others`,
      lastModified: fallbackDate,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/corporate-actions/rights`,
      lastModified: fallbackDate,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/corporate-actions/splits`,
      lastModified: fallbackDate,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/corporate-actions-calendar`,
      lastModified: fallbackDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/broker-analyzer`,
      lastModified: fallbackDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/compare-brokers`,
      lastModified: fallbackDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/how-to-apply-ipo`,
      lastModified: fallbackDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/ipo-guide`,
      lastModified: fallbackDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/pre-ipo-guide`,
      lastModified: fallbackDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ipo-calendar`,
      lastModified: fallbackDate,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: fallbackDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: fallbackDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/report-issue`,
      lastModified: fallbackDate,
      changeFrequency: "monthly",
      priority: 0.4,   // lowered — internal form, no SEO value
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: fallbackDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: fallbackDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: fallbackDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const [
      mockIPOsResult,
      dbIPOsResult,
      preIposResult,
      blogsResult,
      brokersResult,
    ] = await Promise.all([
      fetchIPOs().catch(() => []),

      supabase
        .from("ipos")
        .select("id, name, slug, updated_at")
        .order("id", { ascending: false })
        .then((r) => r.data || [])
        .catch(() => []),

      fetchPreIPODetails().catch(() => []),

      // ✅ Added `category` — needed to route corporate actions vs blogs
      supabase
        .from("blogs")
        .select("id, title, slug, category, updated_at, status")
        .eq("status", "published")
        .order("id", { ascending: false })
        .limit(5000)
        .then((r) => r.data || [])
        .catch(() => []),

      supabase
        .from("brokers")
        .select("slug, updated_at")
        .then((r) => r.data || [])
        .catch(() => []),
    ]);

    const sitemapEntries = [...staticPages];

    // --------------------------------------------------
    // IPOs — merged (mock + DB)
    // --------------------------------------------------
    const ipoMap = new Map();
    const mockIPOs = Array.isArray(mockIPOsResult) ? mockIPOsResult : [];
    const dbIPOs = Array.isArray(dbIPOsResult) ? dbIPOsResult : [];

    mockIPOs.forEach((ipo) => {
      if (ipo?.id) {
        ipoMap.set(String(ipo.id), {
          id: ipo.id,
          name: ipo.name,
          slug: ipo.slug,
          updated_at: ipo.updated_at,
        });
      }
    });

    dbIPOs.forEach((ipo) => {
      if (ipo?.id) ipoMap.set(String(ipo.id), ipo);
    });

    Array.from(ipoMap.values()).forEach((ipo) => {
      const slug = ipo.slug || slugify(ipo.name || "");
      if (!slug) return;
      sitemapEntries.push({
        url: `${BASE_URL}/ipo/${ipo.id}/${slug}`,
        lastModified: getValidDate(ipo.updated_at),
        changeFrequency: "daily",
        priority: 0.8,
      });
    });

    // --------------------------------------------------
    // PRE-IPO
    // --------------------------------------------------
    const preIPOs = Array.isArray(preIposResult) ? preIposResult : [];

    preIPOs.forEach((company) => {
      if (!company?.id) return;
      const slug = company.slug || slugify(company.name || "");
      if (!slug) return;
      sitemapEntries.push({
        url: `${BASE_URL}/pre-ipo/${company.id}/${slug}`,
        lastModified: getValidDate(company.updated_at),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

  
    const blogs = Array.isArray(blogsResult) ? blogsResult : [];

    blogs.forEach((blog) => {
      if (!blog?.id || !blog?.title) return;

      const slug = slugify(blog.title);
      if (!slug) return;

      const isCorporateAction = CORPORATE_ACTION_CATEGORIES.includes(
        (blog.category || "").trim()
      );

      const basePath = isCorporateAction ? "corporateactions" : "insight-hub";

      sitemapEntries.push({
        url: `${BASE_URL}/${basePath}/${blog.id}/${slug}`,
        lastModified: getValidDate(blog.updated_at),
        changeFrequency: "weekly",
        priority: isCorporateAction ? 0.7 : 0.75,
      });
    });

    const brokers = Array.isArray(brokersResult) ? brokersResult : [];

    brokers.forEach((broker) => {
      if (!broker?.slug) return;
      sitemapEntries.push({
        url: `${BASE_URL}/brokerdetails/${broker.slug}`,
        lastModified: getValidDate(broker.updated_at),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

    return sitemapEntries;
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticPages;
  }
}