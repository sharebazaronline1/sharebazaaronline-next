// app/layout.jsx
import "./globals.css";

import ReactQueryProvider from "../src/providers/ReactQueryProvider";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.sharebazaaronline.com"),

  title: {
    default: "ShareBazaarOnline",
    template: "%s | ShareBazaarOnline",
  },

  description:
    "IPO Tracker, GMP, Unlisted Shares and Corporate Actions.",

  keywords: [
    "IPO",
    "GMP",
    "Unlisted Shares",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  // ✅ AdSense verification meta tag
  other: {
    "google-adsense-account": "ca-pub-5607112752912440",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>

       
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5607112752912440"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}