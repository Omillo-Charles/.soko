import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
