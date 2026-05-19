import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard/bids',
        destination: '/dashboard/proposals',
        permanent: true,
      },
      {
        source: '/dashboard/leases',
        destination: '/dashboard/markets',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
