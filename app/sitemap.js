import { createClient } from "@supabase/supabase-js";

// IMPORTANT:
// Change this import path to wherever these functions exist
// in your Next.js project.
import { fetchIPOs, fetchPreIPODetails } from "@/api/mockApi";

const BASE_URL = "https://www.sharebazaaronline.com";

// Regenerate sitemap every 5 minutes
export const revalidate = 300;

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
  if (!dateStr) return new Date();

const date = new Date(dateStr);

if (Number.isNaN(date.getTime())) {
return new Date();
}

return date;
}

export default async function sitemap() {
const fallbackDate = new Date();

// Create Supabase client for server-side sitemap generation
const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --------------------------------------------------
// STATIC PAGES
// --------------------------------------------------

const staticPages = [
{
url: `${BASE_URL}`,
lastModified: fallbackDate,
changeFrequency: "hourly",
priority: 1.0,
},


{
  url: `${BASE_URL}/ipo-tracker`,
  lastModified: fallbackDate,
  changeFrequency: "hourly",
  priority: 0.95,
},

{
  url: `${BASE_URL}/ipo`,
  lastModified: fallbackDate,
  changeFrequency: "daily",
  priority: 0.95,
},

{
  url: `${BASE_URL}/pre-ipo-stocks`,
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
  url: `${BASE_URL}/corporateactions`,
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
  url: `${BASE_URL}/comparebrokers`,
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
  url: `${BASE_URL}/skill-up`,
  lastModified: fallbackDate,
  changeFrequency: "monthly",
  priority: 0.7,
},

{
  url: `${BASE_URL}/ipoguide`,
  lastModified: fallbackDate,
  changeFrequency: "monthly",
  priority: 0.7,
},

{
  url: `${BASE_URL}/preipoguide`,
  lastModified: fallbackDate,
  changeFrequency: "monthly",
  priority: 0.7,
},


];

try {
// --------------------------------------------------
// PARALLEL DATA FETCHING
// --------------------------------------------------


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
    .then((result) => result.data || [])
    .catch(() => []),

  fetchPreIPODetails().catch(() => []),

  supabase
    .from("blogs")
    .select("id, title, slug, updated_at")
    .order("id", { ascending: false })
    .then((result) => result.data || [])
    .catch(() => []),

  supabase
    .from("brokers")
    .select("slug, updated_at")
    .then((result) => result.data || [])
    .catch(() => []),
]);

// Start sitemap with static pages
const sitemapEntries = [...staticPages];

// --------------------------------------------------
// IPOs
// Merge Mock/API IPOs + Supabase IPOs
// --------------------------------------------------

const ipoMap = new Map();

const mockIPOs = Array.isArray(mockIPOsResult)
  ? mockIPOsResult
  : [];

const dbIPOs = Array.isArray(dbIPOsResult)
  ? dbIPOsResult
  : [];

// Add IPOs from fetchIPOs()
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

// Supabase data overrides duplicate IDs
dbIPOs.forEach((ipo) => {
  if (ipo?.id) {
    ipoMap.set(String(ipo.id), ipo);
  }
});

// Generate IPO URLs
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

const preIPOs = Array.isArray(preIposResult)
  ? preIposResult
  : [];

preIPOs.forEach((company) => {
  if (!company?.id) return;

  const slug =
    company.slug ||
    slugify(company.name || "");

  if (!slug) return;

  sitemapEntries.push({
    url: `${BASE_URL}/preipo/${company.id}/${slug}`,
    lastModified: getValidDate(company.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  });
});

const blogs = Array.isArray(blogsResult)
  ? blogsResult
  : [];

blogs.forEach((blog) => {
  if (!blog?.id || !blog?.title) return;

  // The canonical Insight Hub URL is generated from the article title.
  const slug = slugify(blog.title);

  if (!slug) return;

  sitemapEntries.push({
    url: `${BASE_URL}/insight-hub/${blog.id}/${slug}`,
    lastModified: getValidDate(blog.updated_at),
    changeFrequency: "weekly",
    priority: 0.75,
  });
});

// --------------------------------------------------
// BROKERS
// URLs match /brokerdetails/[slug]
// --------------------------------------------------

const brokers = Array.isArray(brokersResult)
  ? brokersResult
  : [];

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

// Return static pages if dynamic fetching fails
return staticPages;


}
}
