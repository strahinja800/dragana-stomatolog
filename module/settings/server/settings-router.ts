import { endOfYear, startOfYear } from 'date-fns';
import { z } from 'zod';

import { emitSettingsUpdate, SETTINGS_EVENT_TYPES } from '@/lib/events';
import {
  createNonWorkingDaySchema,
  createServiceTypeSchema,
  deleteNonWorkingDaySchema,
  deleteServiceTypeSchema,
  getNonWorkingDaysSchema,
  updateServiceTypeSchema,
  upsertWorkingHoursSchema,
} from '@/module/settings/types/settings-schemas';
import { adminProcedure, createTRPCRouter } from '@/trpc/init';

export const settingsRouter = createTRPCRouter({
  // ============================================
  // WORKING HOURS
  // ============================================

  /**
   * Vraća radno vreme za sve dane u nedelji, sortirano od ponedeljka
   */
  //   /api/settings/working-hours
  getWorkingHours: adminProcedure.query(async ({ ctx }) => {
    const workingHours = await ctx.prisma.workingHour.findMany({
      select: {
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        isOpen: true,
      },
    });

    // Return all 7 days with defaults, ordered Monday-Sunday (1,2,3,4,5,6,0)
    return Array.from({ length: 7 }, (_, i) => {
      const dayOfWeek = i === 6 ? 0 : i + 1;
      const existing = workingHours.find((h) => h.dayOfWeek === dayOfWeek);
      return (
        existing ?? {
          dayOfWeek,
          startTime: '08:00',
          endTime: '17:00',
          isOpen: dayOfWeek !== 0 && dayOfWeek !== 6,
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

      emitSettingsUpdate(SETTINGS_EVENT_TYPES.WORKING_HOURS_UPDATED);

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

      emitSettingsUpdate(SETTINGS_EVENT_TYPES.NON_WORKING_DAY_CREATED);

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

      emitSettingsUpdate(SETTINGS_EVENT_TYPES.NON_WORKING_DAY_DELETED);

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
