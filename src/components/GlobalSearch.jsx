// src/components/GlobalSearch.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";

import {
  fetchIPOs,
  fetchPreIPODetails,
  fetchBrokers,
  fetchBlogs,
  fetchUnlistedShares,
} from "@/api/mockApi";

import { buildSearchIndex } from "@/utils/buildSearchIndex";

const GlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchAllData = async () => {
      const [ipos, preIpos, brokers, blogs, unlistedShares] = await Promise.all([
        fetchIPOs(),
        fetchPreIPODetails(),
        fetchBrokers(),
        fetchBlogs(),
        fetchUnlistedShares(),
      ]);

      setSearchIndex(
        buildSearchIndex(ipos, preIpos, brokers, blogs, unlistedShares)
      );
    };

    fetchAllData();
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results =
    query.trim() === ""
      ? []
      : searchIndex.filter((item) =>
          `${item.title} ${item.content}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  const handleResultClick = (result) => {
    // Navigate to the result URL
    if (result.anchor) {
      // For same-page anchors (like Pre-IPO or Unlisted Shares)
      router.push(result.url);
      // We can't scroll to anchor immediately because the page might not be loaded
      // We could store the anchor in sessionStorage and handle it on the target page
      // Alternatively, we could navigate and then scroll after page load.
      // For simplicity, we'll just navigate and rely on the target page to handle anchor.
      // To improve UX, we could use a state management or route change listener.
      // But for now, we'll just navigate.
      // If we need exact anchor scrolling, we can implement a custom solution.
    } else {
      router.push(result.url);
    }

    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-slate-100 transition"
      >
        <FiSearch className="w-5 h-5 text-slate-600" />
      </button>

      {/* Search Popup */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-[380px] max-w-[90vw] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-[999]">
          {/* Header */}
          <div className="flex items-center border-b border-slate-100 px-4">
            <FiSearch className="text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search IPOs, Brokers, Blogs..."
              className="flex-1 px-3 py-4 outline-none text-sm"
            />
            <button
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
            >
              <FiX className="text-slate-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[450px] overflow-y-auto">
            {query.trim() !== "" &&
              results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => handleResultClick(r)}
                  className="w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-blue-50 transition"
                >
                  <p className="font-semibold text-slate-900 text-sm">{r.title}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {r.preview || r.content}
                  </p>
                </button>
              ))}

            {query.trim() !== "" && results.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No results found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;