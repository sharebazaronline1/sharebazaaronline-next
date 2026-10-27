// app/corporate-actions-calendar/page.jsx
import { createClient } from "@supabase/supabase-js";
import CorporateActionsCalendarClient from "@/components/CorporateActionsCalendarClient";

const SITE_URL = "https://www.sharebazaaronline.com";

const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);

export const metadata = {
  title: "Corporate Actions Calendar — Buyback, Dividend, Bonus, Split | ShareBazaarOnline",
  description:
    "Calendar view of corporate actions across Indian listed companies. Track ex-dates for buybacks, dividends, bonus issues, stock splits and rights issues.",
  alternates: { canonical: `${SITE_URL}/corporate-actions-calendar` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Corporate Actions Calendar | ShareBazaarOnline",
    description:
      "Calendar view of corporate actions across Indian listed companies.",
    url: `${SITE_URL}/corporate-actions-calendar`,
    type: "website",
    siteName: "ShareBazaarOnline",
    locale: "en_IN",
  },
};

// ✅ CHANGED: Increased to 1 hour to reduce ISR writes
export const revalidate = 3600;

async function getCorporateActions() {
  try {
    const { data, error } = await supabasePublic
      .from("corporate_actions")
      .select(
        `
        *,
        blog:blogs (
          id,
          slug,
          heading
        )
      `
      )
      .order("ex_date", { ascending: false })
      .limit(2000);

    if (error) {
      console.error("[getCorporateActions] supabase error:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("[getCorporateActions] exception:", err?.message || err);
    return [];
  }
}

export default async function CorporateActionsCalendarPage() {
  const records = await getCorporateActions();

  return <CorporateActionsCalendarClient initialRecords={records} />;
}