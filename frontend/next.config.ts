import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
