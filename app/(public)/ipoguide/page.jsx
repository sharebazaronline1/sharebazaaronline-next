// app/ipoguide/page.jsx
import { Metadata } from 'next';
import IPOGuideClient from '@/components/IPOGuideClient';

const SITE_URL = "https://sharebazaaronline.com";

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "IPO Guide 2026 - Complete Guide to IPO Investing in India | ShareBazaarOnline",
    description: "Complete IPO guide for Indian investors. Learn about IPO types, allotment process, GMP, SME IPOs, taxation, and how to apply for IPOs online. Get expert insights on ShareBazaarOnline.",
    alternates: {
      canonical: `${SITE_URL}/ipoguide`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: "IPO Guide - Master IPO Investing in India",
      description: "Learn everything about IPO investing in India. Complete guide covering IPO types, allotment, GMP, SME IPOs, taxation, and application process.",
      url: `${SITE_URL}/ipoguide`,
      type: "article",
      images: [{ url: `${SITE_URL}/og-image.jpg` }],
      siteName: "ShareBazaarOnline",
      locale: "en_IN",
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: "IPO Guide - Complete IPO Investing Guide",
      description: "Learn everything about IPO investing in India. Complete guide for beginners and experienced investors.",
      images: [`${SITE_URL}/og-image.jpg`],
    },
    keywords: "IPO Guide, IPO Investing, IPO Allotment, SME IPO, IPO GMP, IPO Taxation, How to apply IPO, ShareBazaarOnline",
  };
}

// Main page component - SERVER COMPONENT
export default function IPOGuidePage() {
  return <IPOGuideClient />;
}