// app/settings/page.jsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SettingsClient from '@/components/SettingsClient';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sharebazaaronline.com";

export async function generateMetadata() {
  return {
    title: "Settings - ShareBazaarOnline | Manage Your Account",
    description: "Manage your profile, security, notification preferences, and app settings on ShareBazaarOnline.",
    alternates: {
      canonical: `${SITE_URL}/settings`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: "Settings - ShareBazaarOnline",
      description: "Manage your profile, security, notification preferences, and app settings.",
      url: `${SITE_URL}/settings`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Settings - ShareBazaarOnline",
      description: "Manage your profile, security, notification preferences, and app settings.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

async function getUserData(userId) {
  const supabase = await createClient();

  // Fetch additional user data from profiles table if needed
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Optionally fetch profile data from profiles table
  const profile = await getUserData(user.id);

  return (
    <SettingsClient
      user={user}
      profile={profile}
    />
  );
}