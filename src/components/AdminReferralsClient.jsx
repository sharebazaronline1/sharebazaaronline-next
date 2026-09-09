// src/components/AdminReferralsClient.jsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import {
  Users,
  Loader2,
  UserPlus,
  AlertCircle,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

const AdminReferralsClient = () => {
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Orders Modal
  const [selectedReferredForOrders, setSelectedReferredForOrders] = useState(null);
  const [referredOrders, setReferredOrders] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: rawReferrals, error: fetchError } = await supabase
        .from("referrals")
        .select(`
          id,
          referrer_sb_user_id,
          referred_name,
          referred_email,
          referred_mobile,
          referred_sb_user_id,
          status,
          reward_amount,
          commission_earned,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      const enriched = await Promise.all(
        rawReferrals.map(async (ref) => {
          // Referrer (Referred By)
          const { data: referrerData } = await supabase
            .from("profiles")
            .select("full_name, sb_user_id, email")
            .eq("id", ref.referrer_sb_user_id)
            .single();

          // Referred User Profile
          const { data: referredProfile } = await supabase
            .from("profiles")
            .select("sb_user_id, full_name")
            .eq("id", ref.referred_sb_user_id)
            .single();

          // Orders
          const { data: ordersData } = await supabase
            .from("orders")
            .select("total, commission_amount")
            .eq("user_id", ref.referred_sb_user_id);

          const totalOrderValue = ordersData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
          const commissionEarned = ordersData?.reduce((sum, o) => sum + (o.commission_amount || 0), 0) || 0;

          // Portfolio
          const { data: portfolioData } = await supabase
            .from("portfolios")
            .select("value")
            .eq("user_id", ref.referred_sb_user_id);

          const totalPortfolio = portfolioData?.reduce((sum, p) => sum + (p.value || 0), 0) || 0;

          // KYC
          const { data: kycData } = await supabase
            .from("user_kyc")
            .select("pan_status, aadhaar_status, cmr_status, cheque_status")
            .eq("user_id", ref.referred_sb_user_id)
            .maybeSingle();

          let kycStatus = "Not Uploaded";
          if (kycData) {
            const statuses = [kycData.pan_status, kycData.aadhaar_status, kycData.cmr_status, kycData.cheque_status];
            if (statuses.every(s => s === "Verified")) kycStatus = "Verified";
            else if (statuses.some(s => s === "Pending")) kycStatus = "Pending";
            else kycStatus = "Incomplete";
          }

          return {
            ...ref,
            referrer_name: referrerData?.full_name || "Unknown Referrer",
            referrer_sb_id: referrerData?.sb_user_id || "—",
            referred_full_name: ref.referred_name || referredProfile?.full_name || "Unnamed",
            referred_sb_id: referredProfile?.sb_user_id || "Not Registered",
            orderCount: ordersData?.length || 0,
            totalOrderValue,
            totalPortfolioValue: totalPortfolio,
            commissionEarned,
            kycStatus,
          };
        })
      );

      setReferrals(enriched);
    } catch (err) {
      console.error("Referrals fetch failed:", err);
      setError(err.message || "Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  const openReferredOrdersModal = async (ref) => {
    setSelectedReferredForOrders(ref);
    setModalLoading(true);
    setReferredOrders([]);
    setCurrentPage(1);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id, asset_name, price, quantity, total, order_type, status, 
          commission_amount, created_at
        `)
        .eq("user_id", ref.referred_sb_user_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferredOrders(data || []);
    } catch (err) {
      console.error("Error fetching referred user orders:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeOrdersModal = () => {
    setSelectedReferredForOrders(null);
    setReferredOrders([]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(referredOrders.length / itemsPerPage);
  const paginatedOrders = referredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-5">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
          <p className="text-lg font-medium text-gray-700">Loading referrals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="md:ml-64 transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-10 bg-white backdrop-blur-lg border-gray-200 px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2.5 rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <Menu size={22} />
              </button>
              <div>
                <h1 className="text-xl font-bold leading-tight text-gray-900">Referrals</h1>
                <p className="text-xs text-gray-500">Overview</p>
              </div>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="sticky top-0 z-10 bg-white backdrop-blur-lg border-gray-200 px-4 sm:px-6 lg:px-8 py-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Referrals Overview</h1>
              <p className="text-sm text-gray-600 mt-1">
                All referred users • Orders • Commission • Referrer details
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchReferrals}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
              >
                <RefreshCw size={17} />
                Refresh
              </button>
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto">
          {error && (
            <div className="mb-10 p-6 bg-red-50 border border-red-200 rounded-3xl flex items-center gap-4">
              <AlertCircle size={26} className="text-red-600 flex-shrink-0" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          )}

          {referrals.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-20 text-center">
              <User className="mx-auto text-emerald-600" size={56} />
              <h3 className="text-2xl font-semibold text-gray-800 mt-8">No Referrals Yet</h3>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm bg-white">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 px-4 py-5"></th>
                    <th className="px-4 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Referred User</th>
                    <th className="px-4 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Referred By</th>
                    <th className="px-4 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Contact</th>
                    <th className="px-4 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                    <th className="px-4 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Portfolio</th>
                    <th className="px-4 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">KYC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {referrals.map((ref) => (
                    <tr
                      key={ref.id}
                      className="hover:bg-emerald-50/60 transition-colors"
                    >
                      <td className="px-4 py-5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-semibold text-lg">
                          {ref.referred_full_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      </td>

                      {/* Referred User */}
                      <td className="px-4 py-5">
                        <div className="font-semibold text-gray-900">{ref.referred_full_name}</div>
                        <div className="text-xs font-mono text-gray-500 mt-0.5">
                          {ref.referred_sb_id}
                        </div>
                      </td>

                      {/* Referred By - Now with SB ID */}
                      <td className="px-4 py-5 text-sm text-gray-600 hidden md:table-cell">
                        <div>{ref.referrer_name}</div>
                        <div className="text-xs font-mono text-gray-500">
                          {ref.referrer_sb_id}
                        </div>
                      </td>

                      <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                        {ref.referred_email || ref.referred_mobile || "—"}
                      </td>

                      <td 
                        className="px-4 py-5 text-center font-medium text-emerald-600 underline hover:text-emerald-700 cursor-pointer"
                        onClick={() => openReferredOrdersModal(ref)}
                      >
                        {ref.orderCount}
                      </td>

                      <td className="px-4 py-5 text-center font-medium text-emerald-700 text-sm">
                        ₹{ref.totalPortfolioValue.toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-5 text-center">
                        <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          ref.kycStatus === "Verified" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : 
                          ref.kycStatus === "Pending" ? "bg-amber-100 text-amber-700 border border-amber-200" : 
                          "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}>
                          {ref.kycStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Orders Modal */}
      {selectedReferredForOrders && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/70 px-4 pt-32 pb-8 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[70vh] flex flex-col mx-auto">
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Orders by {selectedReferredForOrders.referred_full_name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  SB ID: {selectedReferredForOrders.referred_sb_id}
                </p>
              </div>
              <button onClick={closeOrdersModal} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 sm:p-8">
              {modalLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : referredOrders.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 rounded-3xl py-12 text-center">
                  <p className="text-gray-500">No orders found for this user.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-3xl border border-gray-100 max-h-[45vh] overflow-y-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-4 text-left font-medium text-gray-600">Asset</th>
                          <th className="px-4 py-4 text-right font-medium text-gray-600">Price</th>
                          <th className="px-4 py-4 text-right font-medium text-gray-600">Qty</th>
                          <th className="px-4 py-4 text-center font-medium text-gray-600">Type</th>
                          <th className="px-4 py-4 text-center font-medium text-gray-600">Status</th>
                          <th className="px-4 py-4 text-right font-medium text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {paginatedOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 font-medium">{order.asset_name}</td>
                            <td className="px-4 py-4 text-right">₹{order.price?.toLocaleString("en-IN")}</td>
                            <td className="px-4 py-4 text-right">{order.quantity}</td>
                            <td className="px-4 py-4 text-center">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-2xl ${order.order_type === "BUY" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                                {order.order_type}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-2xl ${order.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right text-xs text-gray-500">
                              {new Date(order.created_at).toLocaleDateString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <button onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage===1} className="p-3 rounded-2xl hover:bg-gray-100 disabled:opacity-50">
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-sm font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
                      <button onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage===totalPages} className="p-3 rounded-2xl hover:bg-gray-100 disabled:opacity-50">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="px-6 sm:px-8 py-5 flex justify-end">
              <button onClick={closeOrdersModal} className="px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReferralsClient;