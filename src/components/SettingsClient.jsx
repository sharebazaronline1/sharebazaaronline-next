// src/components/SettingsClient.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "./Sidebar";
import UserProfileDropdown from "./UserProfileDropdown";
import {
  Menu,
  Settings as SettingsIcon,
  User,
  Mail,
  Lock,
  BellRing,
  Moon,
  Smartphone,
  CreditCard,
  Globe,
} from "lucide-react";

const SettingsClient = ({ user, profile }) => {
  const router = useRouter();
  const supabase = createClient();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name || user?.user_metadata?.name || ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || profile?.mobile || "Not set");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [ipoAlerts, setIpoAlerts] = useState(true);
  const [gmpUpdates, setGmpUpdates] = useState(true);
  const [orderStatus, setOrderStatus] = useState(true);
  const [portfolioChanges, setPortfolioChanges] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [editSecurity, setEditSecurity] = useState(false);

  // Update profile (name & phone)
  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: displayName },
      });

      if (updateError) throw updateError;

      // Update profile table with phone and other fields if needed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          full_name: displayName,
          mobile: phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setMessage("Profile updated successfully!");
      setEditProfile(false);
    } catch (error) {
      setMessage("Error updating profile: " + error.message);
    }
    setLoading(false);
  };

  // Update password (requires re-authentication)
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }
    if (!currentPassword) {
      setMessage("Current password is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Re-authenticate with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEditSecurity(false);
    } catch (error) {
      setMessage("Error updating password: " + error.message);
    }
    setLoading(false);
  };

  // Save notification & app preferences (just UI state for now)
  const handleSavePreferences = () => {
    // In a real app, you would save these preferences to a user_preferences table
    // For now, we just show a success message
    setMessage("Preferences saved successfully!");
  };

  // Handle dark mode toggle - apply to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // If user not available (shouldn't happen due to server redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />
      <main className="md:ml-64 p-4 md:p-8 transition-all">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-20 bg-white border-gray-200 px-4 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSidebarOpen(true)} className="p-1">
                <Menu size={24} />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 leading-tight">Settings</h1>
            </div>
            <div className="shrink-0">
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your profile, security, preferences, and account</p>
          </div>
          <UserProfileDropdown />
        </header>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}>
            {message}
          </div>
        )}

        {/* Profile Section */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <User className="text-green-600" />
              Profile Information
            </h2>
            {!editProfile && (
              <button onClick={() => setEditProfile(true)} className="text-green-600 hover:underline font-medium">
                Edit
              </button>
            )}
          </div>
          {!editProfile ? (
            <div className="space-y-3 text-gray-700">
              <p><strong className="text-gray-900">Name:</strong> {displayName || "Not set"}</p>
              <p><strong className="text-gray-900">Email:</strong> {email}</p>
              <p><strong className="text-gray-900">Phone:</strong> {phone}</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full border border-gray-300 rounded-xl px-5 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          )}
          {editProfile && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="bg-[#16A34A] text-white px-6 py-3 rounded-xl hover:bg-[#15803D] transition font-medium disabled:opacity-50"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
              <button onClick={() => setEditProfile(false)} className="text-gray-600 hover:text-gray-900 font-medium">
                Cancel
              </button>
            </div>
          )}
        </section>

        {/* Security Section */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lock className="text-green-600" />
              Security
            </h2>
            {!editSecurity && (
              <button onClick={() => setEditSecurity(true)} className="text-green-600 hover:underline font-medium">
                Change Password
              </button>
            )}
          </div>
          {!editSecurity ? (
            <div className="space-y-3 text-gray-700">
              <p><strong className="text-gray-900">Password:</strong> ••••••••</p>
              <p><strong className="text-gray-900">Two-Factor Authentication:</strong> Not enabled</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}
          {editSecurity && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleUpdatePassword}
                disabled={loading}
                className="bg-[#16A34A] text-white px-6 py-3 rounded-xl hover:bg-[#15803D] transition font-medium disabled:opacity-50"
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
              <button onClick={() => setEditSecurity(false)} className="text-gray-600 hover:text-gray-900 font-medium">
                Cancel
              </button>
            </div>
          )}
        </section>

        {/* Notification Preferences */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BellRing className="text-green-600" />
            Notification Preferences
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className="text-gray-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">General alerts</p>
                </div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                  className="hidden"
                />
                <div
                  className={`w-11 h-6 rounded-full px-0.5 transition-colors duration-200 flex items-center
                    ${emailNotifications ? "bg-[#16A34A] justify-end" : "bg-gray-300 justify-start"}
                  `}
                >
                  <div className="h-5 w-5 bg-white rounded-full shadow" />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className="text-gray-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">IPO Alerts</p>
                  <p className="text-sm text-gray-600">New IPO openings, closings</p>
                </div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ipoAlerts}
                  onChange={() => setIpoAlerts(!ipoAlerts)}
                  className="hidden"
                />
                <div
                  className={`w-11 h-6 rounded-full px-0.5 transition-colors duration-200 flex items-center
                    ${ipoAlerts ? "bg-[#16A34A] justify-end" : "bg-gray-300 justify-start"}
                  `}
                >
                  <div className="h-5 w-5 bg-white rounded-full shadow" />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className="text-gray-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">GMP Updates</p>
                  <p className="text-sm text-gray-600">Grey market premium changes</p>
                </div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={gmpUpdates}
                  onChange={() => setGmpUpdates(!gmpUpdates)}
                  className="hidden"
                />
                <div
                  className={`w-11 h-6 rounded-full px-0.5 transition-colors duration-200 flex items-center
                    ${gmpUpdates ? "bg-[#16A34A] justify-end" : "bg-gray-300 justify-start"}
                  `}
                >
                  <div className="h-5 w-5 bg-white rounded-full shadow" />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className="text-gray-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Order Status</p>
                  <p className="text-sm text-gray-600">Order execution alerts</p>
                </div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={orderStatus}
                  onChange={() => setOrderStatus(!orderStatus)}
                  className="hidden"
                />
                <div
                  className={`w-11 h-6 rounded-full px-0.5 transition-colors duration-200 flex items-center
                    ${orderStatus ? "bg-[#16A34A] justify-end" : "bg-gray-300 justify-start"}
                  `}
                >
                  <div className="h-5 w-5 bg-white rounded-full shadow" />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className="text-gray-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Portfolio Changes</p>
                  <p className="text-sm text-gray-600">Value changes, dividends</p>
                </div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={portfolioChanges}
                  onChange={() => setPortfolioChanges(!portfolioChanges)}
                  className="hidden"
                />
                <div
                  className={`w-11 h-6 rounded-full px-0.5 transition-colors duration-200 flex items-center
                    ${portfolioChanges ? "bg-[#16A34A] justify-end" : "bg-gray-300 justify-start"}
                  `}
                >
                  <div className="h-5 w-5 bg-white rounded-full shadow" />
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="mt-6 bg-[#16A34A] text-white px-6 py-3 rounded-xl hover:bg-[#15803D] transition font-medium"
          >
            Save Preferences
          </button>
        </section>

        {/* Theme & Language */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <SettingsIcon className="text-green-600" />
            App Preferences
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="text-gray-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">Switch to dark theme</p>
                </div>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="hidden"
                />
                <div
                  className={`w-11 h-6 rounded-full px-0.5 transition-colors duration-200 flex items-center
                    ${darkMode ? "bg-[#16A34A] justify-end" : "bg-gray-300 justify-start"}
                  `}
                >
                  <div className="h-5 w-5 bg-white rounded-full shadow" />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="text-gray-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Language</p>
                  <p className="text-sm text-gray-600">Select app language</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-gray-300 rounded-xl px-5 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Gujarati</option>
                <option>Marathi</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="mt-6 bg-[#16A34A] text-white px-6 py-3 rounded-xl hover:bg-[#15803D] transition font-medium"
          >
            Save Preferences
          </button>
        </section>

        {/* Active Devices */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Smartphone className="text-green-600" />
            Active Devices
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <p className="text-gray-700">Current Device - Web Browser</p>
              <button className="text-red-600 hover:underline font-medium">Log out</button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-700">Mobile App - Android (Last active: Today)</p>
              <button className="text-red-600 hover:underline font-medium">Log out</button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Manage devices logged into your account</p>
        </section>
      </main>
    </div>
  );
};

export default SettingsClient;