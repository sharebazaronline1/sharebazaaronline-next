// app/corporateactions/page.jsx
import { Metadata } from 'next';
import CorporateActionsClient from '@/components/CorporateActionsClient';

const SITE_URL = "https://sharebazaaronline.com";

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "Corporate Actions - Buyback, Dividends, Bonus, Split | ShareBazaarOnline",
    description: "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",
    alternates: {
      canonical: `${SITE_URL}/corporateactions`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: "Corporate Actions Calendar - Track Buybacks, Dividends & More",
      description: "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",
      url: `${SITE_URL}/corporateactions`,
      type: "article",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: "Corporate Actions Calendar - Track All Corporate Events",
      description: "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    keywords: "Corporate Actions, Buyback, Dividends, Bonus Issue, Stock Split, Rights Issue, Record Date, Ex Date, Corporate Events, ShareBazaarOnline",
  };
}

// Main page component - SERVER COMPONENT
export default function CorporateActionsPage() {
  return <CorporateActionsClient />;
}