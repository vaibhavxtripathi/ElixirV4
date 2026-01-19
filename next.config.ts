import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  eslint: {
    // Enforce linting during builds
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enforce typechecking during builds
    ignoreBuildErrors: false,
  },
  // Performance optimizations for development
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "@radix-ui/react-icons",
      "lucide-react",
    ],
  },
  // Disable source maps in development for faster builds
  productionBrowserSourceMaps: false,
  // Optimize bundle splitting
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce bundle size in development
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          // Bundle all vendor code together
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /node_modules/,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
