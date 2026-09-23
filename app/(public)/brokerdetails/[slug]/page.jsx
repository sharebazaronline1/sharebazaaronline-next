
// app/brokerdetails/[slug]/page.jsx
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BrokerReviewDetailClient from "@/components/BrokerReviewDetailClient";

const SITE_URL = "https://www.sharebazaaronline.com";

// Server-side function to fetch broker review data
async function getBrokerReviewData(slug) {
  try {
    const possibleSlugs = [slug, `${slug}-review`, `${slug}review`];
    let reviewData = null;
    let brokerData = null;

    // Find review
    for (const trySlug of possibleSlugs) {
      const { data, error } = await supabase
        .from("broker_reviews")
        .select("*")
        .eq("slug", trySlug)
        .single();

      if (!error && data) {
        reviewData = data;
        break;
      }
    }

    if (!reviewData) {
      return null;
    }

    // Find broker
    const baseSlug = slug.replace(/-review$/, "").replace(/review$/, "");
    const { data: brokerDataResult } = await supabase
      .from("brokers")
      .select("*")
      .or(`slug.eq.${baseSlug},slug.eq.${slug}`)
      .maybeSingle();

    if (brokerDataResult) {
      brokerData = brokerDataResult;
    }

    // Get competitors
    const { data: competitors } = await supabase
      .from("brokers")
      .select("name, slug, logo, rating, active_users")
      .neq("slug", brokerData?.slug || baseSlug)
      .limit(4);

    return {
      review: reviewData,
      broker: brokerData,
      competitors: competitors || [],
    };
  } catch (error) {
    console.error("Error fetching broker review data:", error);
    return null;
  }
}

// Generate static params for SSG
export async function generateStaticParams() {
  try {
    const { data: reviews } = await supabase
      .from("broker_reviews")
      .select("slug");

    if (!reviews) return [];

    return reviews.map((review) => ({
      slug: review.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getBrokerReviewData(slug);

  if (!data || !data.review) {
    return {
      title: "Broker Not Found | ShareBazaarOnline",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const brokerName = data.broker?.name || "Broker";
  const reviewTitle = data.review.title || `${brokerName} Review`;

  const description =
    data.review.content?.slice(0, 160) ||
    `Complete review of ${brokerName} including brokerage charges, platform features, ratings, and more.`;

  const canonical = `${SITE_URL}/brokerdetails/${slug}`;

  const imageUrl = data.broker?.logo
    ? (
        data.broker.logo.startsWith("http")
          ? data.broker.logo
          : `${SITE_URL}${data.broker.logo.startsWith("/") ? "" : "/"}${data.broker.logo}`
      )
    : `${SITE_URL}/og-image.jpg`;

  const rating = data.broker?.rating || 4.3;

  return {
    title: `${reviewTitle} - Broker Review & Ratings 2026 | ShareBazaarOnline`,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: `${reviewTitle} - Complete Broker Review`,
      description,
      url: canonical,
      type: "article",
      images: [{ url: imageUrl }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
      publishedTime:
        data.review.created_at || new Date().toISOString(),
      modifiedTime:
        data.review.updated_at || new Date().toISOString(),
    },

    twitter: {
      card: "summary_large_image",
      title: `${reviewTitle} - Broker Review`,
      description,
      images: [imageUrl],
    },

    keywords: `${brokerName} Review, ${brokerName} Broker Review, ${brokerName} Charges, ${brokerName} Platform, Stock Broker Review, ShareBazaarOnline`,
  };
}

// Main page component - SERVER COMPONENT
export default async function Page({ params }) {
  const { slug } = await params;
  const data = await getBrokerReviewData(slug);

  if (!data || !data.review) {
    notFound();
  }

  const { review, broker } = data;

  const brokerName = broker?.name || "Broker";

  const reviewTitle =
    review.title || `${brokerName} Review`;

  const description =
    review.content?.slice(0, 200) ||
    `Complete review of ${brokerName} including brokerage charges, platform features, ratings, and more.`;

  const canonicalUrl =
    `${SITE_URL}/brokerdetails/${slug}`;

  const imageUrl = broker?.logo
    ? (
        broker.logo.startsWith("http")
          ? broker.logo
          : `${SITE_URL}${broker.logo.startsWith("/") ? "" : "/"}${broker.logo}`
      )
    : `${SITE_URL}/og-image.jpg`;

  const publishedDate =
    review.created_at || undefined;

  const modifiedDate =
    review.updated_at ||
    review.created_at ||
    undefined;

  const rating =
    parseFloat(broker?.rating || review?.rating || 4.3);

  // ==========================================
  // ARTICLE JSON-LD
  // ==========================================

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",

    "@id": `${canonicalUrl}#article`,

    headline: reviewTitle,

    description,

    url: canonicalUrl,

    image: [imageUrl],

    ...(publishedDate
      ? {
          datePublished: publishedDate,
        }
      : {}),

    ...(modifiedDate
      ? {
          dateModified: modifiedDate,
        }
      : {}),

    articleSection: "Broker Reviews",

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
      url: canonicalUrl,
    },
  };

  // ==========================================
  // REVIEW JSON-LD
  // ==========================================

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",

    "@id": `${canonicalUrl}#review`,

    name: reviewTitle,

    reviewBody:
      review.content?.slice(0, 500) ||
      `Complete review of ${brokerName}.`,

    reviewRating: {
      "@type": "Rating",
      ratingValue: rating.toFixed(1),
      bestRating: "5",
      worstRating: "1",
    },

    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },

    itemReviewed: {
      "@type": "Product",
      name: `${brokerName} Brokerage Services`,
      brand: {
        "@type": "Brand",
        name: brokerName,
      },
    },

    url: canonicalUrl,
  };

  // ==========================================
  // BREADCRUMB JSON-LD
  // ==========================================

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    "@id": `${canonicalUrl}#breadcrumb`,

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
        name: "Brokers",
        item: `${SITE_URL}/comparebrokers`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${brokerName} Reviews`,
        item: canonicalUrl,
      },
    ],
  };

  /*
   * Safely serialize JSON-LD.
   *
   * Prevents a "<" character inside dynamic database content
   * from interfering with the script element.
   */
  const articleSchemaJson = JSON.stringify(articleSchema).replace(
    /</g,
    "\\u003c"
  );

  const reviewSchemaJson = JSON.stringify(reviewSchema).replace(
    /</g,
    "\\u003c"
  );

  const breadcrumbSchemaJson = JSON.stringify(breadcrumbSchema).replace(
    /</g,
    "\\u003c"
  );

  return (
    <>
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: articleSchemaJson,
        }}
      />

      {/* Review JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: reviewSchemaJson,
        }}
      />

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbSchemaJson,
        }}
      />

      <BrokerReviewDetailClient
        initialData={data}
        slug={slug}
      />
    </>
  );
}

