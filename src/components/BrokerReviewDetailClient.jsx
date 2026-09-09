// src/components/BrokerReviewDetailClient.jsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, StarHalf, Award, ChevronRight, CheckCircle2, 
  Monitor, BarChart3, Package, UserPlus, Scale, 
  Repeat, ListChecks, DollarSign, Home
} from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = "https://sharebazaaronline.com";

// ==========================================
// 1. GLOBAL HELPER COMPONENTS & RENDERERS
// ==========================================
const RenderStars = ({ ratingScore, size = 15 }) => {
  const score = parseFloat(ratingScore) || 4.3;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (score >= i) {
      stars.push(<Star key={i} size={size} className="fill-amber-400 text-amber-400 flex-shrink-0" />);
    } else if (score > i - 1 && score < i) {
      stars.push(
        <div key={i} className="relative inline-block flex-shrink-0" style={{ width: size, height: size }}>
          <Star size={size} className="text-slate-600 absolute top-0 left-0" />
          <StarHalf size={size} className="fill-amber-400 text-amber-400 absolute top-0 left-0 z-10" />
        </div>
      );
    } else {
      stars.push(<Star key={i} size={size} className="text-slate-600 flex-shrink-0" />);
    }
  }
  return <div className="flex gap-0.5 justify-center">{stars}</div>;
};

// High-density key-value layout
const RenderDetailsValue = ({ val }) => {
  if (val === null || val === undefined || val === "N/A" || val === "") {
    return <span className="text-slate-400 italic text-xs">Not Available</span>;
  }
  
  if (Array.isArray(val)) {
    return (
      <ul className="space-y-1 text-slate-600 list-none pl-0 m-0 text-xs sm:text-sm">
        {val.map((item, idx) => (
          <li key={idx} className="flex items-start gap-1.5 leading-tight text-left">
            <span className="text-emerald-500 font-bold select-none">•</span>
            <div className="flex-1 text-slate-700"><RenderDetailsValue val={item} /></div>
          </li>
        ))}
      </ul>
    );
  }
  
  if (typeof val === "object") {
    return (
      <div className="w-full rounded-lg border border-slate-100 bg-slate-50/40 divide-y divide-slate-100 overflow-hidden text-xs">
        {Object.entries(val).map(([subKey, subVal]) => (
          <div 
            key={subKey} 
            className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 p-2 items-start text-left hover:bg-slate-50/80 transition-colors"
          >
            <div className="sm:col-span-4 text-slate-500 font-semibold capitalize tracking-tight break-words leading-tight">
              {subKey.replace(/_/g, " ")}
            </div>
            <div className="sm:col-span-8 text-slate-700 font-normal break-words leading-tight">
              {typeof subVal === "object" ? <RenderDetailsValue val={subVal} /> : String(subVal)}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return <span className="text-slate-700 font-normal leading-normal text-xs break-words block text-left">{String(val)}</span>;
};

// Card shell built specifically to work flawlessly inside CSS Columns
const DetailCard = ({ title, icon, children }) => (
  <div className="break-inside-avoid mb-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow transition-all flex flex-col">
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
      <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <h3 className="font-bold text-sm text-slate-900 tracking-tight">{title}</h3>
    </div>
    <div className="w-full space-y-1.5">
      {children}
    </div>
  </div>
);

// ==========================================
// 2. MAIN BROKER REVIEW DETAIL COMPONENT
// ==========================================
const BrokerReviewDetailClient = ({ initialData, slug }) => {
  const router = useRouter();
  
  const { review, broker, competitors } = initialData;

  if (!review) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Broker Review Not Found</h2>
          <Link href="/comparebrokers" className="inline-block mt-4 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition">
            Return to Comparison Hub
          </Link>
        </div>
      </div>
    );
  }

  const currentRating = broker?.rating || review?.rating || 4.3;
  const targetActionUrl = broker?.account_opening_url || broker?.website || "#";
  const brokerName = broker?.name || "Broker";

  // Breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Brokers", url: "/comparebrokers" },
    { name: `${brokerName} Reviews`, url: `/brokerdetails/${slug}` },
  ];

  // Generate Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: review.title || `${brokerName} Review`,
    description: review.content?.slice(0, 200) || `Complete review of ${brokerName} including brokerage charges, platform features, and ratings.`,
    image: broker?.logo ? `${SITE_URL}${broker.logo}` : `${SITE_URL}/og-image.jpg`,
    datePublished: review.created_at || new Date().toISOString(),
    dateModified: review.updated_at || new Date().toISOString(),
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
      "@id": `${SITE_URL}/brokerdetails/${slug}`,
    },
  };

  // Generate Review Schema (Product Review)
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: review.title || `${brokerName} Review`,
    reviewBody: review.content?.slice(0, 500) || `Complete review of ${brokerName}.`,
    reviewRating: {
      "@type": "Rating",
      ratingValue: parseFloat(currentRating).toFixed(1),
      bestRating: "5",
    },
    author: {
      "@type": "Organization",
      name: "ShareBazaarOnline",
    },
    itemReviewed: {
      "@type": "Product",
      name: `${brokerName} Brokerage Services`,
      brand: {
        "@type": "Brand",
        name: brokerName,
      },
    },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="min-h-screen bg-white text-slate-900 antialiased w-full overflow-x-hidden">
        
        {/* Visual Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <nav aria-label="Breadcrumb" className="text-sm font-medium text-slate-500">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-emerald-600 flex items-center gap-1 transition-colors">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <li>
                <Link href="/comparebrokers" className="hover:text-emerald-600 transition-colors">
                  Brokers
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <li className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
                {brokerName} Reviews
              </li>
            </ol>
          </nav>
        </div>

        {/* SECTION 1: HERO PANEL */}
        <div className="bg-gradient-to-b from-[#060a22] to-[#0c133a] text-white border-b border-slate-800/60 w-full">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-5 pb-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3 text-left">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  <Award size={12} /> Official Analyst Scorecard
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  {review.title}
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl opacity-80 font-normal">
                  {broker?.tagline || `In-depth structural inspection parameters, system configurations, compliance checks, and pricing models.`}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a 
                    href={targetActionUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs tracking-wide transition-all shadow-md"
                  >
                    Open Demat Account
                  </a>
                  <button 
                    onClick={() => router.push("/comparebrokers")}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-4 py-2.5 rounded-lg text-xs transition"
                  >
                    Compare Terminal Matrix
                  </button>
                </div>
              </div>

              {broker?.logo && (
                <div className="lg:col-span-4 flex justify-start lg:justify-end w-full">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 backdrop-blur-md w-full max-w-xs">
                    <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center shadow-md">
                      <img src={broker.logo} alt={broker.name} className="max-w-full max-h-full object-contain" />
                    </div>

                    <div className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full uppercase">
                      {broker.broker_type || "Discount Broker"}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xl font-black text-white tracking-tight">{parseFloat(currentRating).toFixed(1)}</span>
                        <span className="text-xs text-slate-400">/ 5.0</span>
                      </div>
                      <RenderStars ratingScore={currentRating} size={12} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-3 mt-5 border-t border-slate-800/60 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-normal"><CheckCircle2 size={12} className="text-emerald-400" /> SEBI Registered Broker Portfolio</span>
              <span className="flex items-center gap-1.5 font-normal"><CheckCircle2 size={12} className="text-emerald-400" /> Exchange Core Member (NSE, BSE, MCX)</span>
            </div>

          </div>
        </div>

        {/* SECTION 2: MASONRY SYSTEM SPECIFICATION METRIC ENGINE */}
        {broker && broker.details && (
          <div className="w-full bg-slate-50/60 py-8 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="mb-6 text-left">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                  Complete Broker Specifications
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  Granular structural mapping data for {broker.name}.
                </p>
              </div>

              {/* CSS Masonry Columns Layout */}
              <div className="columns-1 md:columns-2 lg:columns-3 gap-4 w-full [column-fill:balance]">
                
                <DetailCard title="Platform" icon={<Monitor className="w-3.5 h-3.5" />}>
                  <RenderDetailsValue val={broker.details.platform} />
                </DetailCard>

                <DetailCard title="Basic Details" icon={<BarChart3 className="w-3.5 h-3.5" />}>
                  <RenderDetailsValue val={broker.details.basic_details} />
                </DetailCard>

                <DetailCard title="Services Offered" icon={<Package className="w-3.5 h-3.5" />}>
                  <RenderDetailsValue val={broker.details.services_offered} />
                </DetailCard>

                <DetailCard title="Brokerage Charges" icon={<DollarSign className="w-3.5 h-3.5" />}>
                  <RenderDetailsValue val={broker.details.brokerage_charges} />
                </DetailCard>

                <DetailCard title="Account Opening" icon={<UserPlus className="w-3.5 h-3.5" />}>
                  <RenderDetailsValue val={broker.details.account_opening_charges} />
                </DetailCard>

                <DetailCard title="Government & Transaction Charges" icon={<Scale className="w-3.5 h-3.5" />}>
                  <RenderDetailsValue val={broker.details.government_charges} />
                </DetailCard>

                <DetailCard title="DP & Transaction Charges" icon={<Repeat className="w-3.5 h-3.5" />}>
                  <RenderDetailsValue val={broker.details.dp_and_transaction_charges} />
                </DetailCard>

                <DetailCard title="Order Types Supported" icon={<ListChecks className="w-3.5 h-3.5" />}>
                  <RenderDetailsValue val={broker.details.order_types_supported} />
                </DetailCard>

              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: EDITORIAL CONTENT VIEWPORT */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
          <article
            className="prose max-w-none text-left prose-slate prose-sm"
            dangerouslySetInnerHTML={{
              __html: review.content || "<p class='text-slate-400 text-sm'>No editorial content has been populated yet for this entry.</p>",
            }}
          />

          {/* SECTION 4: ECOSYSTEM MATRIX FOOTER */}
          {competitors && competitors.length > 0 && (
            <div className="pt-8 mt-10 border-t border-slate-200 w-full text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-slate-950">Compare Equivalent Ecosystems</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Evaluate structural variance directly with alternative brokerage operations.</p>
                </div>
                <Link href="/comparebrokers" className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs uppercase tracking-wider flex items-center gap-1 transition">
                  Open Full Matrix Engine <ChevronRight size={14} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {competitors.map((item) => (
                  <div
                    key={item.slug}
                    className="flex flex-col justify-between p-3 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition text-left shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        {item.logo ? (
                          <div className="h-7 max-w-[90px] flex items-center justify-center p-1 border border-slate-100 rounded-lg bg-white">
                            <img src={item.logo} alt={item.name} className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 bg-slate-950 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            {item.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-[10px] text-amber-500 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                          ★ {item.rating ? parseFloat(item.rating).toFixed(1) : "4.2"}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-slate-900 text-xs mb-0.5">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{item.active_users?.trim() || "Verified Member"}</p>
                    </div>

                    <button
                      onClick={() => router.push(`/comparebrokers?broker1=${item.slug}`)}
                      className="mt-3 w-full bg-slate-50 hover:bg-slate-950 text-slate-600 hover:text-white border border-slate-200 hover:border-slate-950 py-1 rounded-md text-xs font-medium transition text-center"
                    >
                      Compare Matrix
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default BrokerReviewDetailClient;