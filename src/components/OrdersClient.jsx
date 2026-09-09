// src/components/OrdersClient.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IndianRupee, Search, Plus, Minus, Menu } from "lucide-react";
import { fetchPreIPODetails } from "@/api/mockApi";
import Sidebar from "./Sidebar";
import UserProfileDropdown from "./UserProfileDropdown";

const OrdersClient = ({ user, initialOrders }) => {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState("buy");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [quantity, setQuantity] = useState(null);
  const total = (quantity || 0) * (pricePerUnit || 0);
  const [preIpos, setPreIpos] = useState([]);
  const [dbCompanies, setDbCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [orders, setOrders] = useState(initialOrders || []);
  const [ordersLoading, setOrdersLoading] = useState(!initialOrders || initialOrders.length === 0);

  // Load Pre-IPO list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const preIpoData = await fetchPreIPODetails();

        const { data: dbData, error } = await supabase
          .from("pre_ipo_companies")
          .select("name, price, lot_size");

        if (error) {
          console.error("Supabase fetch error:", error);
        }

        const normalize = (str = "") =>
          str
            .toLowerCase()
            .replace(/limited|ltd|llp|private|unlisted|shares?|share/gi, "")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const dbMap = {};

        dbData?.forEach((item) => {
          dbMap[normalize(item.name)] = item;
        });

        const merged = preIpoData.map((item) => {
          const key = normalize(item.name);

          let dbItem = dbMap[key];

          if (!dbItem) {
            const bestMatch = Object.keys(dbMap).find(
              (dbKey) =>
                dbKey.includes(key) ||
                key.includes(dbKey)
            );

            if (bestMatch) {
              dbItem = dbMap[bestMatch];
            }
          }

          return {
            ...item,
            price:
              dbItem?.price != null
                ? Number(dbItem.price)
                : Number(
                    String(
                      item.shareDetails?.indicativeUnlistedSharePrice ||
                      item.price ||
                      0
                    )
                      .replace(/[^\d.-]/g, "")
                      .split("-")[0]
                  ),
            lot_size:
              dbItem?.lot_size != null
                ? Number(
                    String(dbItem.lot_size).replace(/[^\d]/g, "")
                  )
                : Number(
                    String(
                      item.shareDetails?.lotSize ||
                      item.lot_size ||
                      item.lotSize ||
                      0
                    ).replace(/[^\d]/g, "")
                  ),
          };
        });

        setPreIpos(Array.isArray(merged) ? merged : []);
        setDbCompanies(dbData || []);
      } catch (err) {
        console.error("Failed to load Pre-IPOs:", err);
        setPreIpos([]);
      }
    };

    fetchData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Refresh orders (e.g., after submit)
  const refreshOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Refresh orders error:", error);
    } else {
      setOrders(data || []);
    }
    setOrdersLoading(false);
  };

  // If initialOrders weren't provided, fetch them
  useEffect(() => {
    if (!initialOrders || initialOrders.length === 0) {
      refreshOrders();
    }
  }, []);

  const filteredCompanies = preIpos.filter((item) =>
    item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item?.isin ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompanySelect = (company) => {
    setSelectedCompany(company.name || "Unknown");
    const parsedPrice = Number(company.price || 0);
    setPricePerUnit(parsedPrice);
    const parsedLot = Number(
      String(
        company.lot_size ||
        company.shareDetails?.lotSize ||
        company.lotSize ||
        5
      ).replace(/[^\d]/g, "")
    );
    setQuantity(parsedLot || 5);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const adjustQuantity = (delta) => {
    const selected = preIpos.find(
      (item) => item.name === selectedCompany
    );
    const minLot = Number(selected?.lot_size) || 5;
    const currentQty = Number(quantity) || minLot;
    const newQty = Math.max(minLot, currentQty + delta * 5);
    setQuantity(newQty);
  };

  const handleSubmit = async () => {
    if (!selectedCompany) {
      alert("Please select a company");
      return;
    }
    const selected = preIpos.find(
      (item) => item.name === selectedCompany
    );
    const minLot = Number(selected?.lot_size) || 5;
    if (quantity < minLot) {
      alert(`Minimum quantity required is ${minLot}`);
      return;
    }

    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      order_type: activeTab === "buy" ? "BUY" : "SELL",
      asset_name: selectedCompany,
      quantity,
      price: pricePerUnit,
      total: pricePerUnit * quantity,
      status: "PENDING",
    });

    if (error) {
      console.error("Order insert error:", error);
      alert("Failed to submit order: " + (error.message || "Unknown error"));
      return;
    }

    await refreshOrders();
    setQuantity(0);
    setSelectedCompany("");
    setPricePerUnit(0);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />
      <main className="md:ml-64 transition-all">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between md:hidden">
              <button onClick={() => setMobileSidebarOpen(true)} className="p-2">
                <Menu size={24} />
              </button>
              <div className="flex-1 text-center px-2">
                <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
                <p className="text-xs text-gray-500 mt-1">Buy & Sell Pre-IPO Shares</p>
              </div>
              <div className="flex items-center justify-end min-w-[40px]">
                <UserProfileDropdown />
              </div>
            </div>

            <div className="hidden md:flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders & Buy/Sell</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your Pre-IPO buy & sell requests</p>
              </div>
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 xl:gap-8">
          {/* LEFT - Buy/Sell form */}
          <section
            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full lg:w-1/2 max-w-2xl flex flex-col"
            style={{ maxHeight: "85vh" }}
          >
            <div className="p-5 md:p-6 bg-gray-50 shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2.5">
                <IndianRupee className="text-green-600" size={22} />
                {activeTab === "buy" ? "Buy Interest" : "Sell Interest"}
              </h2>
            </div>

            <div className="p-5 md:p-6 space-y-6 overflow-y-auto flex-1">
              {/* Tabs */}
              <div className="flex shrink-0">
                <button
                  onClick={() => setActiveTab("buy")}
                  className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                    activeTab === "buy"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setActiveTab("sell")}
                  className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                    activeTab === "sell"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Company Search */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Company (Name or ISIN)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery || selectedCompany}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value) setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search company name or ISIN..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition"
                  />
                  <Search
                    className="absolute right-4 top-1/3 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>

                {showDropdown && (
                  <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map((company) => (
                        <div
                          key={company.name}
                          onClick={() => handleCompanySelect(company)}
                          className="px-5 py-3.5 hover:bg-gray-50 cursor-pointer text-sm flex justify-between items-center transition"
                        >
                          <span className="font-medium text-gray-900">{company.name}</span>
                          <span className="text-xs text-gray-500 font-mono">
                            {company.isin || "—"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-4 text-sm text-gray-500 italic">
                        No matching Pre-IPO companies found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity + Price */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  {(() => {
                    const selected = preIpos.find(
                      (item) => item.name === selectedCompany
                    );
                    const minLot = Number(selected?.lot_size) || 5;
                    return (
                      <>
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                          Minimum Lot Size is{" "}
                          <span className="font-bold text-green-700">
                            {minLot.toLocaleString("en-IN")}
                          </span>
                        </label>
                        <div
                          className="flex items-center border border-gray-300 rounded-lg overflow-hidden"
                          title={`Minimum quantity allowed is ${minLot}`}
                        >
                          <button
                            onClick={() => adjustQuantity(-1)}
                            className="px-3 py-3 bg-gray-100 hover:bg-gray-200 transition"
                            disabled={(quantity || 0) <= minLot}
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={quantity ?? ""}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "");
                              value = value.replace(/^0+/, "");
                              if (value === "") {
                                setQuantity("");
                                return;
                              }
                              const numericValue = Number(value);
                              setQuantity(numericValue);
                            }}
                            className={`w-full text-center py-3 font-semibold text-base focus:outline-none appearance-none ${
                              Number(quantity || 0) < minLot
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}
                            style={{ MozAppearance: "textfield" }}
                          />
                          <button
                            onClick={() => adjustQuantity(1)}
                            className="px-3 py-3 bg-gray-100 hover:bg-gray-200 transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        {Number(quantity || 0) < minLot && (
                          <p className="text-xs text-red-600 mt-2">
                            Quantity must be at least {minLot.toLocaleString("en-IN")}
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Price/Unit
                  </label>
                  <div className="text-xl font-bold text-gray-900 flex items-center h-[46px]">
                    ₹{pricePerUnit.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Total + Submit */}
              <div className="pt-6 space-y-5 sticky bottom-0 bg-white pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-gray-700">Total Amount</span>
                  <span className="text-2xl font-bold text-green-700">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                {(() => {
                  const selected = preIpos.find(
                    (item) => item.name === selectedCompany
                  );
                  const minLot = Number(selected?.lot_size) || 5;
                  const qty = Number(quantity || 0);
                  const isBelowLot = qty < minLot;
                  return (
                    <button
                      onClick={handleSubmit}
                      disabled={isBelowLot}
                      title={isBelowLot ? `Minimum quantity must be in multiples of ${minLot}` : ""}
                      className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all shadow-md ${
                        isBelowLot
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#16A34A] hover:bg-[#15803D] hover:shadow-lg active:scale-[0.98]"
                      }`}
                    >
                      {activeTab === "buy" ? "Submit Buy Request" : "Submit Sell Request"}
                    </button>
                  );
                })()}

                <p className="text-xs text-gray-500 text-center">
                  Indicative prices • Final confirmation required
                </p>
              </div>
            </div>
          </section>

          {/* Order History */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 w-full lg:w-1/2 flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2.5 shrink-0">
              <IndianRupee className="text-green-600" size={22} />
              Order History
            </h2>

            {ordersLoading ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
                    <IndianRupee className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">No orders yet</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Your Pre-IPO buy/sell requests will appear here once submitted.
                  </p>
                  <button
                    onClick={() => router.push("/ipo")}
                    className="bg-[#16A34A] text-white px-8 py-4 rounded-xl hover:bg-[#15803D] transition font-medium shadow-md hover:shadow-lg"
                  >
                    Explore Pre-IPOs
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto flex-1">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 text-left">
                      <th className="py-4 px-4 font-medium">Type</th>
                      <th className="py-4 px-4 font-medium">Company</th>
                      <th className="py-4 px-4 font-medium text-right">Qty</th>
                      <th className="py-4 px-4 font-medium text-right">Price</th>
                      <th className="py-4 px-4 font-medium text-right">Total</th>
                      <th className="py-4 px-4 font-medium">Status</th>
                      <th className="py-4 px-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 6).map((order) => (
                      <tr key={order.id} className="last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.order_type === "BUY"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.order_type === "BUY" ? "Buy" : "Sell"}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium max-w-[180px] truncate" title={order.asset_name}>
                          {order.asset_name?.length > 28
                            ? order.asset_name.substring(0, 25) + "..."
                            : order.asset_name || "—"}
                        </td>
                        <td className="py-3 px-4 text-right">{order.quantity}</td>
                        <td className="py-3 px-4 text-right">
                          ₹{order.price?.toLocaleString("en-IN") || "—"}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          ₹{order.total?.toLocaleString("en-IN") || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "SETTLED"
                                ? "bg-green-100 text-green-700"
                                : order.status === "PROCESSING"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status || "PENDING"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-xs">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString("en-IN")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {orders.length > 6 && (
                  <div className="text-center py-4 text-sm text-gray-500">
                    Showing latest 6 of {orders.length} orders
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default OrdersClient;