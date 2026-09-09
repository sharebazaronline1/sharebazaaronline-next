// src/components/CorporateActionsClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { createClient } from "@/lib/supabase/client";
import { 
  BookOpen, 
  Search, 
  TrendingUp,
  Home,
  ChevronRight
} from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = "https://sharebazaaronline.com";

const CorporateActionsClient = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("buyback");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026");
const supabase = createClient();
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

  const filteredRecords = records.filter((item) => {
    const matchesSearch = item.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const dateToCheck = item.ex_date || item.announcement || "";
    const matchesYear = dateToCheck ? dateToCheck.startsWith(selectedYear) : true;
    return matchesSearch && matchesYear;
  });

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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
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
          <div className="relative max-w-[1800px] mx-auto px-6 text-center">
            
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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex justify-center">
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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
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
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  No data matched your selected metrics for {currentTabLabel}.
                </div>
              ) : (
                <table className="w-full border-collapse text-[13px] text-slate-700">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold text-center">
                      <th className="px-6 py-3.5 text-left font-semibold text-slate-600 w-64 border-r border-slate-200/60">Company</th>

                      {activeTab === "buyback" && (
                        <>
                          <th className="px-4 py-3.5">Buyback Price</th>
                          <th className="px-4 py-3.5">CMP</th>
                          <th className="px-4 py-3.5">Premium</th>
                          <th className="px-4 py-3.5">Record Date</th>
                          <th className="px-4 py-3.5">Ex Date</th>
                          <th className="px-4 py-3.5">Size</th>
                        </>
                      )}

                      {activeTab === "dividends" && (
                        <>
                          <th className="px-4 py-3.5">Dividend Type</th>
                          <th className="px-4 py-3.5">Yield %</th>
                          <th className="px-4 py-3.5">Announcement</th>
                          <th className="px-4 py-3.5">Record Date</th>
                          <th className="px-4 py-3.5">Ex Date</th>
                          <th className="px-4 py-3.5">Payment Date</th>
                        </>
                      )}

                      {activeTab === "rights" && (
                        <>
                          <th className="px-4 py-3.5">Ratio</th>
                          <th className="px-4 py-3.5">Rights Price</th>
                          <th className="px-4 py-3.5">Market Price</th>
                          <th className="px-4 py-3.5">Discount</th>
                          <th className="px-4 py-3.5">Record Date</th>
                          <th className="px-4 py-3.5">Ex Date</th>
                        </>
                      )}

                      {activeTab === "bonus" && (
                        <>
                          <th className="px-4 py-3.5">Bonus Ratio</th>
                          <th className="px-4 py-3.5">Announcement</th>
                          <th className="px-4 py-3.5">Record Date</th>
                          <th className="px-4 py-3.5">Ex Date</th>
                        </>
                      )}

                      {activeTab === "splits" && (
                        <>
                          <th className="px-4 py-3.5">Split Ratio</th>
                          <th className="px-4 py-3.5">Old FV</th>
                          <th className="px-4 py-3.5">New FV</th>
                          <th className="px-4 py-3.5">Announcement</th>
                          <th className="px-4 py-3.5">Record Date</th>
                          <th className="px-4 py-3.5">Ex Date</th>
                        </>
                      )}

                      {activeTab === "others" && (
                        <>
                          <th className="px-4 py-3.5">Action Type</th>
                          <th className="px-4 py-3.5">Key Detail</th>
                          <th className="px-4 py-3.5">Announcement</th>
                          <th className="px-4 py-3.5">Record Date</th>
                          <th className="px-4 py-3.5">Ex Date</th>
                          <th className="px-4 py-3.5">Status</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredRecords.map((row) => (
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
          </div>
        </div>
      </div>
    </>
  );
};

export default CorporateActionsClient;