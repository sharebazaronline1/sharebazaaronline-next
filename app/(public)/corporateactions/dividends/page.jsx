import CorporateActionsPage from "../_lib/CorporateActionsPage";
const SITE_URL = "https://www.sharebazaaronline.com";
export const revalidate = 300;
export const metadata = {
  title: {
    absolute:
      "Upcoming Dividends — Record Dates & Ex-Dates | ShareBazaarOnline",
  },
  description:
    "Track upcoming dividend announcements for Indian listed companies — record dates, ex-dividend dates, and payment schedules. Updated daily.",
  alternates: { canonical: `${SITE_URL}/corporateactions/dividends` },
  robots: { index: true, follow: true },
};
export default function Page() {
  return <CorporateActionsPage tabId="dividends" />;
}