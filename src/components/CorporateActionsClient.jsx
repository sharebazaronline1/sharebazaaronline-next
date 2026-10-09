// src/components/CorporateActionsClient.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { createClient } from "@/lib/supabase/client";
import { 
  BookOpen, 
  Search, 
  TrendingUp,
  Home,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft
} from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = "https://sharebazaaronline.com";
const ITEMS_PER_PAGE = 20;

const CorporateActionsClient = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buyback");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);
  const supabase = createClient();

  const [sortConfig, setSortConfig] = useState({
    key: "ex_date",
    direction: "desc",
  });

  const tabs = [
    { id: "buyback", label: "Buyback", dbType: "buyback" },
    { id: "dividends", label: "Dividends", dbType: "dividend" },
    { id: "rights", label: "Rights Issue", dbType: "rights" },
    { id: "bonus", label: "Bonus Issue", dbType: "bonus" },
    { id: "splits", label: "Stock Split", dbType: "split" },
    { id: "others", label: "Other Actions", dbType: "other" },
  ];

  const currentTabLabel = tabs.find((t) => t.id === activeTab)?.label || "Dividends";

  useEffect(() => {
    const fetchCorporateActions = async () => {
      setLoading(true);
      try {
        const currentConfig = tabs.find((t) => t.id === activeTab);
        const { data, error } = await supabase
          .from("corporate_actions")
          .select(`
            *,
            blog:blogs (
              id,
              slug,
              heading
            )
          `)
          .eq("action_type", currentConfig?.dbType || "buyback")
          .order("ex_date", { ascending: false });

        if (error) throw error;
        setRecords(data || []);
      } catch (err) {
        console.error("Error fetching corporate actions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCorporateActions();
  }, [activeTab]);

  // Reset sort to default whenever the tab changes
  useEffect(() => {
    setSortConfig({ key: "ex_date", direction: "desc" });
  }, [activeTab]);

  // Reset page to 1 whenever filters / sort / tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedYear, sortConfig]);

  const filteredRecords = records.filter((item) => {
    const matchesSearch = item.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const dateToCheck = item.ex_date || item.announcement || "";
    const matchesYear = dateToCheck ? dateToCheck.startsWith(selectedYear) : true;
    return matchesSearch && matchesYear;
  });

  // ==========================================================
  // SORTING ENGINE
  // ==========================================================
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
      return {
        key,
        direction: "asc",
      };
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

  // ==========================================================
  // PAGINATION
  // ==========================================================
  const totalPages = Math.ceil(sortedRecords.length / ITEMS_PER_PAGE);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedRecords, currentPage]);

  // ==========================================================
  // SORTABLE HEADER
  // ==========================================================
  const SortableHeader = ({ label, sortKey, align = "center", borderRight = false }) => {
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

  // Breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Corporate Actions", url: "/corporateactions" },
  ];

  // Generate Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Corporate Actions Calendar 2026 - Buyback, Dividends, Bonus, Split",
    description: "Track all corporate actions including buybacks, dividends, bonus issues, stock splits, rights issues and more. Stay updated with record dates, ex-dates, and announcements.",
    image: `${SITE_URL}/og-image.jpg`,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "ShareBazaarOnline",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "ShareBazaarOnline",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/corporateactions`,
    },
  };

  return (
    <>
      {/* JSON-LD Schemas for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="w-full min-h-screen bg-white pb-20">
        
        {/* Visual Breadcrumb */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 pt-6">
          <nav aria-label="Breadcrumb" className="text-sm font-medium text-slate-500">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-emerald-600 flex items-center gap-1 transition-colors">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <li className="text-slate-900 font-semibold">Corporate Actions</li>
            </ol>
          </nav>
        </div>

        {/* ==================== HERO SECTION ==================== */}
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
              Stay informed on essential stock distributions, company restructurings, and upcoming eligibility dates. Want to explore delistings or mergers?{" "}
              <button 
                onClick={() => {
                  setActiveTab("others");
                  setSearchQuery("");
                }}
                className="text-[#16A34A] hover:text-[#15803D] font-bold inline-flex items-center gap-0.5 transition"
              >
                Track More Actions
              </button>
            </p>
          </div>
        </section>

        {/* ==================== TABS BAR ==================== */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 mt-12 flex justify-center">
          <div className="flex bg-slate-100 p-1.5 rounded-xl items-center gap-1 shadow-inner border border-slate-200/60 overflow-x-auto max-w-full scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery("");
                }}
                className={`px-6 py-2 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-[#16A34A] shadow-sm border border-slate-200/40"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== MAIN TABLE ==================== */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 mt-10">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            
            <div className="px-6 py-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="text-slate-800 font-bold text-base">
                Upcoming {currentTabLabel} Records
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                <div className="relative max-w-xs w-full lg:w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
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
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-20 text-slate-500 space-y-3">
                  <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-[#16A34A] rounded-full" />
                  <p className="text-sm tracking-wide">Syncing market data...</p>
                </div>
              ) : sortedRecords.length === 0 ? (
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
                          <SortableHeader label="Buyback Price" sortKey="buyback_price" />
                          <SortableHeader label="CMP" sortKey="cmp" />
                          <SortableHeader label="Premium" sortKey="premium" />
                          <SortableHeader label="Record Date" sortKey="record" />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                          <SortableHeader label="Size" sortKey="size" />
                        </>
                      )}

                      {activeTab === "dividends" && (
                        <>
                          <SortableHeader label="Dividend Type" sortKey="type" />
                          <SortableHeader label="Yield %" sortKey="yield" />
                          <SortableHeader label="Announcement" sortKey="announcement" />
                          <SortableHeader label="Record Date" sortKey="record" />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                          <SortableHeader label="Payment Date" sortKey="payment_date" />
                        </>
                      )}

                      {activeTab === "rights" && (
                        <>
                          <SortableHeader label="Ratio" sortKey="ratio" />
                          <SortableHeader label="Rights Price" sortKey="rights_price" />
                          <SortableHeader label="Market Price" sortKey="market_price" />
                          <SortableHeader label="Discount" sortKey="discount" />
                          <SortableHeader label="Record Date" sortKey="record" />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                        </>
                      )}

                      {activeTab === "bonus" && (
                        <>
                          <SortableHeader label="Bonus Ratio" sortKey="ratio" />
                          <SortableHeader label="Announcement" sortKey="announcement" />
                          <SortableHeader label="Record Date" sortKey="record" />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                        </>
                      )}

                      {activeTab === "splits" && (
                        <>
                          <SortableHeader label="Split Ratio" sortKey="ratio" />
                          <SortableHeader label="Old FV" sortKey="old_fv" />
                          <SortableHeader label="New FV" sortKey="new_fv" />
                          <SortableHeader label="Announcement" sortKey="announcement" />
                          <SortableHeader label="Record Date" sortKey="record" />
                          <SortableHeader label="Ex Date" sortKey="ex_date" />
                        </>
                      )}

                      {activeTab === "others" && (
                        <>
                          <SortableHeader label="Action Type" sortKey="action_type_detail" />
                          <SortableHeader label="Key Detail" sortKey="key_detail" />
                          <SortableHeader label="Announcement" sortKey="announcement" />
                          <SortableHeader label="Record Date" sortKey="record" />
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
                            router.push(`/insight-hub/${row.blog.id}/${row.blog.slug}`);
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
                            <td className="px-4 py-4 text-center font-bold">₹{row.buyback_price || "-"}</td>
                            <td className="px-4 py-4 text-center">₹{row.cmp || "-"}</td>
                            <td className="px-4 py-4 text-center font-semibold text-emerald-600">{row.premium || "-"}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.record)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.ex_date)}</td>
                            <td className="px-4 py-4 text-center font-medium">{row.size || "-"}</td>
                          </>
                        )}

                        {activeTab === "dividends" && (
                          <>
                            <td className="px-4 py-4 text-center">{row.type || "-"}</td>
                            <td className="px-4 py-4 text-center font-bold">{row.ratio_or_percentage || "-"}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.announcement)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.record)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.ex_date)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.payment_date)}</td>
                          </>
                        )}

                        {activeTab === "rights" && (
                          <>
                            <td className="px-4 py-4 text-center font-bold">{row.ratio_or_percentage || "-"}</td>
                            <td className="px-4 py-4 text-center">₹{row.rights_price || "-"}</td>
                            <td className="px-4 py-4 text-center">₹{row.market_price || "-"}</td>
                            <td className="px-4 py-4 text-center text-amber-600 font-semibold">{row.discount || "-"}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.record)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.ex_date)}</td>
                          </>
                        )}

                        {activeTab === "bonus" && (
                          <>
                            <td className="px-4 py-4 text-center font-bold">{row.ratio_or_percentage || "-"}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.announcement)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.record)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.ex_date)}</td>
                          </>
                        )}

                        {activeTab === "splits" && (
                          <>
                            <td className="px-4 py-4 text-center font-bold">{row.ratio_or_percentage || "-"}</td>
                            <td className="px-4 py-4 text-center">₹{row.old_fv || "-"}</td>
                            <td className="px-4 py-4 text-center font-bold text-emerald-600">₹{row.new_fv || "-"}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.announcement)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.record)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.ex_date)}</td>
                          </>
                        )}

                        {activeTab === "others" && (
                          <>
                            <td className="px-4 py-4 text-center font-semibold">{row.action_type_detail || "-"}</td>
                            <td className="px-4 py-4 text-center max-w-xs truncate">{row.key_detail || "-"}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.announcement)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.record)}</td>
                            <td className="px-4 py-4 text-center text-xs tracking-wider">{formatDate(row.ex_date)}</td>
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

            {/* ==================== PAGINATION (Prev / Next only) ==================== */}
            {!loading && sortedRecords.length > 0 && totalPages > 1 && (
              <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-700">
                    {Math.min(currentPage * ITEMS_PER_PAGE, sortedRecords.length)}
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
      </div>
    </>
  );
};

export default CorporateActionsClient;