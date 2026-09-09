// src/components/Sidebar.jsx
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogOut,
  Home,
  Briefcase,
  Bell,
  Settings,
  IndianRupee,
  FileText,
  BarChart2,
  AlertCircle,
  BriefcaseBusiness,
  X,
  User,
  LayoutDashboard,
  TrendingUp,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const Sidebar = ({ mobileOpen = false, setMobileOpen = () => {} }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Navigation links configuration
  const navLinks = [
    { href: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { href: "/pre-ipo-watchlist", icon: <AlertCircle size={18} />, label: "Pre-IPO Watchlist" },
    { href: "/kyc", icon: <BarChart2 size={18} />, label: "Documents" },
    { href: "/orders", icon: <IndianRupee size={18} />, label: "Orders" },
    { href: "/holdings", icon: <BriefcaseBusiness size={18} />, label: "Holdings" },
  ];

  return (
    <>
      {/* Overlay (Mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col shadow-xl`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header with Logo */}
        <div className="p-6 flex justify-between items-center bg-white border-b border-gray-100">
          <Link 
            href="/" 
            className="flex items-center"
            onClick={() => setMobileOpen(false)}
          >
            <img 
              src="/images/sharebazaar.png" 
              alt="ShareBazaarOnline" 
              className="h-8" 
            />
          </Link>
          
          {/* Close button (Mobile) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            
            return (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                isActive={isActive}
                setMobileOpen={setMobileOpen}
              />
            );
          })}
        </nav>

        {/* Ad Banner - Placed just above Logout */}
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 text-center">
            <p className="text-sm font-medium text-green-800 mb-2">
              Unlock Premium Features
            </p>
            <p className="text-xs text-gray-600 mb-3">
              Get exclusive IPO alerts, priority access & more!
            </p>
            <button className="w-full bg-[#16A34A] text-white text-sm font-medium py-2 rounded-lg hover:bg-[#15803D] transition">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({
  href,
  icon,
  label,
  isActive,
  setMobileOpen,
}) => (
  <Link
    href={href}
    onClick={() => setMobileOpen(false)}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
      ${isActive
        ? "bg-green-50 text-green-600 shadow-sm"
        : "text-gray-700 hover:bg-green-50 hover:text-green-600"
      }
    `}
  >
    <span className={isActive ? "text-green-600" : "text-gray-500"}>
      {icon}
    </span>
    <span>{label}</span>
    {isActive && (
      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
    )}
  </Link>
);

export default Sidebar;