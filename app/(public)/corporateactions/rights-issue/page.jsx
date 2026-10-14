import CorporateActionsPage from "../_lib/CorporateActionsPage";
const SITE_URL = "https://www.sharebazaaronline.com";
export const revalidate = 300;
export const metadata = {
  title: {
    absolute:
      "Upcoming Rights Issues — Record Dates & Ex-Dates | ShareBazaarOnline",
  },
  description:
    "Track upcoming rights issues from Indian listed companies — ratio, rights price, record dates, and ex-dates.",
  alternates: { canonical: `${SITE_URL}/corporateactions/rights-issue` },
  robots: { index: true, follow: true },
};
export default function Page() {
  return <CorporateActionsPage tabId="rights" />;
}