import { patientRouter } from '@/module/patient/server/patient-router';
import { createTRPCRouter } from '@/trpc/init';
export const appRouter = createTRPCRouter({
  patient: patientRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
