import { createClient } from "@supabase/supabase-js";
import { fetchIPOs } from "@/api/mockApi";
import IPOCalendarClient from "@/components/IPOCalendarClient";

export const metadata = {
  title: "IPO Calendar 2026 | Live, Upcoming & Listing Dates — ShareBazaarOnline",
  description:
    "Track upcoming IPO subscription windows, close dates and listing days in a single calendar view.",
  alternates: { canonical: "https://www.sharebazaaronline.com/ipo-calendar" },
};

export const revalidate = 300;

export default async function Page() {
  let initialIpos = [];
  try {
    initialIpos = (await fetchIPOs()) || [];
  } catch (err) {
    console.error("[IPO Calendar] fetch failed:", err?.message);
  }
  return <IPOCalendarClient initialIpos={initialIpos} />;
}