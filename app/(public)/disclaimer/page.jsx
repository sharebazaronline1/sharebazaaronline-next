// app/disclaimer/page.jsx
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata = {
  metadataBase: new URL("https://www.sharebazaaronline.com"),
  title: "Disclaimer",
  description:
    "Read the ShareBazaarOnline.com disclaimer. We are an information and educational platform, not a SEBI-registered broker, investment adviser, or research analyst.",
  alternates: { canonical: "/disclaimer" },
  robots: { index: true, follow: true },
};

/* ================= REUSABLE ================= */
const Section = ({ title, paragraphs }) => (
  <section className="mb-8 sm:mb-10">
    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
      {title}
    </h2>
    <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  </section>
);

export default function DisclaimerPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Disclaimer", url: "/disclaimer" },
  ];

  const sections = [
    {
      title: "General",
      paragraphs: [
        "The information on www.sharebazaaronline.com, including IPO details, grey market premium (GMP), subscription and allotment data, unlisted and pre-IPO share prices, broker comparisons, corporate actions, news, and educational content, is provided for general information and research only.",
        "We are not registered with the Securities and Exchange Board of India (SEBI) as a stockbroker, investment adviser, research analyst, or merchant banker. We do not manage money, hold client funds or securities, or guarantee any return. Nothing on this website should be taken as a recommendation, solicitation, or offer to buy or sell any security or financial product.",
      ],
    },
    {
      title: "Not Investment Advice",
      paragraphs: [
        "Content on this website is educational and informational, not personalised investment, legal, tax, or financial advice. It does not take into account your individual objectives, financial situation, or needs.",
        "Investments in securities, IPOs, and unlisted shares are subject to market risks. Read all related documents carefully before investing. Past performance is not indicative of future results. Before making any investment decision, do your own research and consult a SEBI-registered investment adviser or other qualified professional. Any action you take based on this website is at your sole discretion and risk.",
      ],
    },
    {
      title: "Accuracy and Data Sources",
      paragraphs: [
        'Much of our content is compiled from third-party and public sources, including the stock exchanges, NSE and BSE circular and notice feeds, and market data providers and aggregators such as IPO and unlisted-share data services. This data is presented "as is."',
        "We do not guarantee that any information is accurate, complete, current, or error-free, and it may be delayed or differ from official records. The data remains the property of its respective source and is used for information only. Always verify details with the stock exchange, the company, the registrar, or your broker before acting on them. We are not liable for any error, omission, or delay in the data or for any loss arising from reliance on it.",
      ],
    },
    {
      title: "IPO, GMP and Subscription Data",
      paragraphs: [
        "Grey market premium (GMP) is unofficial. GMP figures reflect activity in an unregulated grey market, are not endorsed or recognised by SEBI, the exchanges, or the companies, and are not a reliable indicator of listing price or performance. We publish GMP only as market information. It is speculative, can change rapidly, and should never be the sole basis for an investment decision.",
        "IPO dates, price bands, lot sizes, subscription figures, and allotment status can change and are subject to the official issue documents and the registrar's records. Always rely on the Red Herring Prospectus, the exchange, and the registrar for final details.",
      ],
    },
    {
      title: "Unlisted and Pre-IPO Shares",
      paragraphs: [
        "Unlisted and pre-IPO shares carry significant risk. They are not listed on any stock exchange, are illiquid and may be hard to sell, are not subject to the same disclosure and regulatory protections as listed securities, and can lose value or become worthless. There is no guarantee that any company will complete an IPO or that a listing will happen at any particular price or time.",
        "Prices and valuations shown for unlisted shares are indicative, come from third-party sources, and may not reflect the price at which a transaction can actually be done. Where we or our partners facilitate an enquiry or transaction in unlisted shares, it is subject to separate terms, KYC, and the risks above. Consider taking independent professional advice before dealing in such shares.",
      ],
    },
    {
      title: "Broker Comparison",
      paragraphs: [
        "Brokerage charges, account fees, features, ratings, and offers shown in our broker comparisons are collected from public sources and the brokers themselves, and can change at any time. They may not reflect a broker's current pricing or terms.",
        "A comparison or listing is not an endorsement, recommendation, or guarantee of any broker's services. Verify all charges and terms directly with the broker before opening an account. Some broker links may be referral or affiliate links (see below); this does not affect the information we present.",
      ],
    },
    {
      title: "Third-Party Links and Advertising",
      paragraphs: [
        "The website contains links to third-party websites and displays advertising, including through Google AdSense. We do not control and are not responsible for the content, accuracy, products, services, or privacy practices of any third-party site or advertisement. A link or ad does not imply our endorsement.",
        "We may earn referral, affiliate, or advertising income when you click certain links or ads or open an account through them. This helps us keep the platform free and does not add any cost to you. Your dealings with any third party are solely between you and that third party.",
      ],
    },
    {
      title: "Limitation of Liability",
      paragraphs: [
        "You use this website and its information at your own risk. To the maximum extent permitted by law, ShareBazaarOnline and its operators, affiliates, and personnel are not liable for any direct, indirect, incidental, consequential, or other loss or damage, including trading or investment losses, loss of profit, or loss of data, arising from your use of, or reliance on, the website, its content, or any third-party link or service accessed through it.",
        'The website is provided on an "as is" and "as available" basis, without warranties of any kind, whether express or implied.',
      ],
    },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="bg-white min-h-screen w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8">
          {/* BREADCRUMB */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm font-medium text-slate-500 overflow-x-auto mb-6"
          >
            <ol className="flex items-center gap-2 whitespace-nowrap">
              <li>
                <Link
                  href="/"
                  className="hover:text-slate-900 flex items-center gap-1 transition-colors"
                >
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
              <li className="text-slate-900 font-semibold">Disclaimer</li>
            </ol>
          </nav>

          {/* HERO */}
          <header className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Disclaimer
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Last updated: 08 October 2026
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              ShareBazaarOnline is an information, research, and educational
              platform for the Indian securities market. We are not a
              SEBI-registered broker, investment adviser, or research analyst,
              and nothing on this website is investment advice or an offer to
              buy or sell any security. Please read this disclaimer carefully
              before relying on anything here.
            </p>
          </header>

          {/* SECTIONS */}
          {sections.map(({ title, paragraphs }) => (
            <Section key={title} title={title} paragraphs={paragraphs} />
          ))}

          {/* CHANGES, GOVERNING LAW AND CONTACT */}
          <Section
            title="Changes, Governing Law and Contact"
            paragraphs={[
              "We may update this disclaimer at any time by posting the revised version on this page with a new date. Your continued use of the website means you accept the current version. This disclaimer is governed by the laws of India, and the courts at Bengaluru, Karnataka have jurisdiction over any dispute relating to it. It should be read together with our Privacy Policy and Terms and Conditions.",
            ]}
          />

          {/* CONTACT LINE — separate small block, no icon tile */}
          <p className="text-slate-700 leading-relaxed text-sm sm:text-base mb-8 sm:mb-10">
            Questions about this disclaimer:{" "}
            <a
              href="mailto:support@sharebazaaronline.com"
              className="text-slate-900 font-medium hover:underline break-all sm:break-normal"
            >
              support@sharebazaaronline.com
            </a>
            , or ShareBazaarOnline, Vaishnavi Tech Park, South Tower, 3rd
            Floor, Sarjapur Main Road, Bellandur, Bengaluru, 560103,
            Karnataka, India.
          </p>

          {/* BACK TO HOME */}
          <div className="pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-900 transition-colors text-sm sm:text-base"
            >
              <Home size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}