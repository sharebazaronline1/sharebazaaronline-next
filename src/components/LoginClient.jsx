// src/components/LoginClient.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from 'next/link';
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/profile"; // new utility

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sharebazaaronline.com";

const LoginClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");

  // Save referral code from URL
  useEffect(() => {
    const saveReferral = async () => {
      const ref = searchParams?.get("ref");
      if (!ref) return;

      const { data: referrer } = await supabase
        .from("profiles")
        .select("id")
        .eq("sb_user_id", ref)
        .maybeSingle();

      if (!referrer) {
        console.error("Invalid referral code");
        return;
      }

      localStorage.setItem("referral_code", ref);
      localStorage.setItem("pending_referral", ref);
      sessionStorage.setItem("referral_code", ref);
    };

    saveReferral();
  }, [searchParams]);

  const applyReferral = async (user) => {
    try {
      const referralCode = localStorage.getItem("pending_referral") || localStorage.getItem("referral_code");
      if (!referralCode || !user?.id) return;

      // Ensure profile exists
      const profile = await ensureProfile(supabase, user);
      if (!profile) {
        console.error("Could not ensure profile for referral");
        return;
      }

      const currentProfile = profile;

      if (currentProfile.sb_user_id === referralCode) {
        console.error("Self referral blocked");
        return;
      }

      if (!currentProfile.referred_by_code) {
        await supabase
          .from("profiles")
          .update({ referred_by_code: referralCode })
          .eq("id", user.id);
      }

      const { data: referrerProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("sb_user_id", referralCode)
        .single();

      if (!referrerProfile) return;

      const { data: existingReferral } = await supabase
        .from("referrals")
        .select("id")
        .eq("referred_sb_user_id", currentProfile.id)
        .single();

      if (existingReferral) return;

      await supabase.from("referrals").insert({
        referrer_sb_user_id: referrerProfile.id,
        referred_sb_user_id: currentProfile.id,
        referred_name: currentProfile.full_name || user.user_metadata?.full_name || "New User",
        referred_email: currentProfile.email || user.email,
        referred_mobile: currentProfile.mobile || null,
        status: "pending",
        reward_amount: 0,
        commission_earned: 0,
      });

      console.log("Referral inserted successfully");

    } catch (err) {
      console.error("applyReferral error:", err);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          alert("Please enter your full name");
          setLoading(false);
          return;
        }

        if (!mobile.trim()) {
          alert("Please enter mobile number");
          setLoading(false);
          return;
        }

        const referralCode = localStorage.getItem("pending_referral") || localStorage.getItem("referral_code");

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              mobile,
            },
          },
        });

        if (error) throw error;

        // Ensure profile is created (trigger may not always run)
        if (data.user) {
          await ensureProfile(supabase, data.user);
        }

        if (referralCode) {
          localStorage.setItem("pending_referral", referralCode);
        }

        alert("Check your email to verify your account");
        setIsSignUp(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      if (!user.email_confirmed_at) {
        alert("Please verify your email before logging in 📩");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Ensure profile exists
      await ensureProfile(supabase, user);

      await supabase
        .from("profiles")
        .update({
          mobile: user.user_metadata?.mobile || null,
          email_verified: true,
        })
        .eq("sb_user_id", user.id);

      await applyReferral(user);
      
      router.replace("/dashboard");

    } catch (error) {
      alert(
        error.message.includes("Invalid login credentials")
          ? "Incorrect email or password"
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const ref =
        localStorage.getItem("pending_referral") ||
        localStorage.getItem("referral_code") ||
        searchParams?.get("ref");

      const callbackUrl =
        `${window.location.origin}/auth/callback`;

      console.log("Google OAuth callback URL:", callbackUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) {
        console.error("Google OAuth error:", error);
        alert(error.message);
        return;
      }

      console.log("OAuth started:", data);
    } catch (error) {
      console.error("Google login exception:", error);
      alert(error.message);
    }
  };

  // Breadcrumb items for JSON-LD
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Login", url: "/login" },
  ];

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Login - ShareBazaarOnline",
    description: "Login to your ShareBazaarOnline account to track IPOs, unlisted shares, corporate actions, and manage your investment portfolio.",
    url: `${SITE_URL}/login`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="min-h-screen bg-white">
        <div
          className="flex-1 flex items-center justify-end px-6 sm:px-12 py-12 bg-cover bg-center bg-no-repeat min-h-[calc(100vh-80px)]"
          style={{
            backgroundImage: "url('/images/login.jpeg')",
            backgroundSize: "70%",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm relative z-10"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 pt-8 sm:p-7">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-black text-gray-900">
                    {isSignUp ? "Create Account" : "Welcome Back"}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {isSignUp
                      ? "Join India's trusted investment platform"
                      : "Sign in to track IPOs & unlisted shares"}
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleEmailAuth}>
                  {isSignUp && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  )}
                  {isSignUp && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#16A34A] text-white font-bold rounded-xl hover:bg-[#15803D] transition disabled:opacity-60"
                  >
                    {loading
                      ? "Please wait..."
                      : isSignUp
                      ? "Create Account"
                      : "Sign In"}
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="mt-6 text-center text-sm text-gray-600">
                  {isSignUp ? "Already have an account?" : "New to ShareBazaarOnline?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-semibold text-green-600 hover:text-green-700 transition"
                  >
                    {isSignUp ? "Sign In" : "Create an account"}
                  </button>
                </p>

                <div className="mt-4 text-center">
                  <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition inline-flex items-center gap-1">
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginClient;