// app/brokerdetails/[slug]/page.jsx
import { notFound, permanentRedirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BrokerReviewDetailClient from "@/components/BrokerReviewDetailClient";

const SITE_URL = "https://www.sharebazaaronline.com";

// ✅ NEW HELPER: Strip brand suffix and safely truncate overly long DB titles
// ✅ FINAL HELPER: Strictly truncates to guarantee title is under 65 chars
function cleanTitle(title) {
  if (!title) return "";
  
  // 1. Remove the brand suffix if it exists
  let cleaned = title.replace(/\s*\|\s*ShareBazaarOnline\s*$/i, "").trim();
  
  // 2. Truncate to a strict limit of 40 chars
  const MAX_LENGTH = 40;
  
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

// ✅ Enhanced helper to generate unique meta descriptions
function createMetaDescription(content, brokerName, brokerData) {
  const cleanContent = (content || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  let text = cleanContent;

  if (!text || text.length < 50) {
    const parts = [`Read our detailed ${brokerName} review.`];
    
    if (brokerData?.broker_type) {
      const type = brokerData.broker_type
        .replace(/operating on.*/i, '')
        .replace(/\(.*\)/g, '')
        .trim();
      if (type) parts.push(`Type: ${type}.`);
    }
    
    if (brokerData?.rating) {
      parts.push(`Rating: ${parseFloat(brokerData.rating).toFixed(1)}/5.`);
    }
    
    try {
      const details = typeof brokerData?.details === 'string' 
        ? JSON.parse(brokerData.details) 
        : brokerData?.details;
        
      if (details?.account_opening_charges?.individual_account_opening_fee) {
        parts.push(`Account opening fee: ${details.account_opening_charges.individual_account_opening_fee}.`);
      }
    } catch (e) {
      // Ignore JSON parse errors
    }

    parts.push(`Compare charges, trading platforms, and features on ShareBazaarOnline.`);
    text = parts.join(" ");
  }

  return text.length > 155
    ? `${text.slice(0, 152).trimEnd()}...`
    : text;
}

async function getBrokerReviewData(slug) {
  try {
    const possibleSlugs = [slug, `${slug}-review`, `${slug}review`];
    let reviewData = null;
    let brokerData = null;
    let officialSlug = slug;

    for (const trySlug of possibleSlugs) {
      const { data } = await supabase
        .from("broker_reviews")
        .select("*")
        .eq("slug", trySlug)
        .maybeSingle(); 

      if (data) {
        reviewData = data;
        officialSlug = data.slug; 
        break;
      }
    }

    if (!reviewData && (slug.endsWith('-review') || slug.endsWith('review'))) {
      const base = slug.replace(/-review$/, "").replace(/review$/, "");
      const { data } = await supabase
        .from("broker_reviews")
        .select("*")
        .eq("slug", base)
        .maybeSingle();
      if (data) {
         reviewData = data;
         officialSlug = data.slug;
      }
    }

    if (!reviewData) {
      return null;
    }

    const baseSlug = officialSlug.replace(/-review$/, "").replace(/review$/, "");
    const { data: brokerDataResult } = await supabase
      .from("brokers")
      .select("*")
      .or(`slug.eq.${baseSlug},slug.eq.${officialSlug}`)
      .maybeSingle();

    if (brokerDataResult) {
      brokerData = brokerDataResult;
    }

    const { data: competitors } = await supabase
      .from("brokers")
      .select("name, slug, logo, rating, active_users")
      .neq("slug", brokerData?.slug || baseSlug)
      .limit(4);

    return {
      review: reviewData,
      broker: brokerData,
      competitors: competitors || [],
      officialSlug, 
    };
  } catch (error) {
    console.error("Error fetching broker review data:", error);
    return null;
  }
}

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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getBrokerReviewData(slug);

  if (!data || !data.review) {
    return {
      title: "Broker Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { review, broker, officialSlug } = data;
  const brokerName = broker?.name || "Broker";
  
  // ✅ Uses the updated cleanTitle which truncates long text safely
  const reviewTitle = cleanTitle(review.title) || `${brokerName} Review`;

  const description = createMetaDescription(review.content, brokerName, broker);

  const canonical = `${SITE_URL}/brokerdetails/${officialSlug}`;

  const imageUrl = broker?.logo
    ? (
        broker.logo.startsWith("http")
          ? broker.logo
          : `${SITE_URL}${broker.logo.startsWith("/") ? "" : "/"}${broker.logo}`
      )
    : `${SITE_URL}/og-image.jpg`;

  return {
    title: reviewTitle, // Root layout adds | ShareBazaarOnline
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
      publishedTime: review.created_at || new Date().toISOString(),
      modifiedTime: review.updated_at || new Date().toISOString(),
    },

    twitter: {
      card: "summary_large_image",
      title: reviewTitle,
      description,
      images: [imageUrl],
    },

    keywords: `${brokerName} Review, ${brokerName} Broker Review, ${brokerName} Charges, ${brokerName} Platform, Stock Broker Review, ShareBazaarOnline`,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await getBrokerReviewData(slug);

  if (!data || !data.review) {
    notFound();
  }

  const { review, broker, officialSlug } = data;

  if (slug.toLowerCase() !== officialSlug.toLowerCase()) {
    permanentRedirect(`/brokerdetails/${encodeURIComponent(officialSlug)}`);
  }

  const brokerName = broker?.name || "Broker";
  const reviewTitle = cleanTitle(review.title) || `${brokerName} Review`;

  const description = createMetaDescription(review.content, brokerName, broker);

  const canonicalUrl = `${SITE_URL}/brokerdetails/${officialSlug}`;

  const imageUrl = broker?.logo
    ? (
        broker.logo.startsWith("http")
          ? broker.logo
          : `${SITE_URL}${broker.logo.startsWith("/") ? "" : "/"}${broker.logo}`
      )
    : `${SITE_URL}/og-image.jpg`;

  const publishedDate = review.created_at || undefined;
  const modifiedDate = review.updated_at || review.created_at || undefined;
  const rating = parseFloat(broker?.rating || review?.rating || 4.3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: reviewTitle,
    description,
    url: canonicalUrl,
    image: [imageUrl],
    ...(publishedDate ? { datePublished: publishedDate } : {}),
    ...(modifiedDate ? { dateModified: modifiedDate } : {}),
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

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "@id": `${canonicalUrl}#review`,
    name: reviewTitle,
    reviewBody: review.content?.slice(0, 500) || `Complete review of ${brokerName}.`,
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

  const articleSchemaJson = JSON.stringify(articleSchema).replace(/</g, "\\u003c");
  const reviewSchemaJson = JSON.stringify(reviewSchema).replace(/</g, "\\u003c");
  const breadcrumbSchemaJson = JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleSchemaJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: reviewSchemaJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchemaJson }}
      />

      <BrokerReviewDetailClient
        initialData={data}
        slug={officialSlug}
      />
    </>
  );
}