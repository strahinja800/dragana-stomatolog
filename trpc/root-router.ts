import type { inferRouterOutputs } from '@trpc/server';

import { aboutRouter } from '@/module/about/server/about-router';
import { appointmentRouter } from '@/module/appointment/server/appointment-router';
import { attachmentRouter } from '@/module/attachment/server/attachment-router';
import { medicalRecordRouter } from '@/module/medical-record/server/medical-record-router';
import { patientRouter } from '@/module/patient/server/patient-router';
import { settingsRouter } from '@/module/settings/server/settings-router';
import { uploadRouter } from '@/module/upload/server/upload-router';

import { createTRPCRouter } from './init';
export const appRouter = createTRPCRouter({
  appointment: appointmentRouter,
  attachment: attachmentRouter,
  medicalRecord: medicalRecordRouter,
  patient: patientRouter,
  settings: settingsRouter,
  about: aboutRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
