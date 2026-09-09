// src/components/AdminBlogClient.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "./AdminSidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import {
  Save,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  Hash,
  Menu,
} from "lucide-react";

const AdminBlogClient = () => {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [category, setCategory] = useState("IPO News");
  const [readingTime, setReadingTime] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [heading, setHeading] = useState("");
  const [keywords, setKeywords] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const categories = [
    "IPO News",
    "Market Analysis",
    "Financial Market Updates",
    "Pre-IPO",
    "Investment Tips",
    "Company Updates",
    "Dividend News",
    "Broker Comparison",
    "Options Trading",
    "Futures Trading",
    "Commodity Market",
    "ETF News",
    "Mutual Funds",
    "NFO Updates",
    "Corporate Actions",
    "Unlisted Shares",
  ];

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const stripHtml = (html) =>
    html.replace(/<[^>]*>/g, "").trim();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;

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
      alert("Upload failed: " + err.message);
    } finally {
      setImageUploading(false);
    }
  };

  // Process keywords from textarea
  const processKeywords = (text) => {
    if (!text) return [];
    return text
      .split(/[,\n]+/)
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Required fields missing");
      return;
    }

    setLoading(true);

    try {
      const slug = `${generateSlug(title)}-${Date.now()}`;

      const cleanExcerpt =
        excerpt || stripHtml(content).substring(0, 160) + "...";

      const keywordsArray = processKeywords(keywords);

      const { data, error } = await supabase
        .from("blogs")
        .insert([
          {
            title,
            heading,
            excerpt: cleanExcerpt,
            content,
            image_url: imageUrl || null,
            category,
            reading_time: Number(readingTime),
            status: "published",
            slug,
            author: "Admin",
            published_at: new Date().toISOString(),
            keywords: keywordsArray,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase Insert Error:", error);
        alert(error.message);
        return;
      }

      console.log("Inserted:", data);

      setSuccess(true);

      // Reset form
      setTitle("");
      setHeading("");
      setExcerpt("");
      setContent("");
      setImageUrl("");
      setKeywords("");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
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
                  Create Blog
                </h1>
                <p className="text-xs text-gray-500">Publish to Insight Hub</p>
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
                Create New Blog
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Publish content to Insight Hub
              </p>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
              Blog published successfully
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* TITLE */}
            <input
              type="text"
              placeholder="Enter blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl sm:text-2xl font-medium px-5 py-4 border rounded-xl focus:ring-2 focus:ring-green-500"
            />

            {/* HEADING */}
            <input
              type="text"
              placeholder="Enter heading..."
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full text-lg px-5 py-4 border rounded-xl focus:ring-2 focus:ring-green-500"
            />

            {/* HORIZONTAL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-end">
              {/* CATEGORY */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl bg-white"
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* TIME */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Reading Time (min)
                </label>
                <input
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Featured Image
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {imageUploading ? (
                    <>
                      <Loader2 className="animate-spin text-gray-500" size={18} />
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </>
                  ) : imageUrl ? (
                    <>
                      <CheckCircle className="text-green-600" size={18} />
                      <span className="text-sm text-green-600">Uploaded successfully</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={18} className="text-gray-500" />
                      <span className="text-sm text-gray-600">Upload image</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* KEYWORDS SECTION */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Keywords <span className="text-red-500 text-lg">*</span>
                <span className="text-xs text-gray-500 ml-2 font-normal">
                  (Separate with commas or new lines)
                </span>
              </label>

              <div className="relative">
                <Hash className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Enter keywords separated by commas or new lines&#10;Example:&#10;ipo news, market analysis, investment tips&#10;stock market&#10;financial updates"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 min-h-[120px] resize-y"
                />
              </div>

              {keywords && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Preview ({processKeywords(keywords).length} keywords):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {processKeywords(keywords).slice(0, 10).map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700"
                      >
                        <Hash size={12} className="text-gray-400" />
                        {keyword}
                      </span>
                    ))}
                    {processKeywords(keywords).length > 10 && (
                      <span className="text-xs text-gray-400">
                        +{processKeywords(keywords).length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* EXCERPT */}
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Short summary..."
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* HTML CONTENT */}
            <div className="bg-white border rounded-xl overflow-hidden">
              <label className="block px-5 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
                HTML Content (Detailed Description)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste or write full HTML here..."
                className="w-full h-[400px] sm:h-[600px] p-5 font-mono text-sm leading-relaxed resize-y focus:outline-none"
              />
            </div>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button
                disabled={loading}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 disabled:opacity-70"
              >
                <Save size={18} />
                {loading ? "Publishing..." : "Publish"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminBlogClient;