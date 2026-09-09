// src/components/Blogs.jsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { fetchInsightDetails } from "../api/mockApi";
import slugify from "../utils/slugify";

const BlogCard = ({ post, index, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => onClick(post)}
      className="
        w-full
        max-w-full
        sm:flex-shrink-0
        sm:w-72
        cursor-pointer
      "
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">

        {/* IMAGE */}
     {/* IMAGE */}
<div className="relative overflow-hidden bg-gray-100">

  <img
    src={post.image_url || "/images/placeholder.jpg"}
    alt={post.title}
    loading="lazy"
    className="
      w-full
      h-auto
      sm:h-44
      object-contain
      sm:object-cover
      sm:object-top
      transition-transform
      duration-500
      group-hover:scale-105
      bg-white
    "
  />

  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
</div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col flex-1">

          <p className="text-[13px] sm:text-sm text-green-600 font-medium mb-2 leading-normal">
            {post.category || "Insights"}
          </p>

          <h3
            className="
              font-semibold
              text-gray-900
              text-[10px]
              sm:text-sm
              leading-[1.45]
              break-words
              line-clamp-3
            "
          >
            {post.heading}
          </h3>

          <p className="text-sm text-gray-500 mt-3">
            {post.published_at
              ? new Date(post.published_at).toLocaleDateString("en-IN")
              : "—"}
          </p>

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

export default function Blogs() {
  const router = useRouter();

  const scrollRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH BLOGS
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);

      try {
        // SUPABASE BLOGS
        const { data: dbData, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("status", "published");

        if (error) {
          console.error("Supabase error:", error);
        }

        // MOCK BLOGS
        const mockData = await fetchInsightDetails();

        const formattedMock = mockData.map((item) => ({
          id: `mock-${item.id}`,
          title: item.title,
          image_url: item.image,
          published_at: item.date,
          reading_time: item.readTime,
          category: item.category,
          content: item.content,
          source: "mock",
        }));

        const formattedDB = (dbData || []).map((item) => ({
          ...item,
          source: "db",
        }));

        // MERGE BOTH
        let merged = [...formattedDB, ...formattedMock];

        // REMOVE DUPLICATES
        const uniqueMap = new Map();

        merged.forEach((item) => {
          if (!uniqueMap.has(item.title)) {
            uniqueMap.set(item.title, item);
          }
        });

        merged = Array.from(uniqueMap.values());

        // SORT LATEST FIRST
        merged.sort((a, b) => {
          return new Date(b.published_at || 0) - new Date(a.published_at || 0);
        });

        setBlogs(merged);

      } catch (err) {
        console.error("Error fetching blogs:", err);
      }

      setLoading(false);
    };

    fetchBlogs();
  }, []);

  // AUTO SCROLL
  useEffect(() => {
    if (!isHovered && scrollRef.current && blogs.length > 0) {
      const container = scrollRef.current;

      let position = 0;
      const speed = 0.5;

      let animationFrame;

      const scroll = () => {
        if (!isHovered) {
          position += speed;

          if (position >= container.scrollWidth / 2) {
            position = 0;
          }

          container.scrollLeft = position;
        }

        animationFrame = requestAnimationFrame(scroll);
      };

      scroll();

      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isHovered, blogs]);

  const handleCardClick = (post) => {
    router.push(`/insight-hub/${post.id}/${slugify(post.title)}`);
  };

  if (loading) {
    return (
      <section className="pt-4 pb-4 lg:pt-4 lg:pb-4">
        <div className="text-center text-gray-500">
          Loading blogs...
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="pt-4 pb-4 lg:pt-4 lg:pb-4">
        <div className="text-center text-gray-500">
          No blogs found
        </div>
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

          {/* MOBILE */}
          <div className="sm:hidden space-y-4 py-2">
            {blogs.slice(0, 3).map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
                onClick={handleCardClick}
              />
            ))}
          </div>

          {/* DESKTOP / TABLET */}
          <div
            ref={scrollRef}
            className="
              hidden
              sm:flex
              gap-5
              py-4
              overflow-x-auto
              scrollbar-hide
              scroll-smooth
            "
          >
            {[...blogs, ...blogs].map((post, index) => (
              <BlogCard
                key={`${post.id}-${index}`}
                post={post}
                index={index % blogs.length}
                onClick={handleCardClick}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}