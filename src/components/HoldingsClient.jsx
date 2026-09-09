// src/components/HoldingsClient.jsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "./Sidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import {
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  TrendingUp,
} from "lucide-react";

const HoldingsClient = ({ user, initialHoldings }) => {
  const supabase = createClient();

  const [holdings, setHoldings] = useState(initialHoldings || []);
  const [filteredHoldings, setFilteredHoldings] = useState(initialHoldings || []);
  const [loading, setLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 10;

  const fetchUserHoldings = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select(`
          id,
          asset_name,
          quantity,
          price,
          total,
          created_at,
          status
        `)
        .eq("status", "SETTLED")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const processedData = (data || []).map(item => ({
        ...item,
        average_price: item.price,
        total_value: item.total,
      }));

      setHoldings(processedData);
      setFilteredHoldings(processedData);
    } catch (err) {
      console.error("Failed to fetch holdings:", err);
      setError("Failed to load your holdings. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  // If initial holdings weren't provided (fallback), fetch on client
  useEffect(() => {
    if (!initialHoldings || initialHoldings.length === 0) {
      fetchUserHoldings();
    }
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredHoldings(holdings);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = holdings.filter((holding) =>
      holding.asset_name?.toLowerCase().includes(query)
    );

    setFilteredHoldings(filtered);
    setCurrentPage(1);
  }, [searchQuery, holdings]);

  const paginatedHoldings = filteredHoldings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredHoldings.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />
      <main className="md:ml-64 transition-all duration-300">
        <header className="sticky top-0 z-10 bg-white border-gray-200 px-4 sm:px-6 lg:px-8 py-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            {/* MOBILE HEADER */}
            <div className="flex items-center justify-between md:hidden">
              <button onClick={() => setMobileSidebarOpen(true)} className="p-2">
                <Menu size={24} />
              </button>
              <div className="flex-1 text-center">
                <h1 className="text-xl font-semibold text-gray-900">My Holdings</h1>
                <p className="text-xs text-gray-500 mt-1">Pre-IPO & Unlisted Shares</p>
              </div>
              <div className="flex items-center justify-end min-w-[40px]">
                <UserProfileDropdown />
              </div>
            </div>

            {/* DESKTOP HEADER */}
            <div className="hidden md:flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  My Holdings
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Your Pre-IPO & Unlisted Shares from settled orders
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchUserHoldings}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  <RefreshCw size={17} />
                  Refresh
                </button>
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-2xl text-center">
              {error}
            </div>
          ) : holdings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">You don't have any settled holdings yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-visible">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset</th>
                      <th className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Price</th>
                      <th className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Value</th>
                      <th className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedHoldings.map((holding) => (
                      <tr key={holding.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 font-medium text-gray-900">
                          {holding.asset_name}
                        </td>
                        <td className="px-6 py-5 text-right font-medium">{holding.quantity}</td>
                        <td className="px-6 py-5 text-right">
                          ₹{Number(holding.average_price || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-5 text-right font-semibold">
                          ₹{Number(holding.total_value || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-5 text-right text-xs text-gray-500 whitespace-nowrap">
                          {new Date(holding.created_at).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 py-8 bg-white">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-2xl hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-2xl hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HoldingsClient;