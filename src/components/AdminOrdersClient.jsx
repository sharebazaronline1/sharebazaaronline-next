// src/components/AdminOrdersClient.jsx
"use client";

import { useEffect, useState } from "react";
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
  AlertCircle,
  Search,
  Menu,
} from "lucide-react";

const AdminOrdersClient = () => {
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [openStatusId, setOpenStatusId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState(null);

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
      setFilteredOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders. Please try refreshing.");
      setAllOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(allOrders);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = allOrders.filter((order) => {
      const userName = order.profiles?.full_name?.toLowerCase() || "";
      const sbId = order.profiles?.sb_user_id?.toLowerCase() || "";
      return userName.includes(query) || sbId.includes(query);
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, allOrders]);

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
          {/* Search Bar */}

<div className="mb-6">
  <div className="relative max-w-md">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
    <input
      type="text"
      placeholder="Search by user name or SB ID..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
    />
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
              <h3 className="text-xl font-semibold text-gray-700">No Orders Found</h3>
              <p className="text-gray-500 mt-1">No orders match your search or there are no orders yet.</p>
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
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
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