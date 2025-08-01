import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily remove static export to enable API routes
  // output: 'export',
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
