// app/(public)/insight-hub/[id]/[slug]/page.jsx

import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { fetchInsightDetails } from "@/api/mockApi";
import InsightHubDetail from "@/components/InsightHubDetails";

const SITE_URL = "https://www.sharebazaaronline.com";

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

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
    return null;
  }
}

async function getBlog(id) {
  if (!id) return null;

  // Mock path — never touches Supabase
  if (isMockId(id)) {
    return getMockBlog(id);
  }

  // DB path — select * so we don't break when columns change
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
}

export async function generateStaticParams() {
  try {
    const { data, error } = await supabasePublic
      .from("blogs")
      .select("id, title, heading")
      .eq("status", "published")
      .limit(500);

    if (error || !data) return [];

    const dbParams = data
      .map((b) => {
        const title = b.title || b.heading || "";
        const slug = slugify(title);
        if (!b.id || !slug) return null;
        return { id: String(b.id), slug };
      })
      .filter(Boolean);

    let mockParams = [];
    try {
      const mockData = await fetchInsightDetails();
      if (Array.isArray(mockData)) {
        mockParams = mockData
          .map((m) => {
            const title = m.heading || m.title || "";
            const slug = slugify(title);
            if (!m.id || !slug) return null;
            return { id: `mock-${m.id}`, slug };
          })
          .filter(Boolean);
      }
    } catch (err) {
      console.error("mock params error:", err?.message || err);
    }

    return [...dbParams, ...mockParams];
  } catch (err) {
    console.error("generateStaticParams error:", err?.message || err);
    return [];
  }
}

export const revalidate = 300;
export const dynamicParams = true;

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

export async function generateMetadata({ params }) {
  const { id, slug } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: "Article Not Found | ShareBazaarOnline",
      robots: { index: false, follow: false },
    };
  }

  const title =
    blog.meta_title || blog.heading || blog.title || "ShareBazaarOnline";

  const description =
    blog.meta_description ||
    blog.excerpt ||
    "Read the latest market insights on ShareBazaarOnline.";

  const keywords = normalizeKeywords(blog.keywords);
  const canonical = `${SITE_URL}/insight-hub/${id}/${slug}`;

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

  if (!blog) {
    notFound();
  }

  const articleTitle =
    blog.meta_title || blog.heading || blog.title || "ShareBazaarOnline";

  const articleDescription =
    blog.meta_description ||
    blog.excerpt ||
    "Read the latest market insights on ShareBazaarOnline.";

  const canonicalUrl = `${SITE_URL}/insight-hub/${id}/${slug}`;
  const articleImage = blog.image_url || `${SITE_URL}/og-image.jpg`;

  const publishedDate = blog.published_at || blog.created_at;
  const modifiedDate = blog.updated_at || blog.published_at || blog.created_at;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    headline: articleTitle,
    description: articleDescription,
    url: canonicalUrl,
    image: [articleImage],
    ...(publishedDate ? { datePublished: publishedDate } : {}),
    ...(modifiedDate ? { dateModified: modifiedDate } : {}),
    articleSection: blog.category || "Market Insight",
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
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />
      <InsightHubDetail blog={blog} id={id} slug={slug} />
    </>
  );
}