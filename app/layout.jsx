import "./globals.css";

import ReactQueryProvider from "../src/providers/ReactQueryProvider";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://sharebazaaronline.com"),

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}