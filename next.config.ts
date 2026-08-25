import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Slike se serviraju sa R2 javnog domena, koji se razlikuje po okruženju.
// Protokol se izvodi iz same adrese, jer lokalni storage ume da bude na http.
const r2PublicUrl = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL)
  : null;

const r2PublicHostname = r2PublicUrl?.hostname ?? 'localhost';
const r2PublicProtocol = (r2PublicUrl?.protocol.replace(':', '') ?? 'http') as
  | 'http'
  | 'https';

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
        protocol: r2PublicProtocol,
        hostname: r2PublicHostname,
      },
    ],
  },
};

export default withNextIntl(nextConfig);
