import { cache } from 'react';
import { headers } from 'next/headers';

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { auth } from '@/lib/auth-server';
import { type Session } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
export const createTRPCContext = cache(async () => {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return {
    prisma,
    session: session as Session | null,
    headers: requestHeaders,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  console.log('PROTECTED CTX', ctx);
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  console.log('ADMIN CTX', ctx);
  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
