// src/components/AdminSidebar.jsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Share2,
  Settings,
  X,
  TrendingUp,
  Layers,
  ShieldCheck,
  IndianRupee,
  Newspaper,
  Activity,
  ClipboardList,
  ScrollText,
} from "lucide-react";

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { href: "/admin/users", icon: <Users size={18} />, label: "Users" },
    { href: "/admin/kyc", icon: <FileCheck size={18} />, label: "KYC Verification" },
    { href: "/admin/referrals", icon: <Share2 size={18} />, label: "Referrals" },
    { href: "/admin/preipo", icon: <TrendingUp size={18} />, label: "Pre IPO" },
    { href: "/admin/orders", icon: <IndianRupee size={18} />, label: "Orders" },
    { href: "/admin/blogs", icon: <Newspaper size={18} />, label: "Blogs" },
    { href: "/admin/corporate", icon: <Layers size={18} />, label: "Corporate Actions" },
    { href: "/admin/ipo-upload", icon: <Layers size={18} />, label: "Upload IPOs" },
    { href: "/admin/add-corporate", icon: <ClipboardList size={18} />, label: "Corporate Upload" },
    { href: "/admin/signals", icon: <Activity size={18} />, label: "Signal Upload" },
    { href: "/admin/settings", icon: <Settings size={18} />, label: "Settings" },
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
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-50 transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col shadow-xl`}
        role="navigation"
        aria-label="Admin Navigation"
      >
        {/* Header with Logo */}
        <div className="p-6 flex justify-between items-center bg-white border-b border-gray-100">
          <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
            <img src="/images/sharebazaar.png" alt="ShareBazaarOnline" className="h-8" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
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

        {/* Footer */}
        <div className="p-4 text-xs text-gray-500 border-t border-gray-100">
          Logged in as <span className="font-medium">Admin</span>
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ href, icon, label, isActive, setMobileOpen }) => (
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

export default AdminSidebar;