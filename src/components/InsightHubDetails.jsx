// src/components/InsightHubDetails.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Share2, ChevronRight, Home } from "lucide-react";
import { AUTHOR } from "@/data/author";
import PromoSidebar from "./PromoSidebar";

const InsightHubDetail = ({
  blog,
  id,
  slug,
  sectionLabel = "Insight Hub",
  sectionHref = "/insight-hub",
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const corporateCategories = [
    "Buyback", "Stock Split", "Bonus Issue", "Dividend", "Rights Issue",
    "Merger", "Demerger", "Takeover / Acquisition", "Open Offer",
    "Delisting", "OFS", "QIP", "Preferential Allotment", "Warrants Issue",
    "ESOP Allotment", "FPO", "Bond Issue", "NCD Issue", "Distribution",
    "Unit Split", "AGM", "EGM", "Board Meeting", "Postal Ballot",
    "E-Voting", "Promoter Stake Increase", "Promoter Stake Sale",
    "Pledge Release", "Scheme of Arrangement", "Insolvency Resolution",
    "CIRP Process", "Subsidiary Incorporation", "Joint Venture",
    "Change of Company Name", "IPO Listing", "Change in Director",
    "CEO Appointment", "Auditor Appointment", "Regulatory Action",
    "Trading Suspension", "Revocation of Suspension",
  ];

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <span className="text-gray-600 text-xl">Article not found</span>
          <Link
            href={sectionHref}
            className="block mt-6 text-green-600 hover:underline"
          >
            ← Back to {sectionLabel}
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
      }
    }
  };

  const articleTitle = blog.heading || blog.title || "Article";

  const publishedDate =
    blog.published_at || blog.created_at || new Date().toISOString();
  const modifiedDate =
    blog.updated_at ||
    blog.published_at ||
    blog.created_at ||
    new Date().toISOString();

  const publishedFmt = new Date(publishedDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const modifiedFmt = new Date(modifiedDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const showUpdated = modifiedFmt !== publishedFmt;

  const Avatar = ({ size = 24, className = "" }) => {
    const fallback = !AUTHOR.photo || imageFailed;
    if (fallback) {
      return (
        <div
          className={`rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 ${className}`}
          style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
          aria-hidden="true"
        >
          {AUTHOR.initials}
        </div>
      );
    }
    return (
      <img
        src={AUTHOR.photo}
        alt={AUTHOR.name}
        loading="eager"
        decoding="async"
        onError={() => setImageFailed(true)}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8">

        <nav
          aria-label="Breadcrumb"
          className="mb-5 text-xs sm:text-sm font-medium text-slate-500"
        >
          <ol className="flex items-center space-x-2 flex-wrap">
            <li>
              <Link
                href="/"
                className="hover:text-green-600 flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li>
              <Link
                href={sectionHref}
                className="hover:text-green-600 transition-colors"
              >
                {sectionLabel}
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li className="text-slate-900 font-semibold truncate max-w-[180px] sm:max-w-[300px] md:max-w-[600px]">
              {articleTitle}
            </li>
          </ol>
        </nav>

        <div className="text-center mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold">
            {blog.category || "Market Insight"}
          </span>
        </div>

        <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          {articleTitle}
        </h1>

        {/* Byline + dates row — hidden entirely for corporate actions */}
        {!isCorporateAction && (
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-slate-500 border-b border-slate-200 pb-5 mb-8">
            <div className="flex items-center gap-2">
              <Avatar size={24} />
              <span>
                By{" "}
                <Link
                  href="/about"
                  className="font-semibold text-slate-900 hover:text-emerald-600 transition"
                >
                  {AUTHOR.name}
                </Link>
                <span className="hidden sm:inline text-slate-400">
                  {" "}· {AUTHOR.shortRole}
                </span>
              </span>
            </div>
            <span className="text-slate-300">•</span>
            <span>
              Published <time dateTime={publishedDate}>{publishedFmt}</time>
            </span>
            {showUpdated && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">
                  Updated <time dateTime={modifiedDate}>{modifiedFmt}</time>
                </span>
              </>
            )}
          </div>
        )}

        {/* MAIN GRID — article + promo sidebar on all pages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ARTICLE COLUMN */}
          <div className="lg:col-span-10 min-w-0">
          {/* Before */}
{blog.image_url && (
  <div className="mb-8 w-full">
    <img
      src={blog.image_url}
      alt={articleTitle}
      className="w-full h-auto object-contain rounded-xl shadow-sm"
    />
  </div>
)}

            <div className="w-full mx-auto">
              <article
                className={`prose-content ${
                  isCorporateAction ? "corporate-content" : "blog-content"
                }`}
                dangerouslySetInnerHTML={{ __html: blog.content || "" }}
              />
            </div>

            {/* Author bio */}
            {!isCorporateAction && (
              <section
                aria-label="About the author"
                className="mt-12 pt-8 border-t border-slate-200"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                  <Avatar size={56} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold mb-1">
                      Written by
                    </p>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      {AUTHOR.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mb-3">
                      {AUTHOR.role}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {AUTHOR.bio}
                    </p>
                    <Link
                      href="/about"
                      className="inline-block mt-3 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                    >
                      About the author →
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Share + Back */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Share this article
                </span>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white rounded-full border hover:bg-gray-100 transition"
                  aria-label="Share"
                >
                  <Share2 size={16} />
                </button>
              </div>

              <Link
                href={sectionHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] text-white text-sm font-semibold rounded-full hover:bg-[#15803D] transition"
              >
                <ArrowLeft size={16} />
                Back to {sectionLabel}
              </Link>
            </div>
          </div>

          {/* PROMO SIDEBAR — shown for all article types */}
          <PromoSidebar />
        </div>

        {/* EXPLORE MORE — full width */}
        <div className="mt-10 bg-gradient-to-br from-white to-slate-50 border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm">
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
              href="/ipo"
              className="group bg-white border border-emerald-100 rounded-xl px-5 py-4 shadow-sm hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
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
              href="/preipo"
              className="group bg-white border border-emerald-100 rounded-xl px-5 py-4 shadow-sm hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
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
              className="group bg-white border border-emerald-100 rounded-xl px-5 py-4 shadow-sm hover:border-emerald-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
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

      <style jsx global>{`
        /* Base — applies to BOTH blog and corporate */
        .prose-content {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          color: #1f2937;
          font-size: 15px;
          line-height: 1.75;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        .prose-content img,
        .prose-content video,
        .prose-content iframe {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
        }
        .prose-content ul {
          list-style: disc;
          padding-left: 1.25rem;
        }
        .prose-content li {
          margin-bottom: 0.5rem;
        }
        .prose-content strong {
          color: #111827;
          font-weight: 700;
        }

        /* =========================================================
           CORPORATE ACTIONS — unchanged
        ========================================================= */
        .prose-content.corporate-content table {
          width: 100%;
          border-collapse: collapse;
          display: block;
          overflow-x: auto;
        }
        .prose-content.corporate-content th,
        .prose-content.corporate-content td {
          padding: 0.5rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
          color: #374151;
        }
        .prose-content.corporate-content th {
          color: #6b7280;
          font-weight: 600;
        }
        .prose-content.corporate-content .bg-emerald-600,
        .prose-content.corporate-content [class*="bg-emerald"] {
          background-color: #059669 !important;
          padding: 0.5rem 1.25rem !important;
        }
        .prose-content.corporate-content .bg-emerald-600 h2,
        .prose-content.corporate-content [class*="bg-emerald"] h2 {
          color: #ffffff !important;
          font-size: 1rem !important;
          font-weight: 700 !important;
          margin: 0 !important;
        }
        .prose-content.corporate-content .bg-slate-50,
        .prose-content.corporate-content .bg-gray-50 {
          background-color: #f8fafc !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0.75rem !important;
        }
        .prose-content.corporate-content details {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          margin-bottom: 0.75rem;
          overflow: hidden;
        }
        .prose-content.corporate-content details summary {
          cursor: pointer;
          padding: 1rem 1.25rem;
          font-weight: 600;
          color: #1f2937;
          list-style: none;
        }
        .prose-content.corporate-content details summary::-webkit-details-marker {
          display: none;
        }
        .prose-content.corporate-content details[open] summary {
          border-bottom: 1px solid #f3f4f6;
        }
        .prose-content.corporate-content details > div {
          padding: 0 1.25rem 1.25rem;
          color: #4b5563;
        }

        /* =========================================================
           BLOGS — plain standard blog format
        ========================================================= */
        .prose-content.blog-content [class*="bg-emerald"],
        .prose-content.blog-content .bg-gray-700,
        .prose-content.blog-content .bg-slate-50,
        .prose-content.blog-content .bg-gray-50,
        .prose-content.blog-content .bg-slate-100 {
          background: none !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .prose-content.blog-content > section,
        .prose-content.blog-content > div:not([class]) {
          background: none !important;
          border: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
        }

        .prose-content.blog-content h2 {
          color: #111827 !important;
          font-size: 1.35rem !important;
          font-weight: 700 !important;
          margin: 1.75rem 0 0.5rem !important;
          padding: 0 !important;
          background: none !important;
          border: none !important;
          line-height: 1.35 !important;
        }
        .prose-content.blog-content h3 {
          color: #111827 !important;
          font-size: 1.15rem !important;
          font-weight: 700 !important;
          margin: 1.5rem 0 0.5rem !important;
          padding: 0 !important;
          background: none !important;
          border: none !important;
          line-height: 1.4 !important;
        }
        .prose-content.blog-content h4 {
          color: #1f2937 !important;
          font-size: 1rem !important;
          font-weight: 700 !important;
          margin: 1.25rem 0 0.5rem !important;
          padding: 0 !important;
          background: none !important;
          border: none !important;
        }

        .prose-content.blog-content p {
          color: #374151 !important;
          margin: 0 0 1rem !important;
          padding: 0 !important;
          line-height: 1.75 !important;
        }

        .prose-content.blog-content ul,
        .prose-content.blog-content ol {
          margin: 0 0 1rem !important;
          padding-left: 1.25rem !important;
        }
        .prose-content.blog-content li {
          color: #374151 !important;
          line-height: 1.7 !important;
          margin-bottom: 0.4rem !important;
        }

        .prose-content.blog-content a {
          color: #059669 !important;
          text-decoration: underline !important;
          text-underline-offset: 2px !important;
        }
        .prose-content.blog-content a:hover {
          color: #047857 !important;
        }

        .prose-content.blog-content table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 1rem 0 !important;
          font-size: 0.9rem !important;
        }
        .prose-content.blog-content th,
        .prose-content.blog-content td {
          padding: 0.5rem 0.75rem !important;
          border: 1px solid #e5e7eb !important;
          text-align: left !important;
          color: #374151 !important;
        }
        .prose-content.blog-content th {
          background: #f8fafc !important;
          font-weight: 600 !important;
          color: #111827 !important;
        }

        .prose-content.blog-content blockquote {
          border-left: 3px solid #d1d5db !important;
          padding: 0.25rem 0 0.25rem 1rem !important;
          margin: 1rem 0 !important;
          color: #4b5563 !important;
          font-style: italic !important;
          background: none !important;
        }
        .prose-content.blog-content blockquote p {
          margin: 0 !important;
        }

        @media (min-width: 1024px) {
          .prose-content [class*="lg:grid-cols-2"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InsightHubDetail;