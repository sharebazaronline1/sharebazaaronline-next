// app/kyc/page.jsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DocumentsClient from '@/components/DocumentsClient';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sharebazaaronline.com";

export async function generateMetadata() {
  return {
    title: "KYC & Documents - ShareBazaarOnline | Account Verification",
    description: "Complete your KYC verification to start trading. Upload PAN, Aadhaar, CMR, and bank details securely.",
    alternates: {
      canonical: `${SITE_URL}/kyc`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: "KYC & Documents - ShareBazaarOnline",
      description: "Complete your KYC verification to start trading. Upload documents securely.",
      url: `${SITE_URL}/kyc`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "KYC & Documents - ShareBazaarOnline",
      description: "Complete your KYC verification to start trading.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

async function getKycData(userId) {
  const supabase = await createClient();

  const { data: kyc, error } = await supabase
    .from("user_kyc")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching KYC:", error);
    return null;
  }

  return kyc;
}

export default async function KYCPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const initialKyc = await getKycData(user.id);



  return (
    <DocumentsClient
      user={user}
      initialKyc={initialKyc}
    />
  );
}