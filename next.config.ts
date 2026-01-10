import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/reset-password/:token",
        destination: "/auth?mode=reset&token=:token",
      },
    ];
  },
};

export default nextConfig;
