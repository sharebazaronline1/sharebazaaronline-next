// app/unlisted-guide/page.jsx
import UnlistedGuideClient from '@/components/UnlistedGuideClient';

export const metadata = {
  title: 'Unlisted Shares Guide - Pre-IPO Investing, Taxation & Risks | ShareBazaarOnline',
  description: 'Complete guide to unlisted shares in India. Learn about pre-IPO investing, valuation, taxation, risks, regulations, and how to buy unlisted shares. Expert insights for investors.',
  keywords: 'unlisted shares, pre-IPO shares, unlisted shares India, buy unlisted shares, unlisted shares taxation, pre-IPO investing, unlisted shares guide',
  alternates: {
    canonical: 'https://sharebazaaronline.com/unlisted-guide',
  },
  openGraph: {
    title: 'Unlisted Shares Guide - Pre-IPO Investing, Taxation & Risks',
    description: 'Complete guide to unlisted shares in India. Learn about pre-IPO investing, valuation, taxation, risks, and regulations.',
    url: 'https://sharebazaaronline.com/unlisted-guide',
    type: 'article',
    images: [{ url: 'https://sharebazaaronline.com/og-image.jpg' }],
    siteName: 'ShareBazaarOnline',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unlisted Shares Guide - Pre-IPO Investing',
    description: 'Complete guide to unlisted shares in India. Learn about pre-IPO investing, taxation, and risks.',
    images: ['https://sharebazaaronline.com/og-image.jpg'],
  },
};

export default function UnlistedGuidePage() {
  return <UnlistedGuideClient />;
}