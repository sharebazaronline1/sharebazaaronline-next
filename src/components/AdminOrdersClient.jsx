// src/components/AdminOrdersClient.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import {
  FileText,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Search,
  Menu,
  X,
} from "lucide-react";

const AdminOrdersClient = () => {
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openStatusId, setOpenStatusId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState(null);

  // ================= FILTERS =================
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const itemsPerPage = 12;

  const fetchAllOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select(`
          id,
          asset_name,
          price,
          quantity,
          total,
          order_type,
          status,
          created_at,
          profiles (
            full_name,
            sb_user_id
          )
        `)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setAllOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try refreshing.");
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Reset page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statusFilter]);

  // ================= FILTERED ORDERS =================
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      // Text search: user name, SB ID, or asset name
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const userName = order.profiles?.full_name?.toLowerCase() || "";
        const sbId = order.profiles?.sb_user_id?.toLowerCase() || "";
        const asset = order.asset_name?.toLowerCase() || "";

        if (
          !userName.includes(q) &&
          !sbId.includes(q) &&
          !asset.includes(q)
        ) {
          return false;
        }
      }

      // Order type filter
      if (typeFilter !== "All") {
        if ((order.order_type || "").toUpperCase() !== typeFilter) return false;
      }

      // Status filter
      if (statusFilter !== "All") {
        if ((order.status || "PENDING").toUpperCase() !== statusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [allOrders, searchQuery, typeFilter, statusFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    typeFilter !== "All" ||
    statusFilter !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("All");
    setStatusFilter("All");
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert(`Failed to update: ${error.message}`);
      return;
    }

    setAllOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    setOpenStatusId(null);
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="md:ml-64 transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-10 bg-white border-gray-200 px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2.5 rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <Menu size={22} />
              </button>
              <div>
                <h1 className="text-xl font-bold leading-tight text-gray-900">Orders</h1>
                <p className="text-xs text-gray-500">Manage</p>
              </div>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="sticky top-0 z-10 bg-white border-gray-200 px-4 sm:px-6 lg:px-8 py-6 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">All Orders</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage Pre-IPO orders • Click status to change
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchAllOrders}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <RefreshCw size={17} />
                Refresh
              </button>
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {/* ================= FILTER BAR ================= */}
          <div className="mb-6 bg-white rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by user, SB ID or asset…"
                  className="w-full h-12 pl-11 pr-10 rounded-2xl border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100"
                    aria-label="Clear search"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                )}
              </div>

              {/* Type filter */}
              <div className="relative w-full lg:w-[170px]">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full h-12 rounded-2xl border border-gray-300 bg-white px-5 pr-12 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none"
                >
                  <option value="All">All Types</option>
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>

              {/* Status filter */}
              <div className="relative w-full lg:w-[190px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-12 rounded-2xl border border-gray-300 bg-white px-5 pr-12 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none"
                >
                  <option value="All">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SETTLED">Settled</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-1.5 h-12 px-4 rounded-2xl border border-gray-300 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 whitespace-nowrap"
                >
                  <X size={16} />
                  Clear
                </button>
              )}
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {allOrders.length}
              </span>{" "}
              orders
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-3xl text-center">
              {error}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center">
              <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Orders Found
              </h3>
              <p className="text-gray-500 mt-1">
                {hasActiveFilters
                  ? "No orders match your filters."
                  : "No orders yet."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-visible">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SB ID</th>
                      <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asset</th>
                      <th className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-emerald-50/60 transition-colors">
                        <td className="px-6 py-5 font-medium text-gray-900">
                          {order.profiles?.full_name || "Unknown"}
                        </td>
                        <td className="px-6 py-5 font-mono text-sm text-gray-600">
                          {order.profiles?.sb_user_id || "—"}
                        </td>
                        <td className="px-6 py-5 font-medium text-gray-900">
                          {order.asset_name}
                        </td>
                        <td className="px-6 py-5 text-right font-medium">{order.quantity}</td>
                        <td className="px-6 py-5 text-right">₹{Number(order.price || 0).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-5 text-right font-medium">₹{Number(order.total || 0).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-5 text-center">
                          <span className={`inline-flex px-4 py-1 text-xs font-semibold rounded-2xl ${
                            order.order_type === "BUY" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}>
                            {order.order_type}
                          </span>
                        </td>

                        {/* Status with Portal Dropdown - Positioned Above */}
                        <td className="px-6 py-5 text-center relative">
                          <button
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setDropdownPos({
                                top: rect.top + window.scrollY - 10,
                                left: rect.left + window.scrollX,
                              });
                              setOpenStatusId(order.id);
                            }}
                            className={`inline-flex px-5 py-1.5 text-xs font-semibold rounded-2xl transition-all hover:shadow-sm ${
                              order.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-amber-200"
                                : order.status === "PROCESSING"
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                : "bg-green-100 text-green-700 hover:bg-emerald-200"
                            }`}
                          >
                            {order.status || "PENDING"}
                          </button>
                        </td>

                        <td className="px-6 py-5 text-right text-xs text-gray-500 whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Portal Dropdown - Positioned Above */}
              {openStatusId && dropdownPos && createPortal(
                <div
                  style={{
                    position: "absolute",
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    zIndex: 99999,
                  }}
                  className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 w-44"
                >
                  {["PENDING", "PROCESSING", "SETTLED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(openStatusId, status)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                        allOrders.find(o => o.id === openStatusId)?.status === status 
                          ? "font-semibold text-emerald-700" 
                          : "text-gray-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>,
                document.body
              )}

              {/* Pagination */}
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

export default AdminOrdersClient;