// app/orders/page.jsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import OrdersClient from '@/components/OrdersClient';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sharebazaaronline.com";

export async function generateMetadata() {
  return {
    title: "Orders - ShareBazaarOnline | Buy & Sell Pre-IPO Shares",
    description: "Manage your Pre-IPO buy and sell orders. Track order history, submit new requests, and monitor your investments.",
    alternates: {
      canonical: `${SITE_URL}/orders`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: "Orders - ShareBazaarOnline",
      description: "Manage your Pre-IPO buy and sell orders. Track order history.",
      url: `${SITE_URL}/orders`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Orders - ShareBazaarOnline",
      description: "Manage your Pre-IPO buy and sell orders.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch initial orders on the server (optional but improves performance)
  // We'll pass them as initialOrders to the client
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return <OrdersClient user={user} initialOrders={orders || []} />;
}