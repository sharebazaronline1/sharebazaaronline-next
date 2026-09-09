// src/components/UserProfileDropdown.jsx
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Settings, LogOut, User, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/profile";

const UserProfileDropdown = () => {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({
    displayName: "Guest",
    email: "",
    userID: "SB-NOTSET",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !mounted) return;

      setUser(user);

      // Ensure profile exists and get the profile data
      const profile = await ensureProfile(supabase, user);
      if (!profile) {
        // Fallback: use user metadata
        const email = user.email || "No email";
        let name = user.user_metadata?.full_name || user.user_metadata?.name || email.split("@")[0];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        setUserData({
          displayName: name,
          email,
          userID: "SB-NOTSET",
        });
        return;
      }

      const email = user.email || "No email";
      let name = user.user_metadata?.full_name || user.user_metadata?.name || email.split("@")[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);

      setUserData({
        displayName: name,
        email,
        userID: profile.sb_user_id || "SB-NOTSET",
      });
    };

    getUser();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Guest";

  const avatarLetter = displayName.charAt(0).toUpperCase() || "?";

  // Close dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close dropdown on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const navItems = [
    { href: "/dashboard", icon: User, label: "Dashboard" },
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/settings", icon: Settings, label: "Settings" },
    { href: "/referrals", icon: Share2, label: "Refer & Earn", highlight: true },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle user menu"
        aria-expanded={isOpen}
        className="flex items-center gap-3 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
      >
        <div className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center text-white font-semibold">
          {avatarLetter}
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <p className="text-base font-bold text-gray-900">
                {userData.displayName}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                ID: {userData.userID}
              </p>
              <p className="text-xs text-gray-500 truncate mt-1">
                {userData.email}
              </p>
            </div>

            <div className="py-2" role="menu">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors ${
                      item.highlight ? "hover:bg-green-50 text-green-600" : ""
                    } ${isActive ? "bg-gray-50" : ""}`}
                    role="menuitem"
                  >
                    <Icon size={18} className={item.highlight ? "text-green-600" : ""} />
                    <span className={`text-sm ${item.highlight ? "font-medium" : ""}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="border-t">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-red-50 text-red-600 transition-colors"
                role="menuitem"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileDropdown;