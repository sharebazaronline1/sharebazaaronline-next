import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  poweredByHeader: false,

  reactStrictMode: true,

  // ✅ ADDED: Redirects from old URLs to new SEO-friendly URLs
  async redirects() {
    return [
      {
        source: "/comparebrokers",
        destination: "/compare-brokers",
        permanent: true,
      },
      {
        source: "/corporateactions",
        destination: "/corporate-actions",
        permanent: true,
      },
      {
        // Catches all sub-pages (e.g., /corporateactions/splits)
        source: "/corporateactions/:path*",
        destination: "/corporate-actions/:path*",
        permanent: true,
      },
      {
        source: "/ipoguide",
        destination: "/ipo-guide",
        permanent: true,
      },
      {
        source: "/preipo",
        destination: "/pre-ipo",
        permanent: true,
      },
      {
        // Catches all sub-pages (e.g., /preipo/103/company-name)
        source: "/preipo/:path*",
        destination: "/pre-ipo/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;