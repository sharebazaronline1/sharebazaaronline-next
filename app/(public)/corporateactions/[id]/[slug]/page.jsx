// app/(public)/corporateactions/[id]/[slug]/page.jsx

import { notFound, permanentRedirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { fetchInsightDetails } from "@/api/mockApi";
import InsightHubDetail from "@/components/InsightHubDetails";

const SITE_URL = "https://www.sharebazaaronline.com";

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

const CORPORATE_ACTION_CATEGORIES = [
  "Buyback", "Dividend", "Bonus Issue", "Stock Split", "Rights Issue",
];

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
      slug: slugify(found.heading || found.title),
      status: "published",
      source: "mock",
    };
  } catch (err) {
    console.error("[getMockBlog] error:", err?.message || err);
    return null;
  }
}

async function getBlog(id) {
  if (!id) return null;
  if (isMockId(id)) return getMockBlog(id);

  try {
    const { data, error } = await supabasePublic
      .from("blogs")
      .select("*")
      .eq("id", id)
      .eq("status", "published")   // ← drafts excluded
      .maybeSingle();

    if (error) {
      console.error("[getBlog] supabase error:", error.message, "| code:", error.code);
      return null;
    }
    return data || null;
  } catch (err) {
    console.error("[getBlog] exception:", err?.message || err);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const { data, error } = await supabasePublic
      .from("blogs")
      .select("id, title, heading, slug, category")
      .eq("status", "published")
      .in("category", CORPORATE_ACTION_CATEGORIES)
      .limit(500);

    if (error || !data) return [];

    return data
      .map((b) => {
        const title = b.title || b.heading || "";
        const slug = b.slug || slugify(title);
        if (!b.id || !slug) return null;
        return { id: String(b.id), slug };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("generateStaticParams error:", err?.message || err);
    return [];
  }
}

export const revalidate = 300;
export const dynamicParams = true;

function normalizeKeywords(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((k) => String(k).trim()).filter(Boolean);
  if (typeof raw === "string") {
    return raw.split(/[,\n]+/).map((k) => k.trim()).filter(Boolean);
  }
  return [];
}

/* UTC-safe ISO date for schema */
function ensureTZ(dateStr) {
  if (!dateStr) return undefined;
  const s = String(dateStr);
  if (/[Zz]$|[+-]\d{2}:?\d{2}$/.test(s)) return s;
  return `${s}+05:30`;
}

export async function generateMetadata({ params }) {
  const { id, slug } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: "Article Not Found | ShareBazaarOnline",
      robots: { index: false, follow: false },
    };
  }

  const title = blog.meta_title || blog.heading || blog.title || "ShareBazaarOnline";
  const description =
    blog.meta_description || blog.excerpt || "Read the latest corporate action analysis on ShareBazaarOnline.";

  const keywords = normalizeKeywords(blog.keywords);
  const canonical = `${SITE_URL}/corporateactions/${id}/${slug}`;
  const isMock = isMockId(id);

  return {
    title: { absolute: title },  // ← avoid " | ShareBazaarOnline" doubling
    description,
    keywords,
    alternates: { canonical },
    robots: isMock ? { index: false, follow: false } : { index: true, follow: true },
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

  if (!blog) notFound();

  // Redirect any slug mismatch to the canonical slug
  const expectedSlug =
    blog.slug || slugify(blog.title || blog.heading || "");
  if (!isMockId(id) && expectedSlug && slug !== expectedSlug) {
    permanentRedirect(`/corporateactions/${id}/${expectedSlug}`);
  }

  const articleTitle = blog.meta_title || blog.heading || blog.title || "ShareBazaarOnline";
  const articleDescription =
    blog.meta_description || blog.excerpt || "Read the latest corporate action analysis on ShareBazaarOnline.";

  const canonicalUrl = `${SITE_URL}/corporateactions/${id}/${slug}`;
  const articleImage = blog.image_url || `${SITE_URL}/og-image.jpg`;

  const publishedDate = ensureTZ(blog.published_at || blog.created_at);
  const modifiedDate = ensureTZ(
    blog.updated_at || blog.published_at || blog.created_at
  );

  const plainText =
    typeof blog.content === "string" ? blog.content.replace(/<[^>]+>/g, " ") : "";
  const wordCount = plainText.trim()
    ? plainText.trim().split(/\s+/).length
    : undefined;

  const keywords = normalizeKeywords(blog.keywords);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
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
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Corporate Actions",
        item: `${SITE_URL}/corporateactions`,
      },
      { "@type": "ListItem", position: 3, name: articleTitle, item: canonicalUrl },
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
      <InsightHubDetail
        blog={blog}
        id={id}
        slug={slug}
        sectionLabel="Corporate Actions"
        sectionHref="/corporateactions"
      />
    </>
  );
}