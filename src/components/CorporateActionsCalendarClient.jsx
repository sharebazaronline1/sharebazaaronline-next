// src/components/CorporateActionsCalendarClient.jsx
"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  Building2,
  IndianRupee,
  Percent,
  TrendingUp,
  ExternalLink,
  Filter,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

/* ---------------- Constants ---------------- */

const MONTHS = {
  Jan: 0, January: 0,
  Feb: 1, February: 1,
  Mar: 2, March: 2,
  Apr: 3, April: 3,
  May: 4,
  Jun: 5, June: 5,
  Jul: 6, July: 6,
  Aug: 7, August: 7,
  Sep: 8, Sept: 8, September: 8,
  Oct: 9, October: 9,
  Nov: 10, November: 10,
  Dec: 11, December: 11,
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ACTION_TYPES = {
  buyback: {
    label: "Buyback",
    short: "Buyback",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  dividend: {
    label: "Dividend",
    short: "Dividend",
    dot: "bg-blue-500",
    pill: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  bonus: {
    label: "Bonus Issue",
    short: "Bonus",
    dot: "bg-purple-500",
    pill: "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
  },
  split: {
    label: "Stock Split",
    short: "Split",
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  rights: {
    label: "Rights Issue",
    short: "Rights",
    dot: "bg-rose-500",
    pill: "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
  },
};

const ACTION_TYPE_MAP = {
  buyback: "buyback",
  dividend: "dividend",
  bonus: "bonus",
  split: "split",
  rights: "rights",
};

const CARD_WIDTH = 400;
const CARD_ESTIMATED_HEIGHT = 460;
const GAP = 10;
const EDGE_MARGIN = 12;

/* ---------------- Helpers ---------------- */

function parseDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;

  const str = String(dateStr).trim();
  const parts = str.split(/\s+/);

  if (parts.length >= 3) {
    const [day, monthStr, year] = parts;
    const month = MONTHS[monthStr];
    if (month !== undefined && year) {
      const d = new Date(Number(year), month, Number(day));
      return isNaN(d.getTime()) ? null : d;
    }
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function toDateKey(date) {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a, b) {
  return (
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatLongDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const start = new Date(year, month, 1 - startOffset);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

function computeCardPosition(anchorRect) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const cardW = Math.min(CARD_WIDTH, vw - EDGE_MARGIN * 2);
  const cardH = Math.min(CARD_ESTIMATED_HEIGHT, vh - EDGE_MARGIN * 2);

  let top = anchorRect.bottom + GAP;
  let left = anchorRect.left;

  if (top + cardH > vh - EDGE_MARGIN) {
    const aboveTop = anchorRect.top - cardH - GAP;
    top = aboveTop >= EDGE_MARGIN ? aboveTop : Math.max(EDGE_MARGIN, vh - cardH - EDGE_MARGIN);
  }

  if (left + cardW > vw - EDGE_MARGIN) {
    left = Math.max(EDGE_MARGIN, vw - cardW - EDGE_MARGIN);
  }
  if (left < EDGE_MARGIN) left = EDGE_MARGIN;

  if (top < EDGE_MARGIN) top = EDGE_MARGIN;
  if (top + cardH > vh - EDGE_MARGIN) top = Math.max(EDGE_MARGIN, vh - cardH - EDGE_MARGIN);

  return { top, left, width: cardW };
}

/* ---------------- Component ---------------- */

const CorporateActionsCalendarClient = ({ initialRecords = [] }) => {
  const router = useRouter();
  const supabase = createClient();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cardPos, setCardPos] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [hoveredDay, setHoveredDay] = useState(null);
  const hoverCloseTimer = useRef(null);
  const cardRef = useRef(null);

  const { data: records = initialRecords } = useQuery({
    queryKey: ["corporate_actions_calendar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("corporate_actions")
        .select(
          `
          *,
          blog:blogs (
            id,
            slug,
            heading
          )
        `
        )
        .order("ex_date", { ascending: false })
        .limit(2000);

      if (error) throw error;
      return data || [];
    },
    initialData: initialRecords,
    staleTime: 5 * 60 * 1000,
  });

  /* -------- Build events from corporate actions -------- */
  const events = useMemo(() => {
    const list = [];
    (records || []).forEach((rec) => {
      if (!rec) return;

      const exDate = parseDate(rec.ex_date);
      if (!exDate) return;

      const rawType = (rec.action_type || "other").toLowerCase().trim();
      const typeKey = ACTION_TYPE_MAP[rawType];
      if (!typeKey) return;

      list.push({
        id: `${rec.id}-exdate`,
        date: exDate,
        type: typeKey,
        record: rec,
        name: rec.company || "Company",
      });
    });
    return list;
  }, [records]);

  const filteredEvents = useMemo(
    () => (typeFilter === "all" ? events : events.filter((e) => e.type === typeFilter)),
    [events, typeFilter]
  );

  const eventsByDay = useMemo(() => {
    const map = new Map();
    filteredEvents.forEach((ev) => {
      const key = toDateKey(ev.date);
      if (!key) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    });
    return map;
  }, [filteredEvents]);

  const gridCells = useMemo(
    () => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );

  const goPrev = () =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1));
  const goNext = () =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1));

  const handleBlogNavigate = (rec) => {
    if (rec?.blog?.id && rec?.blog?.slug) {
      router.push(`/corporateactions/${rec.blog.id}/${rec.blog.slug}`);
    }
  };

  const upcomingEvents = useMemo(() => {
    const upcoming = filteredEvents
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date - b.date);
    return upcoming.slice(0, 6);
  }, [filteredEvents, today]);

  const openEventAt = useCallback((ev, anchorEl) => {
    let rect;
    if (anchorEl && typeof anchorEl.getBoundingClientRect === "function") {
      rect = anchorEl.getBoundingClientRect();
    } else if (anchorEl && anchorEl.top !== undefined) {
      rect = anchorEl;
    } else {
      rect = {
        top: window.innerHeight / 2,
        bottom: window.innerHeight / 2,
        left: window.innerWidth / 2,
        right: window.innerWidth / 2,
      };
    }
    setCardPos(computeCardPosition(rect));
    setSelectedEvent(ev);
  }, []);

  const closeEvent = () => {
    setSelectedEvent(null);
    setCardPos(null);
  };

  useEffect(() => {
    if (!selectedEvent) return;
    const handleResize = () => closeEvent();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedEvent]);

  useEffect(() => {
    return () => {
      if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    };
  }, []);

  const openHover = (key) => {
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    setHoveredDay(key);
  };

  const scheduleCloseHover = () => {
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = setTimeout(() => setHoveredDay(null), 180);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <CalendarIcon size={18} className="text-emerald-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              Corporate Actions Calendar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Ex-dates for buybacks, dividends, bonuses, splits and rights — all in one view.
            </p>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            {/* Month navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={goPrev}
                    aria-label="Previous month"
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-slate-600 hover:bg-gray-50 transition"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={goNext}
                    aria-label="Next month"
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-slate-600 hover:bg-gray-50 transition"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={14} className="text-slate-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Filter actions
                </h3>
              </div>
              <div className="space-y-1">
                {[
                  { key: "all", label: "All actions" },
                  { key: "buyback", label: "Buyback" },
                  { key: "dividend", label: "Dividend" },
                  { key: "bonus", label: "Bonus Issue" },
                  { key: "split", label: "Stock Split" },
                  { key: "rights", label: "Rights Issue" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setTypeFilter(f.key)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition flex items-center gap-2 font-bold ${
                      typeFilter === f.key
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-gray-50"
                    }`}
                  >
                    {f.key !== "all" && (
                      <span
                        className={`w-2 h-2 rounded-full ${ACTION_TYPES[f.key].dot}`}
                      />
                    )}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming list */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 hidden lg:block">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
                Coming up
              </h3>
              {upcomingEvents.length === 0 ? (
                <p className="text-xs text-slate-400">No upcoming actions</p>
              ) : (
                <ul className="space-y-2.5">
                  {upcomingEvents.map((ev) => {
                    const cfg = ACTION_TYPES[ev.type];
                    return (
                      <li key={ev.id}>
                        <button
                          onClick={(e) => openEventAt(ev, e.currentTarget)}
                          className="w-full text-left group"
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className={`mt-1 w-2 h-2 rounded-full shrink-0 ${cfg.dot}`}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition">
                                {ev.name}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {cfg.short} ·{" "}
                                {ev.date.toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </p>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>

          {/* Calendar grid */}
          <section className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Mobile month nav */}
              <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <button
                  onClick={goPrev}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-slate-600"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-sm font-bold text-slate-900">
                  {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
                </div>
                <button
                  onClick={goNext}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-slate-600"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Weekday header */}
              <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="px-2 py-2.5 text-center text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Grid cells */}
              <div className="grid grid-cols-7">
                {gridCells.map((cell, i) => {
                  const key = toDateKey(cell);
                  const cellEvents = eventsByDay.get(key) || [];
                  const inMonth = cell.getMonth() === cursor.getMonth();
                  const isToday = isSameDay(cell, today);
                  const visible = cellEvents.slice(0, 2);
                  const more = cellEvents.length - visible.length;
                  const isHovered = hoveredDay === key;

                  return (
                    <div
                      key={i}
                      className={`relative min-h-[100px] sm:min-h-[120px] border-b border-r border-gray-100 p-1.5 sm:p-2 ${
                        inMonth ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[11px] sm:text-xs font-semibold inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-full ${
                            isToday
                              ? "bg-emerald-600 text-white px-1.5"
                              : inMonth
                              ? "text-slate-700"
                              : "text-slate-300"
                          }`}
                        >
                          {cell.getDate()}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        {visible.map((ev) => {
                          const cfg = ACTION_TYPES[ev.type];
                          return (
                            <button
                              key={ev.id}
                              onClick={(e) => openEventAt(ev, e.currentTarget)}
                              className={`w-full text-left text-[9px] sm:text-[10px] leading-tight px-1.5 py-1 rounded border transition truncate ${cfg.pill}`}
                              title={`${ev.name} — ${cfg.label}`}
                            >
                              <span className="font-semibold">
                                {ev.name.length > 22
                                  ? ev.name.slice(0, 20) + "…"
                                  : ev.name}
                              </span>
                            </button>
                          );
                        })}

                        {more > 0 && (
                          <div
                            className="relative"
                            onMouseEnter={() => openHover(key)}
                            onMouseLeave={scheduleCloseHover}
                          >
                            <button
                              className="text-[9px] sm:text-[10px] text-slate-600 hover:text-emerald-700 font-semibold px-1.5 py-0.5 rounded transition"
                              aria-haspopup="true"
                            >
                              +{more} more
                            </button>

                            {isHovered && (
                              <div
                                className="absolute z-40 top-full left-0 mt-1 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-1.5 max-h-72 overflow-y-auto"
                                onMouseEnter={() => openHover(key)}
                                onMouseLeave={scheduleCloseHover}
                              >
                                <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold border-b border-gray-100 mb-1">
                                  {cell.toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className="space-y-0.5">
                                  {cellEvents.map((ev) => {
                                    const cfg = ACTION_TYPES[ev.type];
                                    return (
                                      <button
                                        key={ev.id}
                                        onClick={(e) => {
                                          setHoveredDay(null);
                                          openEventAt(ev, e.currentTarget);
                                        }}
                                        className="w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-50 flex items-start gap-2 transition"
                                      >
                                        <span
                                          className={`mt-1 w-2 h-2 rounded-full shrink-0 ${cfg.dot}`}
                                        />
                                        <div className="min-w-0 flex-1">
                                          <p className="text-[11px] font-semibold text-slate-900 truncate">
                                            {ev.name}
                                          </p>
                                          <p className="text-[10px] text-slate-500">
                                            {cfg.short}
                                          </p>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating event detail card */}
      {selectedEvent && cardPos && (
        <CorporateActionDetailCard
          event={selectedEvent}
          position={cardPos}
          onClose={closeEvent}
          onNavigate={handleBlogNavigate}
          cardRef={cardRef}
        />
      )}
    </div>
  );
};

/* ---------------- Floating Detail Card ---------------- */

const CorporateActionDetailCard = ({
  event,
  position,
  onClose,
  onNavigate,
  cardRef,
}) => {
  const cfg = ACTION_TYPES[event.type];
  const rec = event.record || {};
  const name = event.name;

  const recordDate = parseDate(rec.record);
  const announcementDate = parseDate(rec.announcement);
  const paymentDate = parseDate(rec.payment_date);

  const fmtShort = (d) =>
    d
      ? d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const value = rec.ratio_or_percentage || rec.buyback_price || null;

  return (
    <>
      {/* Invisible click-away layer */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

      {/* Floating card */}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="false"
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          width: position.width,
        }}
        className="z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-end px-3 pt-3">
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-gray-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Header */}
        <div className="px-5 pb-4">
          <div className="flex items-start gap-3">
            <span className={`mt-1.5 w-3 h-3 rounded-full shrink-0 ${cfg.dot}`} />
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 leading-snug break-words">
                {name}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {formatLongDate(event.date)}
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 pb-5 space-y-3.5 text-sm max-h-[55vh] overflow-y-auto">
          <DetailRow icon={<Percent size={14} />} label="Action">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${cfg.badge}`}
            >
              {cfg.label}
            </span>
          </DetailRow>

          {value && (
            <DetailRow icon={<IndianRupee size={14} />} label="Ratio / Value">
              {value}
            </DetailRow>
          )}

          {rec.type && (
            <DetailRow icon={<Building2 size={14} />} label="Sub-type">
              {rec.type}
            </DetailRow>
          )}

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <CalendarKeyValue label="Announcement" value={fmtShort(announcementDate)} />
            <CalendarKeyValue label="Record Date" value={fmtShort(recordDate)} />
            <CalendarKeyValue label="Ex-Date" value={fmtShort(event.date)} />
            {paymentDate && (
              <CalendarKeyValue label="Payment" value={fmtShort(paymentDate)} />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
          {rec?.blog?.id && rec?.blog?.slug ? (
            <button
              onClick={() => onNavigate(rec)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
            >
              Full Analysis
              <ExternalLink size={14} />
            </button>
          ) : (
            <div className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-slate-500 text-sm font-semibold cursor-not-allowed">
              Analysis pending
            </div>
          )}
          <Link
            href="/corporateactions"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-slate-800 text-sm font-semibold transition"
          >
            All Actions
          </Link>
        </div>
      </div>

      {/* Subtle fade-in */}
      <style jsx global>{`
        @keyframes calendarCardIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation: calendarCardIn 0.14s ease-out;
          transform-origin: top left;
        }
      `}</style>
    </>
  );
};

const DetailRow = ({ icon, label, children }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 text-slate-400">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
        {label}
      </p>
      <div className="text-sm text-slate-800 mt-0.5">{children}</div>
    </div>
  </div>
);

const CalendarKeyValue = ({ label, value }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="text-slate-800 font-semibold">{value}</span>
  </div>
);

export default CorporateActionsCalendarClient;