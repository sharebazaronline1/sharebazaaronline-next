// src/components/IPODetailsClient.jsx
"use client";

import { useState } from "react";
import Link from 'next/link';
import {
  Download,
  AlertTriangle,
  Building2,
  Target,
  BarChart3,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  IndianRupee,
  Ticket,
  Users,
  ShieldCheck,
  Briefcase,
  Landmark,
  FileText,
  TrendingUp,
  PieChart,
  ClipboardList,
} from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = "https://sharebazaaronline.com";

/* ================= REUSABLE COMPONENTS ================= */
const Card = ({ children }) => (
  <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, id }) => (
  <div id={id} className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 flex items-center gap-3">
    {Icon && <Icon className="w-5 h-5 text-white" />}
    <h2 className="text-lg lg:text-xl font-bold text-white tracking-wide">
      {title}
    </h2>
  </div>
);

const TableWrapper = ({ children }) => (
  <div className="p-4 overflow-x-auto">{children}</div>
);

/* ================= MAIN COMPONENT ================= */
export default function IPODetailsClient({ initialIpo, id, slug }) {
  const [activeSection, setActiveSection] = useState("about");
  const [openFaqs, setOpenFaqs] = useState({});

  const ipo = initialIpo;

  if (!ipo) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">IPO Not Found</h2>
          <Link href="/ipo" className="text-emerald-600 underline mt-4 inline-block">
            ← Back to IPO List
          </Link>
        </div>
      </div>
    );
  }

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getHigherPrice = (priceStr) => {
    if (!priceStr || typeof priceStr !== 'string') return 0;
    const clean = priceStr.replace(/[^0-9.-]/g, '');
    const parts = clean.split(/[-–]/).filter(Boolean);
    if (parts.length === 0) return 0;
    const num = parseFloat(parts[parts.length - 1].trim());
    return isNaN(num) ? 0 : Math.round(num);
  };

  const getMinInvestment = (ipoData) => {
    if (!ipoData) return 10000;
    if (ipoData.minInvestment) {
      const val = parseInt(ipoData.minInvestment.replace(/[^0-9]/g, ''), 10);
      if (val > 0) return val;
    }
    if (ipoData.ipo_basic_details?.minimum_investment) {
      const val = parseInt(String(ipoData.ipo_basic_details.minimum_investment).replace(/[^0-9]/g, ''), 10);
      if (val > 0) return val;
    }
    const lot = ipoData.lot || ipoData.minBidQuantity || ipoData.ipo_basic_details?.lot_size || 1;
    const price = getHigherPrice(ipoData.price) || getHigherPrice(ipoData.ipo_basic_details?.price_band) || 0;
    const calculated = lot * price;
    return calculated > 100 ? calculated : 10000;
  };

  const minInvestment = getMinInvestment(ipo);
  const ipoName = ipo.name || ipo.fullName || "IPO";

  // Safe text helper
  const safeText = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (value === null || value === undefined) return "-";
    return "-";
  };

  // Safe array helper
  const safeArray = (arr) => {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.join(", ");
    }
    return "-";
  };

  // Breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "IPO Tracker", url: "/ipo" },
    { name: ipoName, url: `/ipo/${id}/${slug}` },
  ];

  // Generate Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${ipoName} IPO GMP Today, Price Band & Review`,
    description: safeText(ipo.about_company?.description)?.slice(0, 200) || `Check ${ipoName} IPO GMP today, price band, lot size, subscription status, allotment date, review, financials and latest IPO news on ShareBazaarOnline.`,
    image: ipo.logo ? `${SITE_URL}${ipo.logo}` : `${SITE_URL}/og-image.jpg`,
    datePublished: ipo.grey_market_premium?.gmp_last_updated || ipo.created_at || new Date().toISOString(),
    dateModified: ipo.updated_at || new Date().toISOString(),
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
      "@id": `${SITE_URL}/ipo/${id}/${slug}`,
    },
  };

  // Generate FAQ Schema
  const faqSchema = ipo.faq && ipo.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ipo.faq.map((faq) => ({
      "@type": "Question",
      name: safeText(faq.question),
      acceptedAnswer: { "@type": "Answer", text: safeText(faq.answer) },
    })),
  } : null;

  const sections = [
    { id: "about", label: "About Company", icon: Building2 },
    { id: "basic-details", label: "IPO Basic Details", icon: ClipboardList },
    { id: "company-overview", label: "Company Overview", icon: Briefcase },
    { id: "strengths-risks", label: "Strengths & Risks", icon: ShieldCheck },
    { id: "important-dates", label: "Important Dates", icon: Clock },
    { id: "objectives", label: "IPO Objectives", icon: Target },
    { id: "investor-reservation", label: "Investor Reservation", icon: Users },
    { id: "lot-allocation", label: "Market Lot Details", icon: Ticket },
    { id: "kpi", label: "Key Indicators", icon: TrendingUp },
    { id: "financials", label: "Financials", icon: BarChart3 },
    { id: "gmp", label: "Grey Market Premium", icon: IndianRupee },
    { id: "subscription", label: "Subscription Data", icon: PieChart },
    { id: "intermediaries", label: "Intermediaries", icon: Landmark },
    { id: "lead-manager", label: "Lead Managers", icon: Briefcase },
    { id: "company-info", label: "Company Info", icon: Building2 },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "faq", label: "FAQs", icon: HelpCircle },
  ];

  return (
    <>
      {/* JSON-LD Schemas for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="min-h-screen bg-gray-50">
        {/* HEADER */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                {ipo.logo ? (
                  <img
                    src={ipo.logo}
                    alt={`${ipoName} IPO GMP and company logo`}
                    className="w-14 h-14 object-contain border rounded-lg"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-700 text-white flex items-center justify-center rounded-lg text-xl font-bold">
                    {ipoName.charAt(0)}
                  </div>
                )}

                <div>
                  <h1 className="text-2xl font-bold">{safeText(ipoName)}</h1>
                  <p className="text-sm text-gray-600">{safeText(ipo.fullName)}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold">
                  {minInvestment.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Minimum Investment</p>
              </div>
            </div>
          </div>

          {/* Blue Banner */}
          <div className="bg-blue-50 border-t border-blue-100">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2 text-blue-900 text-sm">
                <AlertTriangle size={16} />
                Ready to invest in this opportunity? Apply now.
              </div>

              <Link
                href="/how-to-apply-ipo"
                className="bg-[#16A34A] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#15803D] transition"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          
          {/* Breadcrumb - Using href instead of to for Next.js */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-green-600 transition">Home</Link>
            <span>›</span>
            <Link href="/ipo" className="hover:text-green-600 transition">IPO Tracker</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{safeText(ipoName)} IPO</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* SIDEBAR */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="px-5 py-4 bg-slate-50">
                  <h3 className="font-bold text-slate-900">Quick Navigation</h3>
                </div>

                <div className="p-3 max-h-[75vh] overflow-y-auto">
                  {sections.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => scrollToSection(id)}
                      className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
                        activeSection === id
                          ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md"
                          : "text-slate-700 hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={`${
                          activeSection === id
                            ? "text-white"
                            : "text-slate-400 group-hover:text-green-600"
                        }`}
                      />
                      <span className="text-sm font-medium truncate">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="lg:col-span-3 space-y-4">
              
              {/* About Company */}
              <section id="about" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">About Company</h2>
                <div className="space-y-3 text-sm md:text-base">
                  <p><strong>Company Name:</strong> {safeText(ipo.about_company?.company_name)}</p>
                  <p><strong>Industry / Sector:</strong> {safeText(ipo.about_company?.industry_sector)}</p>
                  <p><strong>Founded Year:</strong> {safeText(ipo.about_company?.founded_year)}</p>
                  <p><strong>Promoters:</strong> {safeArray(ipo.about_company?.promoters)}</p>
                  <p className="mt-4">{safeText(ipo.about_company?.description)}</p>
                </div>
              </section>

              {/* IPO Basic Details */}
              <section id="basic-details" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">IPO Basic Details</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-medium">Company Name</td><td className="p-3">{safeText(ipo.ipo_basic_details?.company_name)}</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-medium">IPO Type</td><td className="p-3">{safeText(ipo.ipo_basic_details?.ipo_type)}</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-medium">Price Band</td><td className="p-3">{safeText(ipo.ipo_basic_details?.price_band_min)} – {safeText(ipo.ipo_basic_details?.price_band_max)}</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-medium">Lot Size</td><td className="p-3">{safeText(ipo.ipo_basic_details?.lot_size)}</td></tr>
                      <tr className="hover:bg-gray-50"><td className="p-3 font-medium">Total Issue Size</td><td className="p-3">{safeText(ipo.ipo_basic_details?.total_issue_size)}</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Strengths & Risks */}
              <section id="strengths-risks" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">IPO Strengths & Risks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-green-700">Strengths</h3>
                    <ul className="list-disc ml-6 space-y-3 text-gray-700">
                      {ipo.company_overview?.competitive_strengths?.map((strength, i) => (
                        <li key={i}>{safeText(strength)}</li>
                      )) || <li>No strengths listed</li>}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-red-700">Risks</h3>
                    <ul className="list-disc ml-6 space-y-3 text-gray-700">
                      {ipo.company_overview?.risks?.map((risk, i) => (
                        <li key={i}>{safeText(risk)}</li>
                      )) || <li>No risks listed</li>}
                    </ul>
                  </div>
                </div>
              </section>

              {/* IPO Important Dates */}
              <section id="important-dates" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">IPO Important Dates</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">IPO Open Date</td>
                        <td className="p-3">{safeText(ipo.ipo_important_dates?.ipo_open_date)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">IPO Close Date</td>
                        <td className="p-3">{safeText(ipo.ipo_important_dates?.ipo_close_date)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Basis of Allotment</td>
                        <td className="p-3">{safeText(ipo.ipo_important_dates?.basis_of_allotment_date)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Refund Initiation</td>
                        <td className="p-3">{safeText(ipo.ipo_important_dates?.refund_initiation_date)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Demat Credit Date</td>
                        <td className="p-3">{safeText(ipo.ipo_important_dates?.demat_credit_date)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Listing Date</td>
                        <td className="p-3">{safeText(ipo.ipo_important_dates?.listing_date)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Anchor Investor Date</td>
                        <td className="p-3">{safeText(ipo.ipo_important_dates?.anchor_investor_date)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">UPI Mandate Deadline</td>
                        <td className="p-3">{safeText(ipo.ipo_important_dates?.upi_mandate_deadline)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* IPO Objectives */}
              <section id="objectives" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">IPO Objectives</h2>
                <ul className="list-disc ml-6 space-y-3 text-gray-700">
                  <li>Capital expenditure for machinery and equipment – {safeText(ipo.ipo_objectives?.expansion)}</li>
                  <li>Funding working capital requirements – {safeText(ipo.ipo_objectives?.working_capital)}</li>
                  <li>Debt repayment – {safeText(ipo.ipo_objectives?.debt_repayment)}</li>
                  <li>General corporate purposes – {safeText(ipo.ipo_objectives?.general_corporate_purposes)}</li>
                </ul>
              </section>

              {/* Investor Reservation */}
              <section id="investor-reservation" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">Investor Reservation</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">QIB Quota</td>
                        <td className="p-3">{safeText(ipo.investor_reservation?.qib_quota)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Retail Quota</td>
                        <td className="p-3">{safeText(ipo.investor_reservation?.retail_quota)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">HNI Quota</td>
                        <td className="p-3">{safeText(ipo.investor_reservation?.hni_quota)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Employee Quota</td>
                        <td className="p-3">{safeText(ipo.investor_reservation?.employee_quota)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Shareholder Quota</td>
                        <td className="p-3">{safeText(ipo.investor_reservation?.shareholder_quota)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Anchor Investor Allocation</td>
                        <td className="p-3">{safeText(ipo.investor_reservation?.anchor_investor_allocation)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Market Lot Details */}
              <section id="lot-allocation" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">Market Lot Details</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left">Application</th>
                        <th className="p-3 text-center">Lot Size</th>
                        <th className="p-3 text-center">Shares</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3">Retail Minimum</td>
                        <td className="p-3 text-center">{safeText(ipo.market_lot_details?.retail_minimum?.lot_size)}</td>
                        <td className="p-3 text-center">{safeText(ipo.market_lot_details?.retail_minimum?.shares)}</td>
                        <td className="p-3 text-right">{safeText(ipo.market_lot_details?.retail_minimum?.amount)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3">Retail Maximum</td>
                        <td className="p-3 text-center">{safeText(ipo.market_lot_details?.retail_maximum?.lot_size)}</td>
                        <td className="p-3 text-center">{safeText(ipo.market_lot_details?.retail_maximum?.shares)}</td>
                        <td className="p-3 text-right">{safeText(ipo.market_lot_details?.retail_maximum?.amount)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3">S-HNI Minimum</td>
                        <td className="p-3 text-center">{safeText(ipo.market_lot_details?.shni_minimum?.lot_size)}</td>
                        <td className="p-3 text-center">{safeText(ipo.market_lot_details?.shni_minimum?.shares)}</td>
                        <td className="p-3 text-right">{safeText(ipo.market_lot_details?.shni_minimum?.amount)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3">S-HNI Maximum</td>
                        <td className="p-3 text-center">{safeText(ipo.market_lot_details?.shni_maximum?.lot_size)}</td>
                        <td className="p-3 text-center">{safeText(ipo.market_lot_details?.shni_maximum?.shares)}</td>
                        <td className="p-3 text-right">{safeText(ipo.market_lot_details?.shni_maximum?.amount)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3">B-HNI Minimum</td>
                        <td className="p-3 text-center">{safeText(ipo.market_lot_details?.bhni_minimum?.lot_size)}</td>
                        <td className="p-3 text-center">{safeText(ipo.market_lot_details?.bhni_minimum?.shares)}</td>
                        <td className="p-3 text-right">{safeText(ipo.market_lot_details?.bhni_minimum?.amount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Key Performance Indicators (KPI) */}
              <section id="kpi" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">Key Performance Indicators (KPI)</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">ROE</td>
                        <td className="p-3">{safeText(ipo.key_performance_indicators?.roe)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">ROCE</td>
                        <td className="p-3">{safeText(ipo.key_performance_indicators?.roce)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">RoNW</td>
                        <td className="p-3">{safeText(ipo.key_performance_indicators?.ronw)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">PAT Margin</td>
                        <td className="p-3">{safeText(ipo.key_performance_indicators?.pat_margin)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">EBITDA Margin</td>
                        <td className="p-3">{safeText(ipo.key_performance_indicators?.ebitda_margin)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">EPS</td>
                        <td className="p-3">{safeText(ipo.key_performance_indicators?.eps)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">NAV per share</td>
                        <td className="p-3">{safeText(ipo.key_performance_indicators?.nav_per_share)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Debt to Equity</td>
                        <td className="p-3">{safeText(ipo.key_performance_indicators?.debt_to_equity)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">P/E Ratio</td>
                        <td className="p-3">{safeText(ipo.key_performance_indicators?.pe_ratio)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Industry P/E</td>
                        <td className="p-3">{safeText(ipo.key_performance_indicators?.industry_pe)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Company Financial Data */}
              <section id="financials" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">Company Financial Data</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-left">Period</th>
                        <th className="p-3 text-right">Assets</th>
                        <th className="p-3 text-right">Total Income</th>
                        <th className="p-3 text-right">PAT</th>
                        <th className="p-3 text-right">EBITDA</th>
                        <th className="p-3 text-right">Net Worth</th>
                        <th className="p-3 text-right">Borrowings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ipo.company_financial_data?.map((f, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-3">{safeText(f.period)}</td>
                          <td className="p-3 text-right">{safeText(f.assets)}</td>
                          <td className="p-3 text-right">{safeText(f.total_income)}</td>
                          <td className="p-3 text-right">{safeText(f.pat)}</td>
                          <td className="p-3 text-right">{safeText(f.ebitda)}</td>
                          <td className="p-3 text-right">{safeText(f.net_worth)}</td>
                          <td className="p-3 text-right">{safeText(f.total_borrowing)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Grey Market Premium */}
              <section id="gmp" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">Grey Market Premium</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">GMP Price</td>
                        <td className="p-3">{safeText(ipo.grey_market_premium?.gmp_price)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Kostak Rate</td>
                        <td className="p-3">{safeText(ipo.grey_market_premium?.kostak_rate)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Subject to Sauda</td>
                        <td className="p-3">{safeText(ipo.grey_market_premium?.subject_to_sauda)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Last Updated</td>
                        <td className="p-3">{safeText(ipo.grey_market_premium?.gmp_last_updated)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Estimated Listing Price</td>
                        <td className="p-3">{safeText(ipo.grey_market_premium?.estimated_listing_price)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* IPO Subscription Data */}
              <section id="subscription" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">IPO Subscription Data</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Total Subscription</td>
                        <td className="p-3">{safeText(ipo.ipo_subscription_data?.total_subscription)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">QIB (Ex Anchor)</td>
                        <td className="p-3">{safeText(ipo.ipo_subscription_data?.qib_ex_anchor)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">HNI Subscription</td>
                        <td className="p-3">{safeText(ipo.ipo_subscription_data?.hni_subscription)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Retail Subscription</td>
                        <td className="p-3">{safeText(ipo.ipo_subscription_data?.retail_subscription)}</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-3 font-medium">Anchor</td>
                        <td className="p-3">{safeText(ipo.ipo_subscription_data?.anchor)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* IPO Intermediaries */}
              <section id="intermediaries" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">IPO Intermediaries</h2>
                <div className="space-y-3 text-sm">
                  <p><strong>Registrar:</strong> {safeText(ipo.ipo_intermediaries?.registrar)}</p>
                  <p><strong>Registrar Website:</strong> 
                    {ipo.ipo_intermediaries?.registrar_website ? (
                      <a href={ipo.ipo_intermediaries.registrar_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {ipo.ipo_intermediaries.registrar_website}
                      </a>
                    ) : "-"}
                  </p>
                </div>
              </section>

              {/* IPO Lead Manager(s) */}
              <section id="lead-manager" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">IPO Lead Manager(s)</h2>
                <p className="text-sm">{safeText(ipo.ipo_lead_manager?.lead_manager)}</p>
              </section>

              {/* Company Information */}
              <section id="company-info" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">Company Information</h2>
                <div className="space-y-3 text-sm">
                  <p><strong>Address:</strong> {safeText(ipo.company_information?.company_address)}</p>
                  <p><strong>Website:</strong> 
                    {ipo.company_information?.company_website ? (
                      <a href={ipo.company_information.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {ipo.company_information.company_website}
                      </a>
                    ) : "-"}
                  </p>
                  <p><strong>Email:</strong> {safeText(ipo.company_information?.company_email)}</p>
                  <p><strong>Phone:</strong> {safeText(ipo.company_information?.company_phone)}</p>
                </div>
              </section>

              {/* IPO Documents */}
              <section id="documents" className="bg-white p-6 rounded-xl">
                <h2 className="text-2xl font-bold mb-6">IPO Documents</h2>
                <div className="space-y-3">
                  {ipo.ipo_documents?.drhp_link && (
                    <a href={ipo.ipo_documents.drhp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Download size={16} /> DRHP
                    </a>
                  )}
                  {ipo.ipo_documents?.rhp_link && (
                    <a href={ipo.ipo_documents.rhp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Download size={16} /> RHP
                    </a>
                  )}
                  {ipo.ipo_documents?.prospectus_pdf && (
                    <a href={ipo.ipo_documents.prospectus_pdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Download size={16} /> Prospectus PDF
                    </a>
                  )}
                  {ipo.ipo_documents?.investor_presentation && (
                    <a href={ipo.ipo_documents.investor_presentation} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Download size={16} /> Investor Presentation
                    </a>
                  )}
                </div>
              </section>

              {/* FAQ - collapsible accordion */}
              {ipo.faq && ipo.faq.length > 0 && (
                <section id="faq" className="bg-white p-6 rounded-xl">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions (FAQ)</h2>
                  <div className="space-y-3">
                    {ipo.faq.map((item, index) => (
                      <div key={index} className="overflow-hidden">
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <span className="font-medium text-gray-800">{safeText(item.question)}</span>
                          {openFaqs[index] ? (
                            <ChevronUp size={20} className="text-gray-600" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-600" />
                          )}
                        </button>
                        {openFaqs[index] && (
                          <div className="px-4 pb-4 pt-2 text-gray-700 text-sm md:text-base">
                            {safeText(item.answer)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </main>
          </div>
        </div>
      </div>
    </>
  );
}