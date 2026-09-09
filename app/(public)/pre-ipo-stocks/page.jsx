import PreIPOList from "../../../src/components/PreIPOList";
import { fetchPreIPODetails } from "@/api/mockApi";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Pre-IPO & Unlisted Shares | ShareBazaarOnline",
  description:
    "Discover pre-IPO and unlisted companies, track pricing and availability before they list. Find private company opportunities and market insights.",
  openGraph: {
    title: "Pre-IPO & Unlisted Shares | ShareBazaarOnline",
    description:
      "Discover pre-IPO and unlisted companies, track pricing and availability before they list.",
  },
};

export const revalidate = 300;

export default async function Page() {
  const detailedData = await fetchPreIPODetails();

  const { data: dbData, error } = await supabase
    .from("pre_ipo_companies")
    .select("name, price, lot_size");

  if (error) {
    console.error("Supabase error:", error);
  }

  const normalizeName = (str = "") => {
    return str
      .toLowerCase()
      .replace(
        /limited|ltd|llp|private|unlisted|shares?|share/gi,
        ""
      )
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const dbMap = {};

  dbData?.forEach((db) => {
    const key = normalizeName(db.name);
    dbMap[key] = db;
  });

  const merged = (detailedData || []).map((item) => {
    const key = normalizeName(item.name);

    let dbItem = dbMap[key];

    if (!dbItem) {
      const bestMatch = Object.keys(dbMap).find(
        (dbKey) =>
          dbKey.includes(key) || key.includes(dbKey)
      );

      if (bestMatch) {
        dbItem = dbMap[bestMatch];
      }
    }

    return {
      ...item,

      price:
        dbItem?.price != null
          ? Number(dbItem.price)
          : Number(item.price || 0),

      minLotSize:
        dbItem?.lot_size != null
          ? String(dbItem.lot_size)
          : item.minLotSize || "-",

      depository:
        item.shareDetails?.depository ||
        item.depository ||
        "NSDL & CDSL",
    };
  });

  return <PreIPOList initialIPOs={merged} />;
}