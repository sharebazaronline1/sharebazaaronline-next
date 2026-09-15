// src/components/AdminKycDocumentsClient.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import {
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
  Menu,
  Filter,
} from "lucide-react";

const AdminKycDocumentsClient = () => {
  const router = useRouter();
  const supabase = createClient();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter state
  const [filterDocType, setFilterDocType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("user_kyc_with_user")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error("KYC fetch error:", err);
      setError("Failed to load KYC documents");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (userId, docType, newStatus) => {
    const key = `${userId}-${docType}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const field = `${docType}_status`;
      const { error } = await supabase
        .from("user_kyc")
        .update({
          [field]: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;

      await fetchDocuments();
    } catch (err) {
      console.error("KYC update failed:", err);
      alert("Failed to update");
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getPublicUrl = (path) => {
    if (!path) return "#";
    return supabase.storage
      .from("kyc-documents")
      .getPublicUrl(path).data.publicUrl;
  };

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Get all document types and their statuses
      const docTypes = ["pan", "aadhaar", "cmr", "cheque"];
      let matches = false;

      // If filterDocType is "all", check all types;
      // otherwise check only the selected type
      const typesToCheck =
        filterDocType === "all" ? docTypes : [filterDocType];

      for (const type of typesToCheck) {
        const status = doc[`${type}_status`] || "Not Uploaded";

        if (filterStatus === "all") {
          // When status filter is "all", any selected document type matches
          matches = true;
          break;
        } else {
          if (status === filterStatus) {
            matches = true;
            break;
          }
        }
      }

      return matches;
    });
  }, [documents, filterDocType, filterStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-5">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
          <p className="text-lg font-medium text-gray-700">
            Loading Documents...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="md:ml-64 p-4 sm:p-6 lg:p-8">
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
                <h1 className="text-xl font-bold leading-tight text-gray-900">
                  KYC
                </h1>
                <p className="text-xs text-gray-500">Documents</p>
              </div>
            </div>

            <UserProfileDropdown />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              KYC Documents
            </h1>
            <p className="text-gray-600 mt-1">
              Review and verify user documents
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchDocuments}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <UserProfileDropdown />
          </div>
        </header>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap items-center gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter size={16} />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Document Type Filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="docTypeFilter"
              className="text-xs text-gray-500"
            >
              Document Type
            </label>

            <select
              id="docTypeFilter"
              value={filterDocType}
              onChange={(e) => setFilterDocType(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="all">All</option>
              <option value="pan">PAN</option>
              <option value="aadhaar">Aadhaar</option>
              <option value="cmr">CMR</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="statusFilter"
              className="text-xs text-gray-500"
            >
              Status
            </label>

            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
              <option value="Not Uploaded">Not Uploaded</option>
            </select>
          </div>

          {/* Count */}
          <span className="ml-auto text-xs text-gray-500">
            Showing {filteredDocuments.length} of {documents.length} users
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <FileText
              size={64}
              className="mx-auto text-gray-300 mb-4"
            />

            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No KYC Documents
            </h3>

            <p className="text-gray-500">
              {documents.length === 0
                ? "No submissions found."
                : "No documents match the selected filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.user_id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-6 border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {doc.full_name || "Unknown"}
                      </h3>

                      <p className="text-sm text-gray-600 mt-1">
                        SB ID: {doc.sb_user_id || "—"} •{" "}
                        {doc.email || "—"}
                      </p>
                    </div>

                    <span className="text-sm text-gray-500">
                      Updated:{" "}
                      {new Date(doc.updated_at).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {["pan", "aadhaar", "cmr", "cheque"].map((type) => {
                    const status =
                      doc[`${type}_status`] || "Not Uploaded";
                    const file = doc[`${type}_file`];

                    return (
                      <div
                        key={type}
                        className={`p-5 rounded-xl border ${
                          status === "Pending"
                            ? "bg-yellow-50 border-yellow-200"
                            : status === "Verified"
                            ? "bg-green-50 border-green-200"
                            : status === "Rejected"
                            ? "bg-red-50 border-red-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-medium capitalize">
                            {type}
                          </p>

                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : status === "Verified"
                                ? "bg-green-100 text-green-800"
                                : status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        {file && (
                          <a
                            href={getPublicUrl(file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline block mb-3 truncate"
                          >
                            View File
                          </a>
                        )}

                        {status === "Pending" && (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() =>
                                updateStatus(
                                  doc.user_id,
                                  type,
                                  "Verified"
                                )
                              }
                              disabled={
                                actionLoading[
                                  `${doc.user_id}-${type}`
                                ]
                              }
                              className="flex-1 py-2 bg-[#16A34A] text-white text-sm rounded-lg hover:bg-[#15803D] transition disabled:opacity-50"
                            >
                              Verify
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  doc.user_id,
                                  type,
                                  "Rejected"
                                )
                              }
                              disabled={
                                actionLoading[
                                  `${doc.user_id}-${type}`
                                ]
                              }
                              className="flex-1 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminKycDocumentsClient;