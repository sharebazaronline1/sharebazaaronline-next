import Home from "../../src/components/home/Home";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sharebazaaronline.com';

export const metadata = {
  title: "ShareBazaarOnline | IPO Tracker, Unlisted Shares & Broker Comparison",
  description:
    "Track IPOs, GMP, IPO allotment status, unlisted shares, corporate actions, broker comparisons and investment insights in one place.",

  alternates: {
    canonical: siteUrl + '/',
  },

  openGraph: {
    title: "ShareBazaarOnline",
    description:
      "India's platform for IPO tracking, unlisted shares and investment research.",
    url: siteUrl + '/',
    siteName: "ShareBazaarOnline",
    images: [
      {
        url: siteUrl + '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ShareBazaarOnline",
    description:
      "IPO Tracker, Unlisted Shares, Broker Comparison and Investment Insights.",
    images: [siteUrl + '/og-image.jpg'],
  },
};

export default function Page() {
  return <Home />;
}