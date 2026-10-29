// app/(public)/insight-hub/[id]/[slug]/page.jsx

import { notFound, permanentRedirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { fetchInsightDetails } from "@/api/mockApi";
import InsightHubDetail from "@/components/InsightHubDetails";
import { AUTHOR } from "@/data/author";
import { cache } from "react";

const SITE_URL = "https://www.sharebazaaronline.com";

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

// ✅ UPDATED HELPER: Strictly truncates the title to fit within SEO limits
function cleanTitle(title) {
  if (!title) return "";
  
  // 1. Remove the brand suffix if it exists
  let cleaned = title.replace(/\s*\|\s*ShareBazaarOnline\s*$/i, "").trim();
  
  // 2. Truncate to a safe limit (45 chars) to leave room for " | ShareBazaarOnline"
  const MAX_LENGTH = 45;
  
  if (cleaned.length > MAX_LENGTH) {
    cleaned = cleaned.substring(0, MAX_LENGTH).trim();
    
    // Remove trailing punctuation before cutting at the last space
    cleaned = cleaned.replace(/[,.;:|-]$/, '').trim();
    
    // Find the last space to avoid cutting words in half
    const lastSpace = cleaned.lastIndexOf(" ");
    if (lastSpace > 0) {
      cleaned = cleaned.substring(0, lastSpace).trim();
    }
  }
  
  return cleaned;
}

const CORPORATE_ACTION_CATEGORIES = [
  "Buyback", "Dividend", "Dividends", "Bonus Issue", "Stock Split",
  "Stock Splits", "Rights Issue", "Merger", "Demerger", "Takeover / Acquisition",
  "Open Offer", "Delisting", "OFS", "QIP", "Preferential Allotment",
  "Warrants Issue", "ESOP Allotment", "FPO", "Bond Issue", "NCD Issue",
  "Distribution", "Unit Split", "AGM", "EGM", "Board Meeting", "Postal Ballot",
  "E-Voting", "Promoter Stake Increase", "Promoter Stake Sale", "Pledge Release",
  "Scheme of Arrangement", "Insolvency Resolution", "CIRP Process",
  "Subsidiary Incorporation", "Joint Venture", "Change of Company Name",
  "IPO Listing", "Change in Director", "CEO Appointment", "Auditor Appointment",
  "Regulatory Action", "Trading Suspension", "Revocation of Suspension",
];

function isCorporateActionCategory(category) {
  const normalized = String(category || "").trim().toLowerCase();
  return (
    normalized.includes("corporate action") ||
    CORPORATE_ACTION_CATEGORIES.some(
      (item) => item.toLowerCase() === normalized
    )
  );
}

function slugify(text) {
  if (!text) return "";
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function getCanonicalSlug(blog) {
  return slugify(blog?.heading || blog?.title || "");
}

function isMockId(id) {
  return typeof id === "string" && id.startsWith("mock-");
}

async function getMockBlog(id) {
  try {
    const mockId = String(id).replace(/^mock-/, "");
    const mockData = await fetchInsightDetails();
    if (!Array.isArray(mockData)) return null;
    const found = mockData.find((item) => String(item.id) === mockId);
    if (!found) return null;
    return {
      id: `mock-${found.id}`,
      title: found.title,
      heading: found.heading || found.title,
      meta_title: found.title,
      meta_description: found.excerpt || "",
      excerpt: found.excerpt || "",
      content: found.content || "",
      image_url: found.image,
      category: found.category || "Insights",
      keywords: found.keywords || [],
      published_at: found.date,
      updated_at: found.date,
      created_at: found.date,
      status: "published",
      source: "mock",
    };
  } catch (err) {
    console.error("[getMockBlog] error:", err?.message || err);
    throw err;
  }
}

const getBlog = cache(async (id) => {
  if (!id) return null;
  if (isMockId(id)) return getMockBlog(id);

  const { data, error } = await supabasePublic
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getBlog] Supabase error:", error.message, "| code:", error.code);
    throw new Error(`Failed to fetch blog ${id}: ${error.message}`);
  }
  return data || null;
});

export async function generateStaticParams() {
  return [];
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

function normalizeKeywords(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((keyword) => String(keyword).trim()).filter(Boolean);
  if (typeof raw === "string") return raw.split(/[,\n]+/).map((keyword) => keyword.trim()).filter(Boolean);
  return [];
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog || blog.status !== "published" || isCorporateActionCategory(blog.category)) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalSlug = getCanonicalSlug(blog);
  if (!canonicalSlug) {
    return { title: "Article Not Found", robots: { index: false, follow: false } };
  }

  // ✅ Uses the updated cleanTitle which truncates long text safely
  const title = cleanTitle(blog.meta_title || blog.heading || blog.title) || "Market Insight";

  const description =
    blog.meta_description ||
    blog.excerpt ||
    "Read the latest market insights on ShareBazaarOnline.";

  const keywords = normalizeKeywords(blog.keywords);
  const canonical = `${SITE_URL}/insight-hub/${id}/${canonicalSlug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: blog.image_url ? [{ url: blog.image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog.image_url ? [blog.image_url] : [],
    },
  };
}

export default async function Page({ params }) {
  const { id, slug } = await params;
  const blog = await getBlog(id);

  if (!blog || blog.status !== "published") notFound();

  if (isCorporateActionCategory(blog.category)) {
    permanentRedirect(`/corporateactions/${encodeURIComponent(String(id))}/${slug}`);
  }
  
  const canonicalSlug = getCanonicalSlug(blog);
  if (!canonicalSlug) notFound();

  if (slug !== canonicalSlug) {
    permanentRedirect(`/insight-hub/${encodeURIComponent(String(id))}/${canonicalSlug}`);
  }

  const articleTitle = cleanTitle(blog.meta_title || blog.heading || blog.title) || "Market Insight";
  const articleDescription = blog.meta_description || blog.excerpt || "Read the latest market insights on ShareBazaarOnline.";
  const canonicalUrl = `${SITE_URL}/insight-hub/${id}/${canonicalSlug}`;
  const articleImage = blog.image_url || `${SITE_URL}/og-image.jpg`;

  const publishedDate = blog.published_at || blog.created_at;
  const modifiedDate = blog.updated_at || blog.published_at || blog.created_at;
  const plainText = typeof blog.content === "string" ? blog.content.replace(/<[^>]+>/g, " ") : "";
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : undefined;
  const keywords = normalizeKeywords(blog.keywords);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: articleTitle,
    description: articleDescription,
    url: canonicalUrl,
    image: [{ "@type": "ImageObject", url: articleImage, width: 1200, height: 630 }],
    ...(publishedDate ? { datePublished: publishedDate } : {}),
    ...(modifiedDate ? { dateModified: modifiedDate } : {}),
    ...(wordCount ? { wordCount } : {}),
    ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
    articleSection: blog.category || "Market Insight",
    inLanguage: "en-IN",
    author: {
      "@type": "Person",
      name: "Kavya Talanki",
      jobTitle: "Head of Research & Content",
      url: `${SITE_URL}/about`,
      sameAs: ["https://twitter.com/Sharebazaaronli", "https://www.linkedin.com/company/sharebazaaronline"],
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/sharebazaar.png`, width: 512, height: 512 },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Insight Hub", item: `${SITE_URL}/insight-hub` },
      { "@type": "ListItem", position: 3, name: articleTitle, item: canonicalUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <InsightHubDetail blog={blog} id={id} slug={canonicalSlug} />
    </>
  );
}