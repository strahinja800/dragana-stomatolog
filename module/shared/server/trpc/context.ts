import { headers } from 'next/headers';

import { auth, type Session } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

export async function createTRPCContext() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return {
    prisma,
    session: session as Session | null,
    headers: requestHeaders,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
