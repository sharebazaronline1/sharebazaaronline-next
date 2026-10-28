// app/(public)/corporateactions/[id]/[slug]/page.jsx

import { notFound, permanentRedirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { fetchInsightDetails } from "@/api/mockApi";
import CorporateActionDetails from "@/components/CorporateActionDetails";
import { cache } from "react";

const SITE_URL = "https://www.sharebazaaronline.com";

// ✅ NEW HELPER: Strip brand suffix from DB titles
function cleanTitle(title) {
  if (!title) return "";
  
  // 1. Remove the brand suffix if it exists
  let cleaned = title.replace(/\s*\|\s*ShareBazaarOnline\s*$/i, "").trim();
  
  // 2. Remove any trailing pipes, dashes, or spaces BEFORE truncating
  cleaned = cleaned.replace(/[\s|-]+$/, "").trim();
  
  // 3. Truncate to a safe length (45 chars)
  const MAX_LENGTH = 45;
  
  if (cleaned.length > MAX_LENGTH) {
    cleaned = cleaned.substring(0, MAX_LENGTH).trim();
    
    // Find the last space to avoid cutting words in half
    const lastSpace = cleaned.lastIndexOf(" ");
    if (lastSpace > 0) {
      cleaned = cleaned.substring(0, lastSpace).trim();
    }
    
    // 4. Final sweep: remove any trailing punctuation that survived truncation
    cleaned = cleaned.replace(/[,.;:|-]+$/, "").trim();
  }
  
  return cleaned;
}

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

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

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
      category: found.category || "Corporate Actions",
      keywords: found.keywords || [],
      published_at: found.date,
      updated_at: found.date,
      created_at: found.date,
      status: "published",
      source: "mock",
    };
  } catch (err) {
    console.error("[getMockBlog] error:", err?.message || err);
    return null;
  }
}

const getBlog = cache(async (id) => {
  if (!id) return null;

  if (isMockId(id)) {
    return getMockBlog(id);
  }

  try {
    const { data, error } = await supabasePublic
      .from("blogs")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(
        "[getBlog] supabase error:",
        error.message,
        "| code:",
        error.code
      );
      throw new Error(`Failed to fetch blog ${id}: ${error.message}`);
    }

    return data || null;
  } catch (err) {
    console.error("[getBlog] exception:", err?.message || err);
    throw err;
  }
});

function normalizeKeywords(raw) {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.map((k) => String(k).trim()).filter(Boolean);
  }

  if (typeof raw === "string") {
    return raw
      .split(/[,\n]+/)
      .map((k) => k.trim())
      .filter(Boolean);
  }

  return [];
}

export async function generateStaticParams() {
  return [];
}

export const revalidate = 21600;
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog || !isCorporateActionCategory(blog.category)) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalSlug = getCanonicalSlug(blog);

  if (!canonicalSlug) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  // ✅ Uses the updated cleanTitle which truncates the long string
  const title =
    cleanTitle(blog.meta_title || blog.heading || blog.title) ||
    "Corporate Action";

  const description =
    blog.meta_description ||
    blog.excerpt ||
    "Read the latest corporate action analysis on ShareBazaarOnline.";

  const keywords = normalizeKeywords(blog.keywords);
  const canonical = `${SITE_URL}/corporateactions/${id}/${canonicalSlug}`;

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
      type: "website",
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

  if (!blog || !isCorporateActionCategory(blog.category)) {
    notFound();
  }

  const canonicalSlug = getCanonicalSlug(blog);

  if (!canonicalSlug) {
    notFound();
  }

  if (slug !== canonicalSlug) {
    permanentRedirect(
      `/corporateactions/${encodeURIComponent(String(id))}/${canonicalSlug}`
    );
  }

  const canonicalUrl =
    `${SITE_URL}/corporateactions/${id}/${canonicalSlug}`;

  // ✅ Uses the updated cleanTitle
  const articleTitle =
    cleanTitle(blog.meta_title || blog.heading || blog.title) ||
    "Corporate Action";

  const articleDescription =
    blog.meta_description ||
    blog.excerpt ||
    "Read the latest corporate action analysis on ShareBazaarOnline.";

  const articleImage = blog.image_url || `${SITE_URL}/og-image.jpg`;

  const publishedDate = blog.published_at || blog.created_at;
  const modifiedDate =
    blog.updated_at || blog.published_at || blog.created_at;

  const plainText =
    typeof blog.content === "string"
      ? blog.content.replace(/<[^>]+>/g, " ")
      : "";

  const wordCount = plainText.trim()
    ? plainText.trim().split(/\s+/).length
    : undefined;

  const keywords = normalizeKeywords(blog.keywords);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    name: articleTitle,
    description: articleDescription,
    url: canonicalUrl,
    ...(articleImage
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: articleImage,
          },
        }
      : {}),
    ...(publishedDate ? { datePublished: publishedDate } : {}),
    ...(modifiedDate ? { dateModified: modifiedDate } : {}),
    ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "ShareBazaarOnline",
      url: `${SITE_URL}/`,
    },
    about: {
      "@type": "Thing",
      name: articleTitle,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ShareBazaarOnline",
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/sharebazaar.png`,
        width: 512,
        height: 512,
      },
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
        name: "Corporate Actions",
        item: `${SITE_URL}/corporateactions`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articleTitle,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <CorporateActionDetails
        blog={blog}
        id={id}
        slug={canonicalSlug}
        sectionLabel="Corporate Actions"
        sectionHref="/corporateactions"
      />
    </>
  );
}