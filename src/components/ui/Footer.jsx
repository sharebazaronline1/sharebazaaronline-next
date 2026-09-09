"use client";
import Link from 'next/link';
import { FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer(){
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 px-4 lg:px-6">
      <div className="w-full max-w-[1600px] mx-auto rounded-t-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white shadow-2xl">
        {/* TOP CTA SECTION */}
        <div className="relative overflow-hidden bg-gradient-to-r from-cyan-700 via-cyan-800 to-blue-900 px-8 lg:px-14 py-12">
          <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-8">
            <div className="text-center xl:text-left">
              <h2 className="text-3xl lg:text-4xl font-semibold text-white">Smarter Investing Starts Here</h2>
              <p className="mt-3 text-white/80 text-lg max-w-3xl">IPOs, Unlisted Shares, Broker Comparison and Investment Research — all in one platform.</p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center xl:justify-end gap-4 w-full xl:w-auto">
              <Link href="/ipo" className="w-full sm:w-auto px-6 py-4 rounded-xl bg-green-600 text-white font-bold shadow-lg transition-all hover:scale-[1.02] text-center">Explore IPOs</Link>
              <Link href="/comparebrokers" className="w-full sm:w-auto px-6 py-4 rounded-xl border border-white/70 text-white font-bold hover:bg-white/10 transition text-center">Compare Brokers</Link>
              <Link href="/pre-ipo-stocks" className="w-full sm:w-auto px-6 py-4 rounded-xl bg-green-600 text-white font-bold shadow-lg transition-all hover:scale-[1.02] text-center">Pre-IPO</Link>
            </div>
          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="px-8 lg:px-20 py-12">
          <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-center md:justify-start">
                <img src="/images/sharebazaar.png" alt="ShareBazaarOnline" className="h-10 lg:h-12 w-auto object-contain mb-4" />
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6 text-center md:text-left">Vaishnavi Tech Park, South Tower, 3rd Floor<br/>Sarjapur Main Road, Bellandur<br/>Bengaluru – 560103, Karnataka</p>

              <div className="space-y-4 flex flex-col items-center md:items-start">
                <div className="text-center md:text-left">
                  <p className="text-sm font-semibold text-white mb-3">Contact Us</p>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/50 transition">
                      <FaTwitter size={18} />
                    </a>
                    <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/50 transition">
                      <FaInstagram size={18} />
                    </a>
                    <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/50 transition">
                      <FaLinkedin size={18} />
                    </a>
                    <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-green-400 hover:border-green-500/50 transition">
                      <FaYoutube size={18} />
                    </a>
                  </div>
                </div>

                <div>
                  <a href="mailto:support@sharebazaaronline.com" className="text-sm text-slate-300 hover:text-green-400 transition">support@sharebazaaronline.com</a>
                </div>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-5">COMPANY</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link href="/about" className="hover:text-green-400 transition">About Us</Link></li>
                <li><Link href="/ipo" className="hover:text-green-400 transition">IPO Tracker</Link></li>
                <li><Link href="/skill-up" className="hover:text-green-400 transition">SkillUp</Link></li>
                <li><Link href="/insight-hub" className="hover:text-green-400 transition">Insight Hub</Link></li>
                <li><a href="mailto:support@sharebazaaronline.com" className="hover:text-green-400 transition">Help & Support</a></li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-5">PRODUCTS</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link href="/ipo" className="hover:text-green-400 transition">IPO Updates</Link></li>
                <li><Link href="/pre-ipo-stocks" className="hover:text-green-400 transition">Unlisted Shares</Link></li>
                <li><Link href="/broker-analyzer" className="hover:text-green-400 transition">Broker Analyzer</Link></li>
                <li><Link href="/skill-up" className="hover:text-green-400 transition">ETFs</Link></li>
                <li><Link href="/skill-up" className="hover:text-green-400 transition">Mutual Funds</Link></li>
                <li><Link href="/skill-up" className="hover:text-green-400 transition">NFO</Link></li>
                <li><Link href="/corporateactions" className="hover:text-green-400 transition">Corporate Actions</Link></li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-white mb-5">RESOURCES</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link href="/insight-hub" className="hover:text-green-400 transition">Blogs</Link></li>
                <li><Link href="/ipo" className="hover:text-green-400 transition">IPO Calendar</Link></li>
                <li><Link href="/how-to-apply-ipo" className="hover:text-green-400 transition">How to Invest</Link></li>
                <li><a href="mailto:support@sharebazaaronline.com" className="hover:text-green-400 transition">Help Center</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p className="text-center lg:text-left">© {year} Sharebazaaronline. All rights reserved.</p>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link href="/privacy" className="hover:text-green-400 transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-green-400 transition">Terms and Conditions</Link>
              <Link href="/disclaimer" className="hover:text-green-400 transition">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}