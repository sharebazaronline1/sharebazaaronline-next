// src/components/AdminBrokerReviewClient.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import { Save, Image as ImageIcon, Loader2, CheckCircle, Menu } from "lucide-react";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";

/* 🔥 Preserve table paste */
const Clipboard = Quill.import("modules/clipboard");

class PlainClipboard extends Clipboard {
  onPaste(e) {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");
    const quill = this.quill;
    const range = quill.getSelection();

    if (html && html.includes("<table")) {
      quill.clipboard.dangerouslyPasteHTML(range.index, html);
    } else {
      quill.insertText(range.index, text);
    }
  }
}

Quill.register("modules/clipboard", PlainClipboard, true);

const AdminBrokerReviewClient = () => {
  const router = useRouter();
  const supabase = createClient();
  const quillRef = useRef(null);

  const [brokers, setBrokers] = useState([]);
  const [selectedBrokerId, setSelectedBrokerId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [readingTime, setReadingTime] = useState(8);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch brokers for dropdown
  useEffect(() => {
    const fetchBrokers = async () => {
      const { data, error } = await supabase
        .from("brokers")
        .select("id, name, slug")
        .order("name");

      if (error) console.error("Error fetching brokers:", error);
      else setBrokers(data || []);
    };

    fetchBrokers();
  }, []);

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

  const stripHtml = (html) => html.replace(/<[^>]*>/g, "").trim();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const fileName = `reviews/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (error) {
        alert("Upload failed: " + error.message);
        return;
      }

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      setImageUrl(data.publicUrl);
    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !selectedBrokerId) {
      alert("Title, Content, and Broker selection are required");
      return;
    }

    setLoading(true);

    try {
      const slug = `${generateSlug(title)}-review`;

      const { data, error } = await supabase
        .from("broker_reviews")
        .insert([
          {
            broker_id: selectedBrokerId,
            title,
            slug,
            content,
            image_url: imageUrl || null,
            reading_time: Number(readingTime),
            category: "Broker Review",
            author: "Admin",
            published_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error("Insert Error:", error);
        alert(error.message);
        return;
      }

      console.log("Review Published:", data);
      setSuccess(true);

      // Reset form
      setTitle("");
      setContent("");
      setImageUrl("");
      setSelectedBrokerId("");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="md:ml-64">
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
                  Create Broker Review
                </h1>
                <p className="text-xs text-gray-500">Add detailed review</p>
              </div>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white px-8 py-6 shadow-sm">
          <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Create Broker Review
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Add detailed review for a broker
              </p>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2">
              <CheckCircle size={20} />
              Broker Review published successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* BROKER SELECTION */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block font-medium">
                Select Broker *
              </label>
              <select
                value={selectedBrokerId}
                onChange={(e) => setSelectedBrokerId(e.target.value)}
                className="w-full px-5 py-4 border rounded-xl bg-white focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">-- Choose Broker --</option>
                {brokers.map((broker) => (
                  <option key={broker.id} value={broker.id}>
                    {broker.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TITLE */}
            <input
              type="text"
              placeholder="Enter Review Title (e.g. Angel One Review 2026)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl sm:text-2xl font-medium px-5 py-4 border rounded-xl focus:ring-2 focus:ring-green-500"
              required
            />

            {/* IMAGE UPLOAD */}
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Featured Image
              </label>
              <label className="flex items-center justify-center gap-3 px-6 py-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                {imageUploading ? (
                  <>
                    <Loader2 className="animate-spin text-gray-500" size={20} />
                    <span>Uploading image...</span>
                  </>
                ) : imageUrl ? (
                  <>
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-green-600">Image uploaded successfully</span>
                  </>
                ) : (
                  <>
                    <ImageIcon size={20} className="text-gray-500" />
                    <span>Click to upload featured image</span>
                  </>
                )}
              </label>
            </div>

            {/* READING TIME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Reading Time (minutes)
                </label>
                <input
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  className="w-full px-5 py-4 border rounded-xl"
                  min="1"
                />
              </div>
            </div>

            {/* QUILL EDITOR */}
            <div className="bg-white border rounded-2xl overflow-hidden">
              <ReactQuill
                ref={quillRef}
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-[400px] sm:h-[620px]"
                placeholder="Write your broker review here..."
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading || !selectedBrokerId}
                className="bg-[#16A34A] hover:bg-[#15803D] disabled:bg-gray-400 text-white px-10 py-4 rounded-2xl font-semibold flex items-center gap-3 text-base sm:text-lg"
              >
                <Save size={22} />
                {loading ? "Publishing Review..." : "Publish Review"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminBrokerReviewClient;