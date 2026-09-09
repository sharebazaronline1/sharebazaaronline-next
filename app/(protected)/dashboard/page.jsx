// app/dashboard/page.jsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient from '@/components/DashboardClient';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sharebazaaronline.com";

export async function generateMetadata() {
  return {
    title: "Dashboard - ShareBazaarOnline",
    description: "Access your ShareBazaarOnline dashboard to track IPOs, unlisted shares, portfolio performance, and manage your investments.",
    alternates: {
      canonical: `${SITE_URL}/dashboard`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

async function getDashboardData(supabase, userId) {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("account_status")
      .eq("id", userId)
      .single();

    const { data: userOrders } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const { data: preIPOData } = await supabase
      .from("pre_ipo_companies")
      .select("id, name, price")
      .order("updated_at", { ascending: false });

    return {
      profile: profile || null,
      orders: userOrders || [],
      trendingShares: preIPOData || [],
      upcomingShares: preIPOData || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      profile: null,
      orders: [],
      trendingShares: [],
      upcomingShares: [],
    };
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if no user
  if (!user) {
    redirect('/login');
  }

  const { profile, orders, trendingShares, upcomingShares } = await getDashboardData(supabase, user.id);

  return (
    <DashboardClient 
      user={user}
      profile={profile}
      initialOrders={orders}
      initialTrendingShares={trendingShares}
      initialUpcomingShares={upcomingShares}
    />
  );
}