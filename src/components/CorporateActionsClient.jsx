// src/components/CorporateActionsClient.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Search,
  TrendingUp,
  Home,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { TABS } from "@/lib/corporateActionUtils";

const SITE_URL = "https://sharebazaaronline.com";
const ITEMS_PER_PAGE = 20;

const CorporateActionsClient = ({ activeTab = "buyback", records = [] }) => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "ex_date",
    direction: "desc",
  });

  const tabs = TABS;
  const currentTabLabel =
    tabs.find((t) => t.id === activeTab)?.label || "Buyback";

  useEffect(() => {
    setSortConfig({ key: "ex_date", direction: "desc" });
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedYear, sortConfig]);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesSearch = (item.company || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const dateToCheck = item.ex_date || item.announcement || "";

      const matchesYear =
        selectedYear === "All" ||
        (dateToCheck && String(dateToCheck).startsWith(selectedYear));

      return matchesSearch && matchesYear;
    });
  }, [records, searchQuery, selectedYear]);

  const parseDateValue = (dateStr) => {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const parseNumericValue = (val) => {
    if (val === null || val === undefined || val === "") return 0;
    if (typeof val === "number") return val;
    const match = String(val).replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    return match ? Number(match[0]) : 0;
  };

  const getSortValue = (item, key) => {
    switch (key) {
      case "company":
        return (item.company || "").toLowerCase();
      case "buyback_price":
        return parseNumericValue(item.buyback_price);
      case "cmp":
        return parseNumericValue(item.cmp);
      case "premium":
        return parseNumericValue(item.premium);
      case "size":
        return parseNumericValue(item.size);
      case "record":
        return parseDateValue(item.record);
      case "ex_date":
        return parseDateValue(item.ex_date);
      case "announcement":
        return parseDateValue(item.announcement);
      case "payment_date":
        return parseDateValue(item.payment_date);
      case "type":
        return (item.type || "").toLowerCase();
      case "yield":
        return parseNumericValue(item.ratio_or_percentage);
      case "ratio":
        return (item.ratio_or_percentage || "").toString().toLowerCase();
      case "rights_price":
        return parseNumericValue(item.rights_price);
      case "market_price":
        return parseNumericValue(item.market_price);
      case "discount":
        return parseNumericValue(item.discount);
      case "old_fv":
        return parseNumericValue(item.old_fv);
      case "new_fv":
        return parseNumericValue(item.new_fv);
      case "action_type_detail":
        return (item.action_type_detail || "").toLowerCase();
      case "key_detail":
        return (item.key_detail || "").toLowerCase();
      case "status":
        return (item.status || "").toLowerCase();
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
      return { key, direction: "asc" };
    });
  };

  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const aValue = getSortValue(a, sortConfig.key);
      const bValue = getSortValue(b, sortConfig.key);

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue, undefined, {
          numeric: true,
          sensitivity: "base",
        });
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortConfig]);

  const totalPages = Math.ceil(sortedRecords.length / ITEMS_PER_PAGE);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedRecords, currentPage]);

  const SortableHeader = ({
    label,
    sortKey,
    align = "center",
    borderRight = false,
  }) => {
    const isActive = sortConfig.key === sortKey;
    const isAscending = sortConfig.direction === "asc";

    return (
      <th
        className={`px-4 py-3.5 font-semibold text-slate-600 ${
          align === "left" ? "text-left" : "text-center"
        } ${borderRight ? "border-r border-slate-200/60" : ""}`}
      >
        <button
          type="button"
          onClick={() => handleSort(sortKey)}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 outline-none focus:outline-none focus-visible:outline-none border-0 ring-0 focus:ring-0 ${
            isActive
              ? "text-[#16A34A]"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="leading-none">{label}</span>
          <span className="inline-flex items-center justify-center w-4 h-4 flex-shrink-0">
            {isActive ? (
              isAscending ? (
                <ChevronUp size={15} strokeWidth={2.5} />
              ) : (
                <ChevronDown size={15} strokeWidth={2.5} />
              )
            ) : (
              <ChevronDown
                size={15}
                className="text-slate-300"
                strokeWidth={2}
              />
            )}
          </span>
        </button>
      </th>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase()
      .replace(/ /g, "-");
  };

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Corporate Actions", url: "/corporateactions" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="w-full min-h-screen bg-white pb-20">
        {/* Visual Breadcrumb */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 pt-6">
          <nav
            aria-label="Breadcrumb"
            className="text-sm font-medium text-slate-500"
          >
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 flex items-center gap-1 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <li className="text-slate-900 font-semibold">
                Corporate Actions
              </li>
            </ol>
          </nav>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden py-16 bg-white border-b border-gray-100">
          <div className="relative w-full px-4 sm:px-6 lg:px-10 xl:px-16 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#16A34A] px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-200/60 shadow-xs">
                <BookOpen size={14} />
                Corporate Actions Calendar
              </div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-200/60 shadow-xs">
                <TrendingUp size={14} />
                Live Market Tracking
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4">
              Corporate Actions Matrix
            </h1>

            <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Stay informed on essential stock distributions, company
              restructurings, and upcoming eligibility dates. Want to explore
              delistings or mergers?{" "}
              <Link
                href="/corporateactions/others"
                className="text-[#16A34A] hover:text-[#15803D] font-bold inline-flex items-center gap-0.5 transition"
              >
                Track More Actions
              </Link>
            </p>
          </div>
        </section>

        {/* KEY DATES */}
        <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 pt-12">
          <div className="w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 text-center">
              Key Dates You Need to Know
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                  <BookOpen size={18} className="text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Record Date
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The day the company checks its register to decide who's
                  eligible. You must hold the shares in your Demat account on
                  this date.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  <TrendingUp size={18} className="text-blue-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Ex-Date
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The day the stock starts trading without the benefit of the
                  action. To qualify, buy at least one trading day before the
                  ex-date (T+1 settlement).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-4">
                  <ChevronRight size={18} className="text-purple-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Payment Date
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  When dividends hit your bank account, or bonus shares are
                  credited to your Demat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TABS BAR — Now using Links for separate routes */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 mt-12 flex justify-center">
          <div className="flex bg-slate-100 p-1.5 rounded-xl items-center gap-1 shadow-inner border border-slate-200/60 overflow-x-auto max-w-full scrollbar-none">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`px-6 py-2 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-[#16A34A] shadow-sm border border-slate-200/40"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* MAIN TABLE */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 mt-10">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="text-slate-800 font-bold text-base">
                Upcoming {currentTabLabel} Records
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <div className="relative max-w-xs w-full lg:w-64">
                  <Search
                    className="absolute left-3 top-2.5 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search Company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#16A34A]"
                  />
                </div>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-[#16A34A]"
                >
                  <option value="All">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              {sortedRecords.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  No data matched your selected metrics for {currentTabLabel}.
                </div>
              ) : (
                <table className="w-full border-collapse text-[13px] text-slate-700">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-center">
                      <SortableHeader
                        label="Company"
                        sortKey="company"
                        align="left"
                        borderRight
                      />

                      {activeTab === "buyback" && (
                        <>
                          <SortableHeader
                            label="Buyback Price"
                            sortKey="buyback_price"
                          />
                          <SortableHeader label="CMP" sortKey="cmp" />
                          <SortableHeader label="Premium" sortKey="premium" />
                          <SortableHeader
                            label="Record Date"
                            sortKey="record"
                          />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                          <SortableHeader label="Size" sortKey="size" />
                        </>
                      )}

                      {activeTab === "dividends" && (
                        <>
                          <SortableHeader label="Dividend Type" sortKey="type" />
                          <SortableHeader label="Yield %" sortKey="yield" />
                          <SortableHeader
                            label="Announcement"
                            sortKey="announcement"
                          />
                          <SortableHeader
                            label="Record Date"
                            sortKey="record"
                          />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                          <SortableHeader
                            label="Payment Date"
                            sortKey="payment_date"
                          />
                        </>
                      )}

                      {activeTab === "rights" && (
                        <>
                          <SortableHeader label="Ratio" sortKey="ratio" />
                          <SortableHeader
                            label="Rights Price"
                            sortKey="rights_price"
                          />
                          <SortableHeader
                            label="Market Price"
                            sortKey="market_price"
                          />
                          <SortableHeader label="Discount" sortKey="discount" />
                          <SortableHeader
                            label="Record Date"
                            sortKey="record"
                          />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                        </>
                      )}

                      {activeTab === "bonus" && (
                        <>
                          <SortableHeader label="Bonus Ratio" sortKey="ratio" />
                          <SortableHeader
                            label="Announcement"
                            sortKey="announcement"
                          />
                          <SortableHeader
                            label="Record Date"
                            sortKey="record"
                          />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                        </>
                      )}

                      {activeTab === "splits" && (
                        <>
                          <SortableHeader label="Split Ratio" sortKey="ratio" />
                          <SortableHeader label="Old FV" sortKey="old_fv" />
                          <SortableHeader label="New FV" sortKey="new_fv" />
                          <SortableHeader
                            label="Announcement"
                            sortKey="announcement"
                          />
                          <SortableHeader
                            label="Record Date"
                            sortKey="record"
                          />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                        </>
                      )}

                      {activeTab === "others" && (
                        <>
                          <SortableHeader
                            label="Action Type"
                            sortKey="action_type_detail"
                          />
                          <SortableHeader
                            label="Key Detail"
                            sortKey="key_detail"
                          />
                          <SortableHeader
                            label="Announcement"
                            sortKey="announcement"
                          />
                          <SortableHeader
                            label="Record Date"
                            sortKey="record"
                          />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                          <SortableHeader label="Status" sortKey="status" />
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {paginatedRecords.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => {
                          if (row.blog?.id) {
                            router.push(
                              `/corporateactions/${row.blog.id}/${row.blog.slug}`
                            );
                          }
                        }}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          row.blog?.id ? "cursor-pointer" : ""
                        }`}
                      >
                        <td
                          className={`px-6 py-4 text-left font-bold border-r border-slate-100 ${
                            row.blog?.id
                              ? "text-[#16A34A] hover:underline"
                              : "text-slate-900"
                          }`}
                        >
                          {row.company}
                        </td>

                        {activeTab === "buyback" && (
                          <>
                            <td className="px-4 py-4 text-center font-bold">
                              ₹{row.buyback_price || "-"}
                            </td>
                            <td className="px-4 py-4 text-center">
                              ₹{row.cmp || "-"}
                            </td>
                            <td className="px-4 py-4 text-center font-semibold text-emerald-600">
                              {row.premium || "-"}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.record)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.ex_date)}
                            </td>
                            <td className="px-4 py-4 text-center font-medium">
                              {row.size || "-"}
                            </td>
                          </>
                        )}

                        {activeTab === "dividends" && (
                          <>
                            <td className="px-4 py-4 text-center">
                              {row.type || "-"}
                            </td>
                            <td className="px-4 py-4 text-center font-bold">
                              {row.ratio_or_percentage || "-"}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.announcement)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.record)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.ex_date)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.payment_date)}
                            </td>
                          </>
                        )}

                        {activeTab === "rights" && (
                          <>
                            <td className="px-4 py-4 text-center font-bold">
                              {row.ratio_or_percentage || "-"}
                            </td>
                            <td className="px-4 py-4 text-center">
                              ₹{row.rights_price || "-"}
                            </td>
                            <td className="px-4 py-4 text-center">
                              ₹{row.market_price || "-"}
                            </td>
                            <td className="px-4 py-4 text-center text-amber-600 font-semibold">
                              {row.discount || "-"}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.record)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.ex_date)}
                            </td>
                          </>
                        )}

                        {activeTab === "bonus" && (
                          <>
                            <td className="px-4 py-4 text-center font-bold">
                              {row.ratio_or_percentage || "-"}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.announcement)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.record)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.ex_date)}
                            </td>
                          </>
                        )}

                        {activeTab === "splits" && (
                          <>
                            <td className="px-4 py-4 text-center font-bold">
                              {row.ratio_or_percentage || "-"}
                            </td>
                            <td className="px-4 py-4 text-center">
                              ₹{row.old_fv || "-"}
                            </td>
                            <td className="px-4 py-4 text-center font-bold text-emerald-600">
                              ₹{row.new_fv || "-"}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.announcement)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.record)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.ex_date)}
                            </td>
                          </>
                        )}

                        {activeTab === "others" && (
                          <>
                            <td className="px-4 py-4 text-center font-semibold">
                              {row.action_type_detail || "-"}
                            </td>
                            <td className="px-4 py-4 text-center max-w-xs truncate">
                              {row.key_detail || "-"}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.announcement)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.record)}
                            </td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">
                              {formatDate(row.ex_date)}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="bg-slate-100 px-3 py-1 rounded text-emerald-700 text-xs font-bold">
                                {row.status || "Completed"}
                              </span>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION */}
            {sortedRecords.length > 0 && totalPages > 1 && (
              <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.min(
                      currentPage * ITEMS_PER_PAGE,
                      sortedRecords.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {sortedRecords.length}
                  </span>{" "}
                  records
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </button>

                  <span className="px-4 h-10 inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
                    <span className="text-[#16A34A]">{currentPage}</span>
                    <span className="mx-1.5 text-slate-400">/</span>
                    <span>{totalPages}</span>
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ARTICLE */}
        <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 mt-14">
          <div className="w-full space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Corporate Actions Calendar — Dividends, Bonus Issues, Splits &amp;
              More
            </h2>

            <p>
              Corporate actions are events a listed company initiates that
              directly affect its shareholders. They can change your portfolio
              value, your share count, your tax liability, and whether you
              qualify for a cash payout — which is exactly why every investor
              needs to track them closely.
            </p>

            <p>
              ShareBazaarOnline's Corporate Actions Calendar follows all the
              major events across Indian listed companies — upcoming record
              dates, ex-dates, and eligibility deadlines — in one place,
              updated daily.
            </p>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                Types of Corporate Actions We Track
              </h3>
              <div className="space-y-4">
                <p>
                  <strong className="text-slate-900">Dividends</strong> — Cash a
                  company pays shareholders out of its profits. To receive one,
                  you must hold the shares before the ex-dividend date. In
                  India, dividends are taxable at your income-tax slab rate.
                </p>
                <p>
                  <strong className="text-slate-900">Bonus Issues</strong> —
                  Free additional shares given to existing shareholders in a
                  fixed ratio (e.g. 1:1 = one free share for every share held).
                  Your share count goes up, but your total investment value
                  stays the same because the price adjusts proportionally.
                </p>
                <p>
                  <strong className="text-slate-900">Stock Splits</strong> — The
                  company divides existing shares into smaller units (e.g. a
                  1:5 split turns one ₹100 face-value share into five ₹20
                  shares). This makes the stock more affordable and improves
                  liquidity without changing the company's market
                  capitalisation.
                </p>
                <p>
                  <strong className="text-slate-900">Rights Issues</strong> —
                  Existing shareholders get the right to buy additional shares
                  at a discount before they're offered publicly. You can
                  subscribe, renounce (sell your rights), or let them lapse.
                </p>
                <p>
                  <strong className="text-slate-900">Buybacks</strong> — The
                  company repurchases its own shares from shareholders, usually
                  at a premium to the market price. Buybacks cut the total
                  shares outstanding and can signal management's confidence in
                  the company's value.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                How to Use This Calendar
              </h3>
              <p>
                Pick a corporate action type from the tabs below to see
                upcoming events. Each entry shows the company name, action
                type, ratio or amount, record date, and ex-date. We refresh
                this data daily from official exchange filings and company
                announcements — see the full list on our Corporate Actions
                page.
              </p>
            </div>

            <p className="text-base text-slate-600 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 rounded-r-lg">
              <strong className="text-slate-800">Important Note:</strong>{" "}
              Companies can revise corporate action dates. Always cross-verify
              critical dates against the official BSE / NSE announcements
              before trading on eligibility.
            </p>
          </div>
        </section>

        {/* EXPLORE MORE */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 mt-12">
          <div className="mt-4 bg-gradient-to-br from-white to-slate-50 border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Explore More Investment Opportunities
              </h3>
              <p className="text-slate-500 mt-2 text-sm lg:text-base">
                Discover IPOs, unlisted shares, broker comparison tools, and
                market insights curated for smart investors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/ipo"
                className="group bg-white border border-emerald-100 rounded-xl px-5 py-4 shadow-sm hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      Latest IPOs
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Track live &amp; upcoming IPOs
                    </p>
                  </div>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition font-bold">
                    →
                  </span>
                </div>
              </Link>

              <Link
                href="/preipo"
                className="group bg-white border border-emerald-100 rounded-xl px-5 py-4 shadow-sm hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      Unlisted Shares
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Invest before public listing
                    </p>
                  </div>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition font-bold">
                    →
                  </span>
                </div>
              </Link>

             

              <Link
                href="/insight-hub"
                className="group bg-white border border-emerald-100 rounded-xl px-5 py-4 shadow-sm hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      Insight Hub
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Read IPO news, blogs &amp; market insights
                    </p>
                  </div>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition font-bold">
                    →
                  </span>
                </div>
              </Link>

       

         
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CorporateActionsClient;