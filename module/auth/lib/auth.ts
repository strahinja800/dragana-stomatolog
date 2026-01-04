import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { localization } from 'better-auth-localization';

import prisma from '@/lib/db';

import { authMessagesSr } from './auth-messages';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    localization({
      defaultLocale: 'sr',
      translations: {
        sr: authMessagesSr,
      },
    }),
    admin({
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
  ],
});
