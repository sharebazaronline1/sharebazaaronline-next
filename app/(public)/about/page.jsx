// app/about/page.jsx
import Link from "next/link";
import {
  Building2,
  BarChart3,
  TrendingUp,
  Briefcase,
  Calendar,
  BookOpen,
  Users,
  ShieldCheck,
  Scale,
  Heart,
  RefreshCw,
  MapPin,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  Home,
} from "lucide-react";

import { FaXTwitter, FaYoutube } from "react-icons/fa6";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata = {
  metadataBase: new URL("https://www.sharebazaaronline.com"),
  title: "About Us",
  description:
    "Learn about ShareBazaarOnline.com — India's trusted platform for IPO tracking, pre-IPO & unlisted shares research, broker comparison, corporate actions, and market education.",
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
};

/* ================= REUSABLE ================= */
const Section = ({ title, children }) => (
  <section className="mb-8 sm:mb-10">
    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
      {title}
    </h2>
    {children}
  </section>
);

export default function AboutPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ];

  const offerings = [
    {
      title: "IPO Tracker",
      description:
        "Follow every Mainboard and SME IPO in India: price bands, lot sizes, subscription numbers, and listing performance. (Where we show grey-market sentiment, please treat it as unofficial and unregulated — it's not a prediction of listing gains.)",
    },
    {
      title: "Pre-IPO & Unlisted Shares",
      description:
        "Explore private companies before they list, with pricing, lot sizes, and depository details for 150+ unlisted shares. These are high-risk, illiquid investments — we share information, not recommendations.",
    },
    {
      title: "Broker Analyzer",
      description:
        "Compare 50+ stock brokers in India side by side — brokerage charges, trading platforms, account opening fees, and user ratings. Our tool helps you find the broker that matches your investing style.",
    },
    {
      title: "Corporate Actions Calendar",
      description:
        "Keep track of dividends, bonus issues, stock splits, rights issues, and buybacks, with record dates, ex-dates, and eligibility.",
    },
    {
      title: "Insight Hub",
      description:
        "Easy-to-read market education, IPO explainers, dividend breakdowns, and sector overviews to help you learn and decide for yourself.",
    },
  ];

  const team = [
    {
      name: "Manjunath Talanki",
      role: "Founder & CEO",
      bio: "Manjunath Talanki holds an MBA in Finance and is a NISM-certified professional with 12 years in the Indian equity markets. An active trader and IPO investor since 2014, he started ShareBazaarOnline to make clear, reliable market information available to every retail investor.",
    },
    {
      name: "Kavya Talanki",
      role: "Head of Research & Content",
      bio: "Kavya Talanki holds an MCom (F&A) and has followed Indian markets since 2012. She leads the editorial team and specialises in fundamental analysis, IPO evaluation, and corporate actions — making sure every piece is backed by data and written in plain language.",
    },
  ];

  const whyChooseUs = [
    {
      title: "Data Accuracy",
      description:
        "We source information directly from SEBI filings, stock exchange announcements, and registrar data to ensure everything on our platform is verified and up to date.",
    },
    {
      title: "No Bias",
      description:
        "Our broker comparisons and IPO analyses are independent. We do not favour any broker or company.",
    },
    {
      title: "Investor-First Approach",
      description:
        "Every feature, article, and tool on ShareBazaarOnline is designed to help you make better investment decisions, not to sell you a product.",
    },
    {
      title: "Consistent Updates",
      description:
        "Our team publishes fresh content daily, covering new IPOs, dividend announcements, and market developments as they happen.",
    },
  ];

  const socials = [
    {
      name: "Twitter / X",
      handle: "@Sharebazaaronli",
      href: "https://twitter.com/Sharebazaaronli",
      Icon: FaXTwitter,
      color: "hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50",
    },
    {
      name: "YouTube",
      handle: "@sharebazaronline9156",
      href: "https://www.youtube.com/@sharebazaronline9156",
      Icon: FaYoutube,
      color: "hover:border-red-600 hover:text-red-600 hover:bg-red-50",
    },
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
              <li className="text-slate-900 font-semibold">About Us</li>
            </ol>
          </nav>

          {/* HERO */}
          <header className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              About ShareBazaarOnline.Com
            </h1>
            <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
              Making the Indian stock market easier to understand — for
              everyone.
            </p>
          </header>

          {/* WHO WE ARE */}
          <Section title="Who We Are">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                ShareBazaarOnline.com started in 2024 with one simple idea: make
                the Indian stock market easier to understand for everyone —
                whether you're applying for your first IPO or you've been
                investing for years.
              
                Retail investors were jumping between different websites to
                track IPOs, compare brokers, look up unlisted shares, and
                follow corporate actions. We wanted to bring it all together in
                one clear, easy-to-use place.
             
                Based in Bengaluru, we combine market knowledge with technology
                to give you IPO tracking, broker comparisons, pre-IPO research,
                and market updates — all in one spot.
              </p>
            </div>
          </Section>

          {/* WHAT WE OFFER */}
          <Section title="What We Offer">
            <div className="space-y-5 text-sm sm:text-base">
              {offerings.map(({ title, description }) => (
                <div key={title}>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* OUR TEAM */}
          <Section title="Our Team">
            <div className="space-y-6 text-sm sm:text-base">
              {team.map(({ name, role, bio }) => (
                <div key={name}>
                  <h3 className="font-semibold text-slate-900">
                    {name} — <span className="font-normal text-slate-700">{role}</span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed mt-1">{bio}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* WHY INVESTORS CHOOSE US */}
          <Section title="Why Investors Choose Us">
            <div className="space-y-5 text-sm sm:text-base">
              {whyChooseUs.map(({ title, description }) => (
                <div key={title}>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* VISIT US */}
          <Section title="Visit Us">
            <div className="text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>Vaishnavi Tech Park, South Tower, 3rd Floor</p>
              <p>Sarjapur Main Road, Bellandur</p>
              <p>Bengaluru – 560103, Karnataka, India</p>
            </div>
          </Section>

          {/* CONTACT US */}
          <Section title="Contact Us">
            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>
                We'd love to hear from you — whether it's a question, feedback,
                or a partnership inquiry.
              </p>

              <div className="space-y-2 text-sm sm:text-base">
                <p>
                  <strong className="text-slate-900">Email:</strong>{" "}
                  <a
                    href="mailto:support@sharebazaaronline.com"
                    className="text-slate-700 hover:text-slate-900 hover:underline break-all sm:break-normal"
                  >
                    support@sharebazaaronline.com
                  </a>
                </p>
                <p>
                  <strong className="text-slate-900">Phone:</strong>{" "}
                  <a
                    href="tel:+919663174622"
                    className="text-slate-700 hover:text-slate-900 hover:underline"
                  >
                    +91-9663174622
                  </a>
                </p>
                <p>
                  <strong className="text-slate-900">Business Hours:</strong>{" "}
                  Monday to Friday, 9:30 AM – 6:30 PM IST
                </p>
              </div>

              <div>
                <p className="text-slate-600 mb-3">
                  You can also reach us through our social media channels:
                </p>
                <div className="flex flex-wrap gap-3">
                  {socials.map(({ name, handle, href, Icon, color }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${name} — ${handle}`}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-slate-700 transition-colors ${color}`}
                    >
                      <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] shrink-0" />
                      <span>{handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* BACK TO HOME */}
          <div className="pt-2 pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-900 transition-colors text-sm sm:text-base"
            >
              <Home size={18} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}