// app/contact/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, MapPin, Mail, Home, ChevronRight } from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your backend
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
  };

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Contact Us", url: "/contact" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="bg-white min-h-screen w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8">
          {/* BREADCRUMB */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm font-medium text-slate-500 overflow-x-auto mb-6"
          >
            <ol className="flex items-center gap-2 whitespace-nowrap">
              <li>
                <Link
                  href="/"
                  className="hover:text-slate-900 flex items-center gap-1 transition-colors"
                >
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
              <li className="text-slate-900 font-semibold">Contact Us</li>
            </ol>
          </nav>

          {/* ===================== CONTACT US SECTION ===================== */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Contact Us
            </h1>
            <p className="mt-3 text-slate-500 text-sm sm:text-base">
              Please fill in the details below.
            </p>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
            {/* LEFT — INFO PANEL */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    Office Hours:
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base mt-1">
                    Monday to Saturday — 09:30 AM to 6:30 PM
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                    (Except Public Holidays)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    Registered Office:
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base mt-1">
                    Vaishnavi Tech Park, South Tower, 3rd Floor
                  </p>
                  <p className="text-slate-600 text-sm sm:text-base">
                    Sarjapur Main Road, Bellandur
                  </p>
                  <p className="text-slate-600 text-sm sm:text-base">
                    Bengaluru, 560103, Karnataka, India.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    Email:
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base mt-1">
                    <a
                      href="mailto:support@sharebazaaronline.com"
                      className="text-emerald-700 hover:underline break-all"
                    >
                      support@sharebazaaronline.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — CONTACT FORM */}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="sr-only">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={contactForm.fullName}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, fullName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="sr-only">Phone number</label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                  className="w-full px-4 py-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="sr-only">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="sr-only">Message</label>
                <textarea
                  rows={5}
                  placeholder="Enter a message"
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide transition"
              >
                SEND
              </button>

              {contactSubmitted && (
                <p className="text-emerald-700 text-sm text-center font-medium">
                  Thanks — your message has been sent.
                </p>
              )}
            </form>
          </section>

          {/* ===================== MAP ===================== */}
          <section className="mb-10">
            <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <iframe
                title="ShareBazaarOnline Office Location"
                src="https://www.google.com/maps?q=Vaishnavi+Tech+Park+South+Tower+Sarjapur+Main+Road+Bellandur+Bengaluru&output=embed"
                className="w-full h-[320px] sm:h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ContactPage;