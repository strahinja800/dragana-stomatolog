import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  //   typedRoutes: true,
  //   reactCompiler: true,
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
    incomingRequests: true,
  },

  experimental: {
    staleTimes: {
      dynamic: 120,
      static: 180,
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.convex.cloud',
        pathname: '/api/storage/**',
      },
      {
        protocol: 'https',
        hostname: 's3.hektor-tech.com',
      },
    ],
  },
};

export default nextConfig;
