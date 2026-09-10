// src/components/IPOGuideClient.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileText,
  Building2,
  TrendingUp,
  Shield,
  ShieldCheck,
  Scale,
  HelpCircle,
  IndianRupee,
  Users,
  Home,
  ChevronRight,
} from "lucide-react";

import { fetchIPOs } from '@/api/mockApi';
import IpoList, { IPOCard } from "./IpoList";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = "https://sharebazaaronline.com";

const faqs = [
  { q: "What is an IPO in simple terms?", a: "An IPO (Initial Public Offering) is when a company sells its shares to the public for the first time and gets listed on NSE or BSE." },
  { q: "Is IPO investment safe?", a: "IPO investment carries market risk. Safety depends on company fundamentals, valuation, and market conditions." },
  { q: "How can I apply for an IPO in India?", a: "You can apply through broker apps or bank ASBA using a UPI ID linked to your bank account." },
  { q: "What is IPO GMP today?", a: "IPO GMP is the unofficial premium at which shares trade in the grey market before listing." },
  { q: "Does high GMP guarantee listing gains?", a: "No. GMP only reflects market sentiment and does not guarantee profits." },
  { q: "How is IPO allotment decided?", a: "Allotment depends on subscription levels. In oversubscription, retail allotment is done via lottery." },
  { q: "How to check IPO allotment status?", a: "You can check using PAN or application number on registrar websites like KFintech or Link Intime." },
  { q: "What happens if I don't get IPO allotment?", a: "Your blocked funds are released automatically." },
  { q: "What is IPO price band?", a: "Price band is the range within which investors can bid during the IPO." },
  { q: "What is IPO lot size?", a: "Lot size is the minimum number of shares required to apply for an IPO." },
  { q: "What is the minimum investment in IPO?", a: "Minimum investment equals lot size × upper price band." },
  { q: "Can I apply for multiple IPOs at the same time?", a: "Yes, if IPO dates overlap and you meet fund requirements." },
  { q: "Can I apply multiple times for the same IPO?", a: "No. One PAN is allowed per category." },
  { q: "What is SME IPO?", a: "SME IPOs are offerings by small and medium enterprises listed on NSE SME or BSE SME platforms." },
  { q: "Are SME IPOs risky?", a: "Yes. SME IPOs carry higher risk due to lower liquidity and limited disclosure." },
  { q: "What is IPO subscription status?", a: "It shows demand from retail, HNI, and QIB investors." },
  { q: "Which subscription category matters most?", a: "QIB subscription is considered the most reliable indicator." },
  { q: "What is IPO listing date?", a: "Listing date is when shares start trading on the stock exchange." },
  { q: "What is listing gain?", a: "Listing gain is the profit earned if shares list above issue price." },
  { q: "Should I sell IPO shares on listing day?", a: "Depends on valuation, fundamentals, and your investment goal." },
  { q: "What is DRHP?", a: "Draft Red Herring Prospectus filed with SEBI containing company details." },
  { q: "What is RHP?", a: "Red Herring Prospectus filed before IPO opening." },
  { q: "What is anchor investment?", a: "Anchor investors are institutions that invest before IPO opens." },
  { q: "What is OFS in IPO?", a: "Offer for Sale is when existing shareholders sell shares." },
  { q: "What is fresh issue?", a: "Fresh issue involves issuing new shares to raise capital." },
  { q: "What is ASBA?", a: "Application Supported by Blocked Amount." },
  { q: "Is UPI mandatory for IPO?", a: "Yes, for retail investors." },
  { q: "What is IPO lock-in period?", a: "Time during which promoters cannot sell shares." },
  { q: "How long does IPO process take?", a: "6–10 working days." },
  { q: "Are IPO gains taxable?", a: "Yes. Short-term: 15%, Long-term: 10% above ₹1 lakh." },
  { q: "Can NRIs apply for IPO?", a: "Yes, through NRE/NRO accounts." },
  { q: "What is cut-off price?", a: "Highest price in the price band for retail investors." },
  { q: "What happens if UPI mandate is not approved?", a: "IPO application is rejected." },
  { q: "What is oversubscription?", a: "When IPO demand exceeds available shares." },
  { q: "What is undersubscription?", a: "When demand is less than offered shares." },
  { q: "How many lots can retail apply?", a: "Depends on ₹2 lakh limit." },
  { q: "Can I modify IPO application?", a: "Yes, before issue closure." },
  { q: "Is IPO allotment guaranteed?", a: "No." },
  { q: "Can I cancel IPO application?", a: "Yes, before closing." },
  { q: "What is IPO registrar?", a: "Entity managing allotment and refunds." },
  { q: "How to avoid bad IPOs?", a: "Focus on fundamentals and valuation." },
  { q: "What documents are required?", a: "PAN, Demat, Bank account." },
  { q: "What is grey market?", a: "Unofficial IPO trading market." },
  { q: "Is grey market legal?", a: "It is unregulated." },
  { q: "Do IPOs always perform well?", a: "No." },
  { q: "What is face value?", a: "Nominal value of a share." },
  { q: "What is market lot?", a: "Minimum tradable quantity." },
  { q: "What is IPO cut-off time?", a: "Usually 5 PM on closing day." },
  { q: "Can IPO shares be pledged?", a: "Yes, after listing." },
  { q: "What is book building?", a: "Price discovery process." }
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

const FAQSection = () => {
  const [showAllFAQs, setShowAllFAQs] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const visibleFaqs = showAllFAQs ? faqs : faqs.slice(0, 10);

  return (
    <div className="space-y-4">
      {visibleFaqs.map((faq, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => toggle(i)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition"
          >
            <h4 className="text-base lg:text-lg font-medium text-gray-900 pr-6">
              {faq.q}
            </h4>
            {openIndex === i ? (
              <ChevronUp size={22} className="text-gray-600 flex-shrink-0" />
            ) : (
              <ChevronDown size={22} className="text-gray-500 flex-shrink-0" />
            )}
          </button>

          {openIndex === i && (
            <div className="px-6 pb-5">
              <p className="text-gray-700 text-base leading-relaxed">
                {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
      {!showAllFAQs && faqs.length > 10 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAllFAQs(true)}
            className="px-8 py-3 bg-[#16A34A] text-white font-medium rounded-full hover:bg-[#15803D] transition"
          >
            View All FAQs ({faqs.length - 10} more)
          </button>
        </div>
      )}
    </div>
  );
};

const IPOGuideClient = () => {
  const router = useRouter();
  
  const { data: ipos = [], isLoading: isIPOLoading } = useQuery({
    queryKey: ['ipos'],
    queryFn: fetchIPOs,
  });

  // Breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "IPO Guide", url: "/ipoguide" },
  ];

  // Generate Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "IPO Guide 2026 - Complete Guide to IPO Investing in India",
    description: "Complete IPO guide for Indian investors. Learn about IPO types, allotment process, GMP, SME IPOs, taxation, and how to apply for IPOs online.",
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
      "@id": `${SITE_URL}/ipoguide`,
    },
  };

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD Schemas for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        {/* Visual Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm font-medium text-slate-500 pt-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-emerald-600 flex items-center gap-1 transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </li>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <li className="text-slate-900 font-semibold">IPO Guide</li>
          </ol>
        </nav>

        <section className="relative overflow-hidden py-16 lg:py-8 bg-white">
          <div className="relative w-full mx-auto px-2">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-14 items-center">
              {/* LEFT */}
              <div className="xl:col-span-6">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold border border-green-200 shadow-sm">
                  <Building2 size={16} />
                  IPO Learning Hub
                </div>

                <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-black tracking-[-3px] leading-[0.95] text-[#0f172a]">
                  Master IPO
                  <span className="text-green-600 block">
                    Investing 
                  </span>
                </h1>

                <p className="mt-6 text-lg lg:text-[22px] leading-9 text-slate-600 max-w-2xl">
                  Learn IPO basics, allotment rules, GMP, SME IPOs,
                  taxation, subscription data and everything you need
                  to make informed investment decisions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                      <FileText size={22} className="text-green-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Complete IPO Guide</p>
                      <p className="text-sm text-gray-500 mt-1">Everything from basics to advanced concepts</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <ShieldCheck size={22} className="text-blue-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Investor Education</p>
                      <p className="text-sm text-gray-500 mt-1">Understand risks, allotment and taxation</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="xl:col-span-6 relative">
                <div className="relative flex justify-center">
                  <img
                    src="/images/hero-ipoguide.png"
                    alt="IPO Guide"
                    className="w-full max-w-[780px] object-contain drop-shadow-2xl rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Introduction - Vertical Full Width */}
          <section className="bg-white mt-8 rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Introduction to IPO in India</h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              An IPO (Initial Public Offering) marks a crucial milestone in a company's lifecycle. It is the process through which a privately held company becomes publicly traded by offering its shares to the general public for the first time. In India, IPOs are regulated by SEBI and listed on NSE or BSE.
            </p>
            <p className="mt-4 text-base text-gray-700 leading-relaxed">
              For investors, IPOs offer a unique opportunity to invest in companies at an early public stage, potentially benefiting from listing gains and long-term growth. The Indian IPO market has evolved significantly with transparent processes, online applications, and faster allotments.
            </p>
          </section>

          {/* What is an IPO? - Vertical Full Width */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">What is an IPO?</h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed mb-8">
              An IPO is the first sale of a company's equity shares to public investors. Before an IPO, ownership is limited to promoters, founders, private investors, and venture capitalists. Once listed, shares can be freely traded in the secondary market.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Objectives of an IPO</h3>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>Raise capital for expansion and growth</li>
                  <li>Repay existing debt</li>
                  <li>Fund new projects or acquisitions</li>
                  <li>Provide exit to early investors</li>
                  <li>Enhance corporate visibility and brand trust</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Evolution of IPO Market in India</h3>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>India's IPO ecosystem has matured due to:</li>
                  <li>Strong regulatory framework by SEBI</li>
                  <li>Digitization of IPO applications (UPI-ASBA)</li>
                  <li>Increased retail investor participation</li>
                  <li>Growth of SME IPO platforms</li>
                  <li>The Indian IPO market has seen participation from startups, manufacturing giants, technology firms, and government-backed PSUs.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* IPO SECTION */}
          <section className="py-2">
            <div className="w-full max-w-full mx-auto px-6 lg:px-10">
              <div className="flex flex-col xl:flex-row xl:items-start gap-4 xl:gap-3">
                <div className="flex-1 max-w-[1100px]">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 bg-gray-50 border-gray-200 text-center">
                      <h2 className="text-3xl font-black text-gray-900">IPO Tracker</h2>
                      <p className="mt-2 text-lg text-gray-600">Live & Upcoming IPOs in India</p>
                    </div>

                    <div className="p-8">
                      {isIPOLoading ? (
                        <div className="flex justify-center py-20">
                          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-gray-800" />
                        </div>
                      ) : (
                        (() => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          const liveIPOs = ipos
                            .map((ipo) => ({
                              ...ipo,
                              _openDate: new Date(ipo.open),
                              _closeDate: new Date(ipo.close),
                            }))
                            .filter(
                              (ipo) =>
                                !isNaN(ipo._openDate) &&
                                !isNaN(ipo._closeDate) &&
                                ipo._openDate <= today &&
                                today <= ipo._closeDate
                            )
                            .sort((a, b) => a._closeDate - b._closeDate)
                            .slice(0, 8);

                          return (
                            <>
                              <div className="lg:hidden overflow-x-auto px-2 pb-6 scrollbar-hide">
                                {liveIPOs.length > 0 ? (
                                  <div className="flex gap-6">
                                    {liveIPOs.map((ipo) => (
                                      <div key={ipo.id} className="min-w-[280px] flex-shrink-0">
                                        <IPOCard ipo={ipo} />
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="py-20 text-center">
                                    <p className="text-xl font-semibold text-gray-600">No Live IPOs Right Now</p>
                                  </div>
                                )}
                              </div>

                              <div className="hidden lg:block">
                                <IpoList ipos={liveIPOs} />
                              </div>
                            </>
                          );
                        })()
                      )}

                      <div className="text-center mt-8">
                        <button
                          onClick={() => router.push("/ipo")}
                          className="px-8 py-3.5 bg-[#16A34A] text-white font-bold rounded-full hover:bg-[#15803D] transition shadow-md"
                        >
                          View All IPO
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Types of IPOs - Full Width */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Types of IPOs in India</h2>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Based on Pricing Mechanism</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Fixed Price Issue</h4>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>Price decided before issue opens</li>
                  <li>Investors apply at a single fixed price</li>
                  <li>Mostly used in SME IPOs</li>
                  <li>Example: Price: ₹80 per share</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Book Building Issue</h4>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>Price band provided (Lower & Upper price)</li>
                  <li>Final price determined based on demand</li>
                  <li>Most mainboard IPOs follow this method</li>
                  <li>Example: Price Band: ₹100 – ₹105</li>
                </ul>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Based on Share Offering</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Fresh Issue</h4>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>New shares are issued</li>
                  <li>Funds go directly to the company</li>
                  <li>Used for: Business expansion, Debt repayment, Working capital</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Offer for Sale (OFS)</h4>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>Existing shareholders sell shares</li>
                  <li>Company does not receive funds</li>
                  <li>Used for: Partial exit by promoters, Improving public shareholding</li>
                  <li>Most IPOs combine Fresh Issue + OFS</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Mainboard IPO vs SME IPO - Full Width */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Mainboard IPO vs SME IPO</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-base bg-gray-50 rounded-xl border border-gray-200">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Feature</th>
                    <th className="px-6 py-4 text-left">Mainboard IPO</th>
                    <th className="px-6 py-4 text-left">SME IPO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4">Listing Exchange</td>
                    <td className="px-6 py-4">NSE/BSE</td>
                    <td className="px-6 py-4">NSE SME / BSE SME</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4">Investment Size</td>
                    <td className="px-6 py-4">Higher</td>
                    <td className="px-6 py-4">Lower</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4">Risk Level</td>
                    <td className="px-6 py-4">Moderate</td>
                    <td className="px-6 py-4">High</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4">Liquidity</td>
                    <td className="px-6 py-4">High</td>
                    <td className="px-6 py-4">Limited</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4">Disclosure Norms</td>
                    <td className="px-6 py-4">Strict</td>
                    <td className="px-6 py-4">Moderate</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <AdBanner />

          {/* IPO Investor Categories - Full Width */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">IPO Investor Categories</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Retail Investors Box */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Who are Retail Investors?</h3>
                <p className="text-base text-gray-700 mb-4">
                  Retail Individual Investors (RII) are individual investors who apply for IPO shares for personal investment purposes.
                </p>
                <p className="text-base font-medium text-gray-800 mb-2">Investment Limit</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 mb-4">
                  <li>Maximum investment: ₹2,00,000</li>
                  <li>Applications above ₹2 lakh are not considered under retail category</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Key Characteristics</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 mb-4">
                  <li>This category sees the highest participation volume in IPOs</li>
                  <li>Reserved portion in Mainboard IPOs: At least 35% of the total issue size</li>
                  <li>Applications must be made using ASBA (Application Supported by Blocked Amount)</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Allotment Process</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 mb-4">
                  <li>If the IPO is oversubscribed, allotment is done through a computerized lottery system</li>
                  <li>Every valid retail applicant has an equal chance of allotment, irrespective of the number of lots applied</li>
                  <li>Partial or single-lot allotment is common in highly subscribed IPOs</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Best For</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>First-time investors</li>
                  <li>Small investors looking for listing gains or long-term investments</li>
                </ul>
              </div>

              {/* NII / HNI Box */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Who are NIIs / HNIs?</h3>
                <p className="text-base text-gray-700 mb-4">
                  Non-Institutional Investors (NII), commonly known as High Net Worth Individuals (HNI), include: Individuals, Corporates, Trusts, NRIs (non-repatriation basis)
                </p>
                <p className="text-base font-medium text-gray-800 mb-2">Investment Limit</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 mb-4">
                  <li>Investment above ₹2,00,000</li>
                  <li>No upper investment limit</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Sub-Categories</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 mb-4">
                  <li>SEBI further divides NIIs into:</li>
                  <li>Small HNIs (sHNI): ₹2 lakh to ₹10 lakh</li>
                  <li>Big HNIs (bHNI): Above ₹10 lakh</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Key Characteristics</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 mb-4">
                  <li>Reserved portion in Mainboard IPOs: At least 15% of the issue size</li>
                  <li>Higher application amounts increase the probability of allotment, but allotment is not guaranteed</li>
                  <li>No lottery system like retail category</li>
                  <li>Allotment is done on a proportionate basis</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Best For</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>Investors with higher capital</li>
                  <li>Investors aiming for listing gains</li>
                  <li>Experienced market participants</li>
                </ul>
              </div>

              {/* QIB Box */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Who are QIBs?</h3>
                <p className="text-base text-gray-700 mb-4">
                  Qualified Institutional Buyers are professional and regulated investors, such as: Mutual Funds, Banks, Insurance Companies, Foreign Institutional Investors (FIIs / FPIs), Pension Funds
                </p>
                <p className="text-base font-medium text-gray-800 mb-2">Investment Limit</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 mb-4">
                  <li>No maximum investment limit</li>
                  <li>Typically invest large sums</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Key Characteristics</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 mb-4">
                  <li>Reserved portion in Mainboard IPOs: At least 50% of the issue size</li>
                  <li>Considered informed and sophisticated investors</li>
                  <li>Their participation reflects market confidence</li>
                  <li>Strong QIB subscription often indicates positive listing prospects</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Allotment Process</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 mb-4">
                  <li>Allotment is done on a proportionate basis</li>
                  <li>No lottery system</li>
                  <li>Cornerstone investors may get shares before IPO opening (in select cases)</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Best For</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>Institutional and professional investors</li>
                  <li>Long-term strategic investments</li>
                </ul>
              </div>
            </div>

            {/* IPO Category Reservation Summary - Table */}
            <div className="overflow-x-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">IPO Category Reservation Summary (Mainboard IPOs)</h3>
              <table className="w-full text-base bg-gray-50 rounded-xl border border-gray-200">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Investor Category</th>
                    <th className="px-6 py-4 text-left">Reservation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  <tr>
                    <td className="px-6 py-4">QIB</td>
                    <td className="px-6 py-4">≥ 50%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Retail (RII)</td>
                    <td className="px-6 py-4">≥ 35%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">NII / HNI</td>
                    <td className="px-6 py-4">≥ 15%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Employee/Shareholder quota (if applicable)</td>
                    <td className="px-6 py-4">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <AdBanner />

          {/* IPO Price Band, Lot Size & Issue Size - Full Width */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">IPO Price Band, Lot Size & Issue Size</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* IPO Price Band Box */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">IPO Price Band</h3>
                <p className="text-base font-medium text-gray-800 mb-2">What is an IPO Price Band?</p>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  The IPO Price Band is the price range within which investors can bid for shares during the IPO subscription period.
                </p>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  Example: Price Band: ₹100 – ₹105 per share. Investors can bid at any price within this range.
                </p>
                <p className="text-base font-medium text-gray-800 mb-2">Types of IPO Pricing</p>
                <ul className="list-disc pl-6 space-y-3 text-base text-gray-700 mb-4">
                  <li><strong>Fixed Price Issue</strong>: Offered at one fixed price. Common in SME IPOs. Example: ₹80 per share</li>
                  <li><strong>Book-Building Issue (Most Common)</strong>: Price band with lower & upper limits. Final price decided based on demand. Example: ₹100 – ₹105</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">What is Cut-Off Price?</p>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  The final IPO price at which shares are allotted. Retail investors can apply at "Cut-Off". Usually set at the upper end if demand is strong.
                </p>
                <p className="text-base font-medium text-gray-800 mb-2">Why Price Band Matters</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>Determines minimum investment amount</li>
                  <li>Helps evaluate IPO valuation</li>
                  <li>Affects listing gains and long-term returns</li>
                </ul>
              </div>

              {/* IPO Lot Size Box */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">IPO Lot Size</h3>
                <p className="text-base font-medium text-gray-800 mb-2">What is IPO Lot Size?</p>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  The minimum number of shares an investor must apply for in an IPO.
                </p>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  Example: Lot Size: 150 shares, Price Band: ₹100 – ₹105 → Minimum investment = 150 × 105 = ₹15,750
                </p>
                <p className="text-base font-medium text-gray-800 mb-2">Key Points About Lot Size</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700 mb-4">
                  <li>Investors must apply in multiples of lot size</li>
                  <li>Retail investors can apply up to ₹2 lakh</li>
                  <li>Lot size differs for Mainboard and SME IPOs</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Why Lot Size Is Important</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>Determines retail participation level</li>
                  <li>Smaller lots encourage higher applications</li>
                  <li>Affects allotment chances in oversubscribed IPOs</li>
                </ul>
              </div>

              {/* IPO Issue Size Box */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">IPO Issue Size</h3>
                <p className="text-base font-medium text-gray-800 mb-2">What is IPO Issue Size?</p>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  The total value of shares offered to the public in the IPO.
                </p>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  Example: 1 crore shares at ₹100 → Issue Size = ₹100 crore
                </p>
                <p className="text-base font-medium text-gray-800 mb-2">Types of Issue</p>
                <ul className="list-disc pl-6 space-y-3 text-base text-gray-700 mb-4">
                  <li><strong>Fresh Issue</strong>: New shares issued → Funds go to company (expansion, debt repayment, etc.)</li>
                  <li><strong>Offer for Sale (OFS)</strong>: Existing shareholders sell → No funds to company (promoter exit, public float)</li>
                  <li><strong>Combination Issue</strong>: Both Fresh + OFS (most common)</li>
                </ul>
                <p className="text-base font-medium text-gray-800 mb-2">Why Issue Size Matters</p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>Large size → Lower subscription pressure</li>
                  <li>Small size → Higher oversubscription risk</li>
                  <li>Impacts post-listing liquidity</li>
                </ul>
              </div>
            </div>

            {/* Quick Comparison Table */}
            <div className="overflow-x-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Price Band vs Lot Size vs Issue Size – Quick Comparison</h3>
              <table className="w-full text-base bg-gray-50 rounded-xl border border-gray-200">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Component</th>
                    <th className="px-6 py-4 text-left">Meaning</th>
                    <th className="px-6 py-4 text-left">Impact on Investors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  <tr>
                    <td className="px-6 py-4">Price Band</td>
                    <td className="px-6 py-4">Share price range</td>
                    <td className="px-6 py-4">Decides IPO valuation</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Lot Size</td>
                    <td className="px-6 py-4">Minimum shares per application</td>
                    <td className="px-6 py-4">Determines investment amount</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Issue Size</td>
                    <td className="px-6 py-4">Total IPO value</td>
                    <td className="px-6 py-4">Impacts demand & liquidity</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Example */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="text-base font-medium text-gray-800 mb-2">Example: Putting It All Together</p>
              <p className="text-base text-gray-700 leading-relaxed">
                Price Band: ₹200 – ₹210<br />
                Lot Size: 70 shares<br />
                Issue Size: ₹600 crore<br />
                Minimum investment = 70 × 210 = ₹14,700<br />
                Retail investors can apply up to ~13 lots (≈ ₹1.91 lakh)
              </p>
            </div>
          </section>

          {/* Quick Info on SME IPOs - Full Width */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Info on SME IPOs in India</h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed mb-6">
              SME IPOs are designed for small and medium enterprises seeking capital from public markets.
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Characteristics of SME IPOs</h3>
            <ul className="list-disc pl-8 space-y-2 text-base text-gray-700">
              <li>Listed on NSE SME / BSE SME platforms</li>
              <li>Lower issue size</li>
              <li>Higher risk & reward</li>
              <li>Lower liquidity</li>
              <li>Fixed price issues common</li>
            </ul>
          </section>

          {/* SME IPO Eligibility Criteria & Who Should Invest - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">SME IPO Eligibility Criteria</h2>
              </div>
              <ul className="list-disc pl-8 space-y-3 text-base text-gray-700">
                <li>Minimum paid-up capital</li>
                <li>Positive net worth</li>
                <li>Business track record</li>
                <li>SEBI compliance</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Who Should Invest in SME IPOs?</h2>
              </div>
              <ul className="list-disc pl-8 space-y-3 text-base text-gray-700">
                <li>High-risk investors</li>
                <li>Long-term investors</li>
                <li>Investors with small capital exposure</li>
                <li>Not recommended for beginners without research</li>
              </ul>
            </section>
          </div>

          {/* SME IPO vs Mainboard IPO – Risk Comparison */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8 mt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">SME IPO vs Mainboard IPO – Risk Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-base bg-gray-50 rounded-xl border border-gray-200">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Parameter</th>
                    <th className="px-6 py-4 text-left">SME IPO</th>
                    <th className="px-6 py-4 text-left">Mainboard IPO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900">
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4">Risk Level</td>
                    <td className="px-6 py-4">High</td>
                    <td className="px-6 py-4">Moderate</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4">Liquidity</td>
                    <td className="px-6 py-4">Low</td>
                    <td className="px-6 py-4">High</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4">Volatility</td>
                    <td className="px-6 py-4">Very High</td>
                    <td className="px-6 py-4">Medium</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4">Retail Allocation</td>
                    <td className="px-6 py-4">Higher</td>
                    <td className="px-6 py-4">Standard</td>
                  </tr>
                  <tr className="hover:bg-gray-100">
                    <td className="px-6 py-4">Disclosure Norms</td>
                    <td className="px-6 py-4">Moderate</td>
                    <td className="px-6 py-4">Strict</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* IPO Allotment Process & Taxation - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">IPO Allotment Process Explained</h2>
              </div>
              <ul className="list-disc pl-8 space-y-3 text-base text-gray-700">
                <li>If IPO is undersubscribed → All applicants receive shares</li>
                <li>If oversubscribed → Lottery system for retail investors</li>
                <li>Allotment is finalized by the registrar.</li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">IPO Taxation in India</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-center space-x-8 bg-gray-50 rounded-xl py-6 px-8">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-800">Short-term Gains</p>
                    <p className="text-sm text-gray-600">Holding &lt; 1 year</p>
                  </div>
                  <p className="text-xl font-black text-gray-900">15%</p>
                </div>

                <div className="flex items-center justify-center space-x-8 bg-gray-50 rounded-xl py-6 px-8">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-800">Long-term Gains</p>
                    <p className="text-sm text-gray-600">Above ₹1 lakh (Holding &gt; 1 year)</p>
                  </div>
                  <p className="text-xl font-black text-gray-900">10%</p>
                </div>
              </div>
            </section>
          </div>

          {/* How to Apply for an IPO in India - Full Width */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How to Apply for an IPO in India</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-base text-gray-700 mb-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <p className="font-bold text-gray-900 mb-2">Demat Account</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <p className="font-bold text-gray-900 mb-2">Trading Account / Bank ASBA</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <p className="font-bold text-gray-900 mb-2">PAN Card</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <p className="font-bold text-gray-900 mb-2">UPI ID</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <p className="font-bold text-gray-900 mb-2">Sufficient Bank Balance</p>
              </div>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              Application Methods: Broker platforms (Zerodha, Groww, Angel One), Bank ASBA portals, UPI mandate approval is mandatory for retail investors.
            </p>
            <div className="text-center mt-6">
              <button onClick={() => router.push('/how-to-apply-ipo')} className="px-10 py-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-full transition shadow-lg text-lg">
                Apply Now
              </button>
            </div>
          </section>

          {/* Risk Disclaimer - Before FAQs */}
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <p className="text-base lg:text-lg text-amber-900 font-medium">
              IPO investments carry market risk. Always conduct thorough research before investing.
            </p>
          </div>

          {/* IPO FAQs - Full Width */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">IPO FAQs</h2>
            </div>
            <FAQSection />
          </section>
        </div>
      </div>
    </>
  );
};

export default IPOGuideClient;