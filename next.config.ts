import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '1y03izjmgsaiyedf.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
