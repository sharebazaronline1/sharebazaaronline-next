// app/how-to-apply-ipo/page.jsx
import { Metadata } from 'next';
import HowToApplyIPOClient from '@/components/HowToApplyIPOClient';

const SITE_URL = "https://sharebazaaronline.com";

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "How to Apply for IPO - Step by Step Guide 2026 | ShareBazaarOnline",
    description: "Learn how to apply for IPO online in India through UPI & ASBA. Complete step-by-step guide with multiple bids, allotment process, and important tips for retail investors.",
    alternates: {
      canonical: `${SITE_URL}/how-to-apply-ipo`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: "How to Apply for IPO - Complete Guide for Indian Investors",
      description: "Learn how to apply for IPO online in India through UPI & ASBA. Complete step-by-step guide with multiple bids, allotment process, and important tips.",
      url: `${SITE_URL}/how-to-apply-ipo`,
      type: "article",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: "How to Apply for IPO - Step by Step Guide",
      description: "Learn how to apply for IPO online in India through UPI & ASBA. Complete guide for retail investors.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    keywords: "IPO Application, How to apply IPO, IPO process, UPI IPO, ASBA IPO, IPO allotment, IPO bidding, IPO for beginners, ShareBazaarOnline",
  };
}

// Main page component - SERVER COMPONENT
export default function HowToApplyIPOPage() {
  return <HowToApplyIPOClient />;
}