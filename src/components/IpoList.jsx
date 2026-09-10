// src/components/IPODashboard.jsx (Only IPO Cards Section)
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import slugify from "../utils/slugify";

const LetterAvatar = ({ name }) => (
  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-800 text-white font-bold text-sm">
    {name?.charAt(0)?.toUpperCase() || "I"}
  </div>
);

const formatDateRange = (open, close) => {
  if (!open || !close) return "—";

  const [oDay, oMonth] = open.split(" ");
  const [cDay, cMonth] = close.split(" ");

  return `${oDay}–${cDay} ${cMonth}`;
};

const isIPOActiveByDate = (open, close) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const o = parseDate(open);
  const c = parseDate(close);

  if (!o || !c) return false;

  c.setHours(23, 59, 59, 999);

  return o <= today && today <= c;
};
 const parseDate = (dateStr) => {
  if (!dateStr) return null;

  const [day, monthStr, year] = dateStr.split(" ");
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  return new Date(year, months[monthStr], Number(day));
};
export const IPOCard = ({ ipo }) => {
  const router = useRouter();
const getIPOType = (ipo) => {
  if (ipo?.ipo_basic_details?.ipo_type) {
    return ipo.ipo_basic_details.ipo_type
      .replace(/ipo/i, "")
      .trim()
      .toUpperCase();
  }

  if (ipo?.type) {
    return ipo.type.toUpperCase();
  }

  const name = (ipo?.fullName || ipo?.name || "").toLowerCase();
  return name.includes("sme") ? "SME" : "MAINBOARD";
};
const rawType = getIPOType(ipo);
const type = rawType === "SME" ? "SME" : "Mainboard";

  const typeColor =
    type === "SME"
      ? "bg-blue-100 text-blue-700 border border-blue-200"
      : "bg-green-100 text-green-700 border border-green-200";

  const isLive = isIPOActiveByDate(ipo.open, ipo.close);

  return (
    <div
  className="
    w-full
    bg-white
    border border-gray-200
    rounded-2xl
    shadow-sm
    flex flex-col
    h-full
  "
>
      <div className="p-4 flex flex-col gap-2 h-full">
        <div className="flex gap-3 items-start">
          {ipo.logo ? (
            <img
              src={ipo.logo}
              alt={ipo.name}
              className="w-12 h-12 rounded-xl object-contain border bg-gray-50 p-1"
            />
          ) : (
            <LetterAvatar name={ipo.name} />
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-gray-900 truncate">
              {ipo.name}
            </h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {ipo.about_company?.company_name || "IPO"}
            </p>

            <div className="flex items-center gap-2 mt-1 overflow-x-hidden">
              {isLive && (
                <span className="inline-flex items-center gap-1 px-2 text-xs rounded-full bg-red-50 text-red-700 border border-red-200 flex-shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-70"></span>
                    <span className="relative inline-flex h-full w-full rounded-full bg-red-600"></span>
                  </span>
                  Live
                </span>
              )}

              <span className={`inline-flex items-center px-0.5 text-xs rounded flex-shrink-0 ${typeColor}`}>
                {type}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 text-sm grid grid-cols-2 gap-y-1 gap-x-2">
          <span className="text-gray-600">Dates</span>
          <span className="font-medium text-gray-900">{formatDateRange(ipo.open, ipo.close)}</span>
          <span className="text-gray-600">Price</span>
          <span className="font-medium text-gray-900">{ipo.price}</span>
          <span className="text-gray-600">Lot</span>
          <span className="font-medium text-gray-900">{ipo.lot} shares</span>
          <span className="text-gray-600">Listing</span>
          <span className="font-medium text-gray-900">{ipo.listing || "TBA"}</span>
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => router.push("/how-to-apply-ipo")}
            className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl"
          >
            Apply
          </button> 
          <button
           onClick={() =>
  router.push(
    `/ipo/${ipo.id}/${slugify(
      ipo.name || ipo.fullName
    )}`
  )
}
            className="flex-1 py-2.5 border border-green-300 text-green-700 text-xs font-semibold rounded-xl"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

const IpoList = ({ ipos = [] }) => {
  const router = useRouter();



  const today = new Date();
  today.setHours(0, 0, 0, 0);

 const top8IPOs = useMemo(() => {
  return ipos
    .map((ipo) => {
      const openDate = parseDate(ipo.open);
      const closeDate = parseDate(ipo.close);

      if (!openDate || !closeDate) return null;

      closeDate.setHours(23, 59, 59, 999);

      return {
        ...ipo,
        _openDate: openDate,
        _closeDate: closeDate,
      };
    })
    .filter(
      (ipo) =>
        ipo &&
        ipo._openDate <= today &&
        today <= ipo._closeDate
    )
    .sort((a, b) => a._closeDate - b._closeDate)
    .slice(0, 8);
}, [ipos]);

  return (
    <div className="py-4 px-4 lg:py-4">
      <div className="w-full">
        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-4 gap-4">
          {top8IPOs.length > 0 ? (
            top8IPOs.map((ipo, i) => (
              <motion.div
                key={ipo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="h-full"
              >
                <IPOCard ipo={ipo} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-4 py-20 text-center">
              <p className="text-2xl font-semibold text-gray-600">
                No Live IPOs Right Now
              </p>
              <p className="text-lg text-gray-500 mt-4">
                Check back soon for upcoming IPOs or explore Pre-IPO & Unlisted Shares.
              </p>
            </div>
          )}
        </div>

      
{/* Mobile / Tablet Vertical Layout */}
<div className="lg:hidden">
  {top8IPOs.length > 0 ? (

    <div className="space-y-4">

      {top8IPOs.map((ipo, i) => (

        <motion.div
          key={ipo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <IPOCard ipo={ipo} />
        </motion.div>

      ))}

    </div>

  ) : (

    <div className="py-12 text-center">

      <p className="text-xl font-semibold text-gray-600">
        No Live IPOs Right Now
      </p>

      <p className="text-sm text-gray-500 mt-3">
        Check back soon for new opportunities.
      </p>

      <button
        onClick={() => router.push("/how-to-apply-ipo")}
        className="
          mt-6
          w-full
          py-3
          rounded-xl
          bg-green-600
          hover:bg-green-700
          text-white
          font-bold
          transition
        "
      >
        Learn How to Apply for IPOs
      </button>

    </div>

  )}
</div>
      </div>
    </div>
  );
};

export default IpoList;