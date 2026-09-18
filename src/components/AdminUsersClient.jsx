// src/components/AdminUsersClient.jsx
"use client";

import { useEffect, useState, useMemo, Fragment } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import {
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  RefreshCw,
  Package,
  ShieldCheck,
  Clock,
  CreditCard,
  X,
  Menu,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";
import * as XLSX from "xlsx";

const AdminUsersClient = () => {
  const router = useRouter();
  const supabase = createClient();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRates, setEditingRates] = useState({});
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Modals
  const [selectedReferred, setSelectedReferred] = useState(null);
  const [referredOrders, setReferredOrders] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [referredOrdersMap, setReferredOrdersMap] = useState({});
  const [selectedMainUser, setSelectedMainUser] = useState(null);
  const [mainUserOrders, setMainUserOrders] = useState([]);
  const [mainModalLoading, setMainModalLoading] = useState(false);
  const [mainCurrentPage, setMainCurrentPage] = useState(1);

  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [referralCommissions, setReferralCommissions] = useState({});

  // ================= USER FILTERS =================
  const [userSearch, setUserSearch] = useState("");
  const [kycFilter, setKycFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const calculateCommission = async (referredUserId, commissionRate) => {
    const { data: orders } = await supabase
      .from("orders")
      .select("total")
      .eq("user_id", referredUserId)
      .eq("status", "CONFIRMED")
      .eq("order_type", "BUY");

    return orders?.reduce((sum, o) => sum + (Number(o.total || 0) * (commissionRate / 100)), 0) || 0;
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, sb_user_id, created_at, account_status, commission_rate, mobile")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const enriched = await Promise.all(
        profiles.map(async (profile) => {
          const { count: referralCount } = await supabase
            .from("referrals")
            .select("*", { count: "exact", head: true })
            .eq("referrer_sb_user_id", profile.id);

          const { data: referredUsersRaw } = await supabase
            .from("referrals")
            .select(`
              referred_name,
              referred_email,
              referred_mobile,
              referred_sb_user_id,
              reward_amount,
              commission_earned,
              status,
              created_at
            `)
            .eq("referrer_sb_user_id", profile.id);

          const referredUsers = await Promise.all(
            (referredUsersRaw || []).map(async (ref) => {
              const { data: referredProfile } = await supabase
                .from("profiles")
                .select("sb_user_id")
                .eq("id", ref.referred_sb_user_id)
                .maybeSingle();

              return {
                ...ref,
                profiles: referredProfile || null,
              };
            })
          );

          const { count: orderCount } = await supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .eq("user_id", profile.id);

          let totalPortfolio = 0;
          const { data: portfolio } = await supabase
            .from("portfolios")
            .select("value")
            .eq("user_id", profile.id);

          if (portfolio) {
            totalPortfolio = portfolio.reduce((sum, p) => sum + (p.value || 0), 0);
          }

          const { data: kycData } = await supabase
            .from("user_kyc")
            .select(`
              pan_status, aadhaar_status, cmr_status, cheque_status,
              bank_name, bank_account_no, ifsc, name_as_per_pan, name_as_per_demat,
              demat_id
            `)
            .eq("user_id", profile.id)
            .maybeSingle();

          let kycStatus = "Not Uploaded";
          if (kycData) {
            const statuses = [kycData.pan_status, kycData.aadhaar_status, kycData.cmr_status, kycData.cheque_status];
            if (statuses.every((s) => s === "Verified")) kycStatus = "Verified";
            else if (statuses.some((s) => s === "Pending")) kycStatus = "Pending";
            else kycStatus = "Incomplete";
          }

          const bankAccount = kycData
            ? {
                bank_name: kycData.bank_name,
                account_number: kycData.bank_account_no,
                ifsc_code: kycData.ifsc,
                account_holder_name: kycData.name_as_per_pan || kycData.name_as_per_demat || profile.full_name,
              }
            : null;

          return {
            ...profile,
            referralCount: referralCount || 0,
            referredUsers: referredUsers || [],
            orderCount: orderCount || 0,
            totalPortfolioValue: totalPortfolio,
            kycStatus,
            bankAccount,
            demat_id: kycData?.demat_id || "",
            commission_rate: profile.commission_rate || 0.0025,
          };
        })
      );

      setUsers(enriched);
      const ordersMap = {};

      for (const user of enriched) {
        for (const ref of user.referredUsers) {
          if (!ref.referred_sb_user_id) continue;

          const { data: orders } = await supabase
            .from("orders")
            .select("total, status, order_type")
            .eq("user_id", ref.referred_sb_user_id);

          ordersMap[ref.referred_sb_user_id] = orders || [];
        }
      }

      setReferredOrdersMap(ordersMap);

      // Calculate commissions for all referred users
      const commissionMap = {};
      for (const user of enriched) {
        for (const ref of user.referredUsers) {
          if (ref.referred_sb_user_id) {
            const commission = await calculateCommission(
              ref.referred_sb_user_id,
              user.commission_rate || 0
            );
            commissionMap[ref.referred_sb_user_id] = commission;
          }
        }
      }
      setReferralCommissions(commissionMap);
    } catch (err) {
      console.error("Users fetch failed:", err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ================= DOWNLOAD FUNCTIONS =================
  const downloadUserReport = async () => {
    const userSummary = [];

    for (const user of users) {
      // 🔹 Get referred users
      const { data: referrals } = await supabase
        .from("referrals")
        .select("referred_sb_user_id")
        .eq("referrer_sb_user_id", user.id);

      let referralOrders = 0;
      let referralAmount = 0;

      for (const ref of referrals || []) {
        const { data: orders } = await supabase
          .from("orders")
          .select("total, status, order_type")
          .eq("user_id", ref.referred_sb_user_id);

        if (orders) {
          referralOrders += orders.length;
          referralAmount += orders
            .filter(
              (o) =>
                o.order_type === "BUY" &&
                (o.status === "CONFIRMED" ||
                 o.status === "SETTLED")
            )
            .reduce(
              (sum, o) =>
                sum +
                ((Number(o.total) || 0) *
                  ((user.commission_rate || 0) / 100)),
              0
            );
        }
      }

      userSummary.push({
        "Full Name": user.full_name || "",
        "SB ID": user.sb_user_id || "",
        "Email": user.email || "",
        "Mobile": user.mobile || "",
        "Demat ID": user.demat_id || "",
        "Joined Date": new Date(user.created_at).toLocaleDateString("en-IN"),
        "Account Status": user.account_status || "Active",
        "Commission Rate (%)": user.commission_rate || 0.25,
        "Total Orders": user.orderCount || 0,
        "Portfolio Value (₹)": user.totalPortfolioValue || 0,
        "Total Referrals": referrals?.length || 0,
        "Referral Orders Count": referralOrders,
        "Referral Commission Earned (₹)": referralAmount.toFixed(2),
        "KYC Status": user.kycStatus || "Not Uploaded",
        "Bank Name": user.bankAccount?.bank_name || "",
        "Account Number": user.bankAccount?.account_number || "",
        "IFSC": user.bankAccount?.ifsc_code || "",
      });
    }

    const ws = XLSX.utils.json_to_sheet(userSummary);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users Summary");
    XLSX.writeFile(
      wb,
      `ShareBazaar_Users_Summary_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const downloadOrderReport = async () => {
    const { data: orders, error } = await supabase
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
        user_id,
        profiles (
          id,
          full_name,
          sb_user_id
        )
      `);

    if (error) {
      console.error(error);
      return;
    }

    const { data: referrals } = await supabase
      .from("referrals")
      .select("referrer_sb_user_id, referred_sb_user_id");

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, sb_user_id");

    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.id] = p;
    });

    const referralMap = {};
    referrals.forEach((r) => {
      referralMap[r.referred_sb_user_id] = r;
    });

    let allOrders = [];

    orders?.forEach((order) => {
      const user = profileMap[order.user_id];
      const referral = referralMap[order.user_id];
      const referrer = referral
        ? profileMap[referral.referrer_sb_user_id]
        : null;

      allOrders.push({
        "Company Name": order.asset_name,
        "User Name": user?.full_name || "-",
        "User SB ID": user?.sb_user_id || "-",
        "Referrer Name": referrer?.full_name || "-",
        "Referrer SB ID": referrer?.sb_user_id || "-",
        "Quantity": order.quantity || 0,
        "Price (₹)": order.price || 0,
        "Total (₹)": order.total || 0,
        "Status": order.status,
        "Order Type": order.order_type,
        "Order Date": new Date(order.created_at).toLocaleDateString("en-IN"),
      });
    });

    const ws = XLSX.utils.json_to_sheet(allOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Orders");
    XLSX.writeFile(
      wb,
      `All_Orders_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const updateCommissionRate = async (userId, newRatePercent) => {
    const cleanPercent = Number(newRatePercent);
    if (isNaN(cleanPercent)) return;

    const { data, error } = await supabase
      .from("profiles")
      .update({ commission_rate: cleanPercent })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Update failed:", error);
      return;
    }

    if (data && data.length > 0) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, commission_rate: data[0].commission_rate }
            : u
        )
      );
    }
  };

  const verifyOrder = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "CONFIRMED" })
      .eq("id", orderId);

    if (error) {
      console.error("Failed to verify order:", error);
      alert(`Failed to update order: ${error.message}`);
      return;
    }

    // Update main modal orders
    setMainUserOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "CONFIRMED" }
          : order
      )
    );

    // Update referred orders modal
    setReferredOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "CONFIRMED" }
          : order
      )
    );

    // Update referred cards cache
    setReferredOrdersMap((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((userId) => {
        updated[userId] = updated[userId].map((order) =>
          order.id === orderId
            ? { ...order, status: "CONFIRMED" }
            : order
        );
      });

      return updated;
    });

    alert("Order verified successfully as CONFIRMED!");
  };

  const openReferredModal = async (referred, referrer) => {
    setSelectedReferred({ ...referred, referrer });
    setModalLoading(true);
    setReferredOrders([]);

    try {
      const userId = referred.referred_sb_user_id;
      if (!userId && referred.referred_email) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .ilike("email", referred.referred_email.trim())
          .maybeSingle();
        if (profile?.id) {
          const { data, error } = await supabase
            .from("orders")
            .select("id, asset_name, price, quantity, total, order_type, status, commission_amount, created_at")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false });
          if (error) throw error;
          setReferredOrders(data || []);
        }
      } else if (userId) {
        const { data, error } = await supabase
          .from("orders")
          .select("id, asset_name, price, quantity, total, order_type, status, commission_amount, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setReferredOrders(data || []);
      }
    } catch (err) {
      console.error("❌ ERROR:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const openMainUserOrders = async (user) => {
    setSelectedMainUser(user);
    setMainModalLoading(true);
    setMainUserOrders([]);
    setMainCurrentPage(1);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, asset_name, price, quantity, total, order_type, status, commission_amount, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMainUserOrders(data || []);
    } catch (err) {
      console.error("Error fetching main user orders:", err);
    } finally {
      setMainModalLoading(false);
    }
  };

  const closeReferredModal = () => {
    setSelectedReferred(null);
    setReferredOrders([]);
    setCurrentPage(1);
  };

  const closeMainModal = () => {
    setSelectedMainUser(null);
    setMainUserOrders([]);
    setMainCurrentPage(1);
  };

  const referredTotalPages = Math.ceil(referredOrders.length / itemsPerPage);
  const referredPaginated = referredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const mainTotalPages = Math.ceil(mainUserOrders.length / itemsPerPage);
  const mainPaginated = mainUserOrders.slice(
    (mainCurrentPage - 1) * itemsPerPage,
    mainCurrentPage * itemsPerPage
  );

  // ================= FILTERED USERS =================
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Text search across name / email / sb_user_id / mobile
      if (userSearch.trim()) {
        const q = userSearch.trim().toLowerCase();
        const haystack = [
          user.full_name,
          user.email,
          user.sb_user_id,
          user.mobile,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase())
          .join(" ");

        if (!haystack.includes(q)) return false;
      }

      // KYC filter
      if (kycFilter !== "All") {
        if ((user.kycStatus || "Not Uploaded") !== kycFilter) return false;
      }

      // Account status filter
      if (statusFilter !== "All") {
        const status = (user.account_status || "active").toLowerCase();
        if (status !== statusFilter.toLowerCase()) return false;
      }

      return true;
    });
  }, [users, userSearch, kycFilter, statusFilter]);

  const hasActiveFilters =
    userSearch.trim() !== "" || kycFilter !== "All" || statusFilter !== "All";

  const clearFilters = () => {
    setUserSearch("");
    setKycFilter("All");
    setStatusFilter("All");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-5">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
          <p className="text-lg font-medium text-gray-700">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="md:ml-64 transition-all duration-300">
        <header className="sticky top-0 z-10 bg-white border-gray-200 px-4 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto">
            {/* Mobile Header */}
            <div className="flex items-center justify-between md:hidden">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="p-2.5 rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <Menu size={22} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold leading-tight text-gray-900">Users</h1>
                  <p className="text-xs text-gray-500">Registered users</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchUsers}
                  className="p-2.5 rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <RefreshCw size={18} />
                </button>
                <button
                  onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                  className="p-2.5 rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Users Overview</h1>
                <p className="text-sm text-gray-600 mt-1">
                  All registered users • Orders • Portfolio • Referrals • KYC
                </p>
              </div>
              <div className="flex items-center gap-3 relative">
                <button
                  onClick={fetchUsers}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 shadow-sm"
                >
                  <RefreshCw size={17} />
                  Refresh
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 shadow-sm"
                  >
                    <Download size={17} />
                    Download Report
                    <ChevronDown size={16} />
                  </button>

                  {showDownloadDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <button
                        onClick={() => {
                          downloadUserReport();
                          setShowDownloadDropdown(false);
                        }}
                        className="w-full text-left px-6 py-3 hover:bg-gray-50 text-sm"
                      >
                        User Summary Report
                      </button>
                      <button
                        onClick={() => {
                          downloadOrderReport();
                          setShowDownloadDropdown(false);
                        }}
                        className="w-full text-left px-6 py-3 hover:bg-gray-50 text-sm"
                      >
                        All Orders Report
                      </button>
                    </div>
                  )}
                </div>

                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {error && (
            <div className="mb-10 p-6 bg-red-50 border border-red-200 rounded-3xl flex items-center gap-4">
              <AlertCircle size={26} className="text-red-600 flex-shrink-0" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          )}

          {/* ================= FILTER BAR ================= */}
          {users.length > 0 && (
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
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, email, SB ID or mobile…"
                    className="w-full h-12 pl-11 pr-10 rounded-2xl border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {userSearch && (
                    <button
                      onClick={() => setUserSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100"
                      aria-label="Clear search"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  )}
                </div>

                {/* KYC filter */}
                <div className="relative w-full lg:w-[190px]">
                  <select
                    value={kycFilter}
                    onChange={(e) => setKycFilter(e.target.value)}
                    className="w-full h-12 rounded-2xl border border-gray-300 bg-white px-5 pr-12 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none"
                  >
                    <option value="All">All KYC</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="Not Uploaded">Not Uploaded</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>

                {/* Status filter */}
                <div className="relative w-full lg:w-[180px]">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-12 rounded-2xl border border-gray-300 bg-white px-5 pr-12 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Suspended">Suspended</option>
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
                Showing <span className="font-semibold text-gray-700">{filteredUsers.length}</span> of{" "}
                <span className="font-semibold text-gray-700">{users.length}</span> users
              </div>
            </div>
          )}

          {users.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-20 text-center">
              <Users className="mx-auto text-emerald-600" size={56} />
              <h3 className="text-2xl font-semibold text-gray-800 mt-8">No Users Found</h3>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-20 text-center">
              <Search className="mx-auto text-gray-400" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mt-6">No users match your filters</h3>
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your search or clearing filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                <X size={16} />
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm bg-white">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 px-4 py-5"></th>
                    <th className="px-4 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                    <th className="px-4 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Email</th>
                    <th className="px-4 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                    <th className="px-4 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Portfolio</th>
                    <th className="px-4 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Referrals</th>
                    <th className="px-4 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">KYC</th>
                    <th className="px-4 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Comm %</th>
                    <th className="w-12 px-4 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <Fragment key={user.id}>
                      <tr
                        className="hover:bg-emerald-50/60 transition-colors cursor-pointer group"
                        onClick={() => toggleExpand(user.id)}
                      >
                        <td className="px-4 py-5">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-semibold text-lg shadow-sm group-hover:scale-105 transition-transform">
                            {user.full_name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">{user.full_name || "Unknown"}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">{user.sb_user_id || "—"}</div>
                        </td>
                        <td className="px-4 py-5 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell truncate max-w-[200px]">
                          {user.email || "—"}
                        </td>
                        <td className="px-4 py-5 text-center font-medium text-gray-900 text-sm">{user.orderCount || 0}</td>
                        <td className="px-4 py-5 text-center font-medium text-emerald-700 text-sm">
                          ₹{(user.totalPortfolioValue || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-5 text-center font-semibold text-gray-900 text-sm">{user.referralCount}</td>
                        <td className="px-4 py-5 text-center">
                          <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${user.kycStatus === "Verified" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : user.kycStatus === "Pending" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                            {user.kycStatus}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${user.account_status === "active" ? "bg-green-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {user.account_status ? user.account_status.toUpperCase() : "ACTIVE"}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={
                                editingRates[user.id] !== undefined
                                  ? editingRates[user.id]
                                  : user.commission_rate
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditingRates((prev) => ({
                                  ...prev,
                                  [user.id]: val,
                                }));
                              }}
                              onBlur={async (e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) {
                                  await updateCommissionRate(user.id, val);
                                }
                                setEditingRates((prev) => {
                                  const copy = { ...prev };
                                  delete copy[user.id];
                                  return copy;
                                });
                              }}
                            />
                            <span className="text-xs text-gray-500 font-medium">%</span>
                          </div>
                        </td>
                        <td className="px-4 py-5 text-center"></td>
                      </tr>

                      {expandedUserId === user.id && (
                        <tr>
                          <td colSpan={10} className="p-0 bg-gray-50">
                            <div className="px-3 py-4 md:px-6 md:py-8">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-5 mb-6">
                                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm h-full">
                                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 md:mb-4">
                                    <Clock size={18} className="text-gray-500" />
                                    Account Details
                                  </h4>
                                  <div className="space-y-1.5 md:space-y-2.5 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Joined</span>
                                      <span className="font-medium">
                                        {new Date(user.created_at).toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div 
                                  className="bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm h-full cursor-pointer hover:bg-emerald-50 transition-colors"
                                  onClick={() => openMainUserOrders(user)}
                                >
                                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 md:mb-4">
                                    <Package size={18} className="text-gray-500" />
                                    Activity
                                  </h4>
                                  <div className="space-y-1.5 md:space-y-2.5 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Orders</span>
                                      <span className="font-medium text-emerald-600 underline">{user.orderCount || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Portfolio</span>
                                      <span className="font-medium text-emerald-700">
                                        ₹{(user.totalPortfolioValue || 0).toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
                                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 md:mb-4">
                                    <Users size={18} className="text-gray-500" />
                                    Referrals
                                  </h4>
                                  <div className="mt-auto">
                                    <div className="text-3xl md:text-5xl font-semibold text-emerald-700 tracking-tighter">{user.referralCount}</div>
                                    <p className="text-sm text-gray-500 mt-1">Total referred users</p>
                                  </div>
                                </div>

                                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm h-full">
                                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 md:mb-4">
                                    <ShieldCheck size={18} className="text-gray-500" />
                                    KYC Status
                                  </h4>
                                  <span className={`inline-flex px-5 py-2 rounded-2xl text-sm font-semibold ${user.kycStatus === "Verified" ? "bg-emerald-100 text-emerald-700" : user.kycStatus === "Pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                                    {user.kycStatus}
                                  </span>
                                </div>

                                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm h-full">
                                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 md:mb-4">
                                    <CreditCard size={18} className="text-gray-500" />
                                    Bank Account
                                  </h4>
                                  {user.bankAccount && user.bankAccount.bank_name ? (
                                    <div className="space-y-1.5 md:space-y-2.5 text-sm">
                                      <div>
                                        <span className="text-gray-500 text-xs block">Bank Name</span>
                                        <p className="font-medium text-gray-800 mt-1">{user.bankAccount.bank_name}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-500 text-xs block">Account No.</span>
                                        <p className="font-medium font-mono text-gray-800 mt-1 break-all">{user.bankAccount.account_number || "—"}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-500 text-xs block">IFSC</span>
                                        <p className="font-medium font-mono text-gray-800 mt-1">{user.bankAccount.ifsc_code || "—"}</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-500 text-xs block">Holder</span>
                                        <p className="font-medium text-gray-800 mt-1">{user.bankAccount.account_holder_name}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 italic py-1">No bank account details added yet.</p>
                                  )}
                                </div>
                              </div>

                              {/* Referred Users Section */}
                              <div>
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-6">
                                  <Users size={18} />
                                  Referred Users ({user.referredUsers.length})
                                </h4>

                                {user.referredUsers.length === 0 ? (
                                  <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center">
                                    <p className="text-gray-500">This user has not referred anyone yet.</p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {user.referredUsers.map((ref, index) => {
                                      const orders = referredOrdersMap[ref.referred_sb_user_id] || [];

                                      const eligibleOrders = orders.filter(
                                        (o) =>
                                          (o.status === "CONFIRMED" ||
                                            o.status === "SETTLED") &&
                                          o.order_type === "BUY"
                                      );

                                      const commission = eligibleOrders.reduce(
                                        (sum, o) =>
                                          sum +
                                          ((Number(o.total) || 0) *
                                            ((user.commission_rate || 0) / 100)),
                                        0
                                      );

                                      const latestStatus = orders.length > 0 ? orders[0].status : "PENDING";

                                      return (
                                        <div
                                          key={`${user.id}-ref-${index}`}
                                          onClick={() => openReferredModal(ref, user)}
                                          className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                                        >
                                          <div className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                                            {ref.referred_name || "Unnamed User"}
                                          </div>
                                          <div className="text-sm text-gray-600 mt-3">
                                            SB ID: {ref.profiles?.sb_user_id ||
                                              ref.referred_sb_user_id ||
                                              "Not Registered"}
                                          </div>
                                          {ref.referred_email && (
                                            <div className="text-xs text-gray-500 mt-2 truncate">
                                              {ref.referred_email}
                                            </div>
                                          )}
                                          <div className="mt-6 flex items-center justify-between text-xs">
                                            <span className="text-emerald-600 font-medium">
                                              ₹{commission.toFixed(2)}
                                            </span>
                                            <span
                                              className={`px-3 py-1 rounded-2xl font-medium ${
                                                latestStatus === "CONFIRMED"
                                                  ? "bg-emerald-100 text-emerald-700"
                                                  : latestStatus === "PENDING"
                                                  ? "bg-amber-100 text-amber-700"
                                                  : "bg-gray-100 text-gray-700"
                                              }`}
                                            >
                                              {latestStatus}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Main User Orders Modal */}
      {selectedMainUser && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/70 px-4 pt-24 pb-8 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[70vh] flex flex-col mx-auto">
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{selectedMainUser.full_name}'s Orders</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedMainUser.email}</p>
              </div>
              <button onClick={closeMainModal} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 sm:p-8">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-lg font-semibold text-gray-800">All Orders</h4>
                <span className="text-sm text-gray-500">
                  {mainUserOrders.length} orders • Page {mainCurrentPage} of {mainTotalPages || 1}
                </span>
              </div>

              {mainModalLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : mainUserOrders.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 rounded-3xl py-12 text-center">
                  <p className="text-gray-500">No orders found for this user.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-3xl border border-gray-100 max-h-[32vh] overflow-y-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-4 text-left font-medium text-gray-600 w-40">Asset</th>
                          <th className="px-4 py-4 text-right font-medium text-gray-600">Price</th>
                          <th className="px-4 py-4 text-right font-medium text-gray-600 w-16">Qty</th>
                          <th className="px-4 py-4 text-center font-medium text-gray-600 w-20">Type</th>
                          <th className="px-4 py-4 text-center font-medium text-gray-600 w-24">Status</th>
                          <th className="px-4 py-4 text-right font-medium text-gray-600 w-28">Date</th>
                          <th className="px-4 py-4 text-center font-medium text-gray-600 w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {mainPaginated.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 font-medium text-gray-900 truncate max-w-[160px]" title={order.asset_name}>
                              {order.asset_name}
                            </td>
                            <td className="px-4 py-4 text-right font-medium">₹{order.price?.toLocaleString("en-IN") || 0}</td>
                            <td className="px-4 py-4 text-right font-medium">{order.quantity}</td>
                            <td className="px-4 py-4 text-center">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-2xl ${order.order_type === "BUY" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {order.order_type}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-2xl 
                                ${order.status === "PENDING" ? " text-yellow-500" : 
                                  order.status === "CONFIRMED" ? " text-green-700" : 
                                  " text-red-600"}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right text-xs text-gray-500 whitespace-nowrap">
                              {new Date(order.created_at).toLocaleDateString("en-IN")}
                            </td>
                            <td className="px-4 py-4 text-center">
                              {order.status === "PENDING" ? (
                                <button
                                  onClick={() => verifyOrder(order.id)}
                                  className="px-5 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-2xl transition-colors"
                                >
                                  Verify
                                </button>
                              ) : order.status === "CONFIRMED" ? (
                                <span className="px-5 py-1.5 bg-gray-600 text-xs text-white font-medium rounded-2xl">
                                  Verified
                                </span>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {mainTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <button onClick={() => setMainCurrentPage(p => Math.max(p-1,1))} disabled={mainCurrentPage===1} className="p-3 rounded-2xl hover:bg-gray-100 disabled:opacity-50">
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-sm font-medium text-gray-700">Page {mainCurrentPage} of {mainTotalPages}</span>
                      <button onClick={() => setMainCurrentPage(p => Math.min(p+1, mainTotalPages))} disabled={mainCurrentPage===mainTotalPages} className="p-3 rounded-2xl hover:bg-gray-100 disabled:opacity-50">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="px-6 sm:px-8 py-5 flex justify-end">
              <button onClick={closeMainModal} className="px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Referred User Modal */}
      {selectedReferred && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/70 px-4 pt-24 pb-8 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[70vh] flex flex-col mx-auto">
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{selectedReferred.referred_name}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedReferred.referred_email}</p>
              </div>
              <button onClick={closeReferredModal} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 bg-emerald-50 border border-emerald-100 rounded-3xl p-6 h-fit sticky top-0">
                  <h4 className="flex items-center gap-2 text-emerald-700 font-semibold mb-5">
                    <TrendingUp size={20} />
                    Referral Commission
                  </h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Commission Earned</span>
                      <span className="text-md font-semibold text-emerald-700">
                        ₹{referredOrders
                          .filter(
                            (o) =>
                              (o.status === "CONFIRMED" ||
                               o.status === "SETTLED") &&
                              o.order_type === "BUY"
                          )
                          .reduce(
                            (sum, o) =>
                              sum +
                              ((Number(o.total) || 0) *
                              ((selectedReferred?.referrer?.commission_rate || 0) / 100)),
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Referral Date</span>
                      <span className="font-medium">
                        {selectedReferred.created_at ? new Date(selectedReferred.created_at).toLocaleDateString("en-IN") : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <FileText size={20} />
                      Orders Placed by {selectedReferred.referred_name}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {referredOrders.length} orders • Page {currentPage} of {referredTotalPages || 1}
                    </span>
                  </div>

                  {modalLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                  ) : referredOrders.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-3xl py-12 text-center">
                      <p className="text-gray-500">No orders placed yet by this referred user.</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto rounded-3xl border border-gray-100 max-h-[28vh] overflow-y-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th className="px-4 py-4 text-left font-medium text-gray-600 w-40">Asset</th>
                              <th className="px-4 py-4 text-right font-medium text-gray-600">Price</th>
                              <th className="px-4 py-4 text-right font-medium text-gray-600 w-16">Qty</th>
                              <th className="px-4 py-4 text-center font-medium text-gray-600 w-20">Type</th>
                              <th className="px-4 py-4 text-center font-medium text-gray-600 w-24">Status</th>
                              <th className="px-4 py-4 text-right font-medium text-gray-600 w-28">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {referredPaginated.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 font-medium text-gray-900 truncate max-w-[160px]" title={order.asset_name}>
                                  {order.asset_name}
                                </td>
                                <td className="px-4 py-4 text-right font-medium">₹{order.price?.toLocaleString("en-IN") || 0}</td>
                                <td className="px-4 py-4 text-right font-medium">{order.quantity}</td>
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
                                <td className="px-4 py-4 text-right text-xs text-gray-500 whitespace-nowrap">
                                  {new Date(order.created_at).toLocaleDateString("en-IN")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {referredTotalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-6">
                          <button onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage===1} className="p-3 rounded-2xl hover:bg-gray-100 disabled:opacity-50">
                            <ChevronLeft size={20} />
                          </button>
                          <span className="text-sm font-medium text-gray-700">Page {currentPage} of {referredTotalPages}</span>
                          <button onClick={() => setCurrentPage(p => Math.min(p+1, referredTotalPages))} disabled={currentPage===referredTotalPages} className="p-3 rounded-2xl hover:bg-gray-100 disabled:opacity-50">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 flex justify-end">
              <button onClick={closeReferredModal} className="px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersClient;