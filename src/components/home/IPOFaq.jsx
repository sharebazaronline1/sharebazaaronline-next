import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  { q: "What is an IPO in simple terms?", a: "An IPO (Initial Public Offering) is when a company sells its shares to the public for the first time and gets listed on NSE or BSE." },
  { q: "Is IPO investment safe?", a: "IPO investment carries market risk. Safety depends on company fundamentals, valuation, and market conditions." },
  { q: "How can I apply for an IPO in India?", a: "You can apply through broker apps or bank ASBA using a UPI ID linked to your bank account." },
  { q: "What is IPO GMP today?", a: "IPO GMP is the unofficial premium at which shares trade in the grey market before listing." },
  { q: "Does high GMP guarantee listing gains?", a: "No. GMP only reflects market sentiment and does not guarantee profits." },
  { q: "How is IPO allotment decided?", a: "Allotment depends on subscription levels. In oversubscription, retail allotment is done via lottery." },
  { q: "How to check IPO allotment status?", a: "You can check using PAN or application number on registrar websites like KFintech or Link Intime." },
  { q: "What happens if I don’t get IPO allotment?", a: "Your blocked funds are released automatically." },
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

const INITIAL_COUNT = 5;

const IPOFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const showMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, faqs.length));
  };

  const visibleFaqs = faqs.slice(0, visibleCount);

  return (
    <div className=" rounded-2xl min-h-screen py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            IPO Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Clear answers to common questions about investing in IPOs in India
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {visibleFaqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-6">
                  {faq.q}
                </h3>
                {openIndex === i ? (
                  <ChevronUp size={22} className="text-green-600 flex-shrink-0" />
                ) : (
                  <ChevronDown size={22} className="text-gray-500 flex-shrink-0" />
                )}
              </button>

              {openIndex === i && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 text-base leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View More Button */}
        {visibleCount < faqs.length && (
          <div className="text-center mt-10">
            <button
              onClick={showMore}
              className="px-8 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-medium rounded-full transition shadow-md"
            >
              View More FAQs ({faqs.length - visibleCount} remaining)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default IPOFAQ;