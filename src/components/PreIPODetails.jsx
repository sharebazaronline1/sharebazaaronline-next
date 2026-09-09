// src/components/PreIPODetails.jsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  AlertTriangle,
  Users,
  IndianRupee,
  Wallet,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Home,
} from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = "https://sharebazaaronline.com";

/* ================= REUSABLE COMPONENTS ================= */
const Card = ({ children }) => (
  <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 flex items-center gap-3">
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
const PreIPODetails = ({ data: initialData, id, slug }) => {
  const router = useRouter();
  const [openFaqs, setOpenFaqs] = useState({});
  const [showFullOverview, setShowFullOverview] = useState(false);

  const data = initialData;

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">Company Not Found</h2>
          <Link
            href="/pre-ipo-stocks"
            className="text-emerald-600 underline mt-4 inline-block"
          >
            ← Back to Unlisted Shares
          </Link>
        </div>
      </div>
    );
  }

  const toggleFaq = (index) => {
    setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const displayPrice = Number(data.price || 0).toLocaleString("en-IN");
  const overviewText = data.overview || "";
  const shortOverview =
    overviewText.length > 900
      ? overviewText.slice(0, 900) + "..."
      : overviewText;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Unlisted Shares", url: "/pre-ipo-stocks" },
    { name: data.name, url: `/pre-ipo-stocks/${id}/${slug}` },
  ];

  // Helper function to check if data exists
  const hasData = (dataArray) => {
    return dataArray && Array.isArray(dataArray) && dataArray.length > 0;
  };

  // Helper to format values
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === 'number') return value.toLocaleString('en-IN');
    return value;
  };

  // Generate Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${data.name} - Unlisted Share Details`,
    description: data.overview?.slice(0, 200) || `Complete details about ${data.name} unlisted shares.`,
    image: data.logo ? `${SITE_URL}${data.logo}` : `${SITE_URL}/og-image.jpg`,
    datePublished: data.created_at || new Date().toISOString(),
    dateModified: data.updated_at || new Date().toISOString(),
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
      "@id": `${SITE_URL}/pre-ipo-stocks/${id}/${slug}`,
    },
  };

  // Generate Product Schema with absolute URLs
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${data.name} Unlisted Shares`,
    description: data.overview?.slice(0, 300) || `${data.name} unlisted shares investment opportunity.`,
    image: data.logo ? `${SITE_URL}${data.logo}` : `${SITE_URL}/og-image.jpg`,
    offers: {
      "@type": "Offer",
      price: data.price || 0,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/pre-ipo-stocks/${id}/${slug}`,
    },
    brand: {
      "@type": "Brand",
      name: data.name,
    },
  };

  return (
    <>
      {/* JSON-LD Schemas with absolute URLs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* FAQ Schema */}
      {data.faq && data.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: data.faq.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
      )}

      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* VISUAL BREADCRUMB NAVIGATION */}
          <nav
            aria-label="Breadcrumb"
            className="text-sm font-medium text-slate-500"
          >
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-emerald-600 flex items-center gap-1 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <li>
                <Link
                  href="/pre-ipo-stocks"
                  className="hover:text-emerald-600 transition-colors"
                >
                  Unlisted Shares
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <li className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
                {data.name}
              </li>
            </ol>
          </nav>

          {/* HERO */}
          <header className="relative bg-slate-50">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 ml-4 lg:ml-6 py-6 pl-6 lg:pl-96 relative">
              <div className="shrink-0">
                <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-xl p-4 bg-white shadow-md border border-gray-100">
                  <img
                    src={data.logo}
                    alt={`${data.name} unlisted share logo`}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="pt-2 lg:pt-4">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
                  {data.name}
                </h1>
                <p className="text-base lg:text-lg text-slate-600 leading-relaxed max-w-4xl">
                  {data.shareDetails?.companyName || data.name}
                </p>
              </div>
            </div>

            <div className="sticky top-[72px] sm:top-[88px] left-0 right-0 w-screen rounded-lg z-40 bg-blue-100 shadow-lg">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 text-blue-700 font-medium">
                  <span className="text-lg">
                    Ready to invest in this opportunity? Apply now through our
                    trusted platforms.
                  </span>
                </div>
                <button
                  onClick={() => router.push("/login")}
                  className="px-10 py-4 bg-[#16A34A] text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-xl hover:bg-[#15803D] transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                >
                  Buy Now @ ₹{displayPrice}
                </button>
              </div>
            </div>
          </header>

          {/* COMPANY OVERVIEW */}
          <Card>
            <SectionHeader
              icon={Building2}
              title={`About ${data.name}`}
            />
            <div className="p-6 text-slate-700 whitespace-pre-line leading-relaxed text-[15px]">
              {showFullOverview ? overviewText : shortOverview}
              {overviewText.length > 900 && (
                <button
                  onClick={() => setShowFullOverview(!showFullOverview)}
                  className="block mt-4 text-emerald-600 font-semibold text-sm hover:underline"
                >
                  {showFullOverview ? "View less" : "View more"}
                </button>
              )}
            </div>
          </Card>

          {/* SHARE DETAILS */}
          <Card>
            <SectionHeader
              icon={IndianRupee}
              title="Share Details"
            />
            <TableWrapper>
              <table className="w-full min-w-[800px] text-sm border-collapse">
                <tbody className="divide-y divide-gray-100">
                  {data.shareDetails && Object.entries(data.shareDetails).map(
                    ([key, value]) => (
                      <tr key={key} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-medium text-slate-600 w-1/2">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </td>
                        <td className="px-6 py-3 text-slate-900 text-right font-semibold">
                          {value || "-"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </TableWrapper>
          </Card>

          {/* FINANCIAL ANNUAL REPORT SUMMARY */}
          <Card>
            <SectionHeader
              icon={BarChart3}
              title="Financial Annual Report Summary"
            />
            <div className="p-6 text-slate-700 leading-relaxed whitespace-pre-line">
              {data.financials?.annualReportSummary ||
                "Detailed audited financial performance summary will be updated soon."}
            </div>
          </Card>

          {/* INCOME STATEMENT */}
          <Card>
            <SectionHeader
              icon={BarChart3}
              title="Income Statement (Profit & Loss) (₹ in Crore)"
            />
            <TableWrapper>
              {hasData(data.financials?.incomeStatement) ? (
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-700 font-semibold">Particulars</th>
                      <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY22</th>
                      <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY23</th>
                      <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY24</th>
                      <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY25</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.financials.incomeStatement.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/30">
                        <td className="px-4 py-3 text-slate-800 font-medium">{r.label}</td>
                        <td className="px-4 py-3 text-right text-slate-800">{formatValue(r.fy22)}</td>
                        <td className="px-4 py-3 text-right text-slate-800">{formatValue(r.fy23)}</td>
                        <td className="px-4 py-3 text-right text-slate-800">{formatValue(r.fy24)}</td>
                        <td className="px-4 py-3 text-right text-slate-800">{formatValue(r.fy25)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-slate-500 text-center">
                  Income statement data not available
                </div>
              )}
            </TableWrapper>
          </Card>

          {/* KEY FINANCIAL RATIOS */}
          <Card>
            <SectionHeader
              icon={BarChart3}
              title="Key Financial Ratios (Last 3–5 Years)"
            />
            <TableWrapper>
              {hasData(data.financials?.keyRatios) ? (
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-slate-700 font-semibold">Ratio</th>
                      <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY22</th>
                      <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY23</th>
                      <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY24</th>
                      <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY25</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.financials.keyRatios.map((ratio, i) => (
                      <tr key={i} className="hover:bg-slate-50/30">
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {ratio.label}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">
                          {formatValue(ratio.fy22)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">
                          {formatValue(ratio.fy23)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">
                          {formatValue(ratio.fy24)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">
                          {formatValue(ratio.fy25)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-slate-500 text-center">
                  Financial ratios not available
                </div>
              )}
            </TableWrapper>
          </Card>

          {/* WHY INVEST / INVESTOR INSIGHTS */}
          <Card>
            <SectionHeader
              icon={BarChart3}
              title={`Why Invest in ${data.name.split(' ').slice(0, 3).join(' ')}`}
            />
            <div className="p-6">
              {data.financials?.investorInsight && data.financials.investorInsight.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  {data.financials.investorInsight.map((insight, idx) => (
                    <li key={idx} className="text-slate-700">{insight}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">Investment insights will be updated soon.</p>
              )}
            </div>
          </Card>

          {/* BALANCE SHEET */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <SectionHeader
                icon={Wallet}
                title="Balance Sheet - Assets (₹ in Crore)"
              />
              <TableWrapper>
                {hasData(data.balanceSheet?.assets) ? (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-slate-700 font-semibold">Item</th>
                        <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY22</th>
                        <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY23</th>
                        <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY24</th>
                        <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY25</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.balanceSheet.assets.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/30">
                          <td className="px-4 py-3 text-slate-800 font-medium">{item.label}</td>
                          <td className="px-4 py-3 text-right text-slate-800">{formatValue(item.fy22)}</td>
                          <td className="px-4 py-3 text-right text-slate-800">{formatValue(item.fy23)}</td>
                          <td className="px-4 py-3 text-right text-slate-800">{formatValue(item.fy24)}</td>
                          <td className="px-4 py-3 text-right text-slate-800">{formatValue(item.fy25)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-slate-500 text-center">
                    Balance sheet data not available
                  </div>
                )}
              </TableWrapper>
            </Card>

            <Card>
              <SectionHeader
                icon={Wallet}
                title="Balance Sheet - Liabilities & Equity (₹ in Crore)"
              />
              <TableWrapper>
                {hasData(data.balanceSheet?.liabilities) ? (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-slate-700 font-semibold">Item</th>
                        <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY22</th>
                        <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY23</th>
                        <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY24</th>
                        <th className="px-4 py-3 text-right text-slate-700 font-semibold">FY25</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.balanceSheet.liabilities.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/30">
                          <td className="px-4 py-3 text-slate-800 font-medium">{item.label}</td>
                          <td className="px-4 py-3 text-right text-slate-800">{formatValue(item.fy22)}</td>
                          <td className="px-4 py-3 text-right text-slate-800">{formatValue(item.fy23)}</td>
                          <td className="px-4 py-3 text-right text-slate-800">{formatValue(item.fy24)}</td>
                          <td className="px-4 py-3 text-right text-slate-800">{formatValue(item.fy25)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-4 text-slate-500 text-center">
                    Liabilities data not available
                  </div>
                )}
              </TableWrapper>
            </Card>
          </section>

          {/* LIABILITIES & INSIGHTS */}
          <Card>
            <SectionHeader
              icon={AlertTriangle}
              title="Liabilities Breakdown & Balance Sheet Insights"
            />
            <div className="p-6 text-slate-700 space-y-6">
              {data.balanceSheet?.insights && (
                <div>
                  <h4 className="font-semibold mb-2 text-slate-900">Balance Sheet Insights</h4>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {data.balanceSheet.insights}
                  </p>
                </div>
              )}
              {data.liabilitiesBreakdown && (
                <div>
                  <h4 className="font-semibold mb-2 text-slate-900">Liabilities Breakdown</h4>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {data.liabilitiesBreakdown}
                  </p>
                </div>
              )}
              {data.balanceSheetInsights && (
                <div>
                  <h4 className="font-semibold mb-2 text-slate-900">Additional Insights</h4>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {data.balanceSheetInsights}
                  </p>
                </div>
              )}
              {!data.balanceSheet?.insights && !data.liabilitiesBreakdown && !data.balanceSheetInsights && (
                <p className="text-slate-500">Balance sheet insights will be updated soon.</p>
              )}
            </div>
          </Card>

          {/* CASH FLOW */}
          <Card>
            <SectionHeader
              icon={BarChart3}
              title="Cash Flow Insights"
            />
            <div className="p-6 text-slate-700">
              {data.cashFlow?.insights && data.cashFlow.insights.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {data.cashFlow.insights.map((insight, idx) => (
                    <li key={idx} className="text-slate-600">{insight}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">Cash flow insights will be updated soon.</p>
              )}
            </div>
          </Card>

          {/* SHAREHOLDING PATTERN */}
          <Card>
            <SectionHeader icon={Users} title="Shareholding Pattern" />
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.shareholding && data.shareholding.length > 0 ? (
                data.shareholding.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 bg-slate-50 border border-gray-100 text-center"
                  >
                    <p className="font-bold text-lg text-slate-900 mb-2">
                      {s.year}
                    </p>
                    <p className="text-sm text-slate-600">
                      Promoter:{" "}
                      <span className="font-semibold text-slate-800">
                        {s.promoters || "-"}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Institutional:{" "}
                      <span className="font-semibold text-slate-800">
                        {s.institutional || "-"}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600">
                      Public:{" "}
                      <span className="font-semibold text-slate-800">
                        {s.public || "-"}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-slate-500 py-4">
                  Shareholding pattern data not available
                </div>
              )}
            </div>
          </Card>

          {/* PROMOTERS & MANAGEMENT */}
          <Card>
            <SectionHeader icon={Users} title="Promoters & Management" />
            <div className="p-6">
              {data.promotersManagement && (
                <p className="text-slate-700 mb-4">{data.promotersManagement}</p>
              )}
              {data.management && data.management.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">Key Management</h4>
                  {data.management.map((m, idx) => (
                    <div key={idx} className="text-sm text-slate-600 border-b border-gray-100 pb-2">
                      <span className="font-medium text-slate-800">{m.name}</span>
                      {m.role && <span className="text-slate-500"> - {m.role}</span>}
                      {m.experience && <div className="text-slate-400 text-xs mt-1">{m.experience}</div>}
                    </div>
                  ))}
                </div>
              )}
              {!data.promotersManagement && !data.management && (
                <p className="text-slate-500">Promoter and management details will be updated soon.</p>
              )}
            </div>
          </Card>

          {/* RTA */}
          <Card>
            <SectionHeader
              icon={Users}
              title="Registrar & Transfer Agent (RTA)"
            />
            <div className="p-6 text-sm text-slate-700">
              <p>
                <strong>Registrar:</strong>{" "}
                {data.rta?.registrar || "Not Available"}
              </p>
              {data.rta?.website && (
                <p className="mt-2">
                  <strong>Website:</strong>{" "}
                  <a
                    href={data.rta.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    {data.rta.website}
                  </a>
                </p>
              )}
            </div>
          </Card>

          {/* MANAGEMENT ANALYSIS */}
          <Card>
            <SectionHeader
              icon={BarChart3}
              title="Management Analysis"
            />
            <div className="p-6 text-slate-700 whitespace-pre-line leading-relaxed">
              {data.managementInsight ||
                "Leadership strategy, vision, execution capability, and corporate governance overview."}
            </div>
          </Card>

          {/* FAQ */}
          {data.faq && data.faq.length > 0 && (
            <section
              id="faq"
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-6 text-slate-900">
                Frequently Asked Questions About {data.name}
              </h2>
              <div className="space-y-3">
                {data.faq.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden border border-gray-100"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-50/50 hover:bg-gray-50 transition font-medium text-slate-800"
                    >
                      <span>{item.question}</span>
                      {openFaqs[index] ? (
                        <ChevronUp size={20} className="text-slate-500" />
                      ) : (
                        <ChevronDown size={20} className="text-slate-500" />
                      )}
                    </button>
                    {openFaqs[index] && (
                      <div className="px-4 pb-4 pt-2 text-slate-600 text-sm md:text-base leading-relaxed bg-white border-t border-gray-50">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BACK BUTTON */}
          <div className="text-center pt-4">
            <Link
              href="/pre-ipo-stocks"
              className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={18} />
              Back to All Unlisted Shares
            </Link>
          </div>

          {/* EXPLORE MORE */}
          <div className="bg-gradient-to-br from-white to-slate-50 border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Explore More Investment Opportunities
              </h3>
              <p className="text-slate-500 mt-2 text-sm lg:text-base">
                Discover IPOs, unlisted shares, and broker comparison tools
                curated for smart investors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/ipo/ipo-list"
                className="group bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-emerald-500 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      Latest IPOs
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Track live & upcoming IPOs
                    </p>
                  </div>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition font-bold">
                    →
                  </span>
                </div>
              </Link>

              <Link
                href="/pre-ipo-stocks"
                className="group bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-emerald-500 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      Unlisted Shares
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Invest before public listing
                    </p>
                  </div>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition font-bold">
                    →
                  </span>
                </div>
              </Link>

              <Link
                href="/broker-analyzer"
                className="group bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-emerald-500 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      Compare Brokers
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Find the best broker platform
                    </p>
                  </div>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition font-bold">
                    →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreIPODetails;