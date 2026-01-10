import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';

// Static auth export for schema generation ONLY
// DO NOT import this file at runtime - it's only for CLI generation
export const auth = betterAuth({
  database: {
    type: 'sqlite',
    url: ':memory:',
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: 'patient',
      adminRoles: ['admin'],
    }),
  ],
});
