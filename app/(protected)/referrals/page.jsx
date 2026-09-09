// app/referrals/page.jsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ReferralsClient from '@/components/ReferralsClient';
import { generateShortId } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sharebazaaronline.com";

export async function generateMetadata() {
  return {
    title: "Referrals - ShareBazaarOnline | Earn Rewards by Referring Friends",
    description: "Refer your friends to ShareBazaarOnline and earn rewards on every successful order. Share your referral link and start earning today.",
    alternates: {
      canonical: `${SITE_URL}/referrals`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: "Referrals - ShareBazaarOnline",
      description: "Refer your friends to ShareBazaarOnline and earn rewards on every successful order.",
      url: `${SITE_URL}/referrals`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Referrals - ShareBazaarOnline",
      description: "Refer your friends to ShareBazaarOnline and earn rewards on every successful order.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

async function getReferralData(userId) {
  const supabase = await createClient();

  // 1. Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('sb_user_id, commission_rate')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return { error: 'Profile not found' };
  }

  let referralCode = profile.sb_user_id;
  const commissionRate = (profile.commission_rate || 0) / 100;

  // If no referral code, generate and update
  if (!referralCode) {
    referralCode = generateShortId(userId);
    await supabase
      .from('profiles')
      .update({ sb_user_id: referralCode })
      .eq('id', userId);
  }

  // 2. Fetch referrals (using referrer_sb_user_id = userId UUID)
  const { data: referrals, error: referralsError } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_sb_user_id', userId)
    .order('created_at', { ascending: false });

  if (referralsError) {
    console.error('Error fetching referrals:', referralsError);
    return { error: 'Failed to fetch referrals' };
  }

  // 3. Compute commissions
  const referredUserIds = referrals
    .map(r => r.referred_sb_user_id)
    .filter(id => id);

  let ordersMap = {};
  if (referredUserIds.length > 0) {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('user_id, total')
      .in('user_id', referredUserIds);

    if (!ordersError && orders) {
      ordersMap = orders.reduce((acc, order) => {
        if (!acc[order.user_id]) acc[order.user_id] = [];
        acc[order.user_id].push(order);
        return acc;
      }, {});
    }
  }

  const enrichedReferrals = referrals.map(ref => {
    const userOrders = ordersMap[ref.referred_sb_user_id] || [];
    const totalCommission = userOrders.reduce((sum, order) => {
      return sum + (Number(order.total) || 0) * commissionRate;
    }, 0);
    return {
      ...ref,
      totalCommission: Math.round(totalCommission * 100) / 100,
    };
  });

  const totalRewards = enrichedReferrals.reduce((acc, r) => acc + (r.totalCommission || 0), 0);
  const totalRewardsRounded = Math.round(totalRewards * 100) / 100;

  return {
    referralCode,
    commissionRate,
    referrals: enrichedReferrals,
    totalRewards: totalRewardsRounded,
    profile,
  };
}

export default async function ReferralsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const data = await getReferralData(user.id);
  if (data.error) {
    // Fallback: render with empty data
    return (
      <ReferralsClient
        user={user}
        referralCode=""
        commissionRate={0}
        referrals={[]}
        totalRewards={0}
      />
    );
  }

  return (
    <ReferralsClient
      user={user}
      referralCode={data.referralCode}
      commissionRate={data.commissionRate}
      referrals={data.referrals}
      totalRewards={data.totalRewards}
    />
  );
}