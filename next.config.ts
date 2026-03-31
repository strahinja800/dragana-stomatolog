import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

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

export default withNextIntl(nextConfig);
