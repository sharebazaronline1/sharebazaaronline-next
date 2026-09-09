// app/holdings/page.jsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import HoldingsClient from '@/components/HoldingsClient';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sharebazaaronline.com";

export async function generateMetadata() {
  return {
    title: "Holdings - ShareBazaarOnline | Your Pre-IPO & Unlisted Shares",
    description: "View your settled holdings including Pre-IPO and unlisted shares. Track your investments and portfolio value.",
    alternates: {
      canonical: `${SITE_URL}/holdings`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: "Holdings - ShareBazaarOnline",
      description: "View your settled holdings including Pre-IPO and unlisted shares.",
      url: `${SITE_URL}/holdings`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Holdings - ShareBazaarOnline",
      description: "View your settled holdings including Pre-IPO and unlisted shares.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

async function getUserHoldings(userId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      asset_name,
      quantity,
      price,
      total,
      created_at,
      status
    `)
    .eq("status", "SETTLED")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching holdings:", error);
    return [];
  }

  // Process data for consistency
  return (data || []).map(item => ({
    ...item,
    average_price: item.price,
    total_value: item.total,
  }));
}

export default async function HoldingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const initialHoldings = await getUserHoldings(user.id);

  return <HoldingsClient user={user} initialHoldings={initialHoldings} />;
}