// src/components/HeaderAndNav.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Menu, X, LogOut, Settings, Bell } from "lucide-react";

import GlobalSearch from "@/components/GlobalSearch"; 

const HeaderAndNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ipoOpen, setIpoOpen] = useState(false);
  const [preIpoOpen, setPreIpoOpen] = useState(false);
  const [brokerOpen, setBrokerOpen] = useState(false);
  const [mobileIPO, setMobileIPO] = useState(false);
  const [mobilePreIPO, setMobilePreIPO] = useState(false);
  const [mobileBroker, setMobileBroker] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userID, setUserID] = useState("SB-XXXXXX");

  const ipoTimer = useRef(null);
  const preIpoTimer = useRef(null);
  const brokerTimer = useRef(null);
  const router = useRouter();

  // ───────────────────────────────────────────────
  // Auth logic (uncomment & adjust when you connect Supabase)
  // ───────────────────────────────────────────────
  /*
  useEffect(() => {
    const initializeUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        setUserID("SB-GUEST000");
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      let { data: profile } = await supabase
        .from("profiles")
        .select("sb_user_id")
        .eq("id", currentUser.id)
        .maybeSingle();

      let code = profile?.sb_user_id;

      if (!code) {
        code = generateShortId(currentUser.id);

        const { error } = await supabase
          .from("profiles")
          .update({ sb_user_id: code })
          .eq("id", currentUser.id);

        if (error) {
          console.error("Failed to save sb_user_id:", error);
        }
      }

      setUserID(code);
    };

    initializeUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          setUser(null);
          setUserID("SB-GUEST000");
          setProfileOpen(false);
        } else {
          initializeUser();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  */

  const handleLogout = async () => {
    // await supabase.auth.signOut();
    setUser(null);
    setUserID("SB-GUEST000");
    setProfileOpen(false);
    router.push("/");
    router.refresh(); // useful in App Router
  };

  const openWithDelay = (setter, timerRef) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setter(true);
  };

  const closeWithDelay = (setter, timerRef, delay = 150) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setter(false);
      timerRef.current = null;
    }, delay);
  };

  // Avatar letter
  const avatarLetter = user
    ? user.user_metadata?.full_name?.charAt(0)?.toUpperCase() ||
      user.email?.charAt(0)?.toUpperCase() ||
      "?"
    : "?";

  return (
    <header className="bg-white border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER FLEX */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 -ml-2 lg:-ml-16 cursor-pointer">
            <Image
              src="/images/sharebazaar.png"
              alt="ShareBazaarOnline"
              width={140}
              height={24}
              className="h-6 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-text-emerald-800/70 transition">
              Home
            </Link>

            {/* IPO Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openWithDelay(setIpoOpen, ipoTimer)}
              onMouseLeave={() => closeWithDelay(setIpoOpen, ipoTimer)}
            >
              <Link
                href="/ipoguide"
                className="flex items-center gap-1 font-medium text-gray-700 hover:text-text-emerald-800/70 transition"
              >
                IPO Tracker <span className="text-xl">▾</span>
              </Link>

              <div
                className={`absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-[999] transition-all duration-150 
                  ${
                    ipoOpen
                      ? "opacity-100 pointer-events-auto translate-y-0"
                      : "opacity-0 pointer-events-none translate-y-1"
                  }`}
              >
                <Link
                  href="/ipo"
                  className="block px-4 py-2 text-gray-700 hover:text-text-emerald-800/70 font-normal hover:bg-gray-50 rounded-xl"
                >
                  List Of IPO
                </Link>
              </div>
            </div>

            {/* Pre-IPO Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openWithDelay(setPreIpoOpen, preIpoTimer)}
              onMouseLeave={() => closeWithDelay(setPreIpoOpen, preIpoTimer)}
            >
              <Link
                href="/pre-ipo-guide"
                className="flex items-center gap-1 font-medium text-gray-700 hover:text-text-emerald-800/70 transition"
              >
                Pre IPO <span className="text-xl">▾</span>
              </Link>

              <div
                className={`absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-[999] transition-all duration-150 
                  ${
                    preIpoOpen
                      ? "opacity-100 pointer-events-auto translate-y-0"
                      : "opacity-0 pointer-events-none translate-y-1"
                  }`}
              >
                <Link
                  href="/pre-ipo-stocks"
                  className="block px-4 py-2 text-gray-700 hover:text-text-emerald-800/70 font-normal hover:bg-gray-50 rounded-xl"
                >
                  Pre-IPO List
                </Link>
              </div>
            </div>

            {/* Broker Analyzer Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openWithDelay(setBrokerOpen, brokerTimer)}
              onMouseLeave={() => closeWithDelay(setBrokerOpen, brokerTimer)}
            >
              <Link
                href="/broker-analyzer"
                className="flex items-center gap-1 font-medium text-gray-700 hover:text-text-emerald-800/70 transition"
              >
                Broker Analyzer <span className="text-xl">▾</span>
              </Link>

              <div
                className={`absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] transition-all duration-150 
                  ${
                    brokerOpen
                      ? "opacity-100 pointer-events-auto translate-y-0"
                      : "opacity-0 pointer-events-none translate-y-1"
                  }`}
              >
                <Link
                  href="/comparebrokers"
                  className="block px-4 py-2 text-gray-700 hover:text-text-emerald-800/70 font-normal hover:bg-gray-50 rounded-xl"
                >
                  Compare Brokers
                </Link>
              </div>
            </div>

            <Link
              href="/corporateactions"
              className="text-gray-700 hover:text-text-emerald-800/70 transition"
            >
              Corporate Actions
            </Link>
            <Link
              href="/insight-hub"
              className="text-gray-700 hover:text-text-emerald-800/70 transition"
            >
              Insight Hub
            </Link>
            <Link
              href="/skill-up"
              className="text-gray-700 hover:text-text-emerald-800/70 transition"
            >
              SkillUp
            </Link>

            {/* Global Search - Desktop */}
            <div className="flex items-center">
              <GlobalSearch />
            </div>

            {/* USER AUTH STATE */}
            {user ? (
              <div className="ml-4 lg:ml-8 relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 hover:bg-gray-100 rounded-full px-3 py-2 transition-all duration-200"
                  aria-label="User menu"
                >
                  <div className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center text-white font-medium">
                    {avatarLetter}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden xl:block">
                    {user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "User"}
                  </span>
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />

                    <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="px-5 py-4 bg-green-50 border-gray-100">
                        <p className="text-base font-bold text-gray-900">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">ID: {userID}</p>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition"
                        >
                          <User size={19} className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Dashboard
                          </span>
                        </Link>

                        <Link
                          href="/notifications"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition"
                        >
                          <Bell size={19} className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Notifications
                          </span>
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition"
                        >
                          <Settings size={19} className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            Settings
                          </span>
                        </Link>
                      </div>

                      <div className="border-gray-100 pt-2">
                        <button
                          onClick={() => {
                            handleLogout();
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-4 px-5 py-3 hover:bg-red-50 transition text-left"
                        >
                          <LogOut size={19} className="text-red-600" />
                          <span className="text-sm font-medium text-red-600">
                            Logout
                          </span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-4 lg:ml-8 px-7 py-2.5 bg-[#16A34A] text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl hover:bg-[#15803D] transform hover:scale-105 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Icons */}
          <div className="flex items-center gap-4 lg:hidden">
            {/* Global Search - Mobile (only icon) */}
            <GlobalSearch />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7 text-[#1e40af]" />
              ) : (
                <Menu className="w-7 h-7 text-[#1e40af]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-gray-200 shadow-lg">
          <div className="px-6 py-6 space-y-5 text-base font-medium max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              href="/"
              className="block text-[#1e40af] font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile IPO */}
            <div>
              <div className="flex justify-between items-center py-2">
                <Link
                  href="/ipoguide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-medium text-gray-800"
                >
                  IPO Tracker
                </Link>
                <button
                  onClick={() => setMobileIPO(!mobileIPO)}
                  className="text-xl font-medium text-gray-700"
                >
                  {mobileIPO ? "−" : "+"}
                </button>
              </div>
              {mobileIPO && (
                <div className="pl-6 space-y-2 mt-1">
                  <Link
                    href="/ipo"
                    className="block text-gray-600 hover:text-[#1e40af] font-normal"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    List Of IPO
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Pre-IPO */}
            <div>
              <div className="flex justify-between items-center py-2">
                <Link
                  href="/pre-ipoguide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-medium text-gray-800"
                >
                  Pre-IPO Stocks
                </Link>
                <button
                  onClick={() => setMobilePreIPO(!mobilePreIPO)}
                  className="text-xl font-medium text-gray-700"
                >
                  {mobilePreIPO ? "−" : "+"}
                </button>
              </div>
              {mobilePreIPO && (
                <div className="pl-6 space-y-2 mt-1">
                  <Link
                    href="/pre-ipo-stocks"
                    className="block text-gray-600 hover:text-[#1e40af] font-normal"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pre-IPO List
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Broker */}
            <div>
              <div className="flex justify-between items-center py-2">
                <Link
                  href="/broker-analyzer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-medium text-gray-800"
                >
                  Broker Analyzer
                </Link>
                <button
                  onClick={() => setMobileBroker(!mobileBroker)}
                  className="text-xl font-medium text-gray-700"
                >
                  {mobileBroker ? "−" : "+"}
                </button>
              </div>
              {mobileBroker && (
                <div className="pl-6 space-y-2 mt-1">
                  <Link
                    href="/comparebrokers"
                    className="block text-gray-600 hover:text-[#1e40af] font-normal"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Compare Brokers
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/corporateactions"
              className="block py-2 text-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Corporate Actions
            </Link>
            <Link
              href="/insight-hub"
              className="block py-2 text-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              Insight Hub
            </Link>
            <Link
              href="/skill-up"
              className="block py-2 text-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              SkillUp
            </Link>

            {/* Mobile Login / Profile */}
            {user ? (
              <div className="pt-4 border-gray-200">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 mb-3 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center text-white font-medium">
                    {avatarLetter}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.full_name ||
                        user.email?.split("@")[0] ||
                        "User"}
                    </p>
                    <p className="text-xs text-gray-600">ID: {userID}</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-green-600 font-medium mb-2"
                >
                  Go to Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center mt-6 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-[#16A34A] transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderAndNav;