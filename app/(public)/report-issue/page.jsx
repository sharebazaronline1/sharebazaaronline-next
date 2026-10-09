// app/report-issue/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Home,
  ChevronRight,
} from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

const ReportIssuePage = () => {
  const [form, setForm] = useState({
    category: "",
    subject: "",
    topic: "",
    currentText: "",
    correctedText: "",
    sourceLink: "",
    reporterName: "",
    reporterEmail: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Report Issue", url: "/report-issue" },
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
              <li className="text-slate-900 font-semibold">Report an Issue</li>
            </ol>
          </nav>

          {/* HERO */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Report an Issue
            </h1>
            <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
              Spotted something incorrect? Tell us what's wrong and we'll
              review, verify, and update it.
            </p>
          </header>

          {/* 3 STEP CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-base mb-2 text-slate-900">
                We review
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our editorial team reads every report and checks it against
                official sources.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-base mb-2 text-slate-900">
                We verify
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                If the information is wrong, we confirm the correct facts
                before changing anything.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-4">
                <RefreshCw className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-bold text-base mb-2 text-slate-900">
                We update
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Verified corrections are applied and the change is logged for
                accountability.
              </p>
            </div>
          </section>

          {/* REPORT FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                >
                  <option value="">Select a category</option>
                  <option value="ipo">IPO</option>
                  <option value="unlisted">Unlisted / Pre-IPO shares</option>
                  <option value="broker">Broker comparison</option>
                  <option value="corporate-action">Corporate actions</option>
                  <option value="blog">Blog / Insight Hub</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  Subject <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Short title of the issue"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                What is the issue about?{" "}
                <span className="text-emerald-600">*</span>
              </label>
              <select
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              >
                <option value="">Select a topic</option>
                <option value="incorrect-data">Incorrect data</option>
                <option value="outdated-info">Outdated information</option>
                <option value="missing-info">Missing information</option>
                <option value="broken-link">Broken link</option>
                <option value="typo">Typo / formatting</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                What does our page currently say? (optional)
              </label>
              <textarea
                rows={3}
                placeholder="Quote or describe the information you believe is inaccurate."
                value={form.currentText}
                onChange={(e) =>
                  setForm({ ...form, currentText: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition resize-y"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                What should it say instead?{" "}
                <span className="text-emerald-600">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Tell us the correct information as clearly as you can."
                value={form.correctedText}
                onChange={(e) =>
                  setForm({ ...form, correctedText: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition resize-y"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                Supporting link or source (optional)
              </label>
              <input
                type="url"
                placeholder="e.g. a regulator register or official page"
                value={form.sourceLink}
                onChange={(e) =>
                  setForm({ ...form, sourceLink: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                An official source helps us verify and act faster.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={form.reporterName}
                  onChange={(e) =>
                    setForm({ ...form, reporterName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  Your email (optional)
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={form.reporterEmail}
                  onChange={(e) =>
                    setForm({ ...form, reporterEmail: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Leaving your email lets us follow up if we need more detail. It
              is optional — you can report anonymously.
            </p>

            <button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide transition"
            >
              Submit report
            </button>

            {submitted && (
              <p className="flex items-center justify-center gap-2 text-emerald-700 text-sm font-medium">
                <CheckCircle2 size={16} /> Thanks — your report has been
                submitted.
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ReportIssuePage;