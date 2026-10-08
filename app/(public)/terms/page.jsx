// app/terms/page.jsx
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata = {
  metadataBase: new URL("https://www.sharebazaaronline.com"),
  title: "Terms and Conditions",
  description:
    "Read the Terms and Conditions governing your use of ShareBazaarOnline.com, India's platform for IPO tracking, unlisted shares, broker comparison, and market research.",
  alternates: { canonical: "/terms" },
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

export default function TermsPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Terms and Conditions", url: "/terms" },
  ];

  const definitions = [
    ["Website / Service", "www.sharebazaaronline.com and the features offered on it."],
    ["You / User", "any person who accesses or uses the website, whether a visitor or a registered account holder."],
    ["Account", "a registered account you create to use certain features."],
    ["Content", "all text, data, prices, GMP, comparisons, articles, graphics, and other material on the website."],
    ["Market data", "IPO, GMP, subscription, allotment, unlisted-share, corporate-action, and broker information compiled from exchanges and third-party sources."],
    ["Transaction partner", "a third party through whom an unlisted or pre-IPO share enquiry or transaction may be facilitated."],
  ];

  const permitted = [
    "Use the website only for lawful purposes and in line with these terms;",
    "Provide accurate information and not impersonate anyone;",
    "Make your own decisions and seek independent advice before acting on any content;",
    "Comply with all applicable securities, tax, and other laws.",
  ];

  const prohibited = [
    "Scrape, copy, republish, resell, or redistribute our content or data without written permission;",
    "Use bots, crawlers, or automated means to access the website except as expressly allowed;",
    "Interfere with, disrupt, or attempt to gain unauthorised access to the website, its servers, or other users' accounts;",
    "Upload malware or any harmful code, or attempt to breach security measures;",
    "Post or transmit unlawful, misleading, defamatory, or infringing material;",
    "Use the website to manipulate the market, spread false information, or for any fraudulent or illegal activity.",
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
              <li className="text-slate-900 font-semibold">
                Terms and Conditions
              </li>
            </ol>
          </nav>

          {/* HERO */}
          <header className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Terms and Conditions, ShareBazaarOnline
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Oct 8, 2026 · @ShareBazaarOnline.com
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              These Terms and Conditions govern your use of
              www.sharebazaaronline.com and its features. Please read them
              carefully. By using the website, you agree to be bound by these
              terms, our Privacy Policy, and our Disclaimer.
            </p>
          </header>

          {/* ACCEPTANCE OF TERMS */}
          <Section title="Acceptance of terms">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                These terms are a binding agreement between you and
                ShareBazaarOnline (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), the
                operator of www.sharebazaaronline.com, with its office at
                Vaishnavi Tech Park, South Tower, 3rd Floor, Sarjapur Main
                Road, Bellandur, Bengaluru, 560103, Karnataka, India.
              </p>
              <p>
                By accessing or using the website, creating an account, or
                using any feature, you confirm that you have read, understood,
                and agree to these terms, together with our Privacy Policy and
                Disclaimer, which are incorporated by reference. If you do not
                agree, do not use the website.
              </p>
            </div>
          </Section>

          {/* DEFINITIONS */}
          <Section title="Definitions">
            <ul className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
              {definitions.map(([term, meaning]) => (
                <li key={term} className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-slate-900 sm:shrink-0">
                    {term}
                  </span>
                  <span className="text-slate-600">, {meaning}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* ELIGIBILITY */}
          <Section title="Eligibility">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              The website is intended for users who are at least 18 years old
              and competent to enter into a contract under Indian law. By using
              the website, you confirm that you meet these requirements. The
              website is intended for use in India and is governed by Indian
              law; if you access it from elsewhere, you are responsible for
              complying with your local laws.
            </p>
          </Section>

          {/* NATURE OF THE SERVICE */}
          <Section title="Nature of the service">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                ShareBazaarOnline is an information, research, and educational
                platform. We provide IPO tracking, GMP and subscription data,
                unlisted and pre-IPO share information, broker comparisons,
                corporate actions, and market content. Some features also let
                you enquire about or be connected for unlisted or pre-IPO share
                transactions, which are facilitated through transaction
                partners and subject to separate terms and KYC.
              </p>
              <p>
                We are not registered with SEBI as a stockbroker, investment
                adviser, research analyst, or merchant banker, and we do not
                provide investment advice, execute trades on an exchange, or
                hold your funds or securities. Nothing on the website is a
                recommendation or an offer to buy or sell any security. All
                content is subject to our Disclaimer.
              </p>
            </div>
          </Section>

          {/* ACCOUNT REGISTRATION AND SECURITY */}
          <Section title="Account registration and security">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                Some features require an account. You agree to provide
                accurate, current, and complete information when registering
                and to keep it up to date. You are responsible for keeping your
                login credentials confidential and for all activity under your
                account.
              </p>
              <p>
                Notify us at{" "}
                <a
                  href="mailto:support@sharebazaaronline.com"
                  className="text-slate-900 font-medium hover:underline break-all sm:break-normal"
                >
                  support@sharebazaaronline.com
                </a>{" "}
                of any unauthorised use or security breach. We are not liable
                for any loss arising from your failure to safeguard your
                credentials. We may refuse, suspend, or cancel an account at
                our discretion, including for breach of these terms.
              </p>
            </div>
          </Section>

          {/* PERMITTED USE AND YOUR OBLIGATIONS */}
          <Section title="Permitted use and your obligations">
            <div className="text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                We grant you a limited, non-exclusive, non-transferable,
                revocable licence to use the website for your own lawful,
                personal, non-commercial purposes. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                {permitted.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </Section>

          {/* PROHIBITED CONDUCT */}
          <Section title="Prohibited conduct">
            <div className="text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>You must not:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                {prohibited.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </Section>

          {/* INTELLECTUAL PROPERTY */}
          <Section title="Intellectual property">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                The website and its original content, design, logo, and
                software are owned by ShareBazaarOnline or its licensors and
                are protected by Indian and international intellectual property
                laws. The &quot;ShareBazaarOnline&quot; name and logo are our
                marks; you may not use them without written permission.
              </p>
              <p>
                Market data drawn from exchanges and third-party providers
                belongs to those sources. You may view and use the content for
                your personal, non-commercial use only. Any other use, copying,
                modifying, distributing, or creating derivative works, requires
                our prior written consent.
              </p>
            </div>
          </Section>

          {/* THIRD-PARTY CONTENT */}
          <Section title="Third-party content, data sources, links and advertising">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                Market data is compiled from the stock exchanges (NSE, BSE,
                MCX) and third-party IPO and unlisted-share data providers and
                aggregators, and is presented &quot;as is&quot; without any
                warranty of accuracy, completeness, or timeliness. It remains
                the property of its source.
              </p>
              <p>
                The website contains links to third-party sites and displays
                advertising, including through Google AdSense. We do not
                control or endorse third-party sites, ads, or services, and are
                not responsible for them. We may earn referral, affiliate, or
                advertising income from certain links and ads. Your dealings
                with any third party are solely between you and that third
                party.
              </p>
            </div>
          </Section>

          {/* UNLISTED AND PRE-IPO SHARE TRANSACTIONS */}
          <Section title="Unlisted and pre-IPO share transactions">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                Where the website lets you enquire about or be connected for a
                transaction in unlisted or pre-IPO shares, we act only as a
                facilitator or introducer between you and a transaction
                partner. We are not a party to any transaction, do not act as a
                broker or dealer in securities, and do not guarantee the
                availability, price, title, or transfer of any shares.
              </p>
              <p>
                Any such transaction is subject to separate terms, pricing, and
                KYC and identity verification required under the Income Tax
                Act, the Prevention of Money Laundering Act, 2002, and
                applicable SEBI and depository norms. Unlisted and pre-IPO
                shares are high-risk, illiquid, and may lose value, as set out
                in our Disclaimer. You are responsible for your own due
                diligence and for any tax arising from a transaction.
              </p>
            </div>
          </Section>

          {/* DISCLAIMERS AND LIMITATION OF LIABILITY */}
          <Section title="Disclaimers and limitation of liability">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                The website and all content are provided on an &quot;as is&quot;
                and &quot;as available&quot; basis, without warranties of any
                kind, express or implied. We do not warrant that the website
                will be uninterrupted, secure, or error-free, or that any data
                is accurate or current. Full details are in our Disclaimer.
              </p>
              <p>
                To the maximum extent permitted by law, ShareBazaarOnline and
                its operators, affiliates, and personnel are not liable for any
                direct, indirect, incidental, consequential, or special loss or
                damage, including investment or trading losses, loss of profit,
                or loss of data, arising from your use of, or reliance on, the
                website, its content, or any third-party service accessed
                through it.
              </p>
            </div>
          </Section>

          {/* INDEMNIFICATION */}
          <Section title="Indemnification">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              You agree to indemnify and hold harmless ShareBazaarOnline and
              its operators, affiliates, and personnel against any claim,
              demand, loss, liability, or expense (including reasonable legal
              fees) arising from your use or misuse of the website, your breach
              of these terms or any law, your infringement of a third party&apos;s
              rights, or any transaction you enter into through a transaction
              partner.
            </p>
          </Section>

          {/* PRIVACY */}
          <Section title="Privacy">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              Our handling of your personal data is governed by our{" "}
              <Link
                href="/privacy-policy"
                className="text-slate-900 font-medium hover:underline"
              >
                Privacy Policy
              </Link>
              , which forms part of these terms. By using the website, you also
              agree to the collection, use, and disclosure of your data as
              described there.
            </p>
          </Section>

          {/* SUSPENSION AND TERMINATION */}
          <Section title="Suspension and termination">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                We may suspend or terminate your access to the website or your
                account at any time, with or without notice, if you breach
                these terms, if required by law, or to protect the website or
                other users. You may stop using the website and close your
                account at any time.
              </p>
              <p>
                On termination, your licence to use the website ends, but the
                provisions that by their nature should survive, including
                intellectual property, disclaimers, limitation of liability,
                indemnification, and governing law, continue to apply.
              </p>
            </div>
          </Section>

          {/* CHANGES TO THESE TERMS */}
          <Section title="Changes to these terms">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              We may update these terms from time to time to reflect changes in
              our services or the law. We will post the revised version on this
              page with a new date, and for material changes we may also notify
              you by email or an on-site notice. Your continued use of the
              website after changes take effect means you accept the updated
              terms.
            </p>
          </Section>

          {/* GOVERNING LAW AND DISPUTE RESOLUTION */}
          <Section title="Governing law and dispute resolution">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              These terms are governed by and construed in accordance with the
              laws of India. Any dispute relating to them will first be
              attempted to be resolved through good-faith negotiation for 15
              days. If it remains unresolved, it will be referred to
              arbitration under the Arbitration and Conciliation Act, 1996,
              before a sole arbitrator, seated at Bengaluru, Karnataka, and
              conducted in English; each party bears its own costs unless the
              arbitrator decides otherwise. Subject to arbitration, the courts
              at Bengaluru, Karnataka have exclusive jurisdiction.
            </p>
          </Section>

          {/* GRIEVANCE REDRESSAL AND CONTACT */}
          <Section title="Grievance redressal and contact">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                For any question, complaint, or grievance about these terms or
                the website, contact our Grievance Officer:
              </p>

              <div className="space-y-2">
                <p className="break-all sm:break-normal">
                  <strong className="text-slate-900">Email:</strong>{" "}
                  <a
                    href="mailto:support@sharebazaaronline.com"
                    className="text-slate-900 font-medium hover:underline"
                  >
                    support@sharebazaaronline.com
                  </a>
                </p>
                <p>
                  <strong className="text-slate-900">Address:</strong> Grievance
                  Officer, ShareBazaarOnline, Vaishnavi Tech Park, South Tower,
                  3rd Floor, Sarjapur Main Road, Bellandur, Bengaluru, 560103,
                  Karnataka, India.
                </p>
              </div>

              <p>
                We will acknowledge your grievance within 48 hours and respond
                within 30 days, as required under applicable law.
              </p>
            </div>
          </Section>

          {/* BACK TO HOME */}
          <div className="pb-4">
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