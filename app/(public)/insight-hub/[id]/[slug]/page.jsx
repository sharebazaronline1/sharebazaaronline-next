// app/(public)/insight-hub/[id]/[slug]/page.jsx

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import InsightHubDetail from "@/components/InsightHubDetails";

const SITE_URL = "https://sharebazaaronline.com";

// Server-side function to fetch blog data
async function getBlog(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Normalize the keywords column into an array of strings.
 * Handles both Postgres text[] and comma / newline separated strings.
 */
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

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { id, slug } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: "Article Not Found | ShareBazaarOnline",
      robots: {
        index: false,
        follow: false,
      },
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
    "Read the latest market insights on ShareBazaarOnline.";

  const keywords = normalizeKeywords(blog.keywords);

  const canonical = `${SITE_URL}/insight-hub/${id}/${slug}`;

  return {
    title,
    description,
    keywords,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: blog.image_url
        ? [{ url: blog.image_url }]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: blog.image_url
        ? [blog.image_url]
        : [],
    },
  };
}

// Main page component - SERVER COMPONENT
export default async function Page({ params }) {
  const { id, slug } = await params;

  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <InsightHubDetail
      blog={blog}
      id={id}
      slug={slug}
    />
  );
}