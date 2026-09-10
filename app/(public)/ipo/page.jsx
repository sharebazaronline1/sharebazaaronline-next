import IpoList from "../../../src/components/IpoList";
import { fetchIPOs } from "@/api/mockApi";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.sharebazaaronline.com";

export const metadata = {
  title: "IPO Tracker — ShareBazaarOnline",
  description:
    "Live & upcoming IPOs in India — price bands, lot sizes, GMP trends, and subscription insights.",
  alternates: {
    canonical: `${siteUrl}/ipo`,
  },
  openGraph: {
    title: "IPO Tracker — ShareBazaarOnline",
    description:
      "Live & upcoming IPOs in India — price bands, lot sizes, GMP trends, and subscription insights.",
    url: `${siteUrl}/ipo`,
    siteName: "ShareBazaarOnline",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPO Tracker — ShareBazaarOnline",
    description:
      "Live & upcoming IPOs in India — price bands, lot sizes, GMP trends, and subscription insights.",
  },
};

export const revalidate = 300;

function buildIpoJsonLd(ipos) {
  const getValue = (obj, ...paths) => {
    for (const path of paths) {
      const value = path.split(".").reduce((o, key) => o?.[key], obj);
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return null;
  };

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Live & Upcoming IPOs in India",
    description:
      "Current IPO price bands, lot sizes, subscription dates, and listing schedules.",
    numberOfItems: ipos.length,
    itemListElement: ipos.slice(0, 50).map((ipo, i) => {
      const name =
        getValue(
          ipo,
          "name",
          "fullName",
          "company_information.company_name",
          "company_name"
        ) || "Unknown IPO";

      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "FinancialProduct",
          name: `${name} IPO`,
          url: `${siteUrl}/ipo/${ipo.id}/${
            ipo.slug || ""
          }`,
          category: getValue(
            ipo,
            "ipo_basic_details.ipo_type",
            "type",
            "ipo_type"
          ) || "IPO",
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price:
              getValue(ipo, "price", "price_band", "priceBand") ||
              undefined,
            availabilityStarts: getValue(
              ipo,
              "open",
              "openDate",
              "subscription_open"
            ),
            availabilityEnds: getValue(
              ipo,
              "close",
              "closeDate",
              "subscription_close"
            ),
          },
        },
      };
    }),
  };
}

export default async function Page() {
  const ipos = await fetchIPOs();
  const jsonLd = buildIpoJsonLd(ipos || []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IpoList initialIpos={ipos} />
    </>
  );
}