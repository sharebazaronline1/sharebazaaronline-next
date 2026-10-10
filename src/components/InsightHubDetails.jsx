// src/components/InsightHubDetails.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Share2, ChevronRight, Home } from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = "https://www.sharebazaaronline.com";

const AUTHOR = {
  name: "Kavya Talanki",
  role: "Head of Research",
  initials: "KT",
};

const InsightHubDetail = ({ blog, id, slug }) => {
  const [openFaqs, setOpenFaqs] = useState({});

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
          <Link href="/insight-hub" className="block mt-6 text-green-600 hover:underline">
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
      }
    }
  };

  const articleTitle = blog.heading || blog.title || "Article";
  const articleDescription =
    blog.meta_description ||
    blog.excerpt ||
    "Read this insightful article on ShareBazaarOnline";
  const articleImage =
    blog.image_url || blog.image || `${SITE_URL}/og-image.jpg`;

  const canonicalPath = `/insight-hub/${id}${slug ? `/${slug}` : ""}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

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

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Insight Hub", url: "/insight-hub" },
    { name: articleTitle, url: canonicalPath },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonicalUrl}#article`,
    headline: articleTitle,
    description: articleDescription,
    url: canonicalUrl,
    image: [articleImage],
    datePublished: publishedDate,
    dateModified: modifiedDate,
    articleSection: blog.category || "Market Insight",
    inLanguage: "en-IN",
    author: {
      "@type": "Person",
      name: "Kavya Talanki",
      jobTitle: "Head of Research & Content",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "ShareBazaarOnline",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/sharebazaar.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
      url: canonicalUrl,
    },
  };

  const articleSchemaJson = JSON.stringify(articleSchema).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleSchemaJson }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="bg-gray-50 min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8">

          <nav aria-label="Breadcrumb" className="mb-5 text-xs sm:text-sm font-medium text-slate-500">
            <ol className="flex items-center space-x-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-green-600 flex items-center gap-1 transition-colors">
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <li>
                <Link href="/insight-hub" className="hover:text-green-600 transition-colors">
                  Insight Hub
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

          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-slate-500 border-b border-slate-200 pb-5 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                {AUTHOR.initials}
              </div>
              <span>
                By{" "}
                <Link
                  href="/about"
                  className="font-semibold text-slate-900 hover:text-emerald-600 transition"
                >
                  {AUTHOR.name}
                </Link>
                <span className="hidden sm:inline text-slate-400"> · {AUTHOR.role}</span>
              </span>
            </div>
            <span className="text-slate-300">•</span>
            <span>{publishedFmt}</span>
            {modifiedFmt !== publishedFmt && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">Updated {modifiedFmt}</span>
              </>
            )}
          </div>

          {blog.image_url && (
            <div className="mb-8">
              <img
                src={blog.image_url}
                alt={articleTitle}
                className="w-full h-auto object-contain rounded-xl shadow-sm"
              />
            </div>
          )}

          <div className="w-full mx-auto">
            <article
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: blog.content || "" }}
            />
          </div>

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
              href="/insight-hub"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] text-white text-sm font-semibold rounded-full hover:bg-[#15803D] transition"
            >
              <ArrowLeft size={16} />
              Back to Insights
            </Link>
          </div>
        </div>

        <style jsx global>{`
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
          .prose-content table {
            width: 100%;
            border-collapse: collapse;
            display: block;
            overflow-x: auto;
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
          .prose-content strong {
            color: #111827;
            font-weight: 700;
          }
          .prose-content .bg-emerald-600,
          .prose-content [class*="bg-emerald"] {
            background-color: #059669 !important;
            padding: 0.5rem 1.25rem !important;
          }
          .prose-content .bg-emerald-600 h2,
          .prose-content [class*="bg-emerald"] h2 {
            color: #ffffff !important;
            font-size: 1rem !important;
            font-weight: 700 !important;
            margin: 0 !important;
          }
          .prose-content .bg-slate-50,
          .prose-content .bg-gray-50 {
            background-color: #f8fafc !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 0.75rem !important;
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
          @media (min-width: 1024px) {
            .prose-content [class*="lg:grid-cols-2"] {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default InsightHubDetail;