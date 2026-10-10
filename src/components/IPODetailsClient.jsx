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
  ArrowRight,
} from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = "https://sharebazaaronline.com";

const Card = ({ children }) => (
  <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, id }) => (
  <div
    id={id}
    className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 sm:px-6 py-3 flex items-center gap-3 scroll-mt-24"
  >
    {Icon && <Icon className="w-5 h-5 text-white shrink-0" />}
    <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-wide">
      {title}
    </h2>
  </div>
);

const TableWrapper = ({ children }) => (
  <div className="p-4 sm:p-5 overflow-x-auto">{children}</div>
);

/* Reusable advertisement placeholder */
const AdBlock = ({ size = "horizontal", label = "Advertisement" }) => (
  <div className="w-full flex justify-center py-2">
    <div
      className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 font-medium ${
        size === "horizontal" ? "w-full h-28 sm:h-32" : "w-80 h-96"
      }`}
    >
      {label}
    </div>
  </div>
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

  const safeText = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (value === null || value === undefined) return "-";
    return "-";
  };

  const safeArray = (arr) => {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.join(", ");
    }
    return "-";
  };

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "IPO Tracker", url: "/ipo" },
    { name: ipoName, url: `/ipo/${id}/${slug}` },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${ipoName} IPO GMP Today, Price Band & Review`,
    description: safeText(ipo.about_company?.description)?.slice(0, 200) || `Check ${ipoName} IPO GMP today, price band, lot size, subscription status, allotment date, review, financials and latest IPO news on ShareBazaarOnline.`,
    image: ipo.logo ? `${SITE_URL}${ipo.logo}` : `${SITE_URL}/og-image.jpg`,
    datePublished: ipo.grey_market_premium?.gmp_last_updated || ipo.created_at || new Date().toISOString(),
    dateModified: ipo.updated_at || new Date().toISOString(),
    author: { "@type": "Organization", name: "ShareBazaarOnline", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "ShareBazaarOnline",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/ipo/${id}/${slug}` },
  };

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

      <div className="min-h-screen bg-gray-50 w-full">
        {/* HEADER */}
        <header className="bg-white shadow-sm w-full">
          <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-4">
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
                 {(ipo.fullName || ipo.ipo_basic_details?.company_name) &&
  (ipo.fullName || ipo.ipo_basic_details?.company_name) !== ipoName && (
    <p className="text-sm text-gray-600">
      {safeText(ipo.fullName || ipo.ipo_basic_details?.company_name)}
    </p>
)}

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
          <div className="bg-blue-50 border-t border-blue-100 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
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
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 pt-8 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap">
            <Link href="/" className="hover:text-green-600 transition">Home</Link>
            <span>›</span>
            <Link href="/ipo" className="hover:text-green-600 transition">IPO Tracker</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{safeText(ipoName)} IPO</span>
          </div>

          {/* 12-col layout: Quick Nav (2) | Main (8) | Right Promo (2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full">
            {/* LEFT SIDEBAR — Quick Navigation */}
            <aside className="hidden lg:block lg:col-span-2">
              <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Quick Navigation</h3>
                </div>

                <div className="p-2.5 max-h-[75vh] overflow-y-auto">
                  {sections.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => scrollToSection(id)}
                      className={`group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-200 ${
                        activeSection === id
                          ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-md"
                          : "text-slate-700 hover:bg-green-50 hover:text-green-700"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`${
                          activeSection === id
                            ? "text-white"
                            : "text-slate-400 group-hover:text-green-600"
                        }`}
                      />
                      <span className="text-xs font-medium truncate">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="lg:col-span-8 space-y-4 w-full min-w-0">
              {/* About Company */}
              <Card>
                <SectionHeader id="about" icon={Building2} title="About Company" />
                <div className="p-4 sm:p-5 space-y-3 text-sm md:text-base text-slate-700">
                  <p><strong className="text-slate-900">Company Name:</strong> {safeText(ipo.about_company?.company_name)}</p>
                  <p><strong className="text-slate-900">Industry / Sector:</strong> {safeText(ipo.about_company?.industry_sector)}</p>
                  <p><strong className="text-slate-900">Founded Year:</strong> {safeText(ipo.about_company?.founded_year)}</p>
                  <p><strong className="text-slate-900">Promoters:</strong> {safeArray(ipo.about_company?.promoters)}</p>
                  <p className="mt-4 leading-relaxed">{safeText(ipo.about_company?.description)}</p>
                </div>
              </Card>

              {/* IPO Basic Details */}
              <Card>
                <SectionHeader id="basic-details" icon={ClipboardList} title="IPO Basic Details" />
                <TableWrapper>
                  <table className="w-full text-sm border-collapse">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600 w-1/2">Company Name</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_basic_details?.company_name)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">IPO Type</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_basic_details?.ipo_type)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Price Band</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_basic_details?.price_band_min)} – {safeText(ipo.ipo_basic_details?.price_band_max)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Lot Size</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_basic_details?.lot_size)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Total Issue Size</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_basic_details?.total_issue_size)}</td></tr>
                    </tbody>
                  </table>
                </TableWrapper>
              </Card>

              {/* Strengths & Risks */}
              <Card>
                <SectionHeader id="strengths-risks" icon={ShieldCheck} title="IPO Strengths & Risks" />
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-green-700">Strengths</h3>
                    <ul className="list-disc ml-5 space-y-2 text-slate-700 text-sm">
                      {ipo.company_overview?.competitive_strengths?.map((strength, i) => (
                        <li key={i}>{safeText(strength)}</li>
                      )) || <li>No strengths listed</li>}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-700">Risks</h3>
                    <ul className="list-disc ml-5 space-y-2 text-slate-700 text-sm">
                      {ipo.company_overview?.risks?.map((risk, i) => (
                        <li key={i}>{safeText(risk)}</li>
                      )) || <li>No risks listed</li>}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* AD BLOCK #1 */}
              <AdBlock />

              {/* IPO Important Dates */}
              <Card>
                <SectionHeader id="important-dates" icon={Clock} title="IPO Important Dates" />
                <TableWrapper>
                  <table className="w-full text-sm border-collapse">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600 w-1/2">IPO Open Date</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_important_dates?.ipo_open_date)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">IPO Close Date</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_important_dates?.ipo_close_date)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Basis of Allotment</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_important_dates?.basis_of_allotment_date)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Refund Initiation</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_important_dates?.refund_initiation_date)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Demat Credit Date</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_important_dates?.demat_credit_date)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Listing Date</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_important_dates?.listing_date)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Anchor Investor Date</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_important_dates?.anchor_investor_date)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">UPI Mandate Deadline</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_important_dates?.upi_mandate_deadline)}</td></tr>
                    </tbody>
                  </table>
                </TableWrapper>
              </Card>

              {/* IPO Objectives */}
              <Card>
                <SectionHeader id="objectives" icon={Target} title="IPO Objectives" />
                <div className="p-4 sm:p-6">
                  <ul className="list-disc ml-5 space-y-2 text-slate-700 text-sm">
                    <li>Capital expenditure for machinery and equipment – {safeText(ipo.ipo_objectives?.expansion)}</li>
                    <li>Funding working capital requirements – {safeText(ipo.ipo_objectives?.working_capital)}</li>
                    <li>Debt repayment – {safeText(ipo.ipo_objectives?.debt_repayment)}</li>
                    <li>General corporate purposes – {safeText(ipo.ipo_objectives?.general_corporate_purposes)}</li>
                  </ul>
                </div>
              </Card>

              {/* Investor Reservation */}
              <Card>
                <SectionHeader id="investor-reservation" icon={Users} title="Investor Reservation" />
                <TableWrapper>
                  <table className="w-full text-sm border-collapse">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600 w-1/2">QIB Quota</td><td className="p-3 text-slate-900">{safeText(ipo.investor_reservation?.qib_quota)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Retail Quota</td><td className="p-3 text-slate-900">{safeText(ipo.investor_reservation?.retail_quota)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">HNI Quota</td><td className="p-3 text-slate-900">{safeText(ipo.investor_reservation?.hni_quota)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Employee Quota</td><td className="p-3 text-slate-900">{safeText(ipo.investor_reservation?.employee_quota)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Shareholder Quota</td><td className="p-3 text-slate-900">{safeText(ipo.investor_reservation?.shareholder_quota)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Anchor Investor Allocation</td><td className="p-3 text-slate-900">{safeText(ipo.investor_reservation?.anchor_investor_allocation)}</td></tr>
                    </tbody>
                  </table>
                </TableWrapper>
              </Card>

              {/* Market Lot Details */}
              <Card>
                <SectionHeader id="lot-allocation" icon={Ticket} title="Market Lot Details" />
                <TableWrapper>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-3 text-left font-semibold text-slate-700">Application</th>
                        <th className="p-3 text-center font-semibold text-slate-700">Lot Size</th>
                        <th className="p-3 text-center font-semibold text-slate-700">Shares</th>
                        <th className="p-3 text-right font-semibold text-slate-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-slate-50/50"><td className="p-3 text-slate-800">Retail Minimum</td><td className="p-3 text-center text-slate-800">{safeText(ipo.market_lot_details?.retail_minimum?.lot_size)}</td><td className="p-3 text-center text-slate-800">{safeText(ipo.market_lot_details?.retail_minimum?.shares)}</td><td className="p-3 text-right text-slate-800">{safeText(ipo.market_lot_details?.retail_minimum?.amount)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 text-slate-800">Retail Maximum</td><td className="p-3 text-center text-slate-800">{safeText(ipo.market_lot_details?.retail_maximum?.lot_size)}</td><td className="p-3 text-center text-slate-800">{safeText(ipo.market_lot_details?.retail_maximum?.shares)}</td><td className="p-3 text-right text-slate-800">{safeText(ipo.market_lot_details?.retail_maximum?.amount)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 text-slate-800">S-HNI Minimum</td><td className="p-3 text-center text-slate-800">{safeText(ipo.market_lot_details?.shni_minimum?.lot_size)}</td><td className="p-3 text-center text-slate-800">{safeText(ipo.market_lot_details?.shni_minimum?.shares)}</td><td className="p-3 text-right text-slate-800">{safeText(ipo.market_lot_details?.shni_minimum?.amount)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 text-slate-800">S-HNI Maximum</td><td className="p-3 text-center text-slate-800">{safeText(ipo.market_lot_details?.shni_maximum?.lot_size)}</td><td className="p-3 text-center text-slate-800">{safeText(ipo.market_lot_details?.shni_maximum?.shares)}</td><td className="p-3 text-right text-slate-800">{safeText(ipo.market_lot_details?.shni_maximum?.amount)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 text-slate-800">B-HNI Minimum</td><td className="p-3 text-center text-slate-800">{safeText(ipo.market_lot_details?.bhni_minimum?.lot_size)}</td><td className="p-3 text-center text-slate-800">{safeText(ipo.market_lot_details?.bhni_minimum?.shares)}</td><td className="p-3 text-right text-slate-800">{safeText(ipo.market_lot_details?.bhni_minimum?.amount)}</td></tr>
                    </tbody>
                  </table>
                </TableWrapper>
              </Card>

              {/* Key Performance Indicators */}
              <Card>
                <SectionHeader id="kpi" icon={TrendingUp} title="Key Performance Indicators (KPI)" />
                <TableWrapper>
                  <table className="w-full text-sm border-collapse">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600 w-1/2">ROE</td><td className="p-3 text-slate-900">{safeText(ipo.key_performance_indicators?.roe)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">ROCE</td><td className="p-3 text-slate-900">{safeText(ipo.key_performance_indicators?.roce)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">RoNW</td><td className="p-3 text-slate-900">{safeText(ipo.key_performance_indicators?.ronw)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">PAT Margin</td><td className="p-3 text-slate-900">{safeText(ipo.key_performance_indicators?.pat_margin)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">EBITDA Margin</td><td className="p-3 text-slate-900">{safeText(ipo.key_performance_indicators?.ebitda_margin)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">EPS</td><td className="p-3 text-slate-900">{safeText(ipo.key_performance_indicators?.eps)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">NAV per share</td><td className="p-3 text-slate-900">{safeText(ipo.key_performance_indicators?.nav_per_share)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Debt to Equity</td><td className="p-3 text-slate-900">{safeText(ipo.key_performance_indicators?.debt_to_equity)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">P/E Ratio</td><td className="p-3 text-slate-900">{safeText(ipo.key_performance_indicators?.pe_ratio)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Industry P/E</td><td className="p-3 text-slate-900">{safeText(ipo.key_performance_indicators?.industry_pe)}</td></tr>
                    </tbody>
                  </table>
                </TableWrapper>
              </Card>

              {/* Company Financial Data */}
              <Card>
                <SectionHeader id="financials" icon={BarChart3} title="Company Financial Data" />
                <TableWrapper>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="p-3 text-left font-semibold text-slate-700">Period</th>
                        <th className="p-3 text-right font-semibold text-slate-700">Assets</th>
                        <th className="p-3 text-right font-semibold text-slate-700">Total Income</th>
                        <th className="p-3 text-right font-semibold text-slate-700">PAT</th>
                        <th className="p-3 text-right font-semibold text-slate-700">EBITDA</th>
                        <th className="p-3 text-right font-semibold text-slate-700">Net Worth</th>
                        <th className="p-3 text-right font-semibold text-slate-700">Borrowings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {ipo.company_financial_data?.map((f, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="p-3 text-slate-800">{safeText(f.period)}</td>
                          <td className="p-3 text-right text-slate-800">{safeText(f.assets)}</td>
                          <td className="p-3 text-right text-slate-800">{safeText(f.total_income)}</td>
                          <td className="p-3 text-right text-slate-800">{safeText(f.pat)}</td>
                          <td className="p-3 text-right text-slate-800">{safeText(f.ebitda)}</td>
                          <td className="p-3 text-right text-slate-800">{safeText(f.net_worth)}</td>
                          <td className="p-3 text-right text-slate-800">{safeText(f.total_borrowing)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrapper>
              </Card>

              {/* AD BLOCK #2 */}
              <AdBlock />

              {/* Grey Market Premium */}
              <Card>
                <SectionHeader id="gmp" icon={IndianRupee} title="Grey Market Premium" />
                <TableWrapper>
                  <table className="w-full text-sm border-collapse">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600 w-1/2">GMP Price</td><td className="p-3 text-slate-900">{safeText(ipo.grey_market_premium?.gmp_price)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Kostak Rate</td><td className="p-3 text-slate-900">{safeText(ipo.grey_market_premium?.kostak_rate)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Subject to Sauda</td><td className="p-3 text-slate-900">{safeText(ipo.grey_market_premium?.subject_to_sauda)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Last Updated</td><td className="p-3 text-slate-900">{safeText(ipo.grey_market_premium?.gmp_last_updated)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Estimated Listing Price</td><td className="p-3 text-slate-900">{safeText(ipo.grey_market_premium?.estimated_listing_price)}</td></tr>
                    </tbody>
                  </table>
                </TableWrapper>
              </Card>

              {/* IPO Subscription Data */}
              <Card>
                <SectionHeader id="subscription" icon={PieChart} title="IPO Subscription Data" />
                <TableWrapper>
                  <table className="w-full text-sm border-collapse">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600 w-1/2">Total Subscription</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_subscription_data?.total_subscription)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">QIB (Ex Anchor)</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_subscription_data?.qib_ex_anchor)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">HNI Subscription</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_subscription_data?.hni_subscription)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Retail Subscription</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_subscription_data?.retail_subscription)}</td></tr>
                      <tr className="hover:bg-slate-50/50"><td className="p-3 font-medium text-slate-600">Anchor</td><td className="p-3 text-slate-900">{safeText(ipo.ipo_subscription_data?.anchor)}</td></tr>
                    </tbody>
                  </table>
                </TableWrapper>
              </Card>

              {/* IPO Intermediaries */}
              <Card>
                <SectionHeader id="intermediaries" icon={Landmark} title="IPO Intermediaries" />
                <div className="p-4 sm:p-6 space-y-3 text-sm text-slate-700">
                  <p><strong className="text-slate-900">Registrar:</strong> {safeText(ipo.ipo_intermediaries?.registrar)}</p>
                  <p>
                    <strong className="text-slate-900">Registrar Website:</strong>{" "}
                    {ipo.ipo_intermediaries?.registrar_website ? (
                      <a href={ipo.ipo_intermediaries.registrar_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {ipo.ipo_intermediaries.registrar_website}
                      </a>
                    ) : "-"}
                  </p>
                </div>
              </Card>

              {/* IPO Lead Manager */}
              <Card>
                <SectionHeader id="lead-manager" icon={Briefcase} title="IPO Lead Manager(s)" />
                <div className="p-4 sm:p-6 text-sm text-slate-700">
                  {safeText(ipo.ipo_lead_manager?.lead_manager)}
                </div>
              </Card>

              {/* Company Information */}
              <Card>
                <SectionHeader id="company-info" icon={Building2} title="Company Information" />
                <div className="p-4 sm:p-6 space-y-3 text-sm text-slate-700">
                  <p><strong className="text-slate-900">Address:</strong> {safeText(ipo.company_information?.company_address)}</p>
                  <p>
                    <strong className="text-slate-900">Website:</strong>{" "}
                    {ipo.company_information?.company_website ? (
                      <a href={ipo.company_information.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {ipo.company_information.company_website}
                      </a>
                    ) : "-"}
                  </p>
                  <p><strong className="text-slate-900">Email:</strong> {safeText(ipo.company_information?.company_email)}</p>
                  <p><strong className="text-slate-900">Phone:</strong> {safeText(ipo.company_information?.company_phone)}</p>
                </div>
              </Card>

              {/* IPO Documents */}
              <Card>
                <SectionHeader id="documents" icon={FileText} title="IPO Documents" />
                <div className="p-4 sm:p-6 space-y-3">
                  {ipo.ipo_documents?.drhp_link && (
                    <a href={ipo.ipo_documents.drhp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                      <Download size={16} /> DRHP
                    </a>
                  )}
                  {ipo.ipo_documents?.rhp_link && (
                    <a href={ipo.ipo_documents.rhp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                      <Download size={16} /> RHP
                    </a>
                  )}
                  {ipo.ipo_documents?.prospectus_pdf && (
                    <a href={ipo.ipo_documents.prospectus_pdf} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                      <Download size={16} /> Prospectus PDF
                    </a>
                  )}
                  {ipo.ipo_documents?.investor_presentation && (
                    <a href={ipo.ipo_documents.investor_presentation} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                      <Download size={16} /> Investor Presentation
                    </a>
                  )}
                </div>
              </Card>

              {/* FAQ */}
              {ipo.faq && ipo.faq.length > 0 && (
                <Card>
                  <SectionHeader id="faq" icon={HelpCircle} title="Frequently Asked Questions (FAQ)" />
                  <div className="p-4 sm:p-6 space-y-3">
                    {ipo.faq.map((item, index) => (
                      <div key={index} className="overflow-hidden rounded-lg border border-gray-100">
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition"
                        >
                          <span className="font-medium text-gray-800 text-sm pr-4">{safeText(item.question)}</span>
                          {openFaqs[index] ? (
                            <ChevronUp size={20} className="text-gray-600 shrink-0" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-600 shrink-0" />
                          )}
                        </button>
                        {openFaqs[index] && (
                          <div className="px-4 pb-4 pt-2 text-gray-700 text-sm leading-relaxed border-t border-gray-50">
                            {safeText(item.answer)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </main>

            {/* RIGHT SIDEBAR — 3 compact sticky promo cards */}
            <aside className="hidden lg:block lg:col-span-2">
              <div className="sticky top-28 space-y-3">
                {[
                  {
                    badge: "IPO Insights",
                    title: "Track Live",
                    titleAccent: "IPOs & GMP",
                    description:
                      "Real-time subscription numbers, GMP trends and upcoming issues.",
                    accentText: "text-cyan-400",
                    accentBg: "bg-cyan-500 hover:bg-cyan-400",
                    accentDot: "bg-cyan-400",
                    accentBorder: "border-cyan-400/25",
                    accentBadgeBg: "bg-cyan-400/10",
                    accentGlow1: "bg-cyan-400/15",
                    accentGlow2: "bg-blue-400/10",
                    shadow: "shadow-cyan-500/20",
                    links: [
                      { label: "Live IPOs", href: "/ipo" },
                      { label: "Upcoming Issues", href: "/ipo" },
                    ],
                    cta: { label: "IPO Tracker", href: "/ipo" },
                  },
                  {
                    badge: "Pre-IPO",
                    title: "Explore",
                    titleAccent: "Unlisted Shares",
                    description:
                      "Verified prices and valuations of India's top pre-IPO companies.",
                    accentText: "text-emerald-400",
                    accentBg: "bg-emerald-500 hover:bg-emerald-400",
                    accentDot: "bg-emerald-400",
                    accentBorder: "border-emerald-400/25",
                    accentBadgeBg: "bg-emerald-400/10",
                    accentGlow1: "bg-emerald-400/15",
                    accentGlow2: "bg-teal-400/10",
                    shadow: "shadow-emerald-500/20",
                    links: [
                      { label: "Unlisted Stocks", href: "/preipo" },
                      { label: "Top Valuations", href: "/preipo" },
                    ],
                    cta: { label: "View Pre-IPO", href: "/preipo" },
                  },
                  {
                    badge: "Brokers",
                    title: "Compare",
                    titleAccent: "Top Brokers",
                    description:
                      "Brokerage charges, platform features and account-opening benefits.",
                    accentText: "text-violet-400",
                    accentBg: "bg-violet-500 hover:bg-violet-400",
                    accentDot: "bg-violet-400",
                    accentBorder: "border-violet-400/25",
                    accentBadgeBg: "bg-violet-400/10",
                    accentGlow1: "bg-violet-400/15",
                    accentGlow2: "bg-fuchsia-400/10",
                    shadow: "shadow-violet-500/20",
                    links: [
                      { label: "Broker Analyzer", href: "/broker-analyzer" },
                      { label: "Compare Charges", href: "/comparebrokers" },
                    ],
                    cta: { label: "Compare Brokers", href: "/comparebrokers" },
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#061A40] via-[#0A2558] to-[#0E3A73] p-3.5 shadow-lg border border-cyan-500/10 text-white"
                  >
                    {/* Decorative glows */}
                    <div
                      className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl pointer-events-none ${card.accentGlow1}`}
                    />
                    <div
                      className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-3xl pointer-events-none ${card.accentGlow2}`}
                    />

                    <div className="relative z-10">
                      <div
                        className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${card.accentBadgeBg} ${card.accentBorder} ${card.accentText}`}
                      >
                        {card.badge}
                      </div>

                      <h3 className="mt-2.5 text-base font-black leading-tight">
                        {card.title}
                        <span className={`block ${card.accentText}`}>
                          {card.titleAccent}
                        </span>
                      </h3>

                      <p className="mt-2 text-slate-300 text-[11px] leading-snug">
                        {card.description}
                      </p>

                      <div className="mt-2.5 space-y-1">
                        {card.links.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-2 text-[11px] group"
                          >
                            <div
                              className={`w-1 h-1 rounded-full shrink-0 group-hover:scale-150 transition ${card.accentDot}`}
                            />
                            <span className="text-slate-200 group-hover:text-white transition">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <Link
                        href={card.cta.href}
                        className={`mt-3 w-full py-1.5 rounded-md text-slate-950 font-bold transition-all shadow-md text-[11px] text-center inline-flex items-center justify-center gap-1 ${card.accentBg} ${card.shadow}`}
                      >
                        {card.cta.label}
                        <ArrowRight size={12} className="stroke-[2.5]" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}