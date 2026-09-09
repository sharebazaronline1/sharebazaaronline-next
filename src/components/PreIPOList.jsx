// src/components/PreIPOStocks.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  BriefcaseBusiness,
  ArrowUpRight,
  Filter,
  ChevronDown,
  Star,
  BellRing,
  BadgeCheck,
} from "lucide-react";

import slugify from "../utils/slugify";

const ITEMS_PER_PAGE = 10;

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

const PreIPOStocks = ({ initialIPOs = [] }) => {
  const [ipos, setIPOs] = useState(initialIPOs);
  const [visibleCount, setVisibleCount] = useState(initialIPOs.length);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Hash scroll (replaces react-router useLocation hash)
  useEffect(() => {
    if (typeof window === "undefined" || ipos.length === 0) return;

    const hash = window.location.hash;
    if (!hash) return;

    const targetId = hash.replace("#preipo-", "");

    const scroll = () => {
      const el = document.getElementById(`preipo-${targetId}`);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    };

    const t = setTimeout(scroll, 150);
    return () => clearTimeout(t);
  }, [ipos]);

  const CompanyLogo = ({ name, logo }) => {
    const firstLetter = name?.charAt(0).toUpperCase() || "?";

    return (
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
        {logo ? (
          <img
            src={logo}
            alt={name}
            loading="lazy"
            className="max-w-[70%] max-h-[70%] object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="text-sm font-bold text-gray-700">
            {firstLetter}
          </span>
        )}
      </div>
    );
  };

  const visibleIPOs = ipos.slice(0, visibleCount);

  return (
    <div className="w-full bg-[#f5faf7] min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden border-gray-200 bg-gradient-to-br from-white via-[#f6fffb] to-[#eef8ff] py-16 lg:py-8">

        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-100/40 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-blue-100/40 blur-3xl rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="relative w-full px-4 lg:px-8">

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-14 items-center">

            {/* LEFT */}
            <div className="xl:col-span-6">

              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold border border-green-200 shadow-sm">
                <TrendingUp size={16} />
                Pre-IPO & Unlisted Shares
              </div>

              <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-black tracking-[-3px] leading-[0.95] text-[#0f172a]">
                Invest in{" "}
                Tomorrow’s
                <br />
                <span className="text-green-600">
                  Top Companies
                </span>
              </h1>

              <p className="mt-6 text-lg lg:text-[22px] leading-9 text-slate-600 max-w-2xl">
                Discover high-growth private
                companies before they go public.
                Explore pre-IPO opportunities and
                invest smart.
              </p>

              {/* FEATURES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    <TrendingUp
                      size={22}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      High Growth
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Early access to future
                      leaders
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <ShieldCheck
                      size={22}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      Secure Deals
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Trusted & transparent
                      investments
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <BriefcaseBusiness
                      size={22}
                      className="text-purple-600"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      Curated Picks
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Handpicked opportunities
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT ILLUSTRATION */}
            <div className="xl:col-span-6 relative">

              <div className="relative flex justify-center">

                <img
                  src="/images/hero-preipo.png"
                  alt="Pre IPO"
                  className="w-full max-w-[780px] object-contain drop-shadow-2xl"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* MAIN CONTENT */}
      <section className="w-full px-4 lg:px-8 py-10">

        <div className="w-full">

          {/* LEFT TABLE */}
          <div
            className="
              w-full
              bg-white
              rounded-[28px]
              border
              border-slate-200
              shadow-[0_10px_40px_rgba(15,23,42,0.05)]
              overflow-hidden
            "
          >

            {/* HEADER */}
            <div className="px-8 py-7 border-gray-200">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>
                  <h2 className="text-4xl font-black tracking-[-1px] text-[#0f172a]">
                    Pre-IPO & Unlisted Shares
                  </h2>

                  <p className="mt-2 text-lg text-gray-500">
                    Invest early in high-growth
                    companies before they list
                  </p>
                </div>

              </div>

            </div>

            {/* MOBILE SWIPE */}
            <div className="sm:hidden flex items-center justify-end gap-2 px-4 py-2 bg-blue-50 text-[11px] text-blue-700 font-medium">
              ← Swipe →
            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead>

                  <tr className="bg-gray-50 border-gray-200">

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                      Company
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                      Price / Share
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                      Min. Lot
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                      Depository
                    </th>

                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {loading &&
                    Array.from({
                      length: ITEMS_PER_PAGE,
                    }).map((_, i) => (
                      <tr
                        key={i}
                        className="animate-pulse"
                      >
                        <td className="px-6 py-5">
                          <div className="h-5 bg-gray-200 rounded w-52"></div>
                        </td>
                      </tr>
                    ))}

                  {!loading &&
                    visibleIPOs.map((ipo, i) => (
                      <motion.tr
                        key={ipo.id}
                        id={`preipo-${ipo.id}`}
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: i * 0.02,
                        }}
                        className="hover:bg-gray-50 transition cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/pre-ipo-stocks/${ipo.id}/${slugify(
                              ipo.name
                            )}`
                          )
                        }
                      >

                        {/* COMPANY */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-4 min-w-[280px]">

                            <CompanyLogo
                              name={ipo.name}
                              logo={ipo.logo}
                            />

                            <div>

                              <p className="font-semibold text-gray-900 text-base">
                                {ipo.name}
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                Private Equity •
                                Unlisted Market
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PRICE */}
                        <td className="px-6 py-5 text-center">

                          <div className="font-semibold text-gray-900 ">
                            ₹
                            {ipo.price?.toLocaleString(
                              "en-IN"
                            ) || "-"}
                          </div>

                        </td>

                        {/* LOT */}
                        <td className="px-6 py-5 text-center font-semibold text-gray-800">
                          {ipo.minLotSize || "-"}
                        </td>

                        {/* DEPOSITORY */}
                        <td className="px-6 py-5 text-center text-gray-700 font-medium">
                          {ipo.depository}
                        </td>

                        {/* ACTION */}
                        <td
                          className="px-6 py-5 text-center"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >

                          <div className="flex items-center justify-center gap-3">

                            <button
                              onClick={() =>
                                router.push("/login")
                              }
                              className="h-12 px-5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                            >
                              Buy Now
                            </button>

                            <button
                              onClick={() =>
                                router.push(
                                  `/pre-ipo-stocks/${ipo.id}/${slugify(
                                    ipo.name
                                  )}`
                                )
                              }
                              className="h-12 px-5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                            >
                              View Details
                            </button>

                          </div>

                        </td>

                      </motion.tr>
                    ))}

                </tbody>

              </table>

            </div>

            {/* FOOTER */}
            {!loading && ipos.length > 0 && (
              <div className="px-6 py-5 border-gray-200 bg-[#f8fcf9]">

                <div className="flex items-center justify-between flex-wrap gap-4">

                  <div className="flex items-center gap-3 text-green-700">

                    <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
                      <ShieldCheck size={18} />
                    </div>

                    <p className="text-sm font-medium">
                      All investments are secured
                      & compliant with SEBI
                      regulations.
                    </p>

                  </div>

                  <button
                    onClick={() => router.push("/preipoguide")}
                    className="text-green-700 font-semibold text-sm hover:underline"
                  >
                    Know More About Safety →
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </section>

    </div>
  );
};

export default PreIPOStocks;