"use client"

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Share2,
  ChevronRight,
  Home,
} from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = "https://sharebazaaronline.com";

const InsightHubDetail = ({ blog, id, slug }) => {
  const [openFaqs, setOpenFaqs] = useState({});

  const corporateCategories = [
    "Buyback", "Stock Split", "Bonus Issue", "Dividend", "Rights Issue",
    "Merger", "Demerger", "Takeover / Acquisition", "Open Offer", "Delisting",
    "OFS", "QIP", "Preferential Allotment", "Warrants Issue", "ESOP Allotment",
    "FPO", "Bond Issue", "NCD Issue", "Distribution", "Unit Split",
    "AGM", "EGM", "Board Meeting", "Postal Ballot", "E-Voting",
    "Promoter Stake Increase", "Promoter Stake Sale", "Pledge Release",
    "Scheme of Arrangement", "Insolvency Resolution", "CIRP Process",
    "Subsidiary Incorporation", "Joint Venture", "Change of Company Name",
    "IPO Listing", "Change in Director", "CEO Appointment", "Auditor Appointment",
    "Regulatory Action", "Trading Suspension", "Revocation of Suspension",
  ];

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <span className="text-gray-600 text-xl">Article not found</span>
          <Link
            href="/insight-hub"
            className="block mt-6 text-green-600 hover:underline"
          >
            ← Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  const isCorporateAction = blog?.category
    ? corporateCategories.includes(blog.category)
    : false;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.heading || "Insight Article",
          text: "Check out this article",
          url,
        });
      } catch (err) {
        if (err.name !== "AbortError") console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("✅ Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
        alert("Failed to copy link");
      }
    }
  };

  const articleTitle = blog.heading || blog.title || "Article";
  const articleDescription = blog.meta_description || blog.excerpt || "Read this insightful article on ShareBazaarOnline";
  const articleImage = blog.image_url || blog.image || `${SITE_URL}/og-image.jpg`;
  const canonicalPath = `/insight-hub/${id}${slug ? `/${slug}` : ""}`;

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Insight Hub", url: "/insight-hub" },
    { name: articleTitle, url: canonicalPath },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleTitle,
    description: articleDescription,
    datePublished: blog.published_at || blog.created_at || new Date().toISOString(),
    dateModified: blog.updated_at || blog.published_at || blog.created_at || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "ShareBazaarOnline",
    },
    publisher: {
      "@type": "Organization",
      name: "ShareBazaarOnline",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    image: articleImage,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${canonicalPath}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">

          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-sm font-medium text-slate-500"
          >
            <ol className="flex items-center space-x-2 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="hover:text-green-600 flex items-center gap-1 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              <li>
                <Link
                  href="/insight-hub"
                  className="hover:text-green-600 transition-colors"
                >
                  Insight Hub
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              <li className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-[350px] md:max-w-[500px]">
                {articleTitle}
              </li>
            </ol>
          </nav>

          <div className="text-center mb-5">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              {blog.category || "Market Insight"}
            </span>
          </div>

          <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            {articleTitle}
          </h1>

          {blog.image_url && (
            <div className="mb-10">
              <img
                src={blog.image_url}
                alt={articleTitle}
                className="w-full h-auto object-contain rounded-2xl shadow-sm"
              />
            </div>
          )}

          <div className="w-full max-w-none mx-auto">
            <article
              className={`prose-content ${
                isCorporateAction ? "corporate-content" : "blog-content"
              }`}
              dangerouslySetInnerHTML={{ __html: blog.content || "" }}
            />
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-700">
                Share this article
              </span>
              <button
                onClick={handleShare}
                className="p-2 bg-white rounded-full border hover:bg-gray-100 transition"
              >
                <Share2 size={18} />
              </button>
            </div>

            <Link
              href="/insight-hub"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] text-white font-semibold rounded-full hover:bg-[#15803D] transition"
            >
              <ArrowLeft size={18} />
              Back to Insights
            </Link>
          </div>
        </div>

        {!isCorporateAction ? (
          <style jsx global>{`
            .prose-content {
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
              color: #1f2937;
              font-size: 15px;
              line-height: 1.75;
            }

            .prose-content > section,
            .prose-content section.mb-8 {
              margin-bottom: 2rem;
              background: #fff;
              border-radius: 0.75rem;
              border: 1px solid #e5e7eb;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
              overflow: hidden;
            }

            .prose-content .bg-emerald-600,
            .prose-content [class*="bg-emerald"] {
              background-color: #059669 !important;
              padding: 0.5rem 1.5rem !important;
            }

            .prose-content .bg-emerald-600 h2,
            .prose-content .bg-emerald-600 .text-black,
            .prose-content .bg-emerald-600 .text-white,
            .prose-content [class*="bg-emerald"] h2 {
              color: #ffffff !important;
              font-size: 1.125rem !important;
              font-weight: 700 !important;
              margin: 0 !important;
            }

            .prose-content .bg-gray-700 {
              background-color: #374151 !important;
            }

            .prose-content .bg-gray-700 h2 {
              color: #fff !important;
            }

            .prose-content .p-5 {
              padding: 1.25rem !important;
            }

            .prose-content .p-4 {
              padding: 1rem !important;
            }

            .prose-content .bg-slate-50,
            .prose-content .bg-gray-50 {
              background-color: #f8fafc !important;
              border: 1px solid #e5e7eb !important;
              border-radius: 0.75rem !important;
            }

            .prose-content,
            .prose-content p,
            .prose-content span,
            .prose-content div,
            .prose-content li,
            .prose-content td {
              color: #374151;
            }

            .prose-content .text-gray-400 {
              color: #9ca3af !important;
            }

            .prose-content .text-gray-500 {
              color: #6b7280 !important;
            }

            .prose-content .text-gray-600 {
              color: #4b5563 !important;
            }

            .prose-content .text-gray-700 {
              color: #374151 !important;
            }

            .prose-content .text-gray-800,
            .prose-content .text-slate-800,
            .prose-content .text-slate-900 {
              color: #1f2937 !important;
            }

            .prose-content .font-semibold,
            .prose-content .font-bold {
              color: #111827;
            }

            .prose-content .text-emerald-700 {
              color: #047857 !important;
            }

            .prose-content .text-red-600 {
              color: #dc2626 !important;
            }

            .prose-content .text-amber-600 {
              color: #d97706 !important;
            }

            .prose-content strong {
              color: #111827;
              font-weight: 700;
            }

            .prose-content .flex.justify-between {
              display: flex !important;
              justify-content: space-between !important;
              align-items: flex-start;
              gap: 1rem;
            }

            .prose-content .space-y-4 > * + * {
              margin-top: 1rem !important;
            }

            .prose-content .space-y-3 > * + * {
              margin-top: 0.75rem !important;
            }

            .prose-content .space-y-2 > * + * {
              margin-top: 0.5rem !important;
            }

            .prose-content .grid {
              display: grid !important;
              gap: 1rem !important;
            }

            @media (min-width: 1024px) {
              .prose-content .lg\\:grid-cols-2,
              .prose-content [class*="lg:grid-cols-2"] {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
            }

            .prose-content table {
              width: 100%;
              border-collapse: collapse;
            }

            .prose-content th,
            .prose-content td {
              padding: 0.5rem 1rem;
              border-bottom: 1px solid #e5e7eb;
              text-align: left;
              color: #374151;
            }

            .prose-content th {
              color: #6b7280;
              font-weight: 600;
            }

            .prose-content ul {
              list-style: disc;
              padding-left: 1.25rem;
            }

            .prose-content li {
              margin-bottom: 0.5rem;
            }

            .prose-content details {
              background: #fff;
              border: 1px solid #e5e7eb;
              border-radius: 0.75rem;
              margin-bottom: 0.75rem;
              overflow: hidden;
            }

            .prose-content details summary {
              cursor: pointer;
              padding: 1rem 1.25rem;
              font-weight: 600;
              color: #1f2937;
              list-style: none;
            }

            .prose-content details summary::-webkit-details-marker {
              display: none;
            }

            .prose-content details[open] summary {
              border-bottom: 1px solid #f3f4f6;
            }

            .prose-content details > div {
              padding: 0 1.25rem 1.25rem;
              color: #4b5563;
            }

            .prose-content img {
              max-width: 100%;
              height: auto;
              border-radius: 12px;
            }

            .prose-content .bg-emerald-50,
            .prose-content [class*="bg-emerald-50"] {
              background-color: #ecfdf5 !important;
            }

            .prose-content .bg-red-50 {
              background-color: #fef2f2 !important;
            }
          `}</style>
        ) : (
          <style jsx global>{`
            .prose-content {
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
              color: #1f2937;
              font-size: 15px;
              line-height: 1.75;
            }

            .prose-content > section,
            .prose-content section.mb-8 {
              margin-bottom: 2rem;
              background: #fff;
              border-radius: 0.75rem;
              border: 1px solid #e5e7eb;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
              overflow: hidden;
            }

            .prose-content .bg-emerald-600,
            .prose-content [class*="bg-emerald"] {
              background-color: #059669 !important;
              padding: 0.5rem 1.5rem !important;
            }

            .prose-content .bg-emerald-600 h2,
            .prose-content .bg-emerald-600 .text-black,
            .prose-content .bg-emerald-600 .text-white,
            .prose-content [class*="bg-emerald"] h2 {
              color: #ffffff !important;
              font-size: 1.125rem !important;
              font-weight: 700 !important;
              margin: 0 !important;
            }

            .prose-content .bg-gray-700 {
              background-color: #374151 !important;
            }

            .prose-content .bg-gray-700 h2 {
              color: #fff !important;
            }

            .prose-content .p-5 {
              padding: 1.25rem !important;
            }

            .prose-content .p-4 {
              padding: 1rem !important;
            }

            .prose-content .bg-slate-50,
            .prose-content .bg-gray-50 {
              background-color: #f8fafc !important;
              border: 1px solid #e5e7eb !important;
              border-radius: 0.75rem !important;
            }

            .prose-content,
            .prose-content p,
            .prose-content span,
            .prose-content div,
            .prose-content li,
            .prose-content td {
              color: #374151;
            }

            .prose-content .text-gray-400 {
              color: #9ca3af !important;
            }

            .prose-content .text-gray-500 {
              color: #6b7280 !important;
            }

            .prose-content .text-gray-600 {
              color: #4b5563 !important;
            }

            .prose-content .text-gray-700 {
              color: #374151 !important;
            }

            .prose-content .text-gray-800,
            .prose-content .text-slate-800,
            .prose-content .text-slate-900 {
              color: #1f2937 !important;
            }

            .prose-content .font-semibold,
            .prose-content .font-bold {
              color: #111827;
            }

            .prose-content .text-emerald-700 {
              color: #047857 !important;
            }

            .prose-content .text-red-600 {
              color: #dc2626 !important;
            }

            .prose-content .text-amber-600 {
              color: #d97706 !important;
            }

            .prose-content strong {
              color: #111827;
              font-weight: 700;
            }

            .prose-content .flex.justify-between {
              display: flex !important;
              justify-content: space-between !important;
              align-items: flex-start;
              gap: 1rem;
            }

            .prose-content .space-y-4 > * + * {
              margin-top: 1rem !important;
            }

            .prose-content .space-y-3 > * + * {
              margin-top: 0.75rem !important;
            }

            .prose-content .space-y-2 > * + * {
              margin-top: 0.5rem !important;
            }

            .prose-content .grid {
              display: grid !important;
              gap: 1rem !important;
            }

            @media (min-width: 1024px) {
              .prose-content .lg\\:grid-cols-2,
              .prose-content [class*="lg:grid-cols-2"] {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              }
            }

            .prose-content table {
              width: 100%;
              border-collapse: collapse;
            }

            .prose-content th,
            .prose-content td {
              padding: 0.5rem 1rem;
              border-bottom: 1px solid #e5e7eb;
              text-align: left;
              color: #374151;
            }

            .prose-content th {
              color: #6b7280;
              font-weight: 600;
            }

            .prose-content ul {
              list-style: disc;
              padding-left: 1.25rem;
            }

            .prose-content li {
              margin-bottom: 0.5rem;
            }

            .prose-content details {
              background: #fff;
              border: 1px solid #e5e7eb;
              border-radius: 0.75rem;
              margin-bottom: 0.75rem;
              overflow: hidden;
            }

            .prose-content details summary {
              cursor: pointer;
              padding: 1rem 1.25rem;
              font-weight: 600;
              color: #1f2937;
              list-style: none;
            }

            .prose-content details summary::-webkit-details-marker {
              display: none;
            }

            .prose-content details[open] summary {
              border-bottom: 1px solid #f3f4f6;
            }

            .prose-content details > div {
              padding: 0 1.25rem 1.25rem;
              color: #4b5563;
            }

            .prose-content img {
              max-width: 100%;
              height: auto;
              border-radius: 12px;
            }

            .prose-content .bg-emerald-50,
            .prose-content [class*="bg-emerald-50"] {
              background-color: #ecfdf5 !important;
            }

            .prose-content .bg-red-50 {
              background-color: #fef2f2 !important;
            }
          `}</style>
        )}
      </div>
    </>
  );
};

export default InsightHubDetail;