import CorporateActionsPage from "../_lib/CorporateActionsPage";
const SITE_URL = "https://www.sharebazaaronline.com";
export const revalidate = 300;
export const metadata = {
  title: {
    absolute:
      "Other Corporate Actions — Mergers, Demergers, Delistings | ShareBazaarOnline",
  },
  description:
    "Track other corporate actions — mergers, demergers, delistings, open offers, QIPs, and more — with key details and dates.",
  alternates: { canonical: `${SITE_URL}/corporateactions/other-actions` },
  robots: { index: true, follow: true },
};
export default function Page() {
  return <CorporateActionsPage tabId="others" />;
}