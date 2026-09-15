// src/components/DocumentsClient.jsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import { createClient } from "@/lib/supabase/client";
import {
  Menu,
  CheckCircle,
  FileText,
  AlertCircle,
  User,
  CreditCard,
  Building,
  ShieldCheck,
  Upload,
  Save,
} from "lucide-react";

const DocumentsClient = ({ user, initialKyc }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nameAsPerPan: "",
    nameAsPerDemat: "",
    dematId: "",
    depositoryName: "",
    bankName: "",
    bankAccountNo: "",
    ifsc: "",
  });

  const [savedData, setSavedData] = useState(initialKyc || null);

  const [panStatus, setPanStatus] = useState("Not Uploaded");
  const [aadhaarStatus, setAadhaarStatus] = useState("Not Uploaded");
  const [cmrStatus, setCmrStatus] = useState("Not Uploaded");
  const [chequeStatus, setChequeStatus] = useState("Not Uploaded");

  const [selectedFiles, setSelectedFiles] = useState({
    pan: null,
    aadhar: null,
    cmr: null,
    cheque: null,
  });

  const supabase = createClient();

  const allVerified =
    panStatus === "Verified" &&
    aadhaarStatus === "Verified" &&
    cmrStatus === "Verified" &&
    chequeStatus === "Verified";

  // Initialize state from initialKyc
  useEffect(() => {
    if (initialKyc) {
      setFormData({
        nameAsPerPan: initialKyc.name_as_per_pan || "",
        nameAsPerDemat: initialKyc.name_as_per_demat || "",
        dematId: initialKyc.demat_id || "",
        depositoryName: initialKyc.depository_name || "",
        bankName: initialKyc.bank_name || "",
        bankAccountNo: initialKyc.bank_account_no || "",
        ifsc: initialKyc.ifsc || "",
      });

      setPanStatus(initialKyc.pan_status || "Not Uploaded");
      setAadhaarStatus(initialKyc.aadhaar_status || "Not Uploaded");
      setCmrStatus(initialKyc.cmr_status || "Not Uploaded");
      setChequeStatus(initialKyc.cheque_status || "Not Uploaded");

      setSelectedFiles({
        pan: initialKyc.pan_file ? { name: "PAN Document" } : null,
        aadhar: initialKyc.aadhaar_file ? { name: "Aadhaar Document" } : null,
        cmr: initialKyc.cmr_file ? { name: "CMR Document" } : null,
        cheque: initialKyc.cheque_file ? { name: "Cancelled Cheque" } : null,
      });
    }
    setLoading(false);
  }, [initialKyc]);

  // Real-time listener for KYC updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("kyc-status-listener")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_kyc",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const kyc = payload.new;
          setPanStatus(kyc.pan_status || "Not Uploaded");
          setAadhaarStatus(kyc.aadhaar_status || "Not Uploaded");
          setCmrStatus(kyc.cmr_status || "Not Uploaded");
          setChequeStatus(kyc.cheque_status || "Not Uploaded");
          setSavedData(kyc);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save all details
  const handleSaveAll = async () => {
    if (!user) {
      alert("Please log in first");
      return;
    }

    const payload = {
      user_id: user.id,
      name_as_per_pan: formData.nameAsPerPan.trim() || null,
      name_as_per_demat: formData.nameAsPerDemat.trim() || null,
      demat_id: formData.dematId.trim() || null,
      depository_name: formData.depositoryName.trim() || null,
      bank_name: formData.bankName.trim() || null,
      bank_account_no: formData.bankAccountNo.trim() || null,
      ifsc: formData.ifsc.trim() || null,
    };

    const { data, error } = await supabase
      .from("user_kyc")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      console.error("Save failed:", error);
      alert("Failed to save: " + (error.message || "Unknown error"));
      return;
    }

    setSavedData(data);
    alert("Details saved successfully!");
  };

 // File upload handler
const handleFileSelect = async (docType, file) => {
  if (!user || !file) return;

  try {
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const filePath = `${user.id}/${docType}_${Date.now()}.${fileExt}`;

    // 1. Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("kyc-documents")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("File upload failed: " + uploadError.message);
      return;
    }

    // 2. Map document type to database columns
    const columnMap = {
      pan: {
        fileColumn: "pan_file",
        statusColumn: "pan_status",
      },
      aadhar: {
        fileColumn: "aadhaar_file",
        statusColumn: "aadhaar_status",
      },
      cmr: {
        fileColumn: "cmr_file",
        statusColumn: "cmr_status",
      },
      cheque: {
        fileColumn: "cheque_file",
        statusColumn: "cheque_status",
      },
    };

    const mapping = columnMap[docType];

    if (!mapping) {
      console.error("Invalid document type:", docType);
      return;
    }

    // 3. IMPORTANT:
    // Use UPSERT instead of UPDATE.
    // This guarantees a user_kyc row exists.
    const { data, error: dbError } = await supabase
      .from("user_kyc")
      .upsert(
        {
          user_id: user.id,
          [mapping.fileColumn]: filePath,
          [mapping.statusColumn]: "Pending",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (dbError) {
      console.error("Database update error:", dbError);
      alert("File uploaded, but database update failed: " + dbError.message);
      return;
    }

    console.log("KYC database updated:", data);

    // 4. Update local state only after database update succeeds
    setSavedData(data);

    setSelectedFiles((prev) => ({
      ...prev,
      [docType]: {
        name: file.name,
      },
    }));

    if (docType === "pan") setPanStatus("Pending");
    if (docType === "aadhar") setAadhaarStatus("Pending");
    if (docType === "cmr") setCmrStatus("Pending");
    if (docType === "cheque") setChequeStatus("Pending");

  } catch (error) {
    console.error("Unexpected upload error:", error);
    alert("Something went wrong while uploading the document.");
  }
};

  const hasAnyData = savedData && (
    savedData.name_as_per_pan ||
    savedData.name_as_per_demat ||
    savedData.demat_id ||
    savedData.depository_name ||
    savedData.bank_name ||
    savedData.bank_account_no ||
    savedData.ifsc
  );

  const isSaved = !!hasAnyData;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading KYC details...</p>
      </div>
    );
  }

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
              <div>
                <p className="text-xs text-gray-500">Account Verification</p>
                <h1 className="text-lg font-semibold text-gray-900 leading-tight">Documents & KYC</h1>
              </div>
            </div>
            <div className="shrink-0">
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents & KYC</h1>
            <p className="text-gray-600 mt-1">Manage and verify your account details</p>
          </div>
          <UserProfileDropdown />
        </header>

        {/* Main KYC Card */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">KYC & Account Details</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <DetailGroup title="Personal Information">
                {isSaved ? (
                  <>
                    <DetailItem
                      icon={<User size={16} />}
                      label="Name (As Per PAN)"
                      value={savedData.name_as_per_pan || "Not Provided"}
                    />
                    <DetailItem
                      icon={<User size={16} />}
                      label="Name (As Per Demat)"
                      value={savedData.name_as_per_demat || "Not Provided"}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">Name (As Per PAN)</label>
                      <input
                        type="text"
                        name="nameAsPerPan"
                        value={formData.nameAsPerPan}
                        onChange={handleInputChange}
                        placeholder="Enter name as per PAN"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">Name (As Per Demat)</label>
                      <input
                        type="text"
                        name="nameAsPerDemat"
                        value={formData.nameAsPerDemat}
                        onChange={handleInputChange}
                        placeholder="Enter name as per Demat"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </>
                )}
              </DetailGroup>

              {/* Demat Details */}
              <DetailGroup title="Demat Account">
                {isSaved ? (
                  <>
                    <DetailItem
                      icon={<CreditCard size={16} />}
                      label="Demat ID"
                      value={savedData.demat_id || "Not Provided"}
                    />
                    <DetailItem
                      icon={<Building size={16} />}
                      label="Depository Name"
                      value={savedData.depository_name || "Not Provided"}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">Demat ID</label>
                      <input
                        type="text"
                        name="dematId"
                        value={formData.dematId}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (!/^\d*$/.test(value)) return;
                          if (value.length > 16) return;
                          setFormData((prev) => ({ ...prev, dematId: value }));
                        }}
                        placeholder="Enter 16-digit Demat ID"
                        maxLength={16}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">Depository Name</label>
                      <select
                        name="depositoryName"
                        value={formData.depositoryName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-white"
                      >
                        <option value="">Select Depository</option>
                        <option value="MSEI">MSEI</option>
                        <option value="CDSL">CDSL</option>
                        <option value="NSDL">NSDL</option>
                      </select>
                    </div>
                  </>
                )}
              </DetailGroup>

              {/* Bank Details */}
              <DetailGroup title="Bank Details">
                {isSaved ? (
                  <>
                    <DetailItem
                      icon={<Building size={16} />}
                      label="Bank Name"
                      value={savedData.bank_name || "Not Provided"}
                    />
                    <DetailItem
                      icon={<CreditCard size={16} />}
                      label="Bank Account No."
                      value={savedData.bank_account_no || "Not Provided"}
                    />
                    <DetailItem
                      icon={<FileText size={16} />}
                      label="IFSC Code"
                      value={savedData.ifsc || "Not Provided"}
                    />
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">Bank Name</label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="HDFC Bank / SBI / etc"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">Bank Account No.</label>
                      <input
                        type="text"
                        name="bankAccountNo"
                        value={formData.bankAccountNo}
                        onChange={handleInputChange}
                        placeholder="Enter account number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-500">IFSC Code</label>
                      <input
                        type="text"
                        name="ifsc"
                        value={formData.ifsc}
                        onChange={handleInputChange}
                        placeholder="HDFC0000123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </>
                )}
              </DetailGroup>

              {/* Required Documents Uploads */}
              <DetailGroup title="Required Documents" fullWidth>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <UploadCard
                    title="PAN"
                    status={panStatus}
                    selectedFile={selectedFiles.pan}
                    onFileSelect={(file) => handleFileSelect("pan", file)}
                  />
                  <UploadCard
                    title="Aadhaar"
                    status={aadhaarStatus}
                    selectedFile={selectedFiles.aadhar}
                    onFileSelect={(file) => handleFileSelect("aadhar", file)}
                  />
                  <UploadCard
                    title="CMR"
                    status={cmrStatus}
                    selectedFile={selectedFiles.cmr}
                    onFileSelect={(file) => handleFileSelect("cmr", file)}
                  />
                  <UploadCard
                    title="Cancelled Cheque"
                    status={chequeStatus}
                    selectedFile={selectedFiles.cheque}
                    onFileSelect={(file) => handleFileSelect("cheque", file)}
                  />
                </div>
              </DetailGroup>
            </div>

            {/* Save Button - show when editing (not saved) */}
            {!isSaved && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#16A34A] text-white font-medium rounded-xl hover:bg-[#15803D] transition shadow-md"
                >
                  <Save size={18} />
                  Save All Details
                </button>
              </div>
            )}

            {/* Update Note */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-amber-600 mt-0.5" size={18} />
              <div className="text-sm text-amber-800">
                <p className="font-medium">To update any details</p>
                <p className="mt-1">
                  Please email us at{" "}
                  <a
                    href="mailto:support@sharebazaaronline.com"
                    className="text-green-700 hover:underline font-medium"
                  >
                    support@sharebazaaronline.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEBI Compliance Banner */}
        {allVerified && (
          <section className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-1" size={22} />
            <div>
              <h3 className="font-semibold text-green-800 text-lg">
                SEBI Compliance Completed
              </h3>
              <p className="text-sm text-green-700 mt-1">
                All required documents and details are verified as per regulatory guidelines.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

/* ---------------- Reusable Components ---------------- */

const DetailGroup = ({ title, children, fullWidth = false }) => (
  <div className={`${fullWidth ? "md:col-span-2 lg:col-span-3" : ""}`}>
    <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const DetailItem = ({ icon, label, value, status }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-start gap-3 flex-1">
      <div className="p-2 bg-gray-100 rounded-lg text-gray-600">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900 break-all">{value || "Not Provided"}</p>
      </div>
    </div>

    {status && (
      <span
        className={`text-sm font-medium flex items-center gap-1.5 ${
          status === "Verified"
            ? "text-green-600"
            : status === "Pending"
            ? "text-yellow-600"
            : "text-gray-600"
        }`}
      >
        {status === "Verified" ? <CheckCircle size={14} /> : status === "Pending" ? <AlertCircle size={14} /> : null}
        {status}
      </span>
    )}
  </div>
);

const UploadCard = ({ title, status, selectedFile, onFileSelect }) => (
  <div className="bg-gray-50 rounded-xl p-3 hover:border-green-300 transition h-full flex flex-col">
    <p className="font-medium text-gray-900 text-sm mb-1.5 truncate">{title}</p>

    {!selectedFile ? (
      <label className="cursor-pointer block flex-1">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-green-400 transition h-full flex flex-col justify-center items-center">
          <Upload size={18} className="text-gray-400 mb-1.5" />
          <p className="text-xs font-medium text-gray-700">Upload</p>
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        />
      </label>
    ) : (
      <div className="bg-white rounded-lg p-2.5 text-xs flex items-center justify-between gap-2 min-h-[60px]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FileText className="text-green-600 flex-shrink-0" size={16} />
          <p className="font-medium truncate flex-1">{selectedFile?.name || "Uploaded file"}</p>
        </div>
        <span
          className={`text-xs font-medium flex items-center gap-1 flex-shrink-0 ${
            status === "Pending"
              ? "text-yellow-600"
              : status === "Verified"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {status === "Pending" ? (
            <>
              <AlertCircle size={12} /> Pending
            </>
          ) : status === "Verified" ? (
            <>
              <CheckCircle size={12} /> Verified
            </>
          ) : (
            status
          )}
        </span>
      </div>
    )}
  </div>
);

export default DocumentsClient;