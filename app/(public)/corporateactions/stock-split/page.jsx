import CorporateActionsPage from "../_lib/CorporateActionsPage";
const SITE_URL = "https://www.sharebazaaronline.com";
export const revalidate = 300;
export const metadata = {
  title: {
    absolute:
      "Upcoming Stock Splits — Ratios & Ex-Dates | ShareBazaarOnline",
  },
  description:
    "Track upcoming stock splits from Indian listed companies — split ratio, old and new face value, record dates, and ex-dates.",
  alternates: { canonical: `${SITE_URL}/corporateactions/stock-split` },
  robots: { index: true, follow: true },
};
export default function Page() {
  return <CorporateActionsPage tabId="splits" />;
}