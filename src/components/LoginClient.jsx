"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://sharebazaaronline.com";

const LoginClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const authHandled = useRef(false);
  const mountedRef = useRef(true);

  /* ============================================================
     REFERRAL STORAGE HELPERS
  ============================================================ */
  const getPendingReferral = () => {
    return (
      localStorage.getItem("pending_referral") ||
      localStorage.getItem("referral_code") ||
      sessionStorage.getItem("referral_code")
    );
  };

  const savePendingReferral = (referralCode) => {
    if (!referralCode) return;
    localStorage.setItem("pending_referral", referralCode);
    localStorage.setItem("referral_code", referralCode);
    sessionStorage.setItem("referral_code", referralCode);
  };

  const clearPendingReferral = () => {
    localStorage.removeItem("pending_referral");
    localStorage.removeItem("referral_code");
    localStorage.removeItem("oauth_referral");
    sessionStorage.removeItem("referral_code");
  };

  /* ============================================================
     WAIT FOR PROFILE (trigger may take a moment to fire)
  ============================================================ */
  const waitForProfile = async (userId) => {
    for (let i = 0; i < 30; i++) {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
            id,
            full_name,
            email,
            mobile,
            sb_user_id,
            referred_by_code
          `
        )
        .eq("id", userId)
        .maybeSingle();

      if (data) return data;

      if (error) {
        console.error("Profile lookup error:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return null;
  };

  /* ============================================================
     APPLY REFERRAL (mirrors Login.jsx logic)
  ============================================================ */
  const applyReferral = async (user) => {
    try {
      if (!user?.id) return;

      const referralCode = getPendingReferral();
      if (!referralCode) return;

      const currentProfile = await waitForProfile(user.id);

      if (!currentProfile) {
        console.error(
          "Profile was not available for referral processing"
        );
        return;
      }

      /* Self-referral guard */
      if (currentProfile.sb_user_id === referralCode) {
        console.error("Self referral blocked");
        clearPendingReferral();
        return;
      }

      /* Already referred — nothing to do */
      if (currentProfile.referred_by_code) {
        clearPendingReferral();
        return;
      }

      /* Find referrer */
      const { data: referrerProfile, error: referrerError } =
        await supabase
          .from("profiles")
          .select("id, sb_user_id")
          .eq("sb_user_id", referralCode)
          .maybeSingle();

      if (referrerError || !referrerProfile) {
        console.error(
          "Invalid referral code:",
          referrerError || referralCode
        );
        clearPendingReferral();
        return;
      }

      if (referrerProfile.id === currentProfile.id) {
        console.error("Self referral blocked");
        clearPendingReferral();
        return;
      }

      /* Check for existing referral row */
      const { data: existingReferral, error: existingReferralError } =
        await supabase
          .from("referrals")
          .select("id")
          .eq("referred_sb_user_id", currentProfile.id)
          .maybeSingle();

      if (existingReferralError) {
        console.error("Referral check failed:", existingReferralError);
        return;
      }

      if (existingReferral) {
        clearPendingReferral();
        return;
      }

      /* Update profile — only if referred_by_code is still null */
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ referred_by_code: referralCode })
        .eq("id", currentProfile.id)
        .is("referred_by_code", null);

      if (profileUpdateError) {
        console.error(
          "Referral profile update failed:",
          profileUpdateError
        );
        return;
      }

      /* Insert referral row */
      const { error: insertError } = await supabase
        .from("referrals")
        .insert({
          referrer_sb_user_id: referrerProfile.id,
          referred_sb_user_id: currentProfile.id,
          referred_name:
            currentProfile.full_name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "New User",
          referred_email: currentProfile.email || user.email || null,
          referred_mobile:
            currentProfile.mobile ||
            user.user_metadata?.mobile ||
            null,
          status: "pending",
          reward_amount: 0,
          commission_earned: 0,
        });

      if (insertError) {
        console.error("Referral insert failed:", insertError);
        return;
      }

      clearPendingReferral();
    } catch (error) {
      console.error("Referral processing failed:", error);
    }
  };

  /* ============================================================
     MOUNTED TRACKER
  ============================================================ */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ============================================================
     SAVE URL ?ref= TO STORAGE ON LOAD
  ============================================================ */
  useEffect(() => {
    const referralCode = searchParams?.get("ref");
    if (referralCode) {
      savePendingReferral(referralCode);
    }
  }, [searchParams]);

  /* ============================================================
     HANDLE OAUTH CALLBACK (?code=… OR #access_token=…)
  ============================================================ */
  useEffect(() => {
    const params = searchParams;
    const hashParams = new URLSearchParams(
      window.location.hash.replace("#", "")
    );

    const hasAuthCallback =
      params?.has("code") || hashParams.has("access_token");

    const authError =
      params?.get("error_description") ||
      params?.get("error") ||
      hashParams.get("error_description") ||
      hashParams.get("error");

    if (authError) {
      console.error("Authentication callback error:", authError);
    }

    if (!hasAuthCallback) return;

    const processAuthenticatedUser = async (session) => {
      if (!session?.user || authHandled.current) return;

      authHandled.current = true;

      try {
        await applyReferral(session.user);

        if (!mountedRef.current) return;

        router.replace("/dashboard");
      } catch (error) {
        console.error("Authentication processing failed:", error);

        if (mountedRef.current) {
          router.replace("/dashboard");
        }
      }
    };

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        if (event !== "SIGNED_IN" && event !== "INITIAL_SESSION") {
          return;
        }

        if (!session?.user) return;

        setTimeout(() => {
          processAuthenticatedUser(session);
        }, 0);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams, router]);

  /* ============================================================
     EMAIL / PASSWORD AUTH
  ============================================================ */
  const handleEmailAuth = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      /* ---------- SIGN UP ---------- */
      if (isSignUp) {
        if (!fullName.trim()) {
          throw new Error("Please enter your full name");
        }
        if (!mobile.trim()) {
          throw new Error("Please enter mobile number");
        }

        const referralCode = getPendingReferral();

        const redirectUrl = new URL(
          `${window.location.origin}/login`
        );

        if (referralCode) {
          redirectUrl.searchParams.set("ref", referralCode);
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectUrl.toString(),
            data: {
              full_name: fullName.trim(),
              mobile: mobile.trim(),
            },
          },
        });

        if (error) throw error;

        if (referralCode) {
          savePendingReferral(referralCode);
        }

        if (data?.session?.user) {
          authHandled.current = true;
          await applyReferral(data.session.user);
          router.replace("/dashboard");
          return;
        }

        setIsSignUp(false);
        alert(
          "Account created successfully. Please check your email and verify your account before signing in."
        );
        return;
      }

      /* ---------- SIGN IN ---------- */
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      const user = data?.user;

      if (!user) {
        throw new Error("Unable to retrieve user information");
      }

      if (!user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error("Please verify your email before logging in.");
      }

      authHandled.current = true;

      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ email_verified: true })
        .eq("id", user.id);

      if (profileUpdateError) {
        console.error(
          "Profile verification update failed:",
          profileUpdateError
        );
      }

      await applyReferral(user);

      router.replace("/dashboard");
    } catch (error) {
      console.error("Authentication error:", error);

      alert(
        error?.message?.includes("Invalid login credentials")
          ? "Incorrect email or password"
          : error?.message || "Something went wrong"
      );
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  /* ============================================================
     GOOGLE OAUTH
  ============================================================ */
  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const referralCode =
        getPendingReferral() || searchParams?.get("ref");

      if (referralCode) {
        savePendingReferral(referralCode);
      }

      const redirectUrl = new URL(
        `${window.location.origin}/login`
      );

      if (referralCode) {
        redirectUrl.searchParams.set("ref", referralCode);
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl.toString(),
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("Google login error:", error);
      alert(error?.message || "Google login failed");

      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  /* ============================================================
     SCHEMAS
  ============================================================ */
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Login", url: "/login" },
  ];

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Login - ShareBazaarOnline",
    description:
      "Login to your ShareBazaarOnline account to track IPOs, unlisted shares, corporate actions, and manage your investment portfolio.",
    url: `${SITE_URL}/login`,
  };

  /* ============================================================
     RENDER
  ============================================================ */
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
                  disabled={loading}
                  className="w-full py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <p className="mt-6 text-center text-sm text-gray-600">
                  {isSignUp
                    ? "Already have an account?"
                    : "New to ShareBazaarOnline?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp((prev) => !prev)}
                    className="font-semibold text-green-600 hover:text-green-700 transition"
                  >
                    {isSignUp ? "Sign In" : "Create an account"}
                  </button>
                </p>

                <div className="mt-4 text-center">
                  <Link
                    href="/"
                    className="text-sm text-gray-500 hover:text-gray-700 transition inline-flex items-center gap-1"
                  >
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