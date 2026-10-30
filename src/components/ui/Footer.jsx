"use client";
import Link from 'next/link';
import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  const productLinks = [
    { label: "IPO Tracker", href: "/ipo" },
    { label: "Unlisted Shares", href: "/pre-ipo" },
    { label: "Broker Analyzer", href: "/broker-analyzer" },
    { label: "Corporate Actions", href: "/corporate-actions" },
  ];

  const resourceLinks = [
    { label: "Blogs & Insight Hub", href: "/insight-hub" },
    { label: "IPO Calendar", href: "/ipo-calendar" },
    { label: "Corporate Actions Calendar", href: "/corporate-actions-calendar" },
    { label: "How to Invest", href: "/how-to-apply-ipo" },
    { label: "Help Center", href: "mailto:sharebazaronline1@gmail.com" },
    { label: "Report an Issue", href: "/report-issue" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms and Conditions", href: "/terms" },
    { label: "Disclaimer", href: "/disclaimer" },
  ];

  return (
    <footer className="w-full">
      <div className="w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white shadow-2xl">
        {/* TOP CTA SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-r from-cyan-700 via-cyan-800 to-blue-900 px-4 sm:px-8 lg:px-14 py-10 lg:py-12">
        

          <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-8 w-full">
            <div className="text-center xl:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
                Smarter Investing Starts Here
              </h2>
              <p className="mt-3 text-white/80 text-base sm:text-lg max-w-3xl">
                IPOs, Unlisted Shares, Broker Comparison and Investment Research — all in one platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center xl:justify-end gap-4 w-full xl:w-auto">
              <Link
                href="/ipo"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-green-600 text-white font-bold shadow-lg transition-all hover:scale-[1.02] text-center"
              >
                Explore IPOs
              </Link>
              <Link
                href="/compare-brokers"
                className="w-full sm:w-auto px-6 py-4 rounded-xl border border-white/70 text-white font-bold hover:bg-white/10 transition text-center"
              >
                Compare Brokers
              </Link>
              <Link
                href="/pre-ipo"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-green-600 text-white font-bold shadow-lg transition-all hover:scale-[1.02] text-center"
              >
                Pre-IPO
              </Link>
            </div>
          </div>
        </div>

        {/* MAIN FOOTER */}
        <div
          className="relative px-4 sm:px-8 lg:px-20 pt-10 lg:pt-12 pb-32 lg:pb-12 overflow-hidden"
          style={{ paddingBottom: "max(8rem, env(safe-area-inset-bottom, 0px) + 6rem)" }}
        >
          {/* Candlestick chart (subtle, bottom-right) */}
          <div className="absolute bottom-6 right-6 opacity-[0.05] pointer-events-none hidden lg:block">
            <svg width="220" height="110" viewBox="0 0 220 110" fill="none">
              {[
                { x: 8, h: 28, y: 60, up: true },
                { x: 34, h: 18, y: 70, up: false },
                { x: 60, h: 38, y: 44, up: true },
                { x: 86, h: 22, y: 56, up: false },
                { x: 112, h: 44, y: 32, up: true },
                { x: 138, h: 16, y: 72, up: false },
                { x: 164, h: 52, y: 22, up: true },
                { x: 190, h: 26, y: 58, up: true },
              ].map((c, idx) => (
                <g key={idx}>
                  <line
                    x1={c.x + 4}
                    y1={c.y - 8}
                    x2={c.x + 4}
                    y2={c.y + c.h + 8}
                    stroke="#22D3EE"
                    strokeWidth="1"
                  />
                  <rect
                    x={c.x}
                    y={c.y}
                    width="8"
                    height={c.h}
                    rx="1"
                    fill={c.up ? "#22D3EE" : "#38BDF8"}
                  />
                </g>
              ))}
            </svg>
          </div>

          <div className="relative w-full">
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent mb-10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
              {/* BRANDING */}
              <div className="sm:col-span-2 lg:col-span-2">
                <div className="flex items-center justify-center md:justify-start">
                  <img
                    src="/images/sharebazaar.png"
                    alt="ShareBazaarOnline"
                    className="h-10 lg:h-12 w-auto object-contain mb-4"
                  />
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6 text-center md:text-left">
                  Vaishnavi Tech Park, South Tower, 3rd Floor
                  <br />
                  Sarjapur Main Road, Bellandur
                  <br />
                  Bengaluru – 560103, Karnataka
                </p>

                <div className="space-y-4 flex flex-col items-center md:items-start">
                  <div className="text-center md:text-left">
                
                    <div className="flex gap-4 justify-center md:justify-start">
                      <a
                        href="https://twitter.com/Sharebazaaronli"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/50 transition"
                      >
                        <FaTwitter size={18} />
                      </a>
                      <a
                        href="#"
                        aria-label="Instagram"
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/50 transition"
                      >
                        <FaInstagram size={18} />
                      </a>
                      <a
                        href="#"
                        aria-label="LinkedIn"
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/50 transition"
                      >
                        <FaLinkedin size={18} />
                      </a>
                      <a
                        href="https://www.youtube.com/@sharebazaronline9156"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/50 transition"
                      >
                        <FaYoutube size={18} />
                      </a>
                    </div>
                  </div>

                
                </div>
              </div>

              {/* COMPANY */}
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-white mb-5">COMPANY</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  {companyLinks.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="hover:text-green-400 transition">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PRODUCTS */}
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-white mb-5">PRODUCTS</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  {productLinks.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="hover:text-green-400 transition">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* RESOURCES */}
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-white mb-5">RESOURCES</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  {resourceLinks.map((item) => (
                    <li key={item.label}>
                      {item.href.startsWith("mailto:") ? (
                        <a
                          href={item.href}
                          className="hover:text-green-400 transition"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link href={item.href} className="hover:text-green-400 transition">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* LEGAL & POLICIES */}
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-white mb-5">
                  LEGAL &amp; POLICIES
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  {legalLinks.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="hover:text-green-400 transition">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DISCLAIMER */}
            <div className="mt-10 pt-8">
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-center">
                ShareBazaarOnline.com is an educational and information platform for Indian investors. We are not SEBI-registered Investment Advisers or Research Analysts. All content — including IPO analysis, dividend coverage, broker comparisons, and unlisted share information — is for information and education only, not personalised investment advice. Investments in securities markets carry risk; read all documents carefully and consult a SEBI-registered adviser before investing. Past performance does not guarantee future results. We do not guarantee the accuracy of information provided and are not liable for any loss from its use.{" "}
                <Link
                  href="/disclaimer"
                  className="text-green-400 hover:text-green-300 font-medium whitespace-nowrap"
                >
                  Read full disclaimer →
                </Link>
              </p>
            </div>

            {/* BOTTOM BAR — centered copyright only */}
            <div className="mt-8 pt-8 flex justify-center text-sm text-slate-400">
              <p className="text-center">
                © {year} Sharebazaaronline. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}