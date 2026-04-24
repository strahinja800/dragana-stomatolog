import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { Prisma } from '@/lib/generated/prisma/client';
import { resolvePatient } from '@/module/patient/server/patient-service';
import {
  createPatientSchema,
  getPatientByIdSchema,
  searchPatientsSchema,
  updatePatientSchema,
} from '@/module/patient/types/patient-schemas';
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';

export const patientRouter = createTRPCRouter({
  // ============================================
  // ADMIN QUERIES
  // ============================================

  /**
   * Vraća sve pacijente
   */
  getAll: adminProcedure
    .input(searchPatientsSchema)
    .query(async ({ ctx, input }) => {
      const where = input.query
        ? {
            OR: [
              {
                firstName: {
                  contains: input.query,
                  mode: 'insensitive' as const,
                },
              },
              {
                lastName: {
                  contains: input.query,
                  mode: 'insensitive' as const,
                },
              },
              { phone: { contains: input.query } },
              {
                email: { contains: input.query, mode: 'insensitive' as const },
              },
            ],
          }
        : {};

      const [patients, total] = await Promise.all([
        ctx.prisma.patient.findMany({
          where,
          orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
          skip: input.offset,
          take: input.limit,
        }),
        ctx.prisma.patient.count({ where }),
      ]);

      return { patients, total };
    }),

  /**
   * Vraća pacijenta po ID-u
   */
  getById: adminProcedure
    .input(getPatientByIdSchema)
    .query(async ({ ctx, input }) => {
      const patient = await ctx.prisma.patient.findUnique({
        where: { id: input.id },
      });

      if (!patient) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Pacijent nije pronađen',
        });
      }

      return patient;
    }),

  /**
   * Vraća pacijenta sa svim terminima
   */
  getWithAppointments: adminProcedure
    .input(getPatientByIdSchema)
    .query(async ({ ctx, input }) => {
      const patient = await ctx.prisma.patient.findUnique({
        where: { id: input.id },
        include: {
          appointments: {
            orderBy: { startTime: 'desc' },
            include: {
              serviceType: true,
              dentist: true,
            },
          },
          medicalRecords: {
            orderBy: { createdAt: 'desc' },
            include: {
              appointment: true,
              attachments: true,
            },
          },
          invoices: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!patient) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Pacijent nije pronađen',
        });
      }

      return patient;
    }),

  /**
   * Pretraga pacijenata (za autocomplete)
   */
  search: adminProcedure
    .input(z.object({ query: z.string().min(2) }))
    .query(async ({ ctx, input }) => {
      const patients = await ctx.prisma.patient.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
        where: {
          OR: [
            { firstName: { contains: input.query, mode: 'insensitive' } },
            { lastName: { contains: input.query, mode: 'insensitive' } },
            { phone: { contains: input.query } },
          ],
        },
        take: 10,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      });

      return patients;
    }),

  // ============================================
  // ADMIN MUTATIONS
  // ============================================

  /**
   * Kreira novog pacijenta (admin only)
   */
  create: adminProcedure
    .input(createPatientSchema)
    .mutation(async ({ ctx, input }) => {
      const patient = await ctx.prisma.patient.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email || null,
          phone: input.phone || null,
          dateOfBirth: input.dateOfBirth || null,
          gender: input.gender || null,
          allergies: input.allergies || null,
          medications: input.medications || null,
          notes: input.notes || null,
          userId: input.userId || null,
          isMain: true,
        },
      });

      return patient;
    }),

  /**
   * Kreira pacijenta za registrovanog korisnika (koristi se pri registraciji)
   */
  createForSelf: protectedProcedure
    .input(createPatientSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        return resolvePatient(tx, ctx.session.user, {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone || undefined,
          dateOfBirth: input.dateOfBirth || undefined,
          gender: input.gender || undefined,
        });
      });
    }),

  /**
   * Ažurira pacijenta
   */
  update: adminProcedure
    .input(updatePatientSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      try {
        const patient = await ctx.prisma.patient.update({
          where: { id },
          data: {
            ...(data.firstName !== undefined && { firstName: data.firstName }),
            ...(data.lastName !== undefined && { lastName: data.lastName }),
            ...(data.email !== undefined && { email: data.email || null }),
            ...(data.phone !== undefined && { phone: data.phone || null }),
            ...(data.dateOfBirth !== undefined && {
              dateOfBirth: data.dateOfBirth || null,
            }),
            ...(data.gender !== undefined && { gender: data.gender || null }),
            ...(data.allergies !== undefined && {
              allergies: data.allergies || null,
            }),
            ...(data.medications !== undefined && {
              medications: data.medications || null,
            }),
            ...(data.notes !== undefined && { notes: data.notes || null }),
          },
        });

        return patient;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          const metaStr = JSON.stringify(error.meta ?? '').toLowerCase();
          const isEmail = metaStr.includes('email');
          throw new TRPCError({
            code: 'CONFLICT',
            message: isEmail
              ? 'Pacijent sa ovom email adresom već postoji'
              : 'Pacijent sa ovim brojem telefona već postoji',
          });
        }
        throw error;
      }
    }),

  /**
   * Briše pacijenta
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if patient has appointments
      const appointmentsCount = await ctx.prisma.appointment.count({
        where: { patientId: input.id },
      });

      if (appointmentsCount > 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Pacijent ima termine i ne može biti obrisan',
        });
      }

      await ctx.prisma.patient.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  getStats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalPatients, newPatientsThisMonth] = await Promise.all([
      ctx.prisma.patient.count(),
      ctx.prisma.patient.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
    ]);

    return { totalPatients, newPatientsThisMonth };
  }),

  getRecent: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });
  }),
});
