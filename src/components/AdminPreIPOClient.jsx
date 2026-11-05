// src/components/AdminPreIPOClient.jsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import { Loader2, Search, Menu, RefreshCw } from "lucide-react";

const AdminPreIPOClient = () => {
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editingLotId, setEditingLotId] = useState(null);
  const [editLot, setEditLot] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ which company's listing status is currently being updated
  const [updatingListingId, setUpdatingListingId] = useState(null);

  // Fetch companies
  const fetchCompanies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pre_ipo_companies")
      .select("*")
      .order("name", { ascending: true });

    if (error) console.error(error);
    else {
      setCompanies(data || []);
      setFiltered(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Live Search
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(companies);
    } else {
      const term = search.toLowerCase();
      setFiltered(companies.filter((c) => c.name.toLowerCase().includes(term)));
    }
  }, [search, companies]);

  // Double Click to Edit Price
  const handleDoubleClick = (company) => {
    setEditingId(company.id);
    setEditPrice(company.price.toString());
  };

  // Double Click to Edit Lot Size
  const handleLotDoubleClick = (company) => {
    setEditingLotId(company.id);
    setEditLot(company.lot_size?.toString() || "");
  };

  // Save Price
  const savePrice = async (id) => {
    if (!editPrice || isNaN(editPrice)) {
      setEditingId(null);
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("pre_ipo_companies")
      .update({
        price: parseFloat(editPrice),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) alert("Failed to update price");
    else {
      setEditingId(null);
      fetchCompanies();
    }
    setSaving(false);
  };

  // Save Lot Size
  const saveLot = async (id) => {
    if (!editLot || isNaN(editLot)) {
      setEditingLotId(null);
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("pre_ipo_companies")
      .update({
        lot_size: parseInt(editLot),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update lot size");
    } else {
      setEditingLotId(null);
      fetchCompanies();
    }

    setSaving(false);
  };

  // ✅ one-click listing status toggle
  const toggleListingStatus = async (company) => {
    const isCurrentlyListed = company.listing_status === "listed";
    const nextStatus = isCurrentlyListed ? "unlisted" : "listed";

    const confirmed = window.confirm(
      isCurrentlyListed
        ? `Mark "${company.name}" as UNLISTED?\n\nThe public page will stop showing the listed announcement.`
        : `Mark "${company.name}" as LISTED?\n\nThe public page will show it as a publicly listed company.`
    );

    if (!confirmed) return;

    setUpdatingListingId(company.id);

    const { error } = await supabase
      .from("pre_ipo_companies")
      .update({
        listing_status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", company.id);

    if (error) {
      console.error("Listing status update failed:", error);
      alert("Failed to update listing status. Please try again.");
      setUpdatingListingId(null);
      return;
    }

    // Optimistic local update (avoids a full refetch flicker)
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === company.id ? { ...c, listing_status: nextStatus } : c
      )
    );

    setUpdatingListingId(null);
  };

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
                <h1 className="text-xl font-bold leading-tight text-gray-900">
                  Pre IPO
                </h1>
                <p className="text-xs text-gray-500">Management</p>
              </div>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="sticky top-0 z-10 bg-white backdrop-blur-lg border-gray-200 px-4 sm:px-6 lg:px-8 py-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                Pre IPO Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage prices and lot sizes • Double-click a value to edit
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchCompanies}
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
          {/* Search Bar */}
          <div className="relative mb-8 max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-3xl border border-gray-200 shadow-sm bg-white">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="text-right px-6 py-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Current Price (₹)
                  </th>
                  <th className="text-right px-6 py-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Lot Size
                  </th>
                  {/* ✅ COLUMN HEADER */}
                  <th className="text-center px-6 py-5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Listing Status
                  </th>
                  <th className="w-44 px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <Loader2
                        className="animate-spin mx-auto text-emerald-600"
                        size={36}
                      />
                      <p className="mt-4 text-sm font-medium text-gray-600">
                        Loading companies...
                      </p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-20 text-center text-gray-500"
                    >
                      {search
                        ? "No companies match your search"
                        : "No companies found"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((company) => {
                    const isListed = company.listing_status === "listed";
                    const isUpdating = updatingListingId === company.id;

                    return (
                      <tr
                        key={company.id}
                        className="hover:bg-emerald-50/60 transition-colors"
                      >
                        <td className="px-6 py-5 font-semibold text-gray-900">
                          {company.name}
                        </td>

                        <td className="px-6 py-5 text-right">
                          {editingId === company.id ? (
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              onBlur={() => savePrice(company.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") savePrice(company.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              className="w-32 text-right text-lg font-semibold border border-emerald-500 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                              autoFocus
                            />
                          ) : (
                            <span
                              onDoubleClick={() => handleDoubleClick(company)}
                              className="text-lg font-semibold cursor-pointer hover:text-emerald-700 transition-colors"
                            >
                              ₹{company.price}
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-right">
                          {editingLotId === company.id ? (
                            <input
                              type="number"
                              value={editLot}
                              onChange={(e) => setEditLot(e.target.value)}
                              onBlur={() => saveLot(company.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveLot(company.id);
                                if (e.key === "Escape") setEditingLotId(null);
                              }}
                              className="w-28 text-right text-lg font-semibold border border-blue-500 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              autoFocus
                            />
                          ) : (
                            <span
                              onDoubleClick={() =>
                                handleLotDoubleClick(company)
                              }
                              className="text-lg font-semibold cursor-pointer hover:text-blue-700 transition-colors"
                            >
                              {company.lot_size || "-"}
                            </span>
                          )}
                        </td>

                        {/* ✅ Listing Status badge: Red for Unlisted, Green for Listed */}
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              isListed
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isListed ? "Listed" : "Unlisted"}
                          </span>
                        </td>

                        {/* ✅ One-click toggle action: Blue button */}
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => toggleListingStatus(company)}
                            disabled={isUpdating}
                            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-60 ${
                              isListed
                                ? "bg-white border border-blue-300 text-blue-700 hover:bg-blue-50"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {isUpdating && (
                              <Loader2
                                className="animate-spin"
                                size={14}
                              />
                            )}
                            {isUpdating
                              ? "Updating..."
                              : isListed
                              ? "Mark as Unlisted"
                              : "Mark as Listed"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPreIPOClient;