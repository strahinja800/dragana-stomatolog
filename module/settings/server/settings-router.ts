import { endOfYear, startOfYear } from 'date-fns';
import { z } from 'zod';

import {
  createNonWorkingDaySchema,
  createServiceTypeSchema,
  deleteNonWorkingDaySchema,
  deleteServiceTypeSchema,
  getNonWorkingDaysSchema,
  updateServiceTypeSchema,
  upsertWorkingHoursSchema,
} from '@/module/settings/types/settings-schemas';
import { adminProcedure, router } from '@/module/shared/server/trpc/init';

export const settingsRouter = router({
  // ============================================
  // WORKING HOURS
  // ============================================

  /**
   * Vraća radno vreme za sve dane u nedelji
   */
  getWorkingHours: adminProcedure.query(async ({ ctx }) => {
    const workingHours = await ctx.prisma.workingHour.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });

    // Always return all 7 days with defaults for missing days
    return Array.from({ length: 7 }, (_, dayOfWeek) => {
      const existing = workingHours.find((h) => h.dayOfWeek === dayOfWeek);
      return (
        existing ?? {
          id: `default-${dayOfWeek}`,
          dayOfWeek,
          startTime: '08:00',
          endTime: '17:00',
          isOpen: dayOfWeek !== 0 && dayOfWeek !== 6, // closed on weekends by default
        }
      );
    });
  }),

  /**
   * Upsert radno vreme za dane u nedelji
   */
  upsertWorkingHours: adminProcedure
    .input(upsertWorkingHoursSchema)
    .mutation(async ({ ctx, input }) => {
      const results = await ctx.prisma.$transaction(
        input.hours.map((hour) =>
          ctx.prisma.workingHour.upsert({
            where: { dayOfWeek: hour.dayOfWeek },
            update: {
              startTime: hour.startTime,
              endTime: hour.endTime,
              isOpen: hour.isOpen,
            },
            create: hour,
          })
        )
      );

      return results;
    }),

  // ============================================
  // NON-WORKING DAYS
  // ============================================

  /**
   * Vraća neradne dane za godinu
   */
  getNonWorkingDays: adminProcedure
    .input(getNonWorkingDaysSchema)
    .query(async ({ ctx, input }) => {
      const year = input.year ?? new Date().getFullYear();
      const startDate = startOfYear(new Date(year, 0, 1));
      const endDate = endOfYear(new Date(year, 0, 1));

      const nonWorkingDays = await ctx.prisma.nonWorkingDay.findMany({
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

  /**
   * Kreira neradni dan
   */
  createNonWorkingDay: adminProcedure
    .input(createNonWorkingDaySchema)
    .mutation(async ({ ctx, input }) => {
      const nonWorkingDay = await ctx.prisma.nonWorkingDay.create({
        data: {
          date: input.date,
          reason: input.reason,
        },
      });

      return nonWorkingDay;
    }),

  /**
   * Briše neradni dan
   */
  deleteNonWorkingDay: adminProcedure
    .input(deleteNonWorkingDaySchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.nonWorkingDay.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // ============================================
  // SERVICE TYPES
  // ============================================

  /**
   * Vraća sve tipove usluga
   */
  getServiceTypes: adminProcedure.query(async ({ ctx }) => {
    const serviceTypes = await ctx.prisma.serviceType.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return serviceTypes;
  }),

  /**
   * Vraća aktivne tipove usluga (za select dropdown)
   */
  getActiveServiceTypes: adminProcedure.query(async ({ ctx }) => {
    const serviceTypes = await ctx.prisma.serviceType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return serviceTypes;
  }),

  /**
   * Kreira novi tip usluge
   */
  createServiceType: adminProcedure
    .input(createServiceTypeSchema)
    .mutation(async ({ ctx, input }) => {
      const serviceType = await ctx.prisma.serviceType.create({
        data: {
          name: input.name,
          durationMinutes: input.durationMinutes,
          description: input.description,
          isActive: input.isActive,
          sortOrder: input.sortOrder,
        },
      });

      return serviceType;
    }),

  /**
   * Ažurira tip usluge
   */
  updateServiceType: adminProcedure
    .input(updateServiceTypeSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const serviceType = await ctx.prisma.serviceType.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.durationMinutes !== undefined && {
            durationMinutes: data.durationMinutes,
          }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        },
      });

      return serviceType;
    }),

  /**
   * Briše tip usluge
   */
  deleteServiceType: adminProcedure
    .input(deleteServiceTypeSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.serviceType.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  /**
   * Menja redosled tipova usluga
   */
  reorderServiceTypes: adminProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            id: z.string(),
            sortOrder: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(
        input.items.map((item) =>
          ctx.prisma.serviceType.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );

      return { success: true };
    }),
});
