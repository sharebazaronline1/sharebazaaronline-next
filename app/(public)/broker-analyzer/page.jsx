// app/broker-analyzer/page.jsx
import { Metadata } from 'next';
import BrokerAnalyzerClient from '@/components/BrokerAnalyzerClient';

const SITE_URL = "https://sharebazaaronline.com";

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "Broker Analyzer - Compare Top Stock Brokers in India 2026 | ShareBazaarOnline",
    description: "Compare top stock brokers in India side by side. Check brokerage charges, account opening fees, ratings, active users, and trading segments. Find the best broker for your trading needs.",
    alternates: {
      canonical: `${SITE_URL}/broker-analyzer`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: "Broker Analyzer - Compare Top Stock Brokers in India",
      description: "Make the right choice by comparing brokerage charges, ratings, and features of India's top stock brokers side by side.",
      url: `${SITE_URL}/broker-analyzer`,
      type: "article",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: "Broker Analyzer - Compare Stock Brokers",
      description: "Compare India's top stock brokers side by side. Check brokerage charges, ratings, and features.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    keywords: "Broker Analyzer, Compare Brokers, Stock Broker Comparison, Brokerage Charges, Best Stock Broker India, Discount Broker, Full Service Broker, ShareBazaarOnline",
  };
}

// Main page component - SERVER COMPONENT
export default function BrokerAnalyzerPage() {
  return <BrokerAnalyzerClient />;
}