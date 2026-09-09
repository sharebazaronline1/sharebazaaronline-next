// src/components/AdminLoginClient.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const AdminLoginClient = () => {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // "success", "error", "pending"

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("pending");

    console.log("=== ADMIN LOGIN STARTED ===");
    console.log("Email:", email);

    try {
      // Step 1: Sign in
      console.log("1. Calling signInWithPassword...");
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      console.log("2. Login SUCCESS - user ID:", authData.user?.id);

      // Step 2: Check admin
      console.log("3. Querying profiles table...");
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", authData.user.id)
        .maybeSingle();

      console.log("QUERY FINISHED - raw response:", { profile, profileError });

      if (profileError) {
        console.error("PROFILE ERROR:", profileError.message);
        throw new Error("Profile query failed: " + profileError.message);
      }

      if (!profile) {
        console.warn("No profile row found for this user");
        throw new Error("No profile found - cannot verify admin status");
      }

      console.log("Profile data:", profile);
      console.log("is_admin value:", profile.is_admin);

      if (profile.is_admin !== true) {
        console.warn("User is NOT admin");
        await supabase.auth.signOut();
        throw new Error("Access denied. Admin privileges required.");
      }

      console.log("4. ADMIN CONFIRMED - redirecting");
      setStatus("success");
      router.push("/admin/dashboard");

    } catch (err) {
      console.error("LOGIN FAILED:", err.message);
      console.error("Full error:", err);
      setStatus("error");
      alert(`Login failed: ${err.message}\n\nCheck console → look for "QUERY FINISHED" and "PROFILE ERROR"`);
    } finally {
      console.log("=== ADMIN LOGIN FINISHED ===");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
              <p className="mt-2 text-gray-600">Secure access only</p>
            </div>

            {status === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                Login failed. Check console (F12) for details.
              </div>
            )}

            {status === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                Login successful! Redirecting...
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition disabled:opacity-60"
                  placeholder="admin@test.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition disabled:opacity-60"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Signing in...
                  </>
                ) : (
                  "Login as Admin"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <button
                onClick={() => router.push("/login")}
                className="text-gray-600 hover:text-green-600 transition"
              >
                ← Back to User Login
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginClient;