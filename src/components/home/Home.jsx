// src/pages/HomeClient.jsx
"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchIPOs, fetchPreIPODetails } from '../../api/mockApi';
import { supabase } from "../../lib/supabase";
import IpoList from "../IpoList";
import Blogs from '../Blogs';
import slugify from "../../utils/slugify";
import BrokerAnalyzer from '../BrokerAnalyzer';
import { TrendingUp, ShieldCheck, UserCheck, Gem, Scale, Lightbulb, Star, Check, Building2, UserCog2Icon } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sharebazaaronline.com';
const SEO = () => null;

const features = [
  "Stocks", "IPO Updates", "Unlisted Shares", "Broker Comparison",
  "Options", "Futures", "Commodity", "ETFs",
  "Mutual Funds", "NFO", "Corporate Actions",
];

const AdBanner = ({ size = "horizontal" }) => (
  <div className="w-full flex justify-center py-4">
    <div
      className={`bg-gray-200 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center text-gray-500 font-medium ${
        size === "horizontal" ? "w-full max-w-5xl h-32" : "w-80 h-96"
      }`}
    >
      Advertisement
    </div>
  </div>
);

export default function Home() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const navigate = (p) => router.push(p);

  const { data: ipos = [], isLoading: isIPOLoading } = useQuery({
    queryKey: ['ipos'],
    queryFn: fetchIPOs,
  });

  const { data: unlistedStocks = [], isLoading: isUnlistedLoading } = useQuery({
    queryKey: ['unlistedStocks'],
    queryFn: async () => {
      const detailedData = await fetchPreIPODetails();
      const { data: dbData, error } = await supabase
        .from("pre_ipo_companies")
        .select("*");
      if (error) throw error;

      const normalizeName = (str = "") =>
        str
          .toLowerCase()
          .replace(/limited|ltd|llp|private|unlisted|shares?|share/gi, "")
          .replace(/[^\w\s]/g, " ")
          .replace(/\s+/g, " ")
          .trim();

      const merged = dbData.map((db) => {
        const dbKey = normalizeName(db.name);
        const detail = detailedData.find(
          (item) => normalizeName(item.name) === dbKey
        ) || {};
        return {
          id: db.id,
          name: db.name,
          price: Number(db.price || 0),
          logo: detail.logo || db.logo_url || "/images/company-placeholder.png",
        };
      });

      const allowedCompanies = ["oyo", "nse", "care health", "metropolitan", "pharmeasy", "csk"];
      return merged.filter((company) =>
        allowedCompanies.some((keyword) =>
          company.name.toLowerCase().includes(keyword)
        )
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      <SEO
        title="IPO GMP Today, Unlisted Shares, Broker Comparison India"
        description="Real-time IPO GMP, upcoming IPOs, unlisted/pre-IPO shares prices, best stock brokers comparison, corporate actions & market insights. Trusted by 2M+ investors."
        canonical="/"
        type="website"
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ShareBazaarOnline",
          url: siteUrl,
          logo: siteUrl + "/images/logo.png",
          description: "India's trusted platform for IPOs, unlisted shares, and broker comparison.",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            url: siteUrl
          }
        }}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-8 lg:py-12">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 items-center gap-8 xl:gap-16">
            
            <div className="flex flex-col justify-center items-start text-left w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 text-green-700 font-semibold shadow-sm text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Trusted by Millions of Investors
              </div>

              <motion.h1
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-6 w-full text-left text-slate-900 font-black leading-[1.05] tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
              >
                India's Most Trusted
                <br />
                Analysis Platform for
              </motion.h1>

              <div className="h-14 sm:h-16 md:h-20 mt-1 flex items-center justify-start w-full">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="z-20 text-green-600 font-black leading-none text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-left w-full whitespace-nowrap"
                  >
                    {features[index]}
                  </motion.span>
                </AnimatePresence>
              </div>

              <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
                Your Trusted One-Stop Platform for Smarter Investment Decisions.
              </p>

              <div className="flex flex-wrap sm:flex-row justify-start gap-2 sm:gap-3 mt-6 sm:mt-8 w-full">
                <button
                  onClick={() => navigate("/ipo/ipo-list")}
                  className="flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold shadow-lg shadow-green-600/20 transition text-sm sm:text-base"
                >
                  Explore IPO
                </button>
                <button
                  onClick={() => navigate("/comparebrokers")}
                  className="flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 rounded-2xl border border-green-500 bg-white text-green-700 font-bold hover:bg-green-50 transition text-sm sm:text-base"
                >
                  Compare Brokers
                </button>
                <button
                  onClick={() => navigate("/pre-ipo-stocks")}
                  className="flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold shadow-lg shadow-green-600/20 transition text-sm sm:text-base"
                >
                  Pre IPO
                </button>
              </div>

              <div className="mt-6 sm:mt-8 w-full max-w-[650px] bg-white border border-slate-200 rounded-2xl shadow-sm p-3 sm:p-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                  {[
                    { value: "50+", label: "Live IPOs", icon: TrendingUp },
                    { value: "150+", label: "Unlisted Shares", icon: Building2 },
                    { value: "50+", label: "Brokers Compared", icon: UserCog2Icon },
                    { value: "2M+", label: "Investors", icon: UserCheck },
                  ].map(({ value, label, icon: Icon }, i) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2 sm:gap-3 ${
                        i !== 3 ? "lg:border-r border-slate-200" : ""
                      }`}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                          {value}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-slate-500">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-radial from-green-200/50 via-green-100/20 to-transparent scale-125 blur-[80px]" />
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[220px] h-[220px] bg-green-300/15 rounded-full blur-[60px]" />
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[300px] h-[70px] bg-green-500/20 blur-[40px] rounded-full" />
                <div className="absolute top-[25%] left-[20%] w-[120px] h-[120px] bg-white/30 rounded-full blur-[45px]" />
                <img
                  src="/images/hero-img1.png"
                  alt="ShareBazaarOnline - IPO GMP, Unlisted Shares and Broker Comparison Platform"
                  className="relative z-10 w-[420px] xl:w-[520px] object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UNLISTED / PRE-IPO SHARES SECTION */}
      <section className="py-8 max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
              Trending Unlisted Shares
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Most searched pre-IPO and unlisted companies
            </p>
          </div>
          <button
            onClick={() => navigate("/pre-ipo-stocks")}
            className="hidden lg:flex items-center gap-2 font-semibold text-[#00B14F] hover:text-[#009944] transition text-sm"
          >
            View All →
          </button>
        </div>

        <div className="lg:hidden flex gap-3 overflow-x-auto scrollbar-hide pb-3">
          {unlistedStocks.slice(0, 10).map((stock) => (
            <div
              key={stock.id}
              onClick={() => navigate(`/preipo/${stock.id}/${slugify(stock.name)}`)}
              className="min-w-[180px] sm:min-w-[220px] bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-sm flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-slate-100 bg-white flex items-center justify-center flex-shrink-0">
                <img
                  src={stock.logo}
                  alt={stock.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {stock.name}
                </h4>
                <p className="mt-1 text-sm sm:text-base font-semibold text-slate-700">
                  ₹{parseFloat(stock.price || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
          {unlistedStocks.slice(0, 6).map((stock) => (
            <div
              key={stock.id}
              onClick={() => navigate(`/preipo/${stock.id}/${slugify(stock.name)}`)}
              className="bg-white border border-slate-200 rounded-2xl px-4 py-5 hover:border-green-300 hover:shadow-md transition-all h-[110px] cursor-pointer"
            >
              <div className="flex items-center gap-3 h-full">
                <div className="w-16 h-16 rounded-xl border border-slate-100 bg-white flex items-center justify-center flex-shrink-0">
                  <img
                    src={stock.logo}
                    alt={stock.name}
                    className="w-11 h-11 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[15px] font-bold text-slate-900 truncate leading-tight">
                    {stock.name}
                  </h4>
                  <p className="mt-2 text-lg font-semibold text-slate-700">
                    ₹{parseFloat(stock.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:hidden text-center mt-4">
          <button
            onClick={() => navigate("/pre-ipo-stocks")}
            className="text-[#00B14F] font-semibold text-sm"
          >
            View All →
          </button>
        </div>
      </section>

      {/* BROKER ANALYZER SECTION */}
      <section className="py-12 lg:py-16 max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          <div className="flex-1 rounded-[28px] bg-white border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,0.05)] overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500" />
            <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-4 sm:pb-6">
              <p className="text-xs sm:text-sm font-semibold text-blue-700 tracking-wide">
                BROKER ANALYZER
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
                Best Stock Brokers in India
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500 max-w-2xl">
                Compare brokerage charges, platform features, ratings, trading tools and account opening benefits across India's leading stock brokers.
              </p>
            </div>

            <div className="px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8">
              <BrokerAnalyzer />
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100 pt-6">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                    Looking for the right broker?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Compare top brokers side-by-side and choose the one that matches your investing style.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/comparebrokers")}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold transition text-sm sm:text-base"
                >
                  View All Brokers →
                </button>
              </div>
            </div>
          </div>

          <div className="hidden xl:block w-[340px] flex-shrink-0">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061A40] via-[#0A2558] to-[#0E3A73] p-7 shadow-2xl border border-cyan-500/10 sticky top-24 text-white">
              <div className="absolute bottom-8 right-4 opacity-[0.06] pointer-events-none">
                <svg width="180" height="100" viewBox="0 0 180 100" fill="none">
                  {[30, 50, 40, 70, 60, 85].map((y, i) => (
                    <g key={i}>
                      <line
                        x1={i * 28 + 15}
                        y1={100 - y - 10}
                        x2={i * 28 + 15}
                        y2={100 - y + 10}
                        stroke="#67E8F9"
                        strokeWidth="2"
                      />
                      <rect
                        x={i * 28 + 10}
                        y={100 - y}
                        width="10"
                        height="18"
                        rx="2"
                        fill="#22D3EE"
                      />
                    </g>
                  ))}
                </svg>
              </div>
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M24 0 L0 0 0 24" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold">
                  Broker Analysis
                </div>
                <h3 className="mt-4 text-3xl font-black leading-tight">
                  Find Your <span className="block text-cyan-400">Perfect Broker</span>
                </h3>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                  Compare brokerage fees, platform features, ratings and trading tools before opening your account.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "Compare Brokerage Charges",
                    "Trading Platform Features",
                    "Ratings & User Reviews",
                    "Advanced Broker Analysis",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate("/comparebrokers")}
                  className="mt-8 w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/20"
                >
                  Compare Brokers →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdBanner />

      {/* LIVE & UPCOMING IPOS */}
      <section className="py-12 lg:py-16 max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="rounded-[28px] bg-white border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500" />
          <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-4 sm:pb-6">
            <p className="text-xs sm:text-sm font-semibold text-blue-700 tracking-wide">
              IPO TRACKER
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
              Live & Upcoming IPOs
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500 max-w-2xl">
              Track open IPOs, upcoming issues, price bands, lot sizes and listing schedules in one place.
            </p>
          </div>

          <div className="px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8">
            {isIPOLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-green-600" />
              </div>
            ) : (
              <IpoList ipos={ipos} />
            )}

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100 pt-6">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                  Looking for all IPOs?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Explore upcoming, closed and listed IPOs with complete details.
                </p>
              </div>
              <button
                onClick={() => navigate("/ipo/ipo-list")}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold transition text-sm sm:text-base"
              >
                View All IPOs →
              </button>
            </div>
          </div>
        </div>
      </section>

      <AdBanner />

      {/* BLOGS & MARKET INSIGHTS */}
      <section className="py-12 lg:py-16 max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="rounded-[28px] bg-white border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500" />
          <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-4 sm:pb-6">
            <p className="text-xs sm:text-sm font-semibold text-blue-700 tracking-wide">
              INSIGHT HUB
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
              News & Blogs
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500 max-w-2xl">
              Stay updated with the latest IPO news, dividend announcements, bonus issues, rights issues, NFO launches, REITs, bonds and market insights.
            </p>
          </div>

          <div className="px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8">
            <Blogs />
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100 pt-6">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                  Explore all market insights
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Read expert analysis, IPO updates and investment research.
                </p>
              </div>
              <button
                onClick={() => navigate("/insight-hub")}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold transition text-sm sm:text-base"
              >
                View All Articles →
              </button>
            </div>
          </div>
        </div>
      </section>

      <AdBanner />

      {/* WHY CHOOSE US SECTION */}
      <section className="py-12 lg:py-16 max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="rounded-[28px] bg-white border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500" />
          <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-4 sm:pb-6">
            <p className="text-xs sm:text-sm font-semibold text-blue-700 tracking-wide">
              WHY SHAREBAZAARONLINE
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
              Your Ultimate Hub for{" "}
              <span className="text-green-600">Smarter Stock-Market Decisions</span>
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500 max-w-3xl">
              Everything you need — IPO updates, unlisted shares, broker comparison, and market insights — all in one powerful platform.
            </p>
          </div>

          <div className="px-4 sm:px-6 lg:px-10 pb-8 sm:pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Real-Time IPO Updates & Insights",
                  items: [
                    "Live IPO timelines & issue details",
                    "Daily GMP (Grey Market Premium)",
                    "Real-time subscription status",
                    "Instant allotment & listing alerts",
                    "Complete SME + Mainboard calendar",
                  ],
                },
                {
                  icon: Gem,
                  title: "Unlisted & Pre-IPO Shares",
                  items: [
                    "Verified prices & availability",
                    "ESOP buyback opportunities",
                    "Valuation trends & financials",
                    "Transparent buy/sell process",
                    "Curated high-growth startups",
                  ],
                },
                {
                  icon: Scale,
                  title: "Compare Top Stock Brokers",
                  items: [
                    "Brokerage & account charges",
                    "Platform speed & features",
                    "Charts, tools & order types",
                    "Customer support ratings",
                    "Margin, IPO funding & perks",
                  ],
                },
                {
                  icon: Lightbulb,
                  title: "Deep Market Insights",
                  items: [
                    "Sector trends & outlook",
                    "Fundamentals & valuations",
                    "Dividend, bonus & buybacks",
                    "Analyst reports & summaries",
                    "Actionable investment ideas",
                  ],
                },
              ].map(({ icon: Icon, title, items }, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-7 hover:shadow-lg hover:border-green-200 transition-all"
                >
                  <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 leading-snug">
                      {title}
                    </h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-green-600 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100 pt-6">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                  Everything you need in one platform
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  IPO tracking, unlisted shares, broker comparison and market research.
                </p>
              </div>
              <button
                onClick={() => navigate("/ipo/ipo-list")}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold transition text-sm sm:text-base"
              >
                Explore Platform →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY INVESTORS BANNER */}
      <section className="py-10 sm:py-12 bg-white border-t border-slate-200/80">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-[10px] sm:text-xs font-bold tracking-wider">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
            TRUSTED BY INVESTORS ACROSS INDIA
          </div>
          <h2 className="mt-4 sm:mt-5 text-2xl sm:text-3xl lg:text-5xl font-black leading-tight text-slate-900">
            Why Investors <span className="text-green-600">Trust Us</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            We make the Indian stock market{" "}
            <span className="font-semibold text-slate-900">
              simple, transparent and accessible
            </span>{" "}
            through reliable IPO data, unlisted share insights, broker comparison tools, and market intelligence.
          </p>
        </div>
      </section>
    </div>
  );
}