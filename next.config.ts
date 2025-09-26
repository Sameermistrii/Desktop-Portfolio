import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Apply the custom loader only in development to avoid production tracing issues
  ...(process.env.NODE_ENV === 'development'
    ? {
        turbopack: {
          rules: {
            "*.{jsx,tsx}": {
              loaders: [LOADER],
            },
          },
        },
      }
    : {}),
};

export default nextConfig;
// Orchids restart: 1758630063415
