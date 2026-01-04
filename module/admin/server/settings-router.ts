import prisma from '@/lib/db';
import {
  createNonWorkingDaySchema,
  createServiceTypeSchema,
  deleteNonWorkingDaySchema,
  deleteServiceTypeSchema,
  getNonWorkingDaysSchema,
  updateServiceTypeSchema,
  upsertWorkingHoursSchema,
} from '@/module/admin/types/settings-schema';
import { adminProcedure, baseProcedure, createTRPCRouter } from '@/trpc/init';

export const settingsRouter = createTRPCRouter({
  // ============================================
  // WORKING HOURS
  // ============================================

  getWorkingHours: baseProcedure.query(async () => {
    const workingHours = await prisma.workingHours.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });

    // Always return all 7 days with defaults for missing days
    const fullWeek = Array.from({ length: 7 }, (_, dayOfWeek) => {
      const existing = workingHours.find((h) => h.dayOfWeek === dayOfWeek);
      return (
        existing ?? {
          id: `default-${dayOfWeek}`,
          dayOfWeek,
          startTime: '08:00',
          endTime: '17:00',
          isOpen: dayOfWeek !== 0 && dayOfWeek !== 6, // closed on weekends by default
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
    });

    return fullWeek;
  }),

  upsertWorkingHours: adminProcedure
    .input(upsertWorkingHoursSchema)
    .mutation(async ({ input }) => {
      const results = await Promise.all(
        input.map((hours) =>
          prisma.workingHours.upsert({
            where: { dayOfWeek: hours.dayOfWeek },
            update: {
              startTime: hours.startTime,
              endTime: hours.endTime,
              isOpen: hours.isOpen,
            },
            create: hours,
          })
        )
      );
      return results;
    }),

  // ============================================
  // NON-WORKING DAYS
  // ============================================

  getNonWorkingDays: baseProcedure
    .input(getNonWorkingDaysSchema)
    .query(async ({ input }) => {
      const year = input.year ?? new Date().getFullYear();
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      const nonWorkingDays = await prisma.nonWorkingDay.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'asc' },
      });
      return nonWorkingDays;
    }),

  createNonWorkingDay: adminProcedure
    .input(createNonWorkingDaySchema)
    .mutation(async ({ input }) => {
      const nonWorkingDay = await prisma.nonWorkingDay.create({
        data: {
          date: input.date,
          reason: input.reason,
        },
      });
      return nonWorkingDay;
    }),

  deleteNonWorkingDay: adminProcedure
    .input(deleteNonWorkingDaySchema)
    .mutation(async ({ input }) => {
      await prisma.nonWorkingDay.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  // ============================================
  // SERVICE TYPES
  // ============================================

  getServiceTypes: baseProcedure.query(async () => {
    const serviceTypes = await prisma.serviceType.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return serviceTypes;
  }),

  createServiceType: adminProcedure
    .input(createServiceTypeSchema)
    .mutation(async ({ input }) => {
      const serviceType = await prisma.serviceType.create({
        data: input,
      });
      return serviceType;
    }),

  updateServiceType: adminProcedure
    .input(updateServiceTypeSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const serviceType = await prisma.serviceType.update({
        where: { id },
        data,
      });
      return serviceType;
    }),

  deleteServiceType: adminProcedure
    .input(deleteServiceTypeSchema)
    .mutation(async ({ input }) => {
      await prisma.serviceType.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
