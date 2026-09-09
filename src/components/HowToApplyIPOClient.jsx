// src/components/HowToApplyIPOClient.jsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Info,
  TrendingUp,
  Clock,
  AlertTriangle,
  Home,
  ChevronRight,
} from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = "https://sharebazaaronline.com";

const HowToApplyIPOClient = () => {
  const router = useRouter();

  // Breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "How to Apply IPO", url: "/how-to-apply-ipo" },
  ];

  // Generate Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Apply for IPO - Step by Step Guide for Indian Investors",
    description: "Learn how to apply for IPO online in India through UPI & ASBA. Complete step-by-step guide with multiple bids, allotment process, and important tips.",
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
      "@id": `${SITE_URL}/how-to-apply-ipo`,
    },
  };

  // Generate HowTo Schema for step-by-step guide
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Apply for an IPO in India",
    description: "Step-by-step guide to apply for IPO online through UPI and ASBA methods.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Choose Your Application Method",
        text: "Decide whether to apply via UPI (through trading app) or ASBA (through bank net banking)."
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select the IPO",
        text: "Go to the IPO section on your trading app or bank portal and select the IPO you want to apply for."
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Enter Bid Details",
        text: "Enter the number of shares and your bid price within the price band. You can place up to 3 bids."
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Approve the Mandate",
        text: "Approve the UPI mandate or ASBA request to block funds in your bank account."
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Wait for Allotment",
        text: "The highest eligible bid is considered for allotment. Excess funds are automatically unblocked."
      }
    ],
    totalTime: "P15M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: "0"
    },
    tool: [
      {
        "@type": "HowToTool",
        name: "Demat Account"
      },
      {
        "@type": "HowToTool",
        name: "PAN Card"
      },
      {
        "@type": "HowToTool",
        name: "UPI ID or Net Banking"
      }
    ]
  };

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the minimum amount required to apply for an IPO?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The minimum amount depends on the IPO price band and lot size. Typically, retail investors need ₹10,000 to ₹15,000 for a single lot application."
        }
      },
      {
        "@type": "Question",
        name: "Can I apply for an IPO without a Demat account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, a Demat account is mandatory to hold shares in electronic form. You need to open a Demat account before applying for any IPO."
        }
      },
      {
        "@type": "Question",
        name: "How many bids can I place in one IPO?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can place up to 3 bids per IPO. Only one bid is finally considered for allotment based on the final issue price."
        }
      },
      {
        "@type": "Question",
        name: "What happens if my funds are blocked for an IPO?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The funds are blocked in your bank account and not debited. If you get allotment, the amount is debited. If not, funds are automatically unblocked."
        }
      },
      {
        "@type": "Question",
        name: "Can I apply for an IPO through mobile banking?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, most banks offer IPO application through their mobile banking apps. You can also use UPI-based trading apps for IPO applications."
        }
      }
    ]
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="bg-gray-50 min-h-screen">
        {/* VISUAL BREADCRUMB */}
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 pt-6">
          <nav aria-label="Breadcrumb" className="text-sm font-medium text-slate-500">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-emerald-600 flex items-center gap-1 transition-colors">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <li className="text-slate-900 font-semibold">How to Apply IPO</li>
            </ol>
          </nav>
        </div>

        {/* HEADER */}
        <header>
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 space-y-3 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
              How to Apply for an IPO <span className="text-emerald-600">(Step-by-Step Guide)</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-5xl mx-auto">
              An IPO (Initial Public Offering) lets retail investors buy shares of a company when it goes public.
              Modern IPO applications in India are completely online — no paperwork, no cheques.
              You can apply through your broker trading platform or your bank's ASBA facility.
            </p>
          </div>
        </header>

        {/* CONTENT */}
        <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-6">

          {/* REQUIREMENTS */}
          <section className="bg-white rounded-lg border shadow-sm p-6" aria-label="Requirements">
            <h2 className="text-lg font-bold mb-4 text-gray-900">What You Need Before Applying</h2>

            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
              {[
                "A Demat account (to hold shares)",
                "A trading account or bank ASBA access",
                "A valid PAN card linked to your bank account",
                "A UPI ID (for UPI-based IPO applications)",
                "Sufficient funds in your bank account",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-xs text-gray-500">
              These are mandatory SEBI requirements for IPO participation.
            </p>
          </section>

          {/* METHODS */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Methods of Applying for an IPO</h2>

            <div className="grid md:grid-cols-2 gap-6">

              {/* UPI */}
              <div className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-gray-900">
                  Apply via UPI (Trading App)
                </h3>

                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Select IPO on your trading app</li>
                  <li>Enter UPI ID linked to your bank</li>
                  <li>Choose bid price & quantity</li>
                  <li>Approve mandate request</li>
                </ul>

                <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs text-gray-700">
                  ✔ No charges <br />
                  ✔ Funds are blocked, not debited <br />
                  ✔ Mandate approval till IPO closing
                </div>
              </div>

              {/* ASBA */}
              <div className="bg-white border rounded-lg shadow-sm p-5 space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Apply via ASBA (Bank Net Banking)
                </h3>

                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li>Login to net banking</li>
                  <li>Go to IPO / ASBA section</li>
                  <li>Enter bid & Demat details</li>
                  <li>Funds remain blocked</li>
                </ul>
              </div>
            </div>
          </section>

          {/* MULTIPLE BIDS */}
          <section className="bg-white border rounded-lg shadow-sm p-6 space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
              <TrendingUp size={18} className="text-emerald-600" />
              IPO Multiple Bids – Practical Example
            </h2>

            <p className="text-sm text-gray-700">
              IPO Price Band: <strong>₹100 – ₹105</strong>
            </p>

            {/* BIDS TABLE */}
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-gray-700">Bid</th>
                    <th className="px-3 py-2 text-center text-gray-700">Number of Shares</th>
                    <th className="px-3 py-2 text-center text-gray-700">Bid Price</th>
                    <th className="px-3 py-2 text-right text-gray-700">Total Bid Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2 text-gray-700">Bid 1</td>
                    <td className="px-3 py-2 text-center text-gray-700">150</td>
                    <td className="px-3 py-2 text-center text-gray-700">₹101</td>
                    <td className="px-3 py-2 text-right text-gray-700">₹15,150</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-gray-700">Bid 2</td>
                    <td className="px-3 py-2 text-center text-gray-700">150</td>
                    <td className="px-3 py-2 text-center text-gray-700">₹102</td>
                    <td className="px-3 py-2 text-right text-gray-700">₹15,300</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-gray-700">Bid 3</td>
                    <td className="px-3 py-2 text-center text-gray-700">150</td>
                    <td className="px-3 py-2 text-center text-gray-700">Cut-Off (₹105)</td>
                    <td className="px-3 py-2 text-right text-gray-700">₹15,750</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ALLOTMENT TABLE */}
            <div className="bg-gray-50 border rounded p-4 space-y-2">
              <h3 className="font-semibold flex items-center gap-2 text-gray-900">
                <Info size={16} className="text-emerald-600" />
                Which Bid Gets Considered for Allotment?
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-700">Final Issue Price</th>
                      <th className="px-3 py-2 text-left text-gray-700">Eligible Bid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 text-gray-700">₹103 or higher</td>
                      <td className="px-3 py-2 text-gray-700">Bid 3</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-700">₹102</td>
                      <td className="px-3 py-2 text-gray-700">
                        Bid 3 (higher quantity between Bid 1 & Bid 3)
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-gray-700">₹100</td>
                      <td className="px-3 py-2 text-gray-700">
                        Bid 2 (largest quantity)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* IMPORTANT NOTE */}
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm flex gap-2">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Only one bid is finally considered for allotment, even if you place three bids.</span>
            </div>

            {/* BLOCKED AMOUNT */}
            <div className="bg-emerald-50 border border-emerald-200 rounded p-4">
              <p className="font-semibold text-gray-900">How Much Money Gets Blocked?</p>
              <p className="text-sm mt-1 text-gray-700">
                Highest bid amount is blocked.
                <br />
                Blocked Amount in this example: <strong>₹15,300 (Bid 2)</strong>
              </p>
              <p className="text-sm mt-2 text-gray-700">
                ✔ Funds remain blocked until allotment <br />
                ✔ Excess funds are automatically unblocked
              </p>
            </div>
          </section>

          {/* WHY MULTIPLE BIDS */}
          <section className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-3 text-gray-900">Why Use Multiple Bids?</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">✔ Improve chances of allotment</li>
              <li className="flex items-center gap-2">✔ Participate at different valuation levels</li>
              <li className="flex items-center gap-2">✔ Optimize IPO strategy</li>
              <li className="flex items-center gap-2">✔ Reduce price mismatch risk</li>
            </ul>
          </section>

          {/* TIMING */}
          <section className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900">
              <Clock size={18} className="text-emerald-600" />
              When Can You Apply?
            </h2>

            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <span className="bg-white border rounded px-4 py-2 shadow-sm">
                IPO opens at 10:00 AM
              </span>
              <span className="bg-white border rounded px-4 py-2 shadow-sm">
                Closes at 4:30 PM
              </span>
              <span className="bg-white border rounded px-4 py-2 shadow-sm">
                Pre-apply window does not affect allotment
              </span>
            </div>
          </section>

          {/* RULES */}
          <section className="bg-white border rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Application Tips & Rules
            </h2>

            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <span className="bg-gray-50 border rounded px-4 py-2">Up to 3 bids allowed per IPO</span>
              <span className="bg-gray-50 border rounded px-4 py-2">UPI mandate must be approved before closing</span>
              <span className="bg-gray-50 border rounded px-4 py-2">Only one application per PAN is allowed</span>
            </div>
          </section>

          {/* CHECK STATUS */}
          <section className="bg-white border rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-center text-gray-900">Check Allotment Status</h2>

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://www.nseindia.com/invest/check-trades-bids-verify-ipo-bids"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
              >
                NSE IPO <ExternalLink size={14} />
              </a>

              <a
                href="https://www.bseindia.com/publicissue.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
              >
                BSE IPO <ExternalLink size={14} />
              </a>

              <a
                href="https://ipostatus.kfintech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition"
              >
                Registrar (KFintech) <ExternalLink size={14} />
              </a>
            </div>
          </section>

          {/* BACK */}
          <div className="pt-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

        </main>
      </div>
    </>
  );
};

export default HowToApplyIPOClient;