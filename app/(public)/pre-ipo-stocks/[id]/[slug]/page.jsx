// app/pre-ipo-stocks/[id]/[slug]/page.jsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fetchPreIPODetails } from "@/api/mockApi";
import PreIPODetails from "@/components/PreIPODetails";

const SITE_URL = "https://sharebazaaronline.com";

// Server-side function to fetch PreIPO data
async function getPreIPOData(id) {
  try {
    const mockData = await fetchPreIPODetails();
    const selected = mockData.find((x) => x.id === Number(id));
    
    if (!selected) {
      return null;
    }

    try {
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
              lotSize: dbItem.lot_size || selected.shareDetails?.lotSize || "-",
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
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      return {
        id: String(company.id),
        slug: slug,
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
  const price = data.price ? `₹${Number(data.price).toLocaleString('en-IN')}` : '';
  const overview = data.overview || '';
  
  // Truncate description properly at sentence boundary
  const getDescription = (text) => {
    if (!text) return `Get detailed information about ${companyName} including share price, financials, and investment analysis.`;
    // Get first 155 characters and cut at last space or sentence
    let desc = text.slice(0, 155);
    const lastSpace = desc.lastIndexOf(' ');
    if (lastSpace > 0) {
      desc = desc.slice(0, lastSpace);
    }
    return desc + '...';
  };
  
  const description = getDescription(overview);
  
  // Clean title - remove duplicate site name
  const title = price 
    ? `${companyName} - Share Price ${price} | ShareBazaarOnline`
    : `${companyName} - Share Details | ShareBazaarOnline`;
  
  const canonical = `${SITE_URL}/pre-ipo-stocks/${id}/${slug}`;
  const imageUrl = data.logo ? `${SITE_URL}${data.logo}` : `${SITE_URL}/og-image.jpg`;

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

  return <PreIPODetails data={data} id={id} slug={slug} />;
}