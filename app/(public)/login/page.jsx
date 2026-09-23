// app/login/page.jsx

import { Suspense } from "react";
import LoginClient from "@/components/LoginClient";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.sharebazaaronline.com";

export async function generateMetadata() {
  return {
    title: "Login - ShareBazaarOnline | Access Your Investment Dashboard",
    description:
      "Login to your ShareBazaarOnline account to track IPOs, unlisted shares, corporate actions, and manage your investment portfolio.",
    alternates: {
      canonical: `${SITE_URL}/login`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: "Login - ShareBazaarOnline",
      description:
        "Login to your ShareBazaarOnline account to track IPOs, unlisted shares, and manage your investments.",
      url: `${SITE_URL}/login`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Login - ShareBazaarOnline",
      description:
        "Login to your ShareBazaarOnline account to track IPOs, unlisted shares, and manage your investments.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
  };
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}