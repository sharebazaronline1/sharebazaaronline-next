// src/components/CorporateActionDetails.jsx
"use client";

import Link from "next/link";
import { ArrowLeft, Share2, ChevronRight, Home } from "lucide-react";

const CorporateActionDetails = ({
  blog,
  id,
  slug,
  sectionLabel = "Corporate Actions",
  sectionHref = "/corporateactions",
}) => {
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

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.heading || "Corporate Action",
          text: "Check out this corporate action",
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

  const articleTitle = blog.heading || blog.title || "Corporate Action";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8">

        {/* Breadcrumb */}
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

        {/* Category Badge */}
        <div className="text-center mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold">
            {blog.category || "Corporate Action"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-8">
          {articleTitle}
        </h1>

        {/* Featured Image */}
        {blog.image_url && (
          <div className="mb-8 flex justify-center">
            <img
              src={blog.image_url}
              alt={articleTitle}
              className="w-full max-w-3xl h-auto object-contain rounded-xl shadow-sm"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="w-full mx-auto">
          <article
            className="prose-content corporate-content"
            dangerouslySetInnerHTML={{ __html: blog.content || "" }}
          />
        </div>

        {/* Share + Back */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Share this update
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

        {/* EXPLORE MORE */}
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
           CORPORATE ACTIONS — styling for rich text content
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

        /* Restore layout and spacing for Tailwind HTML stored in Supabase */
        .prose-content.corporate-content section.mb-8 {
          margin-bottom: 2rem !important;
          overflow: hidden;
          background-color: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
        }

        .prose-content.corporate-content section.mb-8 > div:first-child {
          padding: 0.5rem 1.5rem;
          background-color: #059669 !important;
        }

        .prose-content.corporate-content section.mb-8 > div:first-child h2 {
          margin: 0 !important;
          color: #fff !important;
          font-size: 1.125rem !important;
          line-height: 1.75rem;
          font-weight: 700 !important;
        }

        .prose-content.corporate-content section.mb-8 > div:nth-child(2) {
          padding: 1.25rem;
        }

        .prose-content.corporate-content .p-5 {
          padding: 1.25rem !important;
        }

        .prose-content.corporate-content .space-y-4 > * + * {
          margin-top: 1rem !important;
        }

        .prose-content.corporate-content .grid {
          display: grid !important;
          gap: 1rem !important;
        }

        .prose-content.corporate-content .bg-slate-50 {
          background-color: #f8fafc !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0.75rem !important;
        }

        .prose-content.corporate-content .rounded-xl {
          border-radius: 0.75rem !important;
        }

        .prose-content.corporate-content .text-gray-600 {
          color: #4b5563 !important;
        }

        .prose-content.corporate-content .text-gray-800 {
          color: #1f2937 !important;
        }

        .prose-content.corporate-content .leading-relaxed {
          line-height: 1.625 !important;
        }

        .prose-content.corporate-content .mb-2 {
          margin-bottom: 0.5rem !important;
        }

        .prose-content.corporate-content .mt-3 {
          margin-top: 0.75rem !important;
        }

        .prose-content.corporate-content .px-5 {
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }

        .prose-content.corporate-content .py-4 {
          padding-top: 1rem;
          padding-bottom: 1rem;
        }

        .prose-content.corporate-content .pb-5 {
          padding-bottom: 1.25rem;
        }

        .prose-content.corporate-content .text-white {
          color: #fff !important;
        }

        .prose-content.corporate-content a.bg-emerald-600 {
          background-color: #059669 !important;
          color: #fff !important;
          text-decoration: none;
        }

        .prose-content.corporate-content a.bg-emerald-600:hover {
          background-color: #047857 !important;
        }

        @media (min-width: 1024px) {
          .prose-content.corporate-content .lg\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CorporateActionDetails;