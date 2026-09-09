// src/components/UnlistedGuideClient.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, AlertTriangle, FileText, Building2, TrendingUp, Shield, Scale, HelpCircle } from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const faqs = [
  { q: "What are unlisted shares?", a: "Unlisted shares are equity shares of companies that are not listed on stock exchanges like NSE or BSE and are traded through off-market transactions." },
  { q: "Are unlisted shares legal in India?", a: "Yes, unlisted shares are completely legal and governed by the Companies Act, 2013, and depository regulations." },
  { q: "Can retail investors buy unlisted shares?", a: "Yes, any retail investor with a valid PAN card and Demat account can invest in unlisted shares." },
  { q: "What are pre-IPO shares?", a: "Pre-IPO shares are unlisted shares of companies that are expected or planning to launch an IPO in the future." },
  { q: "How are unlisted shares different from listed shares?", a: "Unlisted shares are not traded on stock exchanges, have lower liquidity, and their prices are not publicly discovered like listed shares." },
  { q: "Where can I buy unlisted shares in India?", a: "Unlisted shares can be bought through unlisted share brokers, private deals, employees selling ESOPs, or online platforms like ShareBazar Online." },
  { q: "Is a Demat account mandatory to buy unlisted shares?", a: "Yes, a Demat account is mandatory as unlisted shares are transferred electronically via NSDL or CDSL." },
  { q: "How is the price of unlisted shares decided?", a: "Prices are determined by demand and supply, company fundamentals, industry outlook, IPO expectations, and recent transactions." },
  { q: "Do unlisted shares have an ISIN?", a: "Yes, most unlisted shares have a unique ISIN and are held in Demat form." },
  { q: "Is there a minimum investment amount for unlisted shares?", a: "There is no fixed minimum; it depends on the share price and seller availability." },
  { q: "Can unlisted shares be sold anytime?", a: "They can be sold off-market, but finding a buyer may take time due to limited liquidity." },
  { q: "How long does it take to transfer unlisted shares?", a: "Typically, 2 to 7 working days after payment confirmation and documentation." },
  { q: "What is the settlement process for unlisted shares?", a: "Settlement happens via off-market Demat transfer after funds are transferred to the seller." },
  { q: "Is there a lock-in period for unlisted shares?", a: "There is no lock-in while unlisted, but after IPO, a 6-month lock-in applies for non-promoters." },
  { q: "What happens to unlisted shares after IPO?", a: "They automatically convert into listed shares, but selling is allowed only after the lock-in period ends." },
  { q: "Are dividends paid on unlisted shares?", a: "Yes, if the company declares dividends, unlisted shareholders are eligible." },
  { q: "Is IPO listing guaranteed for pre-IPO shares?", a: "No, IPO plans can be delayed, postponed, or cancelled." },
  { q: "What are the risks of investing in unlisted shares?", a: "Major risks include liquidity risk, valuation risk, governance risk, and IPO uncertainty." },
  { q: "Are unlisted shares safe investments?", a: "They can be safe if invested after proper due diligence, but they carry higher risk than listed stocks." },
  { q: "Can unlisted shares give higher returns than IPOs?", a: "Yes, early entry may result in higher long-term returns, but risks are also higher." },
  { q: "How are unlisted shares taxed in India?", a: "Capital gains tax applies—short-term gains as per income slab, long-term gains at 20% with indexation." },
  { q: "Is Securities Transaction Tax (STT) applicable?", a: "No, STT is not applicable to unlisted share transactions." },
  { q: "What is the holding period for long-term capital gains?", a: "More than 24 months qualifies as long-term for unlisted shares." },
  { q: "Can unlisted shares be pledged for loans?", a: "Generally no, banks rarely accept unlisted shares as collateral." },
  { q: "How do I track the value of unlisted shares?", a: "Values are tracked through broker quotes, recent transactions, and platform-provided price updates." },
  { q: "Are unlisted share prices transparent?", a: "Prices are indicative and negotiated, unlike exchange-traded stocks." },
  { q: "What documents are required to buy unlisted shares?", a: "PAN card, Demat account details, KYC documents, and a linked bank account." },
  { q: "Can NRIs invest in unlisted shares?", a: "Yes, subject to FEMA and RBI guidelines, using appropriate Demat and bank accounts." },
  { q: "Are unlisted shares suitable for beginners?", a: "Not recommended for beginners without guidance due to higher complexity and risk." },
  { q: "How much of my portfolio should I allocate to unlisted shares?", a: "Ideally 5%–15%, depending on risk appetite and financial goals." },
  { q: "Can unlisted shares become worthless?", a: "Yes, if the company fails or shuts down, investors may lose capital." },
  { q: "What are ESOP shares?", a: "ESOP shares are issued to employees and often traded in the unlisted market before IPO." },
  { q: "Are financial statements of unlisted companies available?", a: "Yes, through ROC filings, annual reports, and company disclosures." },
  { q: "How do I verify the authenticity of unlisted shares?", a: "Verify ISIN, company name, Demat credit, and transaction documentation." },
  { q: "Can I buy unlisted shares online?", a: "Yes, through verified platforms that facilitate off-market transactions." },
  { q: "Are unlisted shares regulated by SEBI?", a: "They are indirectly regulated through company law, depositories, and IPO regulations." },
  { q: "What happens if an IPO price is lower than unlisted price?", a: "Investors may face notional losses post listing." },
  { q: "Can I sell unlisted shares partially?", a: "Yes, subject to buyer availability and minimum lot size." },
  { q: "Do unlisted shares appear in Demat statements?", a: "Yes, they appear separately under unlisted securities." },
  { q: "Is insider information a concern in unlisted markets?", a: "Yes, investors should rely only on publicly available and verified information." },
  { q: "Are unlisted shares good for long-term investment?", a: "Yes, if the company has strong fundamentals and growth prospects." },
  { q: "What is off-market transfer?", a: "A direct transfer of shares between two Demat accounts without stock exchange involvement." },
  { q: "How liquid are unlisted shares?", a: "Liquidity is low to medium and depends on company popularity." },
  { q: "Can I gift unlisted shares?", a: "Yes, gifting is allowed through off-market transfer with proper documentation." },
  { q: "Can companies buy back unlisted shares?", a: "Yes, subject to company law and shareholder approvals." },
  { q: "How often do unlisted share prices change?", a: "Prices may change frequently based on demand, news, and IPO developments." },
  { q: "Are unlisted shares risky during market downturns?", a: "Yes, liquidity may dry up during weak market conditions." },
  { q: "What is the biggest advantage of unlisted shares?", a: "Early access to high-quality companies before public listing." },
  { q: "What is the biggest disadvantage of unlisted shares?", a: "Limited liquidity and price transparency." },
  { q: "Should unlisted shares be part of every investor’s portfolio?", a: "Only for investors who understand the risks and have a long-term investment horizon." }
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

const UnlistedGuideClient = () => {
  const [showAllFAQs, setShowAllFAQs] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const router = useRouter();

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const visibleFaqs = showAllFAQs ? faqs : faqs.slice(0, 10);

  // Breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Unlisted Guide", url: "/unlisted-guide" },
  ];

  return (
    <>
      {/* JSON-LD Breadcrumb */}
      <BreadcrumbSchema items={breadcrumbItems} />

      <section className="relative overflow-hidden py-16 lg:py-8">
        <div className="relative max-w-[1800px] mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-14 items-center">
            {/* LEFT CONTENT */}
            <div className="xl:col-span-6">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold border border-green-200 shadow-sm">
                <Building2 size={16} />
                Unlisted Shares Guide
              </div>
              <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-black tracking-[-3px] leading-[0.95] text-[#0f172a]">
                Guide to
                <span className="text-green-600 block">Unlisted Shares</span>
              </h1>
              <p className="mt-6 text-lg lg:text-[22px] leading-9 text-slate-600 max-w-2xl">
                Learn everything about pre-IPO shares,
                valuation, taxation, risks, regulations,
                and investing in India's fastest-growing
                alternative asset class.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    <TrendingUp className="text-green-700" size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Growth Potential</p>
                    <p className="text-sm text-gray-500 mt-1">Early access before IPO</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <Shield className="text-blue-700" size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Regulated Process</p>
                    <p className="text-sm text-gray-500 mt-1">NSDL & CDSL transfers</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <FileText className="text-purple-700" size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Expert Guide</p>
                    <p className="text-sm text-gray-500 mt-1">Risks, tax & valuation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT ILLUSTRATION */}
            <div className="xl:col-span-6 relative">
              <div className="relative flex justify-center">
                <img
                  src="/images/hero-unlisted.png"
                  alt="Unlisted Shares Guide"
                  className="w-full max-w-[820px] object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-8 lg:py-8">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Introduction */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Introduction</h3>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              Unlisted shares, often referred to as pre-IPO shares, represent ownership in companies that are not listed on recognized stock exchanges such as the National Stock Exchange (NSE) or Bombay Stock Exchange (BSE). These shares are legally issued, fully valid equity instruments, but they are traded off-market through private arrangements rather than public exchanges.
            </p>
            <p className="mt-4 text-base text-gray-700 leading-relaxed">
              In recent years, unlisted shares have emerged as one of the fastest-growing alternative investment segments in India, attracting retail investors, High Net-Worth Individuals (HNIs), family offices, venture capitalists, and long-term value investors.
            </p>
            <p className="mt-4 text-base text-gray-700 leading-relaxed">
              The growing interest in companies like NSE India, Tata Capital, HDB Financial Services, SBI General Insurance, and ICICI Lombard (before IPO) has pushed unlisted equity investing into the mainstream.
            </p>
          </section>

          {/* What Are Unlisted Shares? */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">What Are Unlisted Shares?</h3>
            </div>
            <p className="text-base text-gray-700 mb-4">
              <strong>Definition:</strong> Unlisted shares are equity shares of companies that are not traded on any public stock exchange. These companies may be:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-base text-gray-700 mb-6">
              <li>Private limited companies</li>
              <li>Public limited companies not listed on NSE/BSE</li>
              <li>Companies planning an IPO in the future</li>
            </ul>
            <p className="text-base text-gray-700">
              Despite not being listed, these companies are:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-base text-gray-700 mt-4">
              <li>Registered under the Companies Act</li>
              <li>Issued legally</li>
              <li>Held in Demat form</li>
              <li>Transferable via depositories (NSDL/CDSL)</li>
            </ul>
          </section>

          {/* Why Companies Remain Unlisted */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Why Companies Remain Unlisted</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base text-gray-700">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Long-Term Vision</h4>
                <p>Companies may prefer long-term business building without short-term market pressure.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Regulatory Compliance Cost</h4>
                <p>Avoid quarterly disclosures, investor presentations, and exchange reporting.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Strategic Fundraising</h4>
                <p>Raise capital from private equity, venture capital, or strategic investors.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Valuation Optimization</h4>
                <p>Wait for stable revenue, profitability, and favorable market conditions.</p>
              </div>
            </div>
          </section>

          <AdBanner />

          {/* Types of Unlisted Shares */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Types of Unlisted Shares</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Pre-IPO Shares</h4>
                <p className="text-base text-gray-700 mb-4">Companies planning a future IPO.</p>
                <p className="text-sm font-medium text-gray-800 mb-2">Examples:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• NSE India Ltd</li>
                  <li>• Tata Capital Ltd</li>
                  <li>• HDB Financial Services</li>
                  <li>• SBI Mutual Fund</li>
                </ul>
                <p className="mt-5 text-green-700 font-medium">High demand & price appreciation potential</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Private Company Shares</h4>
                <p className="text-base text-gray-700 mb-4">Privately held, no confirmed IPO plans.</p>
                <p className="text-sm font-medium text-gray-800 mb-2">Examples:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• OYO (earlier phase)</li>
                  <li>• PharmEasy</li>
                  <li>• Swiggy (before IPO)</li>
                </ul>
                <p className="mt-5 text-red-700 font-medium">Higher risk due to IPO uncertainty</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Delisted Shares</h4>
                <p className="text-base text-gray-700 mb-4">Previously listed, now removed from exchange.</p>
                <p className="text-sm font-medium text-gray-800 mb-2">Reasons:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Promoter buyback</li>
                  <li>• Low liquidity</li>
                  <li>• Strategic restructuring</li>
                </ul>
                <p className="mt-5 text-gray-700 font-medium">Extremely limited liquidity</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">ESOP Shares</h4>
                <p className="text-base text-gray-700">
                  Employee stock options sold in the unlisted market before company goes public.
                </p>
              </div>
            </div>
          </section>

          <AdBanner />

          {/* Future & Trends */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Future & Trends</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base text-gray-700">
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Key Trends</h4>
                <ul className="space-y-2">
                  <li>• Growing fintech platforms</li>
                  <li>• Rising retail awareness</li>
                  <li>• Strong IPO pipeline</li>
                  <li>• Increasing ESOP monetization</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Growth Drivers</h4>
                <ul className="space-y-2">
                  <li>• Startup ecosystem maturity</li>
                  <li>• Institutional participation</li>
                  <li>• Regulatory clarity</li>
                </ul>
              </div>
            </div>
            <p className="mt-8 text-green-700 font-medium text-lg">
              Unlisted shares are expected to become a mainstream alternative asset class over the next decade.
            </p>
          </section>

          {/* Regulatory Safeguards */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Regulatory Safeguards</h3>
            </div>
            <p className="text-base text-gray-700 mb-4">
              Although unlisted shares are not exchange-traded, they are governed by:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-base text-gray-700">
              <li>Companies Act, 2013</li>
              <li>Depository regulations (NSDL/CDSL)</li>
              <li>SEBI rules for IPO transition</li>
            </ul>
            <p className="mt-6 text-green-700 font-medium">
              📌 Ownership rights remain legally protected.
            </p>
          </section>

          {/* Lock-In After IPO */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Lock-In Period After IPO</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-base bg-gray-50 rounded-xl border border-gray-200">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-8 py-4 text-left">Category</th>
                    <th className="px-8 py-4 text-left">Lock-In Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-8 py-4">Non-promoters</td>
                    <td className="px-8 py-4">6 months</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-4">Promoters</td>
                    <td className="px-8 py-4">18 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Taxation */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Taxation of Unlisted Shares in India</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-base bg-gray-50 rounded-xl border border-gray-200">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-8 py-4 text-left">Holding Period</th>
                    <th className="px-8 py-4 text-left">Tax Type</th>
                    <th className="px-8 py-4 text-left">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-8 py-4">≤ 24 months</td>
                    <td className="px-8 py-4">STCG</td>
                    <td className="px-8 py-4">As per slab</td>
                  </tr>
                  <tr>
                    <td className="px-8 py-4">&gt; 24 months</td>
                    <td className="px-8 py-4">LTCG</td>
                    <td className="px-8 py-4">20% with indexation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Comparison Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Asset Class Comparison */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Unlisted Shares vs Other Asset Classes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-base bg-gray-50 rounded-xl border border-gray-200">
                  <thead className="bg-gray-900 text-white">
                    <tr>
                      <th className="px-8 py-4 text-left">Asset Class</th>
                      <th className="px-8 py-4 text-left">Risk</th>
                      <th className="px-8 py-4 text-left">Return Potential</th>
                      <th className="px-8 py-4 text-left">Liquidity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr><td className="px-8 py-4">Fixed Deposit</td><td>Low</td><td>Low</td><td>High</td></tr>
                    <tr className="bg-gray-100"><td className="px-8 py-4">Mutual Funds</td><td>Medium</td><td>Medium</td><td>High</td></tr>
                    <tr><td className="px-8 py-4">Listed Stocks</td><td>Medium</td><td>Medium–High</td><td>High</td></tr>
                    <tr className="bg-gray-100"><td className="px-8 py-4">Unlisted Shares</td><td className="text-red-600 font-medium">High</td><td className="text-green-600 font-medium">High</td><td>Low</td></tr>
                    <tr><td className="px-8 py-4">Real Estate</td><td>Medium</td><td>Medium</td><td>Low</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-6 text-green-700 font-medium">📌 Best used as satellite allocation, not core.</p>
            </section>
            {/* Unlisted vs IPO Comparison */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Unlisted Shares vs IPO Investment</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-base bg-gray-50 rounded-xl border border-gray-200">
                  <thead className="bg-gray-900 text-white">
                    <tr>
                      <th className="px-8 py-4 text-left">Aspect</th>
                      <th className="px-8 py-4 text-left">Unlisted Shares</th>
                      <th className="px-8 py-4 text-left">IPO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr><td className="px-8 py-4">Entry Timing</td><td>Before IPO</td><td>At IPO</td></tr>
                    <tr className="bg-gray-100"><td className="px-8 py-4">Price Certainty</td><td>Variable</td><td>Fixed</td></tr>
                    <tr><td className="px-8 py-4">Lock-in</td><td>Mandatory</td><td>No</td></tr>
                    <tr className="bg-gray-100"><td className="px-8 py-4">Risk</td><td className="text-red-600 font-medium">Higher</td><td>Lower</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Risk Warning & CTA */}
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-base lg:text-lg text-amber-900 font-medium text-center sm:text-left">
                Unlisted share investments carry higher risks. Buy now through our trusted platforms.
              </p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-full transition shadow-md whitespace-nowrap"
            >
              Buy Now
            </button>
          </div>

          {/* FAQs */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Frequently Asked Questions (FAQs)</h3>
            </div>
            <div className="space-y-3">
              {visibleFaqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition"
                  >
                    <p className="text-base lg:text-lg font-medium text-gray-900 pr-6">
                      {faq.q}
                    </p>
                    {openIndex === i ? (
                      <ChevronUp size={24} className="text-gray-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={24} className="text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === i && (
                    <div className="px-6 pb-6">
                      <p className="text-base text-gray-700 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {!showAllFAQs && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAllFAQs(true)}
                  className="px-10 py-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-medium rounded-full transition shadow-lg text-lg"
                >
                  View All FAQs ({faqs.length - 10} more)
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default UnlistedGuideClient;