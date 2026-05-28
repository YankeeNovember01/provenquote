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
      {
        source: '/dashboard/get-leads/proposals',
        destination: '/dashboard/proposals',
        permanent: true,
      },
      {
        source: '/dashboard/get-leads/:path*',
        destination: '/dashboard/leads',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
