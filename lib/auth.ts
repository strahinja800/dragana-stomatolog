import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { localization } from 'better-auth-localization';

import { authMessagesSr } from './auth-messages';
import prisma from './db';

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
  ],
});
