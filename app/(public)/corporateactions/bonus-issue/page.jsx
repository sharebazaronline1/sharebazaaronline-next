import CorporateActionsPage from "../_lib/CorporateActionsPage";
const SITE_URL = "https://www.sharebazaaronline.com";
export const revalidate = 300;
export const metadata = {
  title: {
    absolute:
      "Upcoming Bonus Issues — Ratios & Ex-Dates | ShareBazaarOnline",
  },
  description:
    "Track upcoming bonus issues from Indian listed companies — bonus ratio, record dates, and ex-dates.",
  alternates: { canonical: `${SITE_URL}/corporateactions/bonus-issue` },
  robots: { index: true, follow: true },
};
export default function Page() {
  return <CorporateActionsPage tabId="bonus" />;
}