// src/components/IPODashboard.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  TrendingUp,
  Zap,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Radio,
  CalendarClock,
  BriefcaseBusiness,
  BadgeCheck,
} from "lucide-react";

import { fetchIPOs } from "../api/mockApi";
import IPOFAQ from "../components/home/IPOFaq";
import slugify from "../utils/slugify";

const tabs = ["Open", "Closed", "Upcoming"];
const ITEMS_PER_PAGE = 10;

const IPODashboard = () => {
  const [ipos, setIpos] = useState([]);
  const [activeTab, setActiveTab] = useState("Upcoming"); // Changed default to Upcoming as per your data
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const loadIPOs = async () => {
      try {
        console.log("🔄 Loading IPOs from Supabase...");
        const data = await fetchIPOs();

        console.log(`✅ Loaded ${data.length} IPOs`);
        if (data.length > 0) {
          console.log("📋 Sample IPO full structure:", 
            JSON.stringify(data[0], null, 2));
        }

        setIpos(data || []);
      } catch (error) {
        console.error("❌ Failed to load IPOs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIPOs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, typeFilter]);

  // ==================== HELPER FUNCTIONS ====================

  // ==================== HELPER FUNCTIONS ====================

  const getValue = (obj, ...paths) => {
    for (const path of paths) {
      const value = path.split(".").reduce((o, key) => o?.[key], obj);
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return null;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // Already a Date
    if (dateStr instanceof Date) {
      return isNaN(dateStr.getTime()) ? null : dateStr;
    }

    const str = String(dateStr).trim();

    // Format: "15 Jan 2026" or "15 January 2026"
    const spaceParts = str.split(/\s+/);
    if (spaceParts.length >= 3) {
      const [day, monthStr, year] = spaceParts;
      const months = {
        Jan: 0, January: 0,
        Feb: 1, February: 1,
        Mar: 2, March: 2,
        Apr: 3, April: 3,
        May: 4,
        Jun: 5, June: 5,
        Jul: 6, July: 6,
        Aug: 7, August: 7,
        Sep: 8, Sept: 8, September: 8,
        Oct: 9, October: 9,
        Nov: 10, November: 10,
        Dec: 11, December: 11,
      };
      const month = months[monthStr];
      if (month !== undefined && year) {
        const d = new Date(Number(year), month, Number(day));
        return isNaN(d.getTime()) ? null : d;
      }
    }

    // ISO / other parseable formats
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };

  const getIPOType = (ipo) => {
    const type = getValue(
      ipo,
      "ipo_basic_details.ipo_type",
      "type",
      "ipo_type",
      "company_information.company_type"
    );

    if (type) {
      return type.replace(/ipo/gi, "").trim().toUpperCase();
    }

    const name = (
      getValue(ipo, "name", "fullName", "company_information.company_name") || ""
    ).toLowerCase();
    return name.includes("sme") ? "SME" : "MAINBOARD";
  };

  const normalizeStatus = (status) => {
    if (!status) return null;
    const s = String(status).toLowerCase().trim();

    if (["open", "live", "active", "ongoing", "current"].includes(s)) return "Open";
    if (["closed", "close", "allotted", "listed", "completed"].includes(s)) return "Closed";
    if (["upcoming", "coming", "forthcoming", "expected", "announced"].includes(s))
      return "Upcoming";

    return null;
  };

  const getIPOStatusByDate = (ipo) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const openStr = getValue(
      ipo,
      "open",
      "openDate",
      "subscription_open",
      "subscription_start_date"
    );
    const closeStr = getValue(
      ipo,
      "close",
      "closeDate",
      "subscription_close",
      "subscription_end_date"
    );

    const openDate = parseDate(openStr);
    const closeDate = parseDate(closeStr);

    // Prefer real dates when available
    if (openDate) {
      const open = new Date(openDate);
      open.setHours(0, 0, 0, 0);

      if (closeDate) {
        const close = new Date(closeDate);
        close.setHours(23, 59, 59, 999); // include full close day

        if (today < open) return "Upcoming";
        if (today >= open && today <= close) return "Open";
        if (today > close) return "Closed";
      }

      // Only open date present
      if (today < open) return "Upcoming";
      return "Open";
    }

    // Fallback: normalized status field
    const fromStatus = normalizeStatus(ipo?.status);
    if (fromStatus) return fromStatus;

    return "Upcoming";
  };

  const filteredIPOs = useMemo(() => {
    return ipos.filter((ipo) => {
      const ipoStatus = getIPOStatusByDate(ipo);
      const matchesTab = ipoStatus === activeTab;

      const ipoType = getIPOType(ipo);
      const matchesType = typeFilter === "All" || 
        ipoType.toLowerCase().includes(typeFilter.toLowerCase());

      return matchesTab && matchesType;
    });
  }, [ipos, activeTab, typeFilter]);

  const totalPages = Math.ceil(filteredIPOs.length / ITEMS_PER_PAGE);
  const paginatedIPOs = filteredIPOs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCount = (tab) => {
    if (tab === "All") return ipos.length;
    return ipos.filter((ipo) => getIPOStatusByDate(ipo) === tab).length;
  };

  const LetterAvatar = ({ name }) => {
    const letter = (name?.charAt(0) || "?").toUpperCase();
    return (
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
        {letter}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading IPOs...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO SECTION - Same as before */}
      <section className="relative overflow-hidden border-gray-200 bg-gradient-to-br from-white via-[#f6fffb] to-[#eef8ff] py-16 lg:py-2">
        {/* ... (Hero content remains same) ... */}
        <div className="relative max-w-[1800px] mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-14 items-center">
            <div className="xl:col-span-6">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold border border-green-200 shadow-sm">
                <TrendingUp size={16} /> IPO Tracker
              </div>
              <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-black tracking-[-3px] leading-[0.95] text-[#0f172a]">
                Track India’s <span className="text-green-600 block">Complete IPOs</span>
              </h1>
              <p className="mt-6 text-lg lg:text-[22px] leading-9 text-slate-600 max-w-2xl">
                Track live & upcoming IPOs in India with listing dates, price bands, GMP trends, lot sizes, and subscription insights.
              </p>
            </div>
            <div className="xl:col-span-6">
              <img src="/images/hero-ipo.png" alt="IPO Tracker" className="w-full max-w-[780px] object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* TABLE SECTION */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* FILTERS */}
          <div className="px-4 sm:px-8 py-5 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === tab ? "bg-[#16A34A] text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab ? "bg-white text-green-600" : "bg-gray-300 text-gray-700"}`}>
                    {getCount(tab)}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-[180px]">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-12 rounded-2xl border border-gray-300 bg-white px-5 pr-12 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 appearance-none"
              >
                <option value="All">All Types</option>
                <option value="Mainboard">Mainboard</option>
                <option value="SME">SME</option>
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Company</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Open</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Close</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Price Band</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Listing</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Lot Size</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedIPOs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-20 text-gray-500 text-lg">
                      No {activeTab.toLowerCase()} IPOs found
                    </td>
                  </tr>
                ) : (
                  paginatedIPOs.map((ipo, i) => {
                    const name = getValue(ipo, 'name', 'fullName', 'company_information.company_name', 'company_name') || 'Unknown IPO';
                    const logo = getValue(ipo, 'logo', 'company_information.logo', 'image');
                    const type = getIPOType(ipo);

                    return (
                      <motion.tr
                        key={ipo.id || i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => router.push(`/ipo/${ipo.id}/${slugify(name)}`)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4 min-w-[260px]">
                            {logo ? (
                              <img
                                src={logo}
                                alt={name}
                                className="w-14 h-14 object-contain rounded-2xl border border-gray-200 bg-white p-2 shadow-sm"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <LetterAvatar name={name} />
                            )}

                            <div>
                              <p className="font-semibold text-gray-900 text-base">{name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {getValue(ipo, 'about_company.company_name', 'description') || ''}
                              </p>
                              <span className={`inline-flex mt-2 px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${
                                type === "SME" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-green-100 text-green-700 border-green-200"
                              }`}>
                                {type}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-center text-sm text-gray-700 font-medium">
                          {getValue(ipo, 'open', 'openDate', 'subscription_open') || "TBA"}
                        </td>
                        <td className="px-6 py-5 text-center text-sm text-gray-700 font-medium">
                          {getValue(ipo, 'close', 'closeDate', 'subscription_close') || "TBA"}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="font-semibold text-gray-900 text-base">
                            ₹{getValue(ipo, 'price', 'price_band', 'priceBand') || "TBA"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center text-sm text-gray-700 font-medium">
                          {getValue(ipo, 'listing', 'listing_date', 'listingDate') || "TBA"}
                        </td>
                        <td className="px-6 py-5 text-center font-semibold text-gray-900 text-base">
                          {getValue(ipo, 'lot', 'lot_size', 'lotSize') || "—"}
                        </td>

                        <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); router.push("/how-to-apply-ipo"); }}
                              className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Apply
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); router.push(`/ipo/${ipo.id}/${slugify(name)}`); }}
                              className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="px-6 py-5 border-t border-gray-200 flex items-center justify-between text-sm">
              <p className="text-gray-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredIPOs.length)} of {filteredIPOs.length}
              </p>

              <div className="flex items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40">
                  <ChevronLeft size={18} className="text-gray-700" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-gray-700 font-semibold ${currentPage === i + 1 ? "bg-[#16A34A] text-white" : "border hover:bg-gray-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40">
                  <ChevronRight size={18} className="text-gray-700" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <IPOFAQ />
        </div>
      </section>
    </div>
  );
};

export default IPODashboard;