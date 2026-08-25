import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Slike se serviraju sa R2 javnog domena, koji se razlikuje po okruženju.
const r2PublicHostname = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : 'localhost';

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
        hostname: r2PublicHostname,
      },
    ],
  },
};

export default withNextIntl(nextConfig);
