// app/comparebrokers/page.jsx
import { Suspense } from "react";
import CompareBrokerClient from "@/components/CompareBrokerClient";

const SITE_URL = "https://sharebazaaronline.com";

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title:
      "Compare Best Stock Brokers in India 2026 - Brokerage Charges & Ratings | ShareBazaarOnline",

    description:
      "Compare top stock brokers in India side by side. Check brokerage charges, account opening fees, ratings, active users, and trading segments to find the best broker for your needs.",

    alternates: {
      canonical: `${SITE_URL}/comparebrokers`,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title:
        "Compare Top Stock Brokers in India - Brokerage & Fees Comparison",

      description:
        "Make the right choice by comparing brokerage charges, ratings, and features of India's top stock brokers side by side. Find the best broker for your trading needs.",

      url: `${SITE_URL}/comparebrokers`,
      type: "article",

      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
        },
      ],

      siteName: "ShareBazaarOnline",
      locale: "en_IN",
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    },

    twitter: {
      card: "summary_large_image",

      title:
        "Compare Stock Brokers - Brokerage & Fees Comparison",

      description:
        "Compare India's top stock brokers side by side. Check brokerage charges, ratings, and features.",

      images: [`${SITE_URL}/og-image.jpg`],
    },

    keywords:
      "Compare Brokers, Stock Broker Comparison, Brokerage Charges, Best Stock Broker India, Discount Broker, Full Service Broker, Trading Platform, ShareBazaarOnline",
  };
}

export default function CompareBrokerPage() {
  return (
    <Suspense fallback={null}>
      <CompareBrokerClient />
    </Suspense>
  );
}