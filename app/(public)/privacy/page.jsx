// app/privacy-policy/page.jsx
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata = {
  metadataBase: new URL("https://www.sharebazaaronline.com"),
  title: "Privacy Policy",
  description:
    "ShareBazaarOnline Privacy Policy, how we collect, use, and protect your personal data under India's Digital Personal Data Protection Act, 2023 (DPDP Act).",
  alternates: { canonical: "/privacy-policy" },
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

const SubHeading = ({ children }) => (
  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mt-6 mb-2 first:mt-0">
    {children}
  </h3>
);

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
  ];

  const definitions = [
    ["We / us / our / ShareBazaarOnline", "the operator of www.sharebazaaronline.com."],
    ["Website / Service", "www.sharebazaaronline.com and the features offered on it."],
    ["You / Data Principal", "the individual whose personal data we process."],
    ["Data Fiduciary", "the person who decides the purpose and means of processing personal data; here, ShareBazaarOnline."],
    ["Data Processor / Service Provider", "a third party that processes personal data on our behalf and on our instructions."],
    ["Personal data", "any information that relates to an identified or identifiable individual."],
    ["Sensitive personal data", "categories such as financial information, passwords, and official identifiers, as defined under the SPDI Rules."],
    ["Cookies", "small files placed on your device that record information about your use of the website."],
    ["DPDP Act", "the Digital Personal Data Protection Act, 2023."],
  ];

  const usageTable = [
    {
      what: "Create and secure your account; show your saved IPOs, watchlists and alerts",
      why: "To provide the features you signed up for",
      basis: "Legitimate use, data you gave us voluntarily for this purpose",
    },
    {
      what: "Reply to your emails and support requests",
      why: "To help you",
      basis: "Legitimate use, data you gave us voluntarily for this purpose",
    },
    {
      what: "Run and improve the website; measure which pages are used",
      why: "To keep the site working and make it better",
      basis: "Consent (via cookie choices) / legitimate use",
    },
    {
      what: "Show advertising, including through Google AdSense",
      why: "To fund a free platform",
      basis: "Consent (via cookie choices)",
    },
    {
      what: "Send updates or newsletters, where you have opted in",
      why: "To keep you informed",
      basis: "Consent, you may withdraw it anytime",
    },
    {
      what: "Detect fraud, abuse, and security threats; comply with law",
      why: "To protect users and meet legal duties",
      basis: "Legitimate use / legal obligation",
    },
  ];

  const rights = [
    ["Access", "a summary of the personal data we process about you, what we do with it, and who we have shared it with."],
    ["Correction and completion", "to have inaccurate or incomplete data corrected, completed or updated."],
    ["Erasure", "to have your data erased, unless we are required to keep it by law or for the purpose it was collected."],
    ["Withdraw consent", "to withdraw any consent you gave, at any time, as easily as you gave it."],
    ["Grievance redressal", "to raise a complaint with us about how we handle your data (see below)."],
    ["Nominate", "to nominate another person to exercise your rights if you die or become incapacitated."],
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
              <li className="text-slate-900 font-semibold">Privacy Policy</li>
            </ol>
          </nav>

          {/* HERO */}
          <header className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Privacy Policy, ShareBazaarOnline
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Last updated: 7 October 2026
            </p>
            <p className="mt-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              This policy explains what personal data ShareBazaarOnline collects
              when you use www.sharebazaaronline.com, why we collect it, and the
              rights you have over it under India's Digital Personal Data
              Protection Act, 2023 (DPDP Act).
            </p>
          </header>

          {/* WHO WE ARE */}
          <Section title="Who we are">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                ShareBazaarOnline (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the
                website www.sharebazaaronline.com, a platform for IPO tracking,
                grey market premium (GMP) data, unlisted and pre-IPO share
                information, broker comparison, corporate actions, and market
                research and educational content.
              </p>
              <p>
                Under the DPDP Act, we act as the Data Fiduciary for the
                personal data we collect through the website, meaning we decide
                why and how your data is processed. You, the person whose data
                we process, are the Data Principal.
              </p>
              <p>
                This policy covers personal data collected through the website
                only. It does not cover the practices of stock brokers,
                exchanges, or other third-party platforms we link to or compare;
                those operate under their own privacy policies.
              </p>
              <p>
                We have prepared this policy in line with India&apos;s applicable
                data-protection laws, including the Digital Personal Data
                Protection Act, 2023 (DPDP Act), the Information Technology Act,
                2000, and the Information Technology (Reasonable Security
                Practices and Procedures and Sensitive Personal Data or
                Information) Rules, 2011 (SPDI Rules).
              </p>
              <p>
                We are an information and research platform. We are not a
                SEBI-registered stockbroker, investment adviser, or research
                analyst, and we do not execute trades or hold client funds or
                securities. Content on the website is for information and
                education only and is not investment advice.
              </p>
              <p>
                Registered contact: Vaishnavi Tech Park, South Tower, 3rd
                Floor, Sarjapur Main Road, Bellandur, Bengaluru, 560103,
                Karnataka, India. Email:{" "}
                <a
                  href="mailto:support@sharebazaaronline.com"
                  className="text-slate-900 font-medium hover:underline break-all sm:break-normal"
                >
                  support@sharebazaaronline.com
                </a>
                .
              </p>
            </div>
          </Section>

          {/* SCOPE AND ACCEPTANCE */}
          <Section title="Scope and acceptance">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                This policy applies to everyone who uses
                www.sharebazaaronline.com, registered account holders and
                visitors alike, and to the personal data we collect from you
                directly or automatically through the website.
              </p>
              <p>
                By using the website, creating an account, or submitting
                information to us, you consent to the collection, use, and
                disclosure of your personal data as described here. If you do
                not agree with this policy, please do not use the website.
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

          {/* INFORMATION WE COLLECT */}
          <Section title="Information we collect">
            <div className="text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                We collect only the data we need to run the website and the
                features you use.
              </p>

              <SubHeading>Information you give us directly</SubHeading>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-slate-900">Account details</strong>,
                  when you create an account or log in, the email address and
                  any name or profile details you provide, and the credentials
                  used to secure your account.
                </li>
                <li>
                  <strong className="text-slate-900">Communications</strong>,
                  when you email us at support@sharebazaaronline.com or use a
                  contact or support form, your email address, your message,
                  and anything you choose to include in it.
                </li>
                <li>
                  <strong className="text-slate-900">Preferences</strong>,
                  watchlists, saved IPOs, broker comparisons, or alerts you set
                  up, so we can show them back to you.
                </li>
              </ul>

              <SubHeading>Information collected automatically</SubHeading>
              <p>
                When you visit the website, our systems and the third-party
                tools we use may record:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Device and browser type, operating system, and screen settings;</li>
                <li>Your IP address and approximate location derived from it;</li>
                <li>Pages viewed, links clicked, time spent, and the site you arrived from;</li>
                <li>Cookies and similar identifiers (see Cookies and advertising below).</li>
              </ul>

              <p className="mt-4">
                <strong className="text-slate-900">
                  Identity and financial data, only where a feature needs it.
                </strong>{" "}
                Some features, such as completing an unlisted or pre-IPO share
                transaction or related KYC, may require identity and financial
                details, for example your PAN, date of birth, and bank or
                payment details. Where this applies, we or our transaction
                partners collect such data only for that specific purpose, with
                your consent, and as required under the Income Tax Act, the
                Prevention of Money Laundering Act, 2002, and applicable SEBI
                and depository norms.
              </p>

              <p className="mt-4">
                For ordinary browsing, research, and account features, we do not
                require your PAN, Demat, bank, or card details. Please never
                share your broker or exchange passwords with us.
              </p>
            </div>
          </Section>

          {/* HOW AND WHY WE USE YOUR DATA */}
          <Section title="How and why we use your data">
            <div className="text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                We process your personal data only for lawful purposes, and only
                on a basis permitted by the DPDP Act, either your consent, or a
                legitimate use recognised by the Act (such as a purpose for
                which you have voluntarily given us your data).
              </p>

              <div className="mt-5 overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[720px] text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        What we do
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        Why
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-900">
                        Lawful basis under DPDP
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {usageTable.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3 align-top text-slate-800">
                          {row.what}
                        </td>
                        <td className="px-4 py-3 align-top text-slate-700">
                          {row.why}
                        </td>
                        <td className="px-4 py-3 align-top text-slate-700">
                          {row.basis}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-5">
                Where we rely on your consent, you can withdraw it at any time,
                as easily as you gave it (see Your rights below). Withdrawing
                consent does not affect processing that already happened before
                you withdrew it.
              </p>
            </div>
          </Section>

          {/* COOKIES AND ADVERTISING */}
          <Section title="Cookies and advertising">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                We use cookies and similar technologies to keep you logged in,
                remember your preferences, understand how the website is used,
                and show advertising.
              </p>

              <p>
                <strong className="text-slate-900">Analytics.</strong> We use
                analytics tools to see which pages are visited and how the site
                performs. This helps us fix problems and improve content. These
                tools may set their own cookies.
              </p>

              <p>
                <strong className="text-slate-900">Google AdSense.</strong> We
                display ads through Google AdSense to keep the platform free.
                Google and its partners use cookies and device identifiers to
                show ads based on your visits to this and other websites.
                Google&apos;s use of advertising cookies lets it and its partners
                serve ads to you based on your activity.
              </p>

              <p>
                <strong className="text-slate-900">
                  Types of cookies we use.
                </strong>{" "}
                Essential cookies (needed to log you in and keep the site
                secure), functional cookies (to remember your preferences),
                analytics cookies (to understand site usage), and advertising
                cookies (to deliver and measure ads).
              </p>

              <p>
                <strong className="text-slate-900">Google DART cookie.</strong>{" "}
                Google, as a third-party vendor, uses the DART cookie to serve
                ads based on your visits to this and other websites. You can
                read Google&apos;s ad technology policy and decline the DART cookie
                at{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-900 font-medium hover:underline break-all"
                >
                  policies.google.com/technologies/ads
                </a>
                . Cookies may be set both by us and by third parties such as
                Google AdSense, analytics providers, and advertising networks;
                we have no control over cookies set by third-party advertisers,
                so please review their own policies.
              </p>

              <p>You can control personalised advertising:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Manage Google ad personalisation at Google Ads Settings;</li>
                <li>
                  Opt out of third-party vendor cookies at aboutads.info and
                  youronlinechoices.eu;
                </li>
                <li>
                  Read how Google uses data from sites that use its services at
                  policies.google.com/technologies/partner-sites.
                </li>
              </ul>

              <p>
                You can also block or delete cookies through your browser
                settings. If you block essential cookies, some features, such
                as staying logged in, may not work.
              </p>
            </div>
          </Section>

          {/* SHARING AND DISCLOSURE */}
          <Section title="Sharing and disclosure">
            <div className="text-slate-700 leading-relaxed text-sm sm:text-base">
              <p className="font-medium text-slate-900">
                We do not sell your personal data.
              </p>
              <p className="mt-3">We share personal data only in these situations:</p>
              <ul className="list-disc pl-5 space-y-3 mt-3">
                <li>
                  <strong className="text-slate-900">
                    Service providers (Data Processors).
                  </strong>{" "}
                  We use third parties to host the website, run analytics,
                  deliver advertising, send email, and provide security. They
                  may process your data only on our instructions, under
                  contract, and for these purposes alone.
                </li>
                <li>
                  <strong className="text-slate-900">
                    Advertising partners.
                  </strong>{" "}
                  Google AdSense and its partners process data as described
                  under Cookies and advertising above.
                </li>
                <li>
                  <strong className="text-slate-900">Legal reasons.</strong> We
                  may disclose data where required by law, a court order, or a
                  lawful request from a government or regulatory authority, or
                  to establish, exercise or defend legal claims.
                </li>
                <li>
                  <strong className="text-slate-900">Business transfer.</strong>{" "}
                  If the platform is involved in a merger, acquisition or
                  restructuring, data may be transferred as part of that,
                  subject to this policy.
                </li>
              </ul>
              <p className="mt-4">
                Some of our service providers may process or store data on
                servers outside India. Where that happens, we do so in line with
                the DPDP Act and any restrictions the Central Government
                notifies on cross-border transfers.
              </p>
            </div>
          </Section>

          {/* MARKET DATA */}
          <Section title="Market data from public and third-party sources">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                Much of the content on the website, IPO details, GMP,
                subscription and allotment data, unlisted share prices,
                corporate actions, and exchange circulars, comes from public and
                third-party sources, including the stock exchanges (NSE, BSE,
                MCX) and market data aggregators.
              </p>
              <p>
                This is company and market information, not your personal data.
                We process it to provide research and tracking content, and this
                policy&apos;s rules on personal data do not apply to it. We present
                such data &quot;as is&quot; from its source and do not guarantee its
                accuracy, completeness, or timeliness; always verify with the
                exchange or company before acting on it.
              </p>
              <p>
                This content is compiled from stock exchange circular and notice
                feeds (NSE, BSE, and MCX) and from third-party IPO and
                unlisted-share data providers and aggregators. Those sources
                operate under their own terms and privacy policies, the data
                remains the property of its respective source, and we present
                it for information only. Full attribution of these sources is
                set out in our Disclaimer.
              </p>
            </div>
          </Section>

          {/* DATA RETENTION AND SECURITY */}
          <Section title="Data retention and security">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                <strong className="text-slate-900">Retention.</strong> We keep
                your personal data only as long as it is needed for the purpose
                it was collected for, or as long as the law requires. When you
                close your account, or when the purpose is no longer being
                served and we are not required to keep the data, we erase it or
                anonymise it. We also ask our service providers to erase data we
                shared with them for processing once it is no longer needed.
              </p>
              <p>
                <strong className="text-slate-900">Security.</strong> We take
                reasonable technical and organisational safeguards to protect
                your data against unauthorised access, loss, misuse, or
                alteration. No method of transmission or storage is completely
                secure, so we cannot guarantee absolute security.
              </p>
              <p>
                <strong className="text-slate-900">Breach notification.</strong>{" "}
                If a personal data breach occurs, we will notify the Data
                Protection Board of India and affected users in the manner
                required by the DPDP Act.
              </p>
            </div>
          </Section>

          {/* YOUR RIGHTS */}
          <Section title="Your rights as a Data Principal">
            <div className="text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                Under the DPDP Act, you have the following rights over the
                personal data we hold about you:
              </p>

              <ul className="mt-4 space-y-3">
                {rights.map(([term, meaning]) => (
                  <li key={term} className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="font-semibold text-slate-900 sm:shrink-0">
                      {term}
                    </span>
                    <span className="text-slate-600">, {meaning}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5">
                To exercise any of these rights, email us at{" "}
                <a
                  href="mailto:support@sharebazaaronline.com"
                  className="text-slate-900 font-medium hover:underline break-all sm:break-normal"
                >
                  support@sharebazaaronline.com
                </a>
                . We may need to verify your identity before acting on a
                request. You also have a duty under the Act not to make a false
                or frivolous complaint and not to impersonate another person
                when providing your data.
              </p>
            </div>
          </Section>

          {/* MARKETING */}
          <Section title="Marketing communications">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                We send promotional emails, newsletters, and market updates only
                if you have opted in. You can opt out at any time by clicking
                &quot;unsubscribe&quot; in any marketing email, changing your account
                settings, or emailing{" "}
                <a
                  href="mailto:support@sharebazaaronline.com"
                  className="text-slate-900 font-medium hover:underline break-all sm:break-normal"
                >
                  support@sharebazaaronline.com
                </a>
                .
              </p>
              <p>
                You cannot opt out of essential service messages, such as
                security alerts, account notices, and updates to our terms or
                this policy, because they are necessary to provide the service.
              </p>
            </div>
          </Section>

          {/* CHILDREN */}
          <Section title="Children's data">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                The website is meant for adults making their own investment
                research decisions and is not directed at children. Under the
                DPDP Act, a child is anyone under 18.
              </p>
              <p>
                We do not knowingly collect the personal data of a child
                without the verifiable consent of a parent or lawful guardian,
                and we do not carry out tracking, behavioural monitoring, or
                targeted advertising directed at children. If you believe a
                child has given us personal data without such consent, email us
                at{" "}
                <a
                  href="mailto:support@sharebazaaronline.com"
                  className="text-slate-900 font-medium hover:underline break-all sm:break-normal"
                >
                  support@sharebazaaronline.com
                </a>{" "}
                and we will delete it.
              </p>
            </div>
          </Section>

          {/* THIRD-PARTY LINKS */}
          <Section title="Third-party links and services">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              The website links to third-party sites and services, including
              stock brokers, exchanges, and data providers. We are not
              responsible for their content, security, or privacy practices.
              This policy does not cover those sites, please review their own
              privacy policies before sharing information with them.
            </p>
          </Section>

          {/* DATA TRANSFERS */}
          <Section title="Data transfers and storage">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              Your personal data is primarily stored and processed on secure
              servers in India, or with cloud providers that meet Indian
              data-protection standards. Some of our service providers may
              process data outside India; where that happens, we take reasonable
              steps to protect it in line with the DPDP Act and any restrictions
              the Central Government notifies on cross-border transfers. We keep
              regular backups for disaster recovery, protected by the same
              safeguards as the primary data.
            </p>
          </Section>

          {/* GRIEVANCE REDRESSAL */}
          <Section title="Grievance redressal">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                If you have a question or complaint about how we handle your
                personal data, contact our Grievance Officer:
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
                We will acknowledge and respond to your grievance within the
                time the DPDP Act and its rules require.
              </p>
              <p>
                If you are not satisfied with our response, you may escalate
                your complaint to the Data Protection Board of India once you
                have given us a reasonable opportunity to resolve it.
              </p>
              <p>
                We will acknowledge your grievance within 48 hours and respond
                with a resolution within 30 days, as required under the DPDP Act
                and the Information Technology Act rules. If you are a
                Significant Data Fiduciary or are later required to appoint a
                Data Protection Officer, that officer&apos;s name and details will
                be added here.
              </p>
            </div>
          </Section>

          {/* DISPUTE RESOLUTION */}
          <Section title="Dispute resolution and arbitration">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              Any dispute relating to this policy will first be attempted to be
              resolved through good-faith negotiation for a period of 15 days.
              If it remains unresolved, it will be referred to arbitration under
              the Arbitration and Conciliation Act, 1996, before a sole
              arbitrator, seated at Bengaluru, Karnataka, and conducted in
              English. Each party bears its own costs unless the arbitrator
              decides otherwise.
            </p>
          </Section>

          {/* INDEMNIFICATION */}
          <Section title="Indemnification">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              You agree to indemnify and hold harmless ShareBazaarOnline and its
              operators, affiliates, and personnel against any claim, loss, or
              expense arising from your breach of this policy, your violation of
              any applicable law, or your misuse of the website.
            </p>
          </Section>

          {/* CHANGES & GOVERNING LAW */}
          <Section title="Changes to this policy and governing law">
            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
              <p>
                We may update this policy from time to time to reflect changes
                in our practices or the law. When we do, we will post the
                revised version here and update the date at the top. For
                significant changes, we may also notify you by email or an
                on-site notice. Please review this page periodically.
              </p>
              <p>
                This policy is governed by the laws of India, including the
                Digital Personal Data Protection Act, 2023 and the rules made
                under it. The courts at Bengaluru, Karnataka have jurisdiction
                over any dispute relating to it.
              </p>
            </div>
          </Section>

          {/* CONSENT */}
          <Section title="Consent and acknowledgment">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              By using the website, you confirm that you have read and
              understood this policy, agree to the collection, use, storage, and
              disclosure of your personal data as described, and accept the
              ordinary risks of transmitting data online. Where we rely on your
              consent, you may withdraw it at any time by emailing{" "}
              <a
                href="mailto:support@sharebazaaronline.com"
                className="text-slate-900 font-medium hover:underline break-all sm:break-normal"
              >
                support@sharebazaaronline.com
              </a>
              ; withdrawing consent may limit your ability to use some features.
            </p>
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