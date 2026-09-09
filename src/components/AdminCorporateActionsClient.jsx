// src/components/AdminCorporateActionsClient.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import { Save, Plus, Trash2, Loader2, CheckCircle, Edit2, X, RefreshCw, Menu } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parse, format } from "date-fns";

const AdminCorporateActionsClient = () => {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState("buyback");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [existingRecords, setExistingRecords] = useState([]);
  const [editModal, setEditModal] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const parseDate = (value) => {
    if (!value) return null;
    const formats = ["yyyy-MM-dd", "dd/MM/yyyy", "dd-MM-yyyy", "dd-MMM-yyyy", "dd MMM yyyy"];
    for (const f of formats) {
      const parsed = parse(value, f, new Date());
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return null;
  };

  const formatDate = (date) => {
    if (!date) return null;
    return format(date, "yyyy-MM-dd");
  };

  const formatDateOnly = (dateValue) => {
    if (!dateValue) return "";
    try {
      return format(new Date(dateValue), "dd-MM-yyyy");
    } catch {
      return dateValue;
    }
  };

  const [data, setData] = useState({
    buyback: [{ company: "", buyback_price: "", cmp: "", premium: "", record: "", size: "" }],
    dividends: [{ company: "", type: "Final Dividend", percentage: "", dividend_share: "", announcement: "", record: "", ex_date: "", payment_date: "" }],
    rights: [{ company: "", ratio: "", rights_price: "", market_price: "", discount: "", announcement: "", record: "", ex_date: "" }],
    bonus: [{ company: "", ratio: "", announcement: "", record: "", ex_date: "" }],
    splits: [{ company: "", ratio: "", old_fv: "", new_fv: "", announcement: "", record: "", ex_date: "" }],
    other: [{ company: "", action_type: "", key_detail: "", announcement: "", record: "", ex_date: "", status: "Completed" }],
  });

  const tabs = [
    { id: "buyback", label: "Buyback", dbType: "buyback" },
    { id: "dividends", label: "Dividends", dbType: "dividend" },
    { id: "rights", label: "Rights Issue", dbType: "rights" },
    { id: "bonus", label: "Bonus Issue", dbType: "bonus" },
    { id: "splits", label: "Stock Split", dbType: "split" },
    { id: "other", label: "Other Actions", dbType: "other" },
  ];

  const currentTabConfig = tabs.find((t) => t.id === activeTab);
  const currentData = data[activeTab];
  const setCurrentData = (newData) => setData((prev) => ({ ...prev, [activeTab]: newData }));

  const otherActionTypes = [
    "Merger", "Demerger", "Takeover / Acquisition", "Open Offer", "Delisting",
    "OFS", "QIP", "Preferential Allotment", "Warrants Issue", "ESOP Allotment",
    "AGM", "EGM", "Board Meeting", "Postal Ballot", "E-Voting",
    "Promoter Stake Increase", "Promoter Stake Sale", "Pledge Release",
    "FPO", "Bond Issue", "NCD Issue", "Insolvency Resolution", "CIRP Process",
    "Subsidiary Incorporation", "Joint Venture", "Change of Company Name",
    "IPO Listing", "Change in Director", "CEO Appointment", "Auditor Appointment",
    "Regulatory Action", "Trading Suspension", "Revocation of Suspension",
    "Distribution", "Unit Split"
  ];

  const fetchRecords = async () => {
    setFetchLoading(true);
    try {
      const { data: records, error } = await supabase
        .from("corporate_actions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setExistingRecords(records || []);
    } catch (err) {
      console.error("Error fetching records:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const addNewRow = () => {
    let newRow = { company: "" };
    switch (activeTab) {
      case "buyback": newRow = { company: "", buyback_price: "", cmp: "", premium: "", record: "", size: "" }; break;
      case "dividends": newRow = { company: "", type: "Final Dividend", percentage: "", dividend_share: "", announcement: "", record: "", ex_date: "", payment_date: "" }; break;
      case "rights": newRow = { company: "", ratio: "", rights_price: "", market_price: "", discount: "", announcement: "", record: "", ex_date: "" }; break;
      case "bonus": newRow = { company: "", ratio: "", announcement: "", record: "", ex_date: "" }; break;
      case "splits": newRow = { company: "", ratio: "", old_fv: "", new_fv: "", announcement: "", record: "", ex_date: "" }; break;
      case "other": newRow = { company: "", action_type: "", key_detail: "", announcement: "", record: "", ex_date: "", status: "Completed" }; break;
    }
    setCurrentData([...currentData, newRow]);
  };

  const removeRow = (index) => {
    if (currentData.length === 1) return;
    setCurrentData(currentData.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...currentData];
    updated[index][field] = value;
    setCurrentData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validEntries = currentData.filter((item) => item.company?.trim());
    if (validEntries.length === 0) return alert("Please fill at least one company name");

    setSubmitLoading(true);
    try {
      const formattedData = validEntries.map((item) => ({
        action_type: currentTabConfig.dbType,
        company: item.company.trim(),
        type: item.type || null,
        ratio_or_percentage: item.ratio || item.percentage || null,
        dividend_share: item.dividend_share || null,
        rights_price: item.rights_price ? parseFloat(item.rights_price) : null,
        market_price: item.market_price ? parseFloat(item.market_price) : null,
        discount: item.discount || null,
        buyback_price: item.buyback_price ? parseFloat(item.buyback_price) : null,
        cmp: item.cmp ? parseFloat(item.cmp) : null,
        premium: item.premium || null,
        size: item.size || null,
        key_detail: item.key_detail || null,
        action_type_detail: item.action_type || null,
        announcement: item.announcement && item.announcement.trim() ? formatDate(parseDate(item.announcement)) : null,
        record: item.record && item.record.trim() ? formatDate(parseDate(item.record)) : null,
        ex_date: item.ex_date && item.ex_date.trim() ? formatDate(parseDate(item.ex_date)) : null,
        payment_date: item.payment_date?.trim() || null,
      }));

      const { error } = await supabase.from("corporate_actions").insert(formattedData);
      if (error) throw error;

      setSuccess(true);
      fetchRecords();

      let blankRow = { company: "" };
      if (activeTab === "dividends") blankRow = { company: "", type: "Final Dividend", percentage: "", dividend_share: "", announcement: "", record: "", ex_date: "", payment_date: "" };
      if (activeTab === "buyback") blankRow = { company: "", buyback_price: "", cmp: "", premium: "", record: "", size: "" };
      if (activeTab === "rights") blankRow = { company: "", ratio: "", rights_price: "", market_price: "", discount: "", announcement: "", record: "", ex_date: "" };
      if (activeTab === "bonus") blankRow = { company: "", ratio: "", announcement: "", record: "", ex_date: "" };
      if (activeTab === "splits") blankRow = { company: "", ratio: "", old_fv: "", new_fv: "", announcement: "", record: "", ex_date: "" };
      if (activeTab === "other") blankRow = { company: "", action_type: "", key_detail: "", announcement: "", record: "", ex_date: "", status: "Completed" };

      setData((prev) => ({ ...prev, [activeTab]: [blankRow] }));
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this corporate action record?")) return;
    const { error } = await supabase.from("corporate_actions").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchRecords();
  };

  const openEdit = (record) => {
    setEditModal({
      ...record,
      ratio: record.ratio_or_percentage,
      percentage: record.ratio_or_percentage,
      action_type: record.action_type_detail,
      dividend_share: record.dividend_share || "",
      old_fv: record.old_fv || "",
      new_fv: record.new_fv || "",
      announcement: formatDateOnly(record.announcement) || "",
      record: formatDateOnly(record.record) || "",
      ex_date: formatDateOnly(record.ex_date) || "",
      payment_date: record.payment_date || "",
    });
  };

  const handleUpdate = async () => {
    if (!editModal) return;
    const { error } = await supabase
      .from("corporate_actions")
      .update({
        company: editModal.company,
        type: editModal.type || null,
        ratio_or_percentage: activeTab === "dividends" ? editModal.percentage : editModal.ratio || null,
        dividend_share: editModal.dividend_share || null,
        rights_price: editModal.rights_price ? parseFloat(editModal.rights_price) : null,
        market_price: editModal.market_price ? parseFloat(editModal.market_price) : null,
        discount: editModal.discount || null,
        buyback_price: editModal.buyback_price ? parseFloat(editModal.buyback_price) : null,
        cmp: editModal.cmp ? parseFloat(editModal.cmp) : null,
        premium: editModal.premium || null,
        size: editModal.size || null,
        key_detail: editModal.key_detail || null,
        action_type_detail: editModal.action_type || null,
        announcement: editModal.announcement && editModal.announcement.trim() ? formatDate(parseDate(editModal.announcement)) : null,
        record: editModal.record && editModal.record.trim() ? formatDate(parseDate(editModal.record)) : null,
        ex_date: editModal.ex_date && editModal.ex_date.trim() ? formatDate(parseDate(editModal.ex_date)) : null,
        payment_date: editModal.payment_date?.trim() || null,
        status: editModal.status || null,
        old_fv: editModal.old_fv ? parseInt(editModal.old_fv) : null,
        new_fv: editModal.new_fv ? parseInt(editModal.new_fv) : null,
      })
      .eq("id", editModal.id);

    if (error) {
      alert(error.message);
    } else {
      setEditModal(null);
      fetchRecords();
    }
  };

  const updateEditModal = (field, value) => {
    setEditModal((prev) => ({ ...prev, [field]: value }));
  };

  const filteredRecords = existingRecords.filter(
    (record) => record.action_type === currentTabConfig?.dbType
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="flex-1 md:ml-64 min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-10 bg-white border-gray-200 px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="p-2.5 rounded-xl border border-gray-200 bg-white shadow-sm">
                <Menu size={22} />
              </button>
              <div>
                <h1 className="text-xl font-bold leading-tight text-gray-900">Corporate Actions</h1>
                <p className="text-xs text-gray-500">Manager</p>
              </div>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white px-8 py-6 shadow-xs border-b border-gray-200">
          <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Corporate Actions Manager</h1>
              <p className="text-gray-500 text-sm mt-0.5">Maintain splits, dividends, buybacks, rights issues, and general structural announcements</p>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 font-medium text-sm animate-fadeIn">
              <CheckCircle className="text-emerald-600" size={18} /> Database updated successfully!
            </div>
          )}

          <div className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-xl shadow-xs p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-100 text-emerald-700 shadow-xs font-semibold"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-xs p-4 sm:p-6">
            <h2 className="text-lg text-gray-900 mb-4 uppercase tracking-wider">New {currentTabConfig?.label}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full border-collapse min-w-[1400px]">
                  <thead>
                    <tr className="bg-gray-50/70 text-[11px] uppercase tracking-widest text-gray-500 border-b border-gray-200">
                      <th className="px-4 py-3 text-left w-72">Company</th>
                      {activeTab === "dividends" && (
                        <>
                          <th className="px-4 py-3 text-left w-48">Dividend Type</th>
                          <th className="px-4 py-3 text-left w-36">Yield %</th>
                          <th className="px-4 py-3 text-left w-40">Dividend/Share</th>
                        </>
                      )}
                      {activeTab === "rights" && (
                        <>
                          <th className="px-4 py-3 text-left w-36">Ratio</th>
                          <th className="px-4 py-3 text-left w-36">Rights Price</th>
                          <th className="px-4 py-3 text-left w-36">Market Price</th>
                          <th className="px-4 py-3 text-left w-36">Discount</th>
                        </>
                      )}
                      {activeTab === "bonus" && <th className="px-4 py-3 text-left w-36">Bonus Ratio</th>}
                      {activeTab === "splits" && (
                        <>
                          <th className="px-4 py-3 text-left w-36">Split Ratio</th>
                          <th className="px-4 py-3 text-left w-36">Old FV</th>
                          <th className="px-4 py-3 text-left w-36">New FV</th>
                        </>
                      )}
                      {activeTab === "buyback" && (
                        <>
                          <th className="px-4 py-3 text-left w-36">Buyback Price</th>
                          <th className="px-4 py-3 text-left w-36">CMP</th>
                          <th className="px-4 py-3 text-left w-36">Premium %</th>
                          <th className="px-4 py-3 text-left w-44">Size</th>
                        </>
                      )}
                      {activeTab === "other" && (
                        <>
                          <th className="px-4 py-3 text-left w-64">Action Type</th>
                          <th className="px-4 py-3 text-left w-72">Key Detail</th>
                          <th className="px-4 py-3 text-left w-40">Status</th>
                        </>
                      )}
                      <th className="px-4 py-3 text-left w-40">Announcement</th>
                      <th className="px-4 py-3 text-left w-40">Record Date</th>
                      <th className="px-4 py-3 text-left w-40">Ex Date</th>
                      {activeTab === "dividends" && <th className="px-4 py-3 text-left w-44">Payment Date</th>}
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {currentData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            value={row.company || ""}
                            onChange={(e) => handleInputChange(index, "company", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="e.g. Reliance Industries"
                            required
                          />
                        </td>

                        {activeTab === "dividends" && (
                          <>
                            <td className="px-3 py-3">
                              <select
                                value={row.type || ""}
                                onChange={(e) => handleInputChange(index, "type", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              >
                                <option value="Final Dividend">Final Dividend</option>
                                <option value="Interim Dividend">Interim Dividend</option>
                                <option value="Special Dividend">Special Dividend</option>
                              </select>
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={row.percentage || ""}
                                onChange={(e) => handleInputChange(index, "percentage", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="1.40%"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={row.dividend_share || ""}
                                onChange={(e) => handleInputChange(index, "dividend_share", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="₹15.50"
                              />
                            </td>
                          </>
                        )}

                        {activeTab === "rights" && (
                          <>
                            <td className="px-3 py-3"><input type="text" value={row.ratio || ""} onChange={(e) => handleInputChange(index, "ratio", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="01:15" /></td>
                            <td className="px-3 py-3"><input type="number" value={row.rights_price || ""} onChange={(e) => handleInputChange(index, "rights_price", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="1257" /></td>
                            <td className="px-3 py-3"><input type="number" value={row.market_price || ""} onChange={(e) => handleInputChange(index, "market_price", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="1500" /></td>
                            <td className="px-3 py-3"><input type="text" value={row.discount || ""} onChange={(e) => handleInputChange(index, "discount", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="~16%" /></td>
                          </>
                        )}

                        {activeTab === "bonus" && (
                          <td className="px-3 py-3">
                            <input type="text" value={row.ratio || ""} onChange={(e) => handleInputChange(index, "ratio", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="1:1" />
                          </td>
                        )}

                        {activeTab === "splits" && (
                          <>
                            <td className="px-3 py-3">
                              <input type="text" value={row.ratio || ""} onChange={(e) => handleInputChange(index, "ratio", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="1:5" />
                            </td>
                            <td className="px-3 py-3">
                              <input type="number" value={row.old_fv || ""} onChange={(e) => handleInputChange(index, "old_fv", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="10" />
                            </td>
                            <td className="px-3 py-3">
                              <input type="number" value={row.new_fv || ""} onChange={(e) => handleInputChange(index, "new_fv", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="2" />
                            </td>
                          </>
                        )}

                        {activeTab === "buyback" && (
                          <>
                            <td className="px-3 py-3"><input type="number" value={row.buyback_price || ""} onChange={(e) => handleInputChange(index, "buyback_price", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="445" /></td>
                            <td className="px-3 py-3"><input type="number" value={row.cmp || ""} onChange={(e) => handleInputChange(index, "cmp", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="380" /></td>
                            <td className="px-3 py-3"><input type="text" value={row.premium || ""} onChange={(e) => handleInputChange(index, "premium", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="17.10%" /></td>
                            <td className="px-3 py-3"><input type="text" value={row.size || ""} onChange={(e) => handleInputChange(index, "size", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="₹12,000 Cr" /></td>
                          </>
                        )}

                        {activeTab === "other" && (
                          <>
                            <td className="px-3 py-3">
                              <select
                                value={row.action_type || ""}
                                onChange={(e) => handleInputChange(index, "action_type", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none"
                              >
                                <option value="">Select Category</option>
                                {otherActionTypes.map((type, i) => (
                                  <option key={i} value={type}>{type}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={row.key_detail || ""}
                                onChange={(e) => handleInputChange(index, "key_detail", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                                placeholder="Details / Issue scale"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                value={row.status || ""}
                                onChange={(e) => handleInputChange(index, "status", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                                placeholder="Completed / Ongoing"
                              />
                            </td>
                          </>
                        )}

                        <td className="px-3 py-3">
                          <DatePicker
                            selected={parseDate(row.announcement)}
                            onChange={(date) => handleInputChange(index, "announcement", formatDate(date))}
                            onChangeRaw={(e) => handleInputChange(index, "announcement", e.target.value)}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="DD-MM-YYYY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </td>

                        <td className="px-3 py-3">
                          <DatePicker
                            selected={parseDate(row.record)}
                            onChange={(date) => handleInputChange(index, "record", formatDate(date))}
                            onChangeRaw={(e) => handleInputChange(index, "record", e.target.value)}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="DD-MM-YYYY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </td>

                        <td className="px-3 py-3">
                          <DatePicker
                            selected={parseDate(row.ex_date)}
                            onChange={(date) => handleInputChange(index, "ex_date", formatDate(date))}
                            onChangeRaw={(e) => handleInputChange(index, "ex_date", e.target.value)}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="DD-MM-YYYY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </td>

                        {activeTab === "dividends" && (
                          <td className="px-3 py-3">
                            <input
                              type="text"
                              value={row.payment_date || ""}
                              onChange={(e) => handleInputChange(index, "payment_date", e.target.value)}
                              placeholder="e.g. Post 15 Aug 2026 or 2026-08-15"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </td>
                        )}

                        <td className="px-3 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            disabled={currentData.length === 1}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={addNewRow}
                  className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-lg font-medium transition"
                >
                  <Plus size={14} /> Add Dataset Row
                </button>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-xs tracking-wider uppercase px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition"
                >
                  {submitLoading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  Commit Entries
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-xs p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg text-gray-900 tracking-tight uppercase">Database Directory</h2>
                <p className="text-xs text-gray-400">Current live records stored inside database category</p>
              </div>
              <button 
                onClick={fetchRecords} 
                className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition"
              >
                <RefreshCw size={12} className={fetchLoading ? "animate-spin" : ""} /> Refresh Stack
              </button>
            </div>

            {fetchLoading ? (
              <p className="text-center py-12 text-sm text-gray-400 tracking-wide">Querying cloud schema database...</p>
            ) : filteredRecords.length === 0 ? (
              <p className="text-center py-12 text-sm text-gray-400">No active {currentTabConfig?.label} records indexed.</p>
            ) : (
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full border-collapse text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                      <th className="px-4 py-3 text-left w-72">Company</th>
                      {activeTab === "dividends" && (
                        <>
                          <th className="px-4 py-3 text-left w-48">Dividend Type</th>
                          <th className="px-4 py-3 text-left w-36">Yield %</th>
                          <th className="px-4 py-3 text-left w-40">Dividend/Share</th>
                        </>
                      )}
                      {activeTab === "rights" && (
                        <>
                          <th className="px-4 py-3 text-left w-36">Ratio</th>
                          <th className="px-4 py-3 text-left w-36">Rights Price</th>
                          <th className="px-4 py-3 text-left w-36">Market Price</th>
                          <th className="px-4 py-3 text-left w-36">Discount</th>
                        </>
                      )}
                      {activeTab === "bonus" && <th className="px-4 py-3 text-left w-36">Bonus Ratio</th>}
                      {activeTab === "splits" && (
                        <>
                          <th className="px-4 py-3 text-left w-36">Split Ratio</th>
                          <th className="px-4 py-3 text-left w-36">Old FV</th>
                          <th className="px-4 py-3 text-left w-36">New FV</th>
                        </>
                      )}
                      {activeTab === "buyback" && (
                        <>
                          <th className="px-4 py-3 text-left w-36">Buyback Price</th>
                          <th className="px-4 py-3 text-left w-36">CMP</th>
                          <th className="px-4 py-3 text-left w-36">Premium %</th>
                          <th className="px-4 py-3 text-left w-44">Size</th>
                        </>
                      )}
                      {activeTab === "other" && (
                        <>
                          <th className="px-4 py-3 text-left w-64">Action Type</th>
                          <th className="px-4 py-3 text-left w-72">Key Detail</th>
                          <th className="px-4 py-3 text-left w-40">Status</th>
                        </>
                      )}
                      <th className="px-4 py-3 text-left w-40">Announcement</th>
                      <th className="px-4 py-3 text-left w-40">Record Date</th>
                      <th className="px-4 py-3 text-left w-40">Ex Date</th>
                      {activeTab === "dividends" && <th className="px-4 py-3 text-left w-44">Payment Date</th>}
                      <th className="w-20 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white text-sm">
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3.5 font-semibold text-gray-900">{record.company}</td>

                        {activeTab === "dividends" && (
                          <>
                            <td className="px-4 py-3.5">{record.type || "-"}</td>
                            <td className="px-4 py-3.5">{record.ratio_or_percentage || "-"}</td>
                            <td className="px-4 py-3.5 font-medium text-emerald-700">
                              {record.dividend_share ? `₹${record.dividend_share}` : "-"}
                            </td>
                          </>
                        )}

                        {activeTab === "rights" && (
                          <>
                            <td className="px-4 py-3.5">{record.ratio_or_percentage || "-"}</td>
                            <td className="px-4 py-3.5">{record.rights_price || "-"}</td>
                            <td className="px-4 py-3.5">{record.market_price || "-"}</td>
                            <td className="px-4 py-3.5">{record.discount || "-"}</td>
                          </>
                        )}

                        {activeTab === "bonus" && (
                          <td className="px-4 py-3.5">{record.ratio_or_percentage || "-"}</td>
                        )}

                        {activeTab === "splits" && (
                          <>
                            <td className="px-4 py-3.5">{record.ratio_or_percentage || "-"}</td>
                            <td className="px-4 py-3.5">{record.old_fv || "-"}</td>
                            <td className="px-4 py-3.5">{record.new_fv || "-"}</td>
                          </>
                        )}

                        {activeTab === "buyback" && (
                          <>
                            <td className="px-4 py-3.5">₹{record.buyback_price || "-"}</td>
                            <td className="px-4 py-3.5">₹{record.cmp || "-"}</td>
                            <td className="px-4 py-3.5">{record.premium || "-"}</td>
                            <td className="px-4 py-3.5">{record.size || "-"}</td>
                          </>
                        )}

                        {activeTab === "other" && (
                          <>
                            <td className="px-4 py-3.5">{record.action_type_detail || "-"}</td>
                            <td className="px-4 py-3.5">{record.key_detail || "-"}</td>
                            <td className="px-4 py-3.5">{record.status || "-"}</td>
                          </>
                        )}

                        <td className="px-4 py-3.5 text-gray-500 font-mono">
                          {formatDateOnly(record.announcement) || "-"}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 font-mono">
                          {formatDateOnly(record.record) || "-"}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 font-mono">
                          {formatDateOnly(record.ex_date) || "-"}
                        </td>

                        {activeTab === "dividends" && (
                          <td className="px-4 py-3.5 text-gray-500 font-mono">
                            {formatDateOnly(record.payment_date) || "-"}
                          </td>
                        )}

                        <td className="px-4 py-3.5 text-center">
                          <div className="flex gap-3 justify-center">
                            <button 
                              onClick={() => openEdit(record)} 
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button 
                              onClick={() => handleDelete(record.id)} 
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-xl animate-scaleUp">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-md font-medium text-gray-900 uppercase tracking-wider">Modify {currentTabConfig?.label}</h3>
              <button onClick={() => setEditModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-sm">
              <div>
                <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Company Name</label>
                <input
                  type="text"
                  value={editModal.company || ""}
                  onChange={(e) => updateEditModal("company", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {activeTab === "dividends" && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Dividend Type</label>
                    <select
                      value={editModal.type || ""}
                      onChange={(e) => updateEditModal("type", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Final Dividend">Final Dividend</option>
                      <option value="Interim Dividend">Interim Dividend</option>
                      <option value="Special Dividend">Special Dividend</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Yield %</label>
                    <input
                      type="text"
                      value={editModal.percentage || ""}
                      onChange={(e) => updateEditModal("percentage", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Dividend/Share</label>
                    <input
                      type="text"
                      value={editModal.dividend_share || ""}
                      onChange={(e) => updateEditModal("dividend_share", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="₹15.50"
                    />
                  </div>
                </div>
              )}

              {activeTab === "rights" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Ratio</label>
                    <input type="text" value={editModal.ratio || ""} onChange={(e) => updateEditModal("ratio", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Rights Price</label>
                    <input type="number" value={editModal.rights_price || ""} onChange={(e) => updateEditModal("rights_price", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Market Price</label>
                    <input type="number" value={editModal.market_price || ""} onChange={(e) => updateEditModal("market_price", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Discount</label>
                    <input type="text" value={editModal.discount || ""} onChange={(e) => updateEditModal("discount", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                </div>
              )}

              {activeTab === "bonus" && (
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Bonus Ratio</label>
                  <input type="text" value={editModal.ratio || ""} onChange={(e) => updateEditModal("ratio", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                </div>
              )}

              {activeTab === "splits" && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Split Ratio</label>
                    <input type="text" value={editModal.ratio || ""} onChange={(e) => updateEditModal("ratio", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Old FV</label>
                    <input type="number" value={editModal.old_fv || ""} onChange={(e) => updateEditModal("old_fv", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">New FV</label>
                    <input type="number" value={editModal.new_fv || ""} onChange={(e) => updateEditModal("new_fv", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                </div>
              )}

              {activeTab === "buyback" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Buyback Price</label>
                    <input type="number" value={editModal.buyback_price || ""} onChange={(e) => updateEditModal("buyback_price", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">CMP</label>
                    <input type="number" value={editModal.cmp || ""} onChange={(e) => updateEditModal("cmp", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Premium %</label>
                    <input type="text" value={editModal.premium || ""} onChange={(e) => updateEditModal("premium", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Size</label>
                    <input type="text" value={editModal.size || ""} onChange={(e) => updateEditModal("size", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                </div>
              )}

              {activeTab === "other" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Action Type</label>
                    <select
                      value={editModal.action_type || ""}
                      onChange={(e) => updateEditModal("action_type", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {otherActionTypes.map((type, i) => (
                        <option key={i} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Key Detail</label>
                    <input type="text" value={editModal.key_detail || ""} onChange={(e) => updateEditModal("key_detail", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Status</label>
                    <input type="text" value={editModal.status || ""} onChange={(e) => updateEditModal("status", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Announcement</label>
                  <DatePicker
                    selected={parseDate(editModal.announcement)}
                    onChange={(date) => updateEditModal("announcement", formatDate(date))}
                    onChangeRaw={(e) => updateEditModal("announcement", e.target.value)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Record Date</label>
                  <DatePicker
                    selected={parseDate(editModal.record)}
                    onChange={(date) => updateEditModal("record", formatDate(date))}
                    onChangeRaw={(e) => updateEditModal("record", e.target.value)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Ex Date</label>
                  <DatePicker
                    selected={parseDate(editModal.ex_date)}
                    onChange={(date) => updateEditModal("ex_date", formatDate(date))}
                    onChangeRaw={(e) => updateEditModal("ex_date", e.target.value)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900"
                  />
                </div>
                {activeTab === "dividends" && (
                  <div>
                    <label className="block text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Payment Date</label>
                    <input
                      type="text"
                      value={editModal.payment_date || ""}
                      onChange={(e) => updateEditModal("payment_date", e.target.value)}
                      placeholder="DD-MM-YYYY or Post 15 Aug 2026"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button type="button" onClick={() => setEditModal(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-xs font-medium transition">
                Cancel
              </button>
              <button type="button" onClick={handleUpdate} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition">
                Save Adjustments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCorporateActionsClient;