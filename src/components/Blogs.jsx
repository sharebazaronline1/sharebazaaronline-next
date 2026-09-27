"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { fetchInsightDetails } from "../api/mockApi";
import slugify from "../utils/slugify";

const MAX_BLOGS = 15;

const CORPORATE_ACTION_TYPES = [
  "buyback",
  "dividend",
  "rights",
  "bonus",
  "split",
  "other",
  "ipo",
];

const isCorporateActionPost = (post) => {
  const type = String(post?.category || "")
    .toLowerCase()
    .trim();

  return CORPORATE_ACTION_TYPES.includes(type);
};

const BlogCard = ({ post, index, onClick }) => {
  const isCorporateAction = isCorporateActionPost(post);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => onClick(post)}
      className="w-full max-w-full sm:flex-shrink-0 sm:w-72 cursor-pointer"
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        <div className="relative overflow-hidden bg-gray-100">
          <img
            src={post.image_url || "/images/placeholder.jpg"}
            alt={post.title || post.heading || "blog"}
            loading="lazy"
            className="w-full h-auto sm:h-44 object-contain sm:object-cover sm:object-top transition-transform duration-500 group-hover:scale-105 bg-white"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        <div className="p-4 flex flex-col flex-1">
          <p className="text-[13px] sm:text-sm text-green-600 font-medium mb-2 leading-normal">
            {post.category || "Insights"}
          </p>

          <h3 className="font-semibold text-gray-900 text-[10px] sm:text-sm leading-[1.45] break-words line-clamp-3">
            {post.heading || post.title}
          </h3>

          {!isCorporateAction && (
            <p className="text-sm text-gray-500 mt-3">
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-IN")
                : "—"}
            </p>
          )}

          <div className="mt-auto pt-4">
            <button className="text-green-600 font-medium text-sm hover:text-green-700 transition">
              Read More →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BlogCardSkeleton = () => (
  <div className="w-full max-w-full sm:flex-shrink-0 sm:w-72 animate-pulse">
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="w-full sm:h-44 bg-gray-200" />

      <div className="p-4 flex flex-col flex-1">
        <div className="h-3 w-20 bg-gray-200 rounded mb-3" />

        <div className="space-y-2">
          <div className="h-3.5 bg-gray-200 rounded w-full" />
          <div className="h-3.5 bg-gray-200 rounded w-5/6" />
          <div className="h-3.5 bg-gray-200 rounded w-2/3" />
        </div>

        <div className="h-3 w-24 bg-gray-200 rounded mt-4" />

        <div className="mt-auto pt-4">
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

const getNewestBlogs = (posts = []) => {
  const seen = new Set();

  const unique = posts.filter((post) => {
    const key = post.id
      ? `id-${post.id}`
      : `title-${String(post.title || post.heading || "")
          .toLowerCase()
          .trim()}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });

  return unique
    .sort((a, b) => {
      const dateA = a.published_at
        ? new Date(a.published_at).getTime()
        : 0;

      const dateB = b.published_at
        ? new Date(b.published_at).getTime()
        : 0;

      return dateB - dateA;
    })
    .slice(0, MAX_BLOGS);
};

async function fetchDBBlogs() {
  let { data, error } = await supabase
    .from("blogs")
    .select(
      "id, title, heading, image_url, published_at, category, status"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(MAX_BLOGS);

  if (error) {
    console.error(
      "[Blogs] Fetch #1 failed:",
      error.message,
      "| code:",
      error.code
    );
  }

  if (!data || data.length === 0) {
    console.warn("[Blogs] Empty result — retrying without status filter");

    const retry = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(MAX_BLOGS);

    if (retry.error) {
      console.error(
        "[Blogs] Fetch #2 failed:",
        retry.error.message,
        "| code:",
        retry.error.code
      );
    } else if (retry.data && retry.data.length > 0) {
      console.log("[Blogs] Fetch #2 succeeded with", retry.data.length, "rows");
      data = retry.data;
      error = null;
    }
  }

  if (!data || data.length === 0) {
    const probe = await supabase.from("blogs").select("id").limit(1);
    if (probe.error) {
      console.error(
        "[Blogs] Table probe failed:",
        probe.error.message,
        "| code:",
        probe.error.code
      );
    } else {
      console.warn(
        "[Blogs] Table reachable but 0 rows matched. Check RLS policies or data."
      );
    }
  }

  return Array.isArray(data) ? data : [];
}

export default function Blogs({ initialBlogs = [] }) {
  const router = useRouter();
  const scrollRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);

  const [blogs, setBlogs] = useState(
    getNewestBlogs(Array.isArray(initialBlogs) ? initialBlogs : [])
  );
  const [loading, setLoading] = useState(
    !initialBlogs || initialBlogs.length === 0
  );

  useEffect(() => {
    if (initialBlogs && initialBlogs.length > 0) {
      setBlogs(getNewestBlogs(initialBlogs));
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadBlogs = async () => {
      setLoading(true);

      try {
        const [dbData, mockResult] = await Promise.all([
          fetchDBBlogs(),
          fetchInsightDetails().catch((e) => {
            console.error("[Blogs] Mock fetch failed:", e);
            return [];
          }),
        ]);

        if (cancelled) return;

        const formattedDB = (dbData || []).map((item) => ({
          id: item.id,
          title: item.title || item.heading || "Untitled",
          heading: item.heading || item.title || "Untitled",
          image_url: item.image_url,
          published_at: item.published_at,
          category: item.category,
          source: "db",
        }));

        const formattedMock = (Array.isArray(mockResult) ? mockResult : []).map(
          (item) => ({
            id: `mock-${item.id}`,
            title: item.title,
            heading: item.heading || item.title,
            image_url: item.image,
            published_at: item.date,
            reading_time: item.readTime,
            category: item.category,
            content: item.content,
            source: "mock",
          })
        );

        const merged = [...formattedDB, ...formattedMock];

        setBlogs(getNewestBlogs(merged));
      } catch (err) {
        console.error("[Blogs] Unexpected error:", err?.message || err);
        if (!cancelled) setBlogs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBlogs();

    return () => {
      cancelled = true;
    };
  }, [initialBlogs]);

  useEffect(() => {
    if (isHovered || !scrollRef.current || blogs.length === 0) return;

    const container = scrollRef.current;

    let animationFrame;
    let position = container.scrollLeft;

    const scroll = () => {
      if (!isHovered) {
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (position < maxScroll) {
          position += 0.5;

          if (position >= maxScroll) {
            position = maxScroll;
          }

          container.scrollLeft = position;
        }
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isHovered, blogs]);

  const handleCardClick = (post) => {
    const idForUrl = String(post.id || "").replace(/^mock-/, "");
    router.push(
      `/insight-hub/${idForUrl}/${slugify(post.title || post.heading || "")}`
    );
  };

  if (loading && blogs.length === 0) {
    return (
      <section className="pt-4 pb-4 lg:pt-4 lg:pb-4">
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="sm:hidden space-y-4 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>

          <div className="hidden sm:flex gap-5 py-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="pt-4 pb-4 lg:pt-4 lg:pb-4">
        <div className="text-center text-gray-500">No blogs found</div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-4 lg:pt-4 lg:pb-4">
      <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="sm:hidden space-y-4 py-2">
            {blogs.slice(0, 3).map((post, index) => (
              <BlogCard
                key={post.id || index}
                post={post}
                index={index}
                onClick={handleCardClick}
              />
            ))}
          </div>

          <div
            ref={scrollRef}
            className="hidden sm:flex gap-5 py-4 overflow-x-auto scrollbar-hide"
          >
            {blogs.map((post, index) => (
              <BlogCard
                key={`${post.id || post.title}-${index}`}
                post={post}
                index={index}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}