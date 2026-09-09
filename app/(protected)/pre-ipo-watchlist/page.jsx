// app/pre-ipo-watchlist/page.jsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PreIPOWatchlistClient from '@/components/PreIPOWatchlistClient';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sharebazaaronline.com";

export async function generateMetadata() {
  return {
    title: "Pre-IPO Watchlist - ShareBazaarOnline | Track Unlisted Shares",
    description: "Track your favorite pre-IPO and unlisted companies. Monitor prices, demand, ISIN, and expected IPO dates.",
    alternates: {
      canonical: `${SITE_URL}/pre-ipo-watchlist`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: "Pre-IPO Watchlist - ShareBazaarOnline",
      description: "Track your favorite pre-IPO and unlisted companies. Monitor prices, demand, ISIN, and expected IPO dates.",
      url: `${SITE_URL}/pre-ipo-watchlist`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Pre-IPO Watchlist - ShareBazaarOnline",
      description: "Track your favorite pre-IPO and unlisted companies.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function PreIPOWatchlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // In the future, you could fetch user-specific watchlist from Supabase
  // For now, we pass the static watchlist data to the client component
  // The client component will have the static data defined there.
  // We'll just pass an empty object or the user info.
  return <PreIPOWatchlistClient user={user} />;
}