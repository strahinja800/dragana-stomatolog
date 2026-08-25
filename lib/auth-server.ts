import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins/admin';

import { prisma } from './prisma';

// Origin zaglavlje nikada nema kosu crtu na kraju, pa bi vrednost oblika
// "https://primer.com/" propala pri poređenju i odbila sve zahteve.
const trustedOrigins = [
  'http://localhost:3000',
  process.env.NEXT_PUBLIC_SITE_URL,
]
  .filter((origin): origin is string => Boolean(origin))
  .map((origin) => origin.replace(/\/+$/, ''));

export const auth = betterAuth({
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: 'patient',
      adminRoles: ['admin'],
    }),
    nextCookies(),
  ],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'patient',
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
