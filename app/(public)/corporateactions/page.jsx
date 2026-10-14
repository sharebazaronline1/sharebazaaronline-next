// app/corporateactions/page.jsx
import CorporateActionsPage from "./_lib/CorporateActionsPage";

const SITE_URL = "https://www.sharebazaaronline.com";

export const revalidate = 300;

export const metadata = {
  title: {
    absolute:
      "Corporate Actions - Buyback, Dividends, Bonus, Split | ShareBazaarOnline",
  },
  description:
    "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",
  keywords:
    "Corporate Actions, Buyback, Dividends, Bonus Issue, Stock Split, Rights Issue, Record Date, Ex Date, Corporate Events, ShareBazaarOnline",
  alternates: { canonical: `${SITE_URL}/corporateactions` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Corporate Actions Calendar - Track Buybacks, Dividends & More",
    description:
      "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more.",
    url: `${SITE_URL}/corporateactions`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg` }],
    siteName: "ShareBazaarOnline",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Actions Calendar - Track All Corporate Events",
    description:
      "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function Page() {
  return <CorporateActionsPage tabId="buyback" />;
}