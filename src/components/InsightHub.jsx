// src/components/InsightHub.jsx
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import slugify from "../utils/slugify";
import {
  BookOpen,
  TrendingUp,
  LineChart,
  GraduationCap,
} from "lucide-react";

const CARDS_PER_PAGE = 24;

const InsightHub = ({ initialBlogs = [] }) => {
  const router = useRouter();
 const [blogs, setBlogs] = useState(initialBlogs);
const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);
const [loading, setLoading] = useState(false);

  const corporateActionTypes = [
    "buyback",
    "dividend",
    "rights",
    "bonus",
    "split",
    "other",
  ];

 

  // Preload the first few images before user scrolls
  useEffect(() => {
    blogs.slice(0, 12).forEach((post) => {
      if (post.image_url) {
        const img = new window.Image();
        img.src = post.image_url;
      }
    });
  }, [blogs]);

  const handleCardClick = (post) => {
    router.push(`/insight-hub/${post.id}/${slugify(post.title)}`);
  };

  const isCorporateAction = (post) => {
    if (!post.action_type && !post.category) return false;
    const type = (post.action_type || post.category || "").toLowerCase();
    return corporateActionTypes.includes(type);
  };

  const visibleBlogs = blogs.slice(0, visibleCount);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <section className="relative overflow-hidden py-16 lg:py-8">
        <div className="relative max-w-[1800px] mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-14 items-center">
            <div className="xl:col-span-6">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold border border-green-200 shadow-sm">
                <BookOpen size={16} />
                Insight Hub
              </div>

              <h1 className="mt-7 text-5xl md:text-6xl lg:text-7xl font-black tracking-[-3px] leading-[0.95] text-[#0f172a]">
                Market Insights
                <span className="text-green-600 block">
                  & Investment Guides
                </span>
              </h1>

              <p className="mt-6 text-lg lg:text-[22px] leading-9 text-slate-600 max-w-2xl">
                Stay ahead with expert analysis, IPO updates,
                investment strategies, market trends, and
                educational guides designed for smarter investing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    <TrendingUp size={22} className="text-green-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Market Trends</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Latest insights & updates
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <LineChart size={22} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Expert Analysis</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Data-backed investment views
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <GraduationCap size={22} className="text-purple-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Learning Guides</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Simplified investing education
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-6">
              <div className="relative flex justify-center">
                <img
                  src="/images/hero-insight.png"
                  alt="Insight Hub"
                  className="w-full max-w-[780px] object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-gray-500">Loading blogs...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500">No blogs found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {visibleBlogs.map((post, i) => {
              const isCorp = isCorporateAction(post);
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
                  onClick={() => handleCardClick(post)}
                  style={{
                    contentVisibility: "auto",
                    containIntrinsicSize: "320px",
                  }}
                >
                  <div className="relative w-full h-[160px] sm:h-[175px] lg:h-[190px] overflow-hidden bg-gray-100">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      loading={i < 4 ? "eager" : "lazy"}
                      fetchPriority={i < 2 ? "high" : "auto"}
                      decoding="async"
                      className="w-full h-full object-cover object-center transition-all duration-300"
                    />
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    {!isCorp && (
                      <time className="text-[11px] text-gray-500 mb-1">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}
                      </time>
                    )}

                    <h3 className="text-[13px] sm:text-sm font-semibold text-gray-900 leading-snug line-clamp-3 mb-2">
                      {post.heading || post.title}
                    </h3>

                    <span className="mt-auto text-xs font-semibold text-green-600 hover:text-green-700">
                      Read More →
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {visibleCount < blogs.length && (
          <div className="text-center mt-14">
            <button
              onClick={() =>
                setVisibleCount((prev) => prev + CARDS_PER_PAGE)
              }
              className="px-8 py-3 bg-[#16A34A] text-white font-semibold rounded-full hover:bg-[#15803D] transition shadow-md"
            >
              Load More Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightHub;