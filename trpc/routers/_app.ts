import { settingsRouter } from '@/module/admin/server/settings-router';
import { appointmentRouter } from '@/module/appointment/server/appointment-router';
import { patientRouter } from '@/module/patient/server/patient-router';
import { createTRPCRouter } from '@/trpc/init';

export const appRouter = createTRPCRouter({
  patient: patientRouter,
  settings: settingsRouter,
  appointment: appointmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
