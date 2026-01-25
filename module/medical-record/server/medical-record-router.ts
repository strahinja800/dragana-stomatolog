import { z } from 'zod';

import { adminProcedure, router } from '@/module/shared/server/trpc/init';

import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
} from './medical-record-schemas';

export const medicalRecordRouter = router({
  getByAppointment: adminProcedure
    .input(z.object({ appointmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.medicalRecord.findMany({
        where: { appointmentId: input.appointmentId },
        include: { attachments: true },
        orderBy: { createdAt: 'desc' },
      });
    }),

  getByPatient: adminProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.medicalRecord.findMany({
        where: { patientId: input.patientId },
        include: {
          appointment: true,
          attachments: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  create: adminProcedure
    .input(createMedicalRecordSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.medicalRecord.create({
        data: input,
        include: { attachments: true },
      });
    }),

  update: adminProcedure
    .input(updateMedicalRecordSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.medicalRecord.update({
        where: { id },
        data,
        include: { attachments: true },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Attachments are automatically deleted via onDelete: Cascade in schema
      return ctx.prisma.medicalRecord.delete({
        where: { id: input.id },
      });
    }),
});
