import IpoList from "../../../src/components/IpoList";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sharebazaaronline.com';

export const metadata = {
  title: "IPO Tracker — ShareBazaarOnline",
  description: "Live & upcoming IPOs in India — price bands, lot sizes, GMP trends, and subscription insights.",
  alternates: { canonical: siteUrl + '/ipo' },
};

export default function Page() {
  return <IpoList />;
}
