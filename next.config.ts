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
};

export default nextConfig;