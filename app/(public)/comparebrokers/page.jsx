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
      "broker comparison, broker app, compare stock brokers, online broker comparison, compare stock broker, brokers with lowest fees, best broker for stock trading, broker comparison india, broker demat account, broker commodity, broker futures, broker options, broker type, demat account broker list, demat account comparison, top brokers comparison, best broker comparison, broker review, broker app, broker account opening, broker customer service, broker currency, broker equity, brokerage account comparison, how to choose the best broker, best brokers for beginner investors, broker for beginners, best demat account broker",
  };
}

export default function CompareBrokerPage() {
  return (
    <Suspense fallback={null}>
      <CompareBrokerClient />
    </Suspense>
  );
}