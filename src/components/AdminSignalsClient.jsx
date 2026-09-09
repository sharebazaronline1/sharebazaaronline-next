// src/components/AdminSignalsClient.jsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import {
  Loader2,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle,
  Menu,
} from "lucide-react";

const AdminSignalsClient = () => {
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FETCH SIGNALS
  const fetchSignals = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("trading_signals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setSignals(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  // IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("signal-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("signal-images")
        .getPublicUrl(fileName);

      setImageUrl(data.publicUrl);
    } catch (err) {
      alert(err.message);
    } finally {
      setImageUploading(false);
    }
  };

  // SAVE SIGNAL
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !imageUrl) {
      alert("Please fill all fields");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("trading_signals")
        .insert({
          title,
          image_url: imageUrl,
        });

      if (error) throw error;

      setTitle("");
      setImageUrl("");

      fetchSignals();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const deleteSignal = async (id) => {
    const confirmed = window.confirm("Delete this signal?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("trading_signals")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchSignals();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="md:ml-64 p-4 sm:p-6 md:p-8">
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
                <h1 className="text-xl font-bold leading-tight text-gray-900">Signals</h1>
                <p className="text-xs text-gray-500">Upload</p>
              </div>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Trading Signals</h1>
            <p className="text-gray-600 mt-2">Upload signal images</p>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* TITLE */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Signal Title
                </label>
                <input
                  type="text"
                  placeholder="Enter signal title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Signal Image
                </label>

                <label className="border-2 border-dashed border-gray-300 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition bg-gray-50">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  {imageUploading ? (
                    <>
                      <Loader2 className="animate-spin text-green-600 mb-4" size={36} />
                      <p className="text-sm text-gray-600">Uploading image...</p>
                    </>
                  ) : imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-h-72 rounded-2xl shadow-sm mb-4"
                      />
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={18} />
                        <span className="text-sm font-medium">Uploaded Successfully</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={42} className="text-gray-400 mb-4" />
                      <p className="font-medium text-gray-700">Click to upload image</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP</p>
                    </>
                  )}
                </label>
              </div>

              {/* BUTTON */}
              <div className="flex justify-end">
                <button
                  disabled={saving}
                  className="bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-3 rounded-2xl font-semibold flex items-center gap-2 transition"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Publish Signal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* SIGNALS */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 sm:px-8 py-6 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Uploaded Signals</h2>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-green-600" size={40} />
              </div>
            ) : signals.length === 0 ? (
              <div className="py-20 text-center text-gray-500">No signals uploaded</div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 p-6 sm:p-8">
                {signals.map((signal) => (
                  <div
                    key={signal.id}
                    className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm"
                  >
                    <img
                      src={signal.image_url}
                      alt={signal.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-3">
                        {signal.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(signal.created_at).toLocaleDateString("en-IN")}
                      </p>
                      <button
                        onClick={() => deleteSignal(signal.id)}
                        className="mt-5 w-full py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-medium flex items-center justify-center gap-2 transition"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSignalsClient;