import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow loading images from Unsplash used in the demo video placeholders
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
