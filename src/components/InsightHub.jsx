// src/components/InsightHub.jsx
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import slugify from "../utils/slugify";
import { BookOpen, TrendingUp, LineChart, GraduationCap } from "lucide-react";

const CARDS_PER_PAGE = 30;
const EAGER_FIRST_BATCH = 8;
const EAGER_SECOND_BATCH = 30;

const CORPORATE_ACTION_CATEGORIES = [
  "buyback",
  "dividend",
  "bonus",
  "bonus issue",
  "stock split",
  "rights",
  "rights issue",
  "split",
  "merger",
  "demerger",
];

const isCorporateAction = (post) => {
  if (!post) return false;
  const cat = String(post.category || "").toLowerCase().trim();
  if (!cat) return false;
  return CORPORATE_ACTION_CATEGORIES.includes(cat);
};

const InsightHub = ({ initialBlogs = [] }) => {
  const router = useRouter();

  const blogs = useMemo(
    () =>
      Array.isArray(initialBlogs)
        ? initialBlogs.filter((p) => !isCorporateAction(p))
        : [],
    [initialBlogs]
  );

  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
  const [loading] = useState(false);

  useEffect(() => {
    if (!blogs.length) return;

    const immediate = blogs
      .slice(0, EAGER_SECOND_BATCH)
      .filter((p) => p?.image_url);

    immediate.forEach((post) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = post.image_url;
    });

    const idle = blogs
      .slice(EAGER_SECOND_BATCH, EAGER_SECOND_BATCH * 2)
      .filter((p) => p?.image_url);

    if (idle.length && "requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(
        () => {
          idle.forEach((post) => {
            const img = new window.Image();
            img.decoding = "async";
            img.src = post.image_url;
          });
        },
        { timeout: 2000 }
      );
      return () => window.cancelIdleCallback?.(handle);
    } else {
      const t = setTimeout(() => {
        idle.forEach((post) => {
          const img = new window.Image();
          img.decoding = "async";
          img.src = post.image_url;
        });
      }, 800);
      return () => clearTimeout(t);
    }
  }, [blogs]);

  useEffect(() => {
    const nextBatchStart = visibleCount;
    const nextBatchEnd = visibleCount + CARDS_PER_PAGE;

    const upcoming = blogs
      .slice(nextBatchStart, nextBatchEnd)
      .filter((p) => p?.image_url);

    upcoming.forEach((post) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = post.image_url;
    });
  }, [visibleCount, blogs]);

  const handleCardClick = (post) => {
    const title = post.title || post.heading || "insight";
    router.push(`/insight-hub/${post.id}/${slugify(title)}`);
  };

  const visibleBlogs = useMemo(
    () => blogs.slice(0, visibleCount),
    [blogs, visibleCount]
  );

  const remaining = Math.max(blogs.length - visibleCount, 0);
  const hasMore = remaining > 0;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <section className="relative overflow-hidden py-10 lg:py-14">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-green-200">
                <BookOpen size={14} />
                Insight Hub
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900">
                Market Insights
                <span className="text-green-600 block">& Investment Guides</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Stay ahead with expert analysis, IPO updates, investment
                strategies, market trends, and educational guides designed for
                smarter investing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                    <TrendingUp size={18} className="text-green-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      Market Trends
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Latest insights & updates
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <LineChart size={18} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      Expert Analysis
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Data-backed investment views
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                    <GraduationCap size={18} className="text-purple-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      Learning Guides
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Simplified investing education
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative flex justify-center">
                <img
                  src="/images/hero-insight.png"
                  alt="Insight Hub"
                  className="w-full max-w-[560px] object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 pb-14">
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No blogs found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
            {visibleBlogs.map((post, i) => {
              const isLoadingEager = i < EAGER_SECOND_BATCH;
              const isHighPriority = i < EAGER_FIRST_BATCH;
              const title = post.heading || post.title || "Insight";

              const publishedDate = post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : null;

              return (
                <motion.article
                  key={post.id || `card-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i, 12) * 0.04 }}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden border border-gray-100"
                  onClick={() => handleCardClick(post)}
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={post.image_url}
                      alt={title}
                      loading={isLoadingEager ? "eager" : "lazy"}
                      fetchPriority={isHighPriority ? "high" : "auto"}
                      decoding="async"
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3.5 sm:p-4 flex flex-col flex-1">
                    {publishedDate && (
                      <time className="text-[11px] text-gray-500 mb-1.5">
                        {publishedDate}
                      </time>
                    )}

                    <h3 className="text-[13px] sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-3 mb-3">
                      {title}
                    </h3>

                    <div className="mt-auto flex items-center justify-end pt-3 border-t border-gray-100">
                      <span className="text-xs font-semibold text-green-600 group-hover:text-green-700">
                        Read →
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {hasMore && !loading && (
          <div className="text-center mt-12">
            <button
              onClick={() =>
                setVisibleCount((prev) =>
                  Math.min(prev + CARDS_PER_PAGE, blogs.length)
                )
              }
              className="px-8 py-3 bg-[#16A34A] text-white font-semibold rounded-full hover:bg-[#15803D] transition shadow-md"
            >
              Load More Insights ({remaining} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightHub;