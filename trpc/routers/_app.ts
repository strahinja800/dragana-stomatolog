import prisma from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
export const appRouter = createTRPCRouter({
  hello: baseProcedure.query(async (opts) => {
    const users = await prisma.user.findMany();
    return users;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
