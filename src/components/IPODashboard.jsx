// src/components/IPODashboard.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

import IPOFAQ from "./home/IPOFaq";
import slugify from "../utils/slugify";

const tabs = ["Open", "Closed", "Upcoming"];
const ITEMS_PER_PAGE = 10;

const MONTHS = {
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

function getValue(obj, ...paths) {
  for (const path of paths) {
    const value = path.split(".").reduce((o, key) => o?.[key], obj);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return null;
}

function parseDate(dateStr) {
  if (!dateStr) return null;

  if (dateStr instanceof Date) {
    return isNaN(dateStr.getTime()) ? null : dateStr;
  }

  const str = String(dateStr).trim();
  const spaceParts = str.split(/\s+/);

  if (spaceParts.length >= 3) {
    const [day, monthStr, year] = spaceParts;
    const month = MONTHS[monthStr];
    if (month !== undefined && year) {
      const d = new Date(Number(year), month, Number(day));
      return isNaN(d.getTime()) ? null : d;
    }
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

const EMPTY_COLUMN_FILTERS = {
  company: "",
  open: "",
  close: "",
  price: "",
  listing: "",
  lot: "",
};

const IPODashboard = ({ initialIpos = [], defaultTab = "Open", now }) => {
  const [ipos, setIpos] = useState(initialIpos);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState(EMPTY_COLUMN_FILTERS);

  const [sortConfig, setSortConfig] = useState({
    key: "open",
    direction: "asc",
  });

  const router = useRouter();

  // Stable "today" reference — same value on server and client.
  const nowRef = useMemo(() => {
    const d = now ? new Date(now) : new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, [now]);

  // Sync when parent passes new initialIpos
  useEffect(() => {
    if (Array.isArray(initialIpos) && initialIpos.length > 0) {
      setIpos(initialIpos);
    }
  }, [initialIpos]);

  // Keep the active tab in sync if the parent recomputes defaultTab
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, typeFilter, columnFilters, sortConfig]);

  // ==================== HELPERS ====================

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
      getValue(
        ipo,
        "name",
        "fullName",
        "company_information.company_name"
      ) || ""
    ).toLowerCase();

    return name.includes("sme") ? "SME" : "MAINBOARD";
  };

  const normalizeStatus = (status) => {
    if (!status) return null;

    const s = String(status).toLowerCase().trim();

    if (["open", "live", "active", "ongoing", "current"].includes(s)) {
      return "Open";
    }
    if (["closed", "close", "allotted", "listed", "completed"].includes(s)) {
      return "Closed";
    }
    if (
      ["upcoming", "coming", "forthcoming", "expected", "announced"].includes(s)
    ) {
      return "Upcoming";
    }
    return null;
  };

  /**
   * Determine status strictly by dates.
   *
   * Upcoming = open date is STRICTLY AFTER today.
   * If the open date is today, the IPO is already "Open" (never Upcoming).
   */
  const getIPOStatusByDate = (ipo) => {
    const today = new Date(nowRef);

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

    if (openDate) {
      const open = new Date(openDate);
      open.setHours(0, 0, 0, 0);

      // Strictly future → Upcoming. Today's open date does NOT qualify.
      if (today < open) return "Upcoming";

      if (closeDate) {
        const close = new Date(closeDate);
        close.setHours(23, 59, 59, 999);
        if (today <= close) return "Open";
        return "Closed";
      }

      return "Open";
    }

    // Fallback when open date can't be parsed — use close date if available
    if (closeDate) {
      const close = new Date(closeDate);
      close.setHours(23, 59, 59, 999);
      if (today > close) return "Closed";
      return "Open";
    }

    const fromStatus = normalizeStatus(ipo?.status);
    if (fromStatus) return fromStatus;

    return "Upcoming";
  };

  /**
   * Centralized display values so filters, sorting, and rendered cells
   * always agree.
   */
  const getDisplayValues = (ipo) => {
    const name =
      getValue(
        ipo,
        "name",
        "fullName",
        "company_information.company_name",
        "company_name"
      ) || "Unknown IPO";

    const open =
      getValue(
        ipo,
        "open",
        "openDate",
        "subscription_open",
        "subscription_start_date"
      ) || "TBA";
    const close =
      getValue(
        ipo,
        "close",
        "closeDate",
        "subscription_close",
        "subscription_end_date"
      ) || "TBA";
    const price = getValue(ipo, "price", "price_band", "priceBand") || "TBA";
    const listing =
      getValue(ipo, "listing", "listing_date", "listingDate") || "TBA";
    const lot = getValue(ipo, "lot", "lot_size", "lotSize") || "—";

    return { name, open, close, price, listing, lot };
  };

  // ==================== SORTING ====================

  const getPriceNumericValue = (ipo) => {
    const price = getValue(ipo, "price", "price_band", "priceBand");

    if (price === null) return Number.MAX_SAFE_INTEGER;

    if (typeof price === "number") return price;

    const numbers = String(price)
      .replace(/₹/g, "")
      .match(/\d+(?:\.\d+)?/g);

    if (!numbers || numbers.length === 0) {
      return Number.MAX_SAFE_INTEGER;
    }

    return Number(numbers[0]);
  };

  const getLotNumericValue = (ipo) => {
    const lot = getValue(ipo, "lot", "lot_size", "lotSize");

    if (lot === null) return Number.MAX_SAFE_INTEGER;

    const number = String(lot)
      .replace(/,/g, "")
      .match(/\d+/);

    return number ? Number(number[0]) : Number.MAX_SAFE_INTEGER;
  };

  const getSortValue = (ipo, key) => {
    switch (key) {
      case "company":
        return (
          getValue(
            ipo,
            "name",
            "fullName",
            "company_information.company_name",
            "company_name"
          ) || ""
        ).toLowerCase();

      case "open": {
        const date = parseDate(
          getValue(
            ipo,
            "open",
            "openDate",
            "subscription_open",
            "subscription_start_date"
          )
        );

        return date ? date.getTime() : Number.MAX_SAFE_INTEGER;
      }

      case "close": {
        const date = parseDate(
          getValue(
            ipo,
            "close",
            "closeDate",
            "subscription_close",
            "subscription_end_date"
          )
        );

        return date ? date.getTime() : Number.MAX_SAFE_INTEGER;
      }

      case "price":
        return getPriceNumericValue(ipo);

      case "listing": {
        const date = parseDate(
          getValue(ipo, "listing", "listing_date", "listingDate")
        );

        return date ? date.getTime() : Number.MAX_SAFE_INTEGER;
      }

      case "lot":
        return getLotNumericValue(ipo);

      default:
        return "";
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key,
        direction: "asc",
      };
    });

    setCurrentPage(1);
  };

  // ==================== FILTER + SORT ====================

  const filteredIPOs = useMemo(() => {
    const filtered = ipos.filter((ipo) => {
      // Tab filter
      const ipoStatus = getIPOStatusByDate(ipo);
      if (ipoStatus !== activeTab) return false;

      // Type filter
      const ipoType = getIPOType(ipo);
      if (
        typeFilter !== "All" &&
        !ipoType.toLowerCase().includes(typeFilter.toLowerCase())
      ) {
        return false;
      }

      // Column filters (case-insensitive substring match)
      const d = getDisplayValues(ipo);
      const f = columnFilters;

      if (
        f.company &&
        !String(d.name).toLowerCase().includes(f.company.toLowerCase())
      )
        return false;
      if (
        f.open &&
        !String(d.open).toLowerCase().includes(f.open.toLowerCase())
      )
        return false;
      if (
        f.close &&
        !String(d.close).toLowerCase().includes(f.close.toLowerCase())
      )
        return false;
      if (
        f.price &&
        !String(d.price).toLowerCase().includes(f.price.toLowerCase())
      )
        return false;
      if (
        f.listing &&
        !String(d.listing).toLowerCase().includes(f.listing.toLowerCase())
      )
        return false;
      if (
        f.lot &&
        !String(d.lot).toLowerCase().includes(f.lot.toLowerCase())
      )
        return false;

      return true;
    });

    return [...filtered].sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.key);
      const bValue = getSortValue(b, sortConfig.key);

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue, undefined, {
          numeric: true,
          sensitivity: "base",
        });

        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }

      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      return 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipos, activeTab, typeFilter, columnFilters, sortConfig, nowRef]);

  const totalPages = Math.ceil(filteredIPOs.length / ITEMS_PER_PAGE);

  const paginatedIPOs = filteredIPOs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCount = (tab) => {
    if (tab === "All") return ipos.length;
    return ipos.filter((ipo) => getIPOStatusByDate(ipo) === tab).length;
  };

  /**
   * Windowed pagination range:
   * Always shows first, last, current, and ±1 around current.
   * Gaps of 1 page are filled directly; larger gaps become "…".
   *
   * Example (current = 10, total = 21):
   *   [1, "…", 9, 10, 11, "…", 21]
   */
  const paginationRange = useMemo(() => {
    const total = totalPages;
    const current = currentPage;
    const delta = 1;

    if (total <= 1) return [1];

    const pages = [];

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i);
      }
    }

    const withDots = [];
    let prev = null;

    for (const page of pages) {
      if (prev !== null) {
        const gap = page - prev;

        if (gap === 2) {
          withDots.push(prev + 1);
        } else if (gap > 2) {
          withDots.push(`dots-${prev}`);
        }
      }

      withDots.push(page);
      prev = page;
    }

    return withDots;
  }, [totalPages, currentPage]);

  const LetterAvatar = ({ name }) => {
    const letter = (name?.charAt(0) || "?").toUpperCase();
    return (
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
        {letter}
      </div>
    );
  };

  const SortableHeader = ({ label, sortKey, align = "center" }) => {
    const isActive = sortConfig.key === sortKey;
    const isAscending = sortConfig.direction === "asc";

    return (
      <th
        className={`px-6 pt-4 pb-2 text-${align} text-xs font-semibold uppercase tracking-wider text-gray-500`}
      >
        <button
          onClick={() => handleSort(sortKey)}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition ${
            isActive ? "text-green-700" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {label}

          <span className="flex flex-col">
            {isActive ? (
              isAscending ? (
                <ChevronUp size={15} strokeWidth={2.5} />
              ) : (
                <ChevronDown size={15} strokeWidth={2.5} />
              )
            ) : (
              <ChevronDown size={14} className="text-gray-300" />
            )}
          </span>
        </button>
      </th>
    );
  };

  const setColumnFilter = (key, value) =>
    setColumnFilters((prev) => ({ ...prev, [key]: value }));

  const clearColumnFilters = () => setColumnFilters(EMPTY_COLUMN_FILTERS);

  const hasActiveColumnFilters = Object.values(columnFilters).some(
    (v) => v !== ""
  );

  if (loading && (!ipos || ipos.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading IPOs...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-gray-200 bg-gradient-to-br from-white via-[#f6fffb] to-[#eef8ff] py-16 lg:py-2">
        <div className="relative max-w-[1800px] mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-14 items-center">
            <div className="xl:col-span-6">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold border border-green-200 shadow-sm">
                <TrendingUp size={16} />
                IPO Tracker
              </div>

              <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-black tracking-[-3px] leading-[0.95] text-[#0f172a]">
                Track India’s{" "}
                <span className="text-green-600 block">Complete IPOs</span>
              </h1>

              <p className="mt-6 text-lg lg:text-[22px] leading-9 text-slate-600 max-w-2xl">
                Track live & upcoming IPOs in India with listing dates,
                price bands, GMP trends, lot sizes, and subscription insights.
              </p>
            </div>

            <div className="xl:col-span-6">
              <img
                src="/images/hero-ipo.png"
                alt="IPO Tracker"
                className="w-full max-w-[780px] object-contain drop-shadow-2xl"
              />
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
                    activeTab === tab
                      ? "bg-[#16A34A] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab
                        ? "bg-white text-green-600"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {getCount(tab)}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {hasActiveColumnFilters && (
                <button
                  onClick={clearColumnFilters}
                  className="inline-flex items-center gap-1.5 h-12 px-4 rounded-2xl border border-gray-300 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  <X size={16} />
                  Clear filters
                </button>
              )}

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

                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px]">
              <thead>
                {/* Column labels (sortable) */}
                <tr className="bg-gray-50">
                  <SortableHeader
                    label="Company"
                    sortKey="company"
                    align="left"
                  />

                  <SortableHeader label="Open" sortKey="open" />

                  <SortableHeader label="Close" sortKey="close" />

                  <SortableHeader label="Price Band" sortKey="price" />

                  <SortableHeader label="Listing" sortKey="listing" />

                  <SortableHeader label="Lot Size" sortKey="lot" />

                  <th className="px-6 pt-4 pb-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedIPOs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-20 text-gray-500 text-lg"
                    >
                      No {activeTab.toLowerCase()} IPOs found
                    </td>
                  </tr>
                ) : (
                  paginatedIPOs.map((ipo, i) => {
                    const { name, open, close, price, listing, lot } =
                      getDisplayValues(ipo);

                    const logo = getValue(
                      ipo,
                      "logo",
                      "company_information.logo",
                      "image"
                    );

                    const type = getIPOType(ipo);

                    return (
                      <motion.tr
                        key={ipo.id || i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-gray-50 transition cursor-pointer"
                        onClick={() =>
                          router.push(`/ipo/${ipo.id}/${slugify(name)}`)
                        }
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4 min-w-[260px]">
                            {logo ? (
                              <img
                                src={logo}
                                alt={name}
                                className="w-14 h-14 object-contain rounded-2xl border border-gray-200 bg-white p-2 shadow-sm"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <LetterAvatar name={name} />
                            )}

                            <div>
                              <p className="font-semibold text-gray-900 text-base">
                                {name}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {getValue(
                                  ipo,
                                  "about_company.company_name",
                                  "description"
                                ) || ""}
                              </p>

                              <span
                                className={`inline-flex mt-2 px-2.5 py-1 text-[11px] font-semibold rounded-lg border ${
                                  type === "SME"
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : "bg-green-100 text-green-700 border-green-200"
                                }`}
                              >
                                {type}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-center text-sm text-gray-700 font-medium">
                          {open}
                        </td>

                        <td className="px-6 py-5 text-center text-sm text-gray-700 font-medium">
                          {close}
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span className="font-semibold text-gray-900 text-base">
                            ₹{price}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-center text-sm text-gray-700 font-medium">
                          {listing}
                        </td>

                        <td className="px-6 py-5 text-center font-semibold text-gray-900 text-base">
                          {lot}
                        </td>

                        <td
                          className="px-6 py-5 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push("/how-to-apply-ipo");
                              }}
                              className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Apply
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/ipo/${ipo.id}/${slugify(name)}`
                                );
                              }}
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
            <div className="px-6 py-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <p className="text-gray-500 text-center sm:text-left">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredIPOs.length
                )}{" "}
                of {filteredIPOs.length}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {/* Prev */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-9 px-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium flex items-center gap-1 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Windowed page numbers */}
                {paginationRange.map((item) =>
                  typeof item === "string" ? (
                    <span
                      key={item}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-semibold transition ${
                        currentPage === item
                          ? "bg-[#16A34A] text-white shadow-sm"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                      aria-current={
                        currentPage === item ? "page" : undefined
                      }
                    >
                      {item}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="h-9 px-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium flex items-center gap-1 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
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