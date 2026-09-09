// src/components/PreIPOWatchlistClient.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import { Menu, AlertCircle, TrendingUp, Plus, X, FileText } from "lucide-react";

const PreIPOWatchlistClient = ({ user }) => {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Watchlist data (same as before)
  const watchlist = [
    {
      name: "OYO (Oravel Stays Ltd)",
      sector: "Hospitality",
      isin: "INE561T01021",
      price: "₹26 – ₹28",
      demand: "High Demand",
      expectedIPO: "2026",
    },
    {
      name: "PhonePe",
      sector: "Fintech",
      isin: "INE0KM101019",
      price: "≈ ₹19,968",
      demand: "Very High Demand",
      expectedIPO: "2026-2027",
    },
    {
      name: "NSE India Ltd",
      sector: "Stock Exchange",
      isin: "INE721I01024",
      price: "₹1,940 – ₹2,400",
      demand: "Strong Interest",
      expectedIPO: "Expected 2026",
    },
    {
      name: "CSK (Chennai Super Kings)",
      sector: "Sports",
      isin: "INE852S01026",
      price: "₹212 – ₹215",
      demand: "Popular",
      expectedIPO: "Unlisted",
    },
    {
      name: "Inox Clean Energy",
      sector: "Renewable Energy",
      isin: "INE0H7K01023",
      price: "≈ ₹550",
      demand: "Rising",
      expectedIPO: "Upcoming",
    },
    {
      name: "Hero FinCorp",
      sector: "NBFC",
      isin: "INE957N01016",
      price: "TBA",
      demand: "Strong",
      expectedIPO: "2026",
    },
  ];

  // DRHP filed data
  const drhpFiled = [
    {
      name: "Ola Electric",
      sector: "Electric Vehicles",
      filedDate: "Dec 2023",
      expectedListing: "August 9, 2024",
      status: "Approved",
    },
  ];

  // Suggestions
  const suggestions = [
    {
      name: "Swiggy",
      price: "≈ ₹390 – ₹410",
      demand: "High Demand",
      sector: "Food Delivery",
    },
    {
      name: "Tata Capital",
      price: "≈ ₹950 – ₹1,100",
      demand: "Strong Interest",
      sector: "NBFC",
    },
    {
      name: "Bharat FIH (Foxconn India)",
      price: "TBA",
      demand: "Growing",
      sector: "Manufacturing",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />
      <main className="md:ml-64 p-4 md:p-8 transition-all">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-20 bg-white border-gray-200 px-4 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSidebarOpen(true)} className="p-1">
                <Menu size={24} />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 leading-tight">Pre-IPO Watchlist</h1>
            </div>
            <div className="shrink-0">
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pre-IPO Watchlist</h1>
            <p className="text-gray-600 mt-1">Track your favorite unlisted and upcoming pre-IPO companies</p>
          </div>
          <UserProfileDropdown />
        </header>

        {/* Watchlist Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.sector}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ISIN</span>
                  <span className="font-semibold">{item.isin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Price</span>
                  <span className="font-semibold">{item.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Settlement Time</span>
                  <span className="text-sm">{item.expectedIPO}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 flex items-center justify-between">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    item.demand.includes("Very High") || item.demand.includes("High")
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.demand}
                </span>
                <button onClick={() => router.push("/orders")} className="text-sm font-semibold text-green-600 hover:underline">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Empty State */}
        {watchlist.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Your watchlist is empty</p>
            <p className="text-gray-400 mt-2">Explore pre-IPO stocks and add them here to track</p>
          </div>
        )}

        {/* DRHP Filed Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FileText className="text-blue-600" size={24} />
            DRHP Filed Companies
          </h2>
          <p className="text-gray-600 mb-6">
            Companies that have filed Draft Red Herring Prospectus (DRHP) with SEBI for upcoming IPOs. Track their progress and expected listing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drhpFiled.map((item, index) => (
              <DRHPCard key={index} {...item} />
            ))}
          </div>
        </section>

        {/* Suggested Pre-IPOs Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="text-green-600" size={24} />
            Suggested for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestions.map((item, index) => (
              <SuggestionCard key={index} {...item} navigate={router} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => router.push("/pre-ipo-stocks")}
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#16A34A] text-white font-medium rounded-xl hover:bg-[#15803D] transition shadow-md hover:shadow-lg"
            >
              <TrendingUp size={20} />
              View More
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

// DRHP Card Component
const DRHPCard = ({ name, sector, filedDate, expectedListing, status }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{sector}</p>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">Filed Date</span>
        <span className="font-semibold">{filedDate}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">Listing</span>
        <span className="font-semibold">{expectedListing}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-600">Status</span>
        <span className="font-semibold text-blue-600">{status}</span>
      </div>
    </div>
    <div className="mt-6 pt-4 flex items-center justify-between">
      <button className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
        <FileText size={16} />
        View DRHP
      </button>
      <button className="text-sm font-semibold text-green-600 hover:underline">
        Add to Watchlist
      </button>
    </div>
  </div>
);

// Suggestion Card Component
const SuggestionCard = ({ name, price, demand, sector, navigate }) => (
  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
    <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
    <p className="text-sm text-gray-600 mt-1">Sector: {sector}</p>
    <p className="text-sm text-gray-600 mt-2">Price: {price}</p>
    <div className="mt-6 flex items-center justify-between">
      <span
        className={`text-xs px-3 py-1 rounded-full font-medium ${
          demand.includes("High") ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
        }`}
      >
        {demand}
      </span>
      <button onClick={() => navigate.push("/orders")} className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:underline">
        Buy Now
      </button>
    </div>
  </div>
);

export default PreIPOWatchlistClient;