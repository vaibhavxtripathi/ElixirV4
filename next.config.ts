import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Enforce linting during builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enforce typechecking during builds
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
