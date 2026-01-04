import prisma from '@/lib/db';
import { afterRegisterPatientSchema } from '@/module/patient/types/patient-schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const patientRouter = createTRPCRouter({
  createPatient: protectedProcedure
    .input(afterRegisterPatientSchema)
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.patient.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          userId: input.userId,
          isMain: true,
        },
      });

      return user;
    }),
});
