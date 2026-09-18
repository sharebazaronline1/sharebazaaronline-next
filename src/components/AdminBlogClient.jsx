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

  const stripHtml = (html) => html.replace(/<[^>]*>/g, "").trim();

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
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Required fields missing");
      return;
    }

    if (!imageUrl) {
      alert("Please upload a featured image before publishing.");
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

  // Publish button gating — must have image + not uploading + not saving
  const canPublish = !!imageUrl && !imageUploading && !loading;

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
                  Create Blog
                </h1>
                <p className="text-xs text-gray-500">Publish to Insight Hub</p>
              </div>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="sticky top-0 z-10 bg-white backdrop-blur-lg border-gray-200 px-4 sm:px-6 lg:px-8 py-6 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                Create New Blog
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Publish content to Insight Hub
              </p>
            </div>
            <UserProfileDropdown />
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {success && (
            <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span className="font-medium">Blog published successfully</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* TITLE */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter blog title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-14 px-5 text-lg font-medium bg-white border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* HEADING */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Heading
              </label>
              <input
                type="text"
                placeholder="Enter heading..."
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="w-full h-12 px-5 text-base bg-white border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* HORIZONTAL ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-end">
              {/* CATEGORY */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 px-5 bg-white border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-gray-700"
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* READING TIME */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Reading Time (min)
                </label>
                <input
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  className="w-full h-12 px-5 bg-white border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-medium text-gray-700"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Featured Image <span className="text-red-500">*</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-2 h-12 px-4 border rounded-2xl cursor-pointer transition-colors ${
                    imageUrl
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {imageUploading ? (
                    <>
                      <Loader2
                        className="animate-spin text-gray-500"
                        size={18}
                      />
                      <span className="text-sm text-gray-600 font-medium">
                        Uploading...
                      </span>
                    </>
                  ) : imageUrl ? (
                    <>
                      <CheckCircle className="text-emerald-600" size={18} />
                      <span className="text-sm text-emerald-700 font-medium">
                        Image uploaded
                      </span>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={18} className="text-gray-500" />
                      <span className="text-sm text-gray-600 font-medium">
                        Upload image
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* KEYWORDS */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Keywords <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2 font-normal">
                  (Separate with commas or new lines)
                </span>
              </label>

              <div className="relative">
                <Hash
                  className="absolute left-4 top-3.5 text-gray-400 pointer-events-none"
                  size={18}
                />
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder={
                    "Enter keywords separated by commas or new lines\nExample:\nipo news, market analysis, investment tips\nstock market\nfinancial updates"
                  }
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[120px] resize-y text-sm"
                />
              </div>

              {keywords && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Preview ({processKeywords(keywords).length} keywords):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {processKeywords(keywords)
                      .slice(0, 10)
                      .map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-xs text-emerald-700"
                        >
                          <Hash size={12} className="text-emerald-500" />
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
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Short Summary
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Short summary..."
                className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm resize-y"
              />
            </div>

            {/* HTML CONTENT */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <label className="block px-5 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
                HTML Content (Detailed Description){" "}
                <span className="text-red-500">*</span>
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
              <div className="relative group">
                <button
                  type="submit"
                  disabled={!canPublish}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-medium transition-all shadow-sm ${
                    canPublish
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Save size={18} />
                  {loading ? "Publishing..." : "Publish"}
                </button>

                {/* Hover tooltip when disabled */}
                {!canPublish && (
                  <div
                    className="pointer-events-none absolute bottom-full right-0 mb-3 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    role="tooltip"
                  >
                    {imageUploading
                      ? "Image is uploading…"
                      : loading
                      ? "Publishing…"
                      : !imageUrl
                      ? "Upload a featured image first"
                      : "Please wait…"}
                    <span className="absolute top-full right-6 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminBlogClient;