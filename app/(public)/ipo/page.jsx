import IPODashboard from "@/components/IpoDashboard";
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

// ─── Shared date parser (used by both JSON-LD and defaultTab) ─────────────
const MONTHS = {
  Jan: 0, January: 0,
  Feb: 1, February: 1,
  Mar: 2, March: 2,
  Apr: 3, April: 3,
  May: 4,
  Jun: 5, June: 5,
  Jul: 6, July: 6,
  Aug: 7, August: 7,
  Sep: 8, Sept: 8, September: 8,
  Oct: 9, October: 9,
  Nov: 10, November: 10,
  Dec: 11, December: 11,
};

function parseDate(dateStr) {
  if (!dateStr) return null;

  if (dateStr instanceof Date) {
    return isNaN(dateStr.getTime()) ? null : dateStr;
  }

  const str = String(dateStr).trim();
  const spaceParts = str.split(/\s+/);

  if (spaceParts.length >= 3) {
    const [day, monthStr, year] = spaceParts;
    const month = MONTHS[monthStr];
    if (month !== undefined && year) {
      const d = new Date(Number(year), month, Number(day));
      return isNaN(d.getTime()) ? null : d;
    }
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function getField(obj, ...paths) {
  for (const path of paths) {
    const value = path.split(".").reduce((o, key) => o?.[key], obj);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

// ─── Compute which tab has data, at SSR time ──────────────────────────────
function computeDefaultTab(ipos) {
  if (!ipos || ipos.length === 0) return "Open";

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const counts = { Open: 0, Closed: 0, Upcoming: 0 };

  for (const ipo of ipos) {
    const openStr = getField(
      ipo,
      "open",
      "openDate",
      "subscription_open",
      "subscription_start_date"
    );
    const closeStr = getField(
      ipo,
      "close",
      "closeDate",
      "subscription_close",
      "subscription_end_date"
    );

    const openDate = parseDate(openStr);
    const closeDate = parseDate(closeStr);

    if (!openDate) {
      counts.Upcoming++;
      continue;
    }

    const open = new Date(openDate);
    open.setHours(0, 0, 0, 0);

    if (closeDate) {
      const close = new Date(closeDate);
      close.setHours(23, 59, 59, 999);

      if (now < open) counts.Upcoming++;
      else if (now >= open && now <= close) counts.Open++;
      else counts.Closed++;
    } else if (now < open) {
      counts.Upcoming++;
    } else {
      counts.Open++;
    }
  }

  return ["Open", "Closed", "Upcoming"].find((t) => counts[t] > 0) || "Open";
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────
function buildIpoJsonLd(ipos) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Live & Upcoming IPOs in India",
    description:
      "Current IPO price bands, lot sizes, subscription dates, and listing schedules.",
    numberOfItems: ipos.length,
    itemListElement: ipos.slice(0, 50).map((ipo, i) => {
      const name =
        getField(
          ipo,
          "name",
          "fullName",
          "company_information.company_name",
          "company_name"
        ) || "Unknown IPO";

      // ── Fixed: no trailing slash when slug is missing ──
      const url = ipo.slug
        ? `${siteUrl}/ipo/${ipo.id}/${ipo.slug}`
        : `${siteUrl}/ipo/${ipo.id}`;

      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "FinancialProduct",
          name: `${name} IPO`,
          url,
          category:
            getField(
              ipo,
              "ipo_basic_details.ipo_type",
              "type",
              "ipo_type"
            ) || "IPO",
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price:
              getField(ipo, "price", "price_band", "priceBand") ||
              undefined,
            availabilityStarts: getField(
              ipo,
              "open",
              "openDate",
              "subscription_open"
            ),
            availabilityEnds: getField(
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
  const safeIpos = Array.isArray(ipos) ? ipos : [];

  const jsonLd = buildIpoJsonLd(safeIpos);
  const defaultTab = computeDefaultTab(safeIpos);
  const now = new Date().toISOString();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IPODashboard
        initialIpos={safeIpos}
        defaultTab={defaultTab}
        now={now}
      />
    </>
  );
}