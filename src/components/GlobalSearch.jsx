"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const EMPTY_DATA = {
  ipos: [],
  preIpos: [],
  brokers: [],
  blogs: [],
  unlistedShares: [],
};

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreResult(item, query) {
  const q = normalizeText(query);
  const title = normalizeText(item.title);
  const words = q.split(" ").filter(Boolean);

  if (!q || !title) return 0;

  // Strongly prefer exact and title matches.
  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 65;

  const titleWords = title.split(" ");
  const matchedTitleWords = words.filter((word) =>
    titleWords.some((titleWord) => titleWord.startsWith(word))
  ).length;

  if (matchedTitleWords === words.length) return 55;
  if (matchedTitleWords > 0) {
    return 35 * (matchedTitleWords / words.length);
  }

  const content = normalizeText(item.content);
  if (content.includes(q)) return 15;

  const matchedContentWords = words.filter((word) =>
    content.includes(word)
  ).length;

  if (matchedContentWords === words.length) return 10;
  if (matchedContentWords > 0) {
    return 5 * (matchedContentWords / words.length);
  }

  return 0;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(EMPTY_DATA);
  const [loaded, setLoaded] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Build the index whenever one dataset arrives, not after all requests finish.
  const searchIndex = useMemo(
    () =>
      buildSearchIndex(
        data.ipos,
        data.preIpos,
        data.brokers,
        data.blogs,
        data.unlistedShares
      ),
    [data]
  );

  useEffect(() => {
    let cancelled = false;

    const sources = [
      ["ipos", fetchIPOs],
      ["preIpos", fetchPreIPODetails],
      ["brokers", fetchBrokers],
      ["blogs", fetchBlogs],
      ["unlistedShares", fetchUnlistedShares],
    ];

    sources.forEach(([key, fetcher]) => {
      Promise.resolve()
        .then(() => fetcher())
        .then((result) => {
          if (cancelled) return;

          setData((previous) => ({
            ...previous,
            [key]: Array.isArray(result) ? result : [],
          }));

          setLoaded((previous) => ({ ...previous, [key]: true }));
        })
        .catch((error) => {
          console.error(`[GlobalSearch] ${key} failed:`, error);

          if (!cancelled) {
            setLoaded((previous) => ({ ...previous, [key]: true }));
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

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

  const allLoaded = Object.keys(EMPTY_DATA).every((key) => loaded[key]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];

    return searchIndex
      .map((item) => ({ ...item, score: scoreResult(item, q) }))
      .filter((item) => item.score >= 10)
      .sort(
        (a, b) =>
          b.score - a.score ||
          String(a.title).localeCompare(String(b.title))
      )
      .slice(0, 12);
  }, [query, searchIndex]);

  const handleResultClick = (result) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative" ref={searchRef}>
      <button
        type="button"
        aria-label="Open global search"
        onClick={() => {
          setIsOpen(true);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="rounded-full p-2 transition hover:bg-slate-100"
      >
        <FiSearch className="h-5 w-5 text-slate-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-[999] w-[380px] max-w-[90vw] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center border-b border-slate-100 px-4">
            <FiSearch className="text-slate-400" />
            <input
              ref={inputRef}
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search IPOs, companies, blogs..."
              aria-label="Search IPOs, companies, brokers and articles"
              className="flex-1 px-3 py-4 text-sm outline-none"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
            >
              <FiX className="text-slate-400" />
            </button>
          </div>

          <div className="max-h-[450px] overflow-y-auto">
            {query.trim() !== "" && results.map((result) => (
              <button
                key={`${result.type || "item"}-${result.id}`}
                type="button"
                onClick={() => handleResultClick(result)}
                className="w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-blue-50"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {result.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {result.preview || result.content}
                </p>
                {result.type && (
                  <span className="mt-1 block text-[11px] text-slate-400">
                    {result.type}
                  </span>
                )}
              </button>
            ))}

            {query.trim() !== "" && results.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">
                  {allLoaded
                    ? "No matching results found"
                    : "Searching more results..."}
                </p>
              </div>
            )}

           
          </div>
        </div>
      )}
    </div>
  );
}