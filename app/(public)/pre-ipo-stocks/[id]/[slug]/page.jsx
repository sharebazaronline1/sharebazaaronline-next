// app/pre-ipo-stocks/[id]/[slug]/page.jsx

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchPreIPODetails } from "@/api/mockApi";
import PreIPODetails from "@/components/PreIPODetails";

const SITE_URL = "https://www.sharebazaaronline.com";

// Server-side function to fetch PreIPO data
async function getPreIPOData(id) {
  try {
    const mockData = await fetchPreIPODetails();
    const selected = mockData.find((x) => x.id === Number(id));

    if (!selected) {
      return null;
    }

    try {
      const supabase = await createClient();

      const { data: dbData, error: dbError } = await supabase
        .from("pre_ipo_companies")
        .select("name, price, lot_size");

      if (!dbError && dbData && dbData.length > 0) {
        const normalize = (str) =>
          str.toLowerCase().replace(/[^a-z0-9]/g, "");

        const dbItem = dbData.find(
          (d) =>
            normalize(d.name).includes(normalize(selected.name)) ||
            normalize(selected.name).includes(normalize(d.name))
        );

        if (dbItem) {
          return {
            ...selected,
            price: Number(dbItem.price),
            shareDetails: {
              ...selected.shareDetails,
              indicativeUnlistedSharePrice: `₹${Number(dbItem.price)}`,
              lotSize:
                dbItem.lot_size ||
                selected.shareDetails?.lotSize ||
                "-",
            },
          };
        }
      }
    } catch (supabaseError) {
      console.error("Supabase error:", supabaseError);
    }

    return selected;
  } catch (error) {
    console.error("Error fetching PreIPO data:", error);
    return null;
  }
}

// Generate static params for SSG
export async function generateStaticParams() {
  try {
    const mockData = await fetchPreIPODetails();

    return mockData.map((company) => {
      const slug = company.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return {
        id: String(company.id),
        slug,
      };
    });
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { id, slug } = await params;
  const data = await getPreIPOData(id);

  if (!data) {
    return {
      title: "Company Not Found | ShareBazaarOnline",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const companyName = data.name;
  const price = data.price
    ? `₹${Number(data.price).toLocaleString("en-IN")}`
    : "";

  const overview = data.overview || "";

  const getDescription = (text) => {
    if (!text) {
      return `Get detailed information about ${companyName} including share price, financials, and investment analysis.`;
    }

    let desc = text.slice(0, 155);
    const lastSpace = desc.lastIndexOf(" ");

    if (lastSpace > 0) {
      desc = desc.slice(0, lastSpace);
    }

    return desc + "...";
  };

  const description = getDescription(overview);

  const title = price
    ? `${companyName} - Share Price ${price} | ShareBazaarOnline`
    : `${companyName} - Share Details | ShareBazaarOnline`;

  const canonical = `${SITE_URL}/pre-ipo-stocks/${id}/${slug}`;

  const imageUrl = data.logo
    ? data.logo.startsWith("http")
      ? data.logo
      : `${SITE_URL}${data.logo.startsWith("/") ? "" : "/"}${data.logo}`
    : `${SITE_URL}/og-image.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${companyName} - Unlisted Share Details`,
      description,
      url: canonical,
      type: "article",
      images: [{ url: imageUrl }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${companyName} - Unlisted Shares`,
      description,
      images: [imageUrl],
    },
  };
}

// Main page component - SERVER COMPONENT
export default async function Page({ params }) {
  const { id, slug } = await params;
  const data = await getPreIPOData(id);

  if (!data) {
    notFound();
  }

  const companyName = data.name || "Unlisted Company";
  const canonicalUrl = `${SITE_URL}/pre-ipo-stocks/${id}/${slug}`;

  const price = data.price
    ? `₹${Number(data.price).toLocaleString("en-IN")}`
    : "";

  const description = data.overview
    ? data.overview.slice(0, 160)
    : `Detailed information about ${companyName} unlisted shares including share price, financials, valuation, and investment analysis.`;

  const imageUrl = data.logo
    ? data.logo.startsWith("http")
      ? data.logo
      : `${SITE_URL}${data.logo.startsWith("/") ? "" : "/"}${data.logo}`
    : `${SITE_URL}/og-image.jpg`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: price
      ? `${companyName} - Unlisted Share Price ${price}`
      : `${companyName} - Unlisted Share Details`,
    description,
    url: canonicalUrl,
    image: [imageUrl],
    articleSection: "Unlisted Shares",
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
    },
  };

  const financialProductSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    "@id": `${canonicalUrl}#financialproduct`,
    name: `${companyName} Unlisted Shares`,
    description,
    url: canonicalUrl,
    category: "Unlisted Shares",
    brand: {
      "@type": "Brand",
      name: companyName,
    },
    ...(data.price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: Number(data.price),
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
          },
        }
      : {}),
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
        name: "Pre-IPO Stocks",
        item: `${SITE_URL}/pre-ipo-stocks`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${companyName} Unlisted Shares`,
        item: canonicalUrl,
      },
    ],
  };

  const safeJsonLd = (schema) =>
    JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(articleSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(financialProductSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(breadcrumbSchema),
        }}
      />

      <PreIPODetails data={data} id={id} slug={slug} />
    </>
  );
}