import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export now that we use static JSON files instead of API routes
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
