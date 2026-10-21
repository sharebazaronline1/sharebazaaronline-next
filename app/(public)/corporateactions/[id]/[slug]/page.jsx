// app/(public)/corporateactions/[id]/[slug]/page.jsx

import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { fetchInsightDetails } from "@/api/mockApi";
import CorporateActionDetails from "@/components/CorporateActionDetails";
import { cache } from "react"; // ✅ Added React cache

const SITE_URL = "https://www.sharebazaaronline.com";

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

// ✅ Wrapped with React cache
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
      return null;
    }

    return data || null;
  } catch (err) {
    console.error("[getBlog] exception:", err?.message || err);
    return null;
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
  const { id, slug } = await params;
  const blog = await getBlog(id);

  if (!blog || !isCorporateActionCategory(blog.category)) {
    return {
      title: "Article Not Found | ShareBazaarOnline",
      robots: { index: false, follow: false },
    };
  }

  const title =
    blog.meta_title ||
    blog.heading ||
    blog.title ||
    "ShareBazaarOnline";

  const description =
    blog.meta_description ||
    blog.excerpt ||
    "Read the latest corporate action analysis on ShareBazaarOnline.";

  const keywords = normalizeKeywords(blog.keywords);
  const canonical = `${SITE_URL}/corporateactions/${id}/${slug}`;

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

  const articleTitle =
    blog.meta_title ||
    blog.heading ||
    blog.title ||
    "ShareBazaarOnline";

  const articleDescription =
    blog.meta_description ||
    blog.excerpt ||
    "Read the latest corporate action analysis on ShareBazaarOnline.";

  const canonicalUrl = `${SITE_URL}/corporateactions/${id}/${slug}`;
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
    "@id": `${canonicalUrl}#article`,
    headline: articleTitle,
    description: articleDescription,
    url: canonicalUrl,
    image: [articleImage],
    ...(publishedDate ? { datePublished: publishedDate } : {}),
    ...(modifiedDate ? { dateModified: modifiedDate } : {}),
    ...(wordCount ? { wordCount } : {}),
    ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
    articleSection: blog.category || "Corporate Actions",
    inLanguage: "en-IN",
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/sharebazaar.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
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
          __html: JSON.stringify(articleSchema).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <CorporateActionDetails
        blog={blog}
        id={id}
        slug={slug}
        sectionLabel="Corporate Actions"
        sectionHref="/corporateactions"
      />
    </>
  );
}