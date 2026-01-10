import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

// ============================================
// WORKING HOURS
// ============================================

export const getWorkingHours = query({
  args: {},
  handler: async (ctx) => {
    const workingHours = await ctx.db
      .query('workingHours')
      .withIndex('by_dayOfWeek')
      .collect();

    // Always return all 7 days with defaults for missing days
    return Array.from({ length: 7 }, (_, dayOfWeek) => {
      const existing = workingHours.find((h) => h.dayOfWeek === dayOfWeek);
      return (
        existing ?? {
          _id: `default-${dayOfWeek}` as unknown as string,
          _creationTime: Date.now(),
          dayOfWeek,
          startTime: '08:00',
          endTime: '17:00',
          isOpen: dayOfWeek !== 0 && dayOfWeek !== 6, // closed on weekends by default
        }
      );
    });
  },
});

export const upsertWorkingHours = mutation({
  args: {
    hours: v.array(
      v.object({
        dayOfWeek: v.number(),
        startTime: v.string(),
        endTime: v.string(),
        isOpen: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx);

    const results = await Promise.all(
      args.hours.map(async (hour) => {
        const existing = await ctx.db
          .query('workingHours')
          .withIndex('by_dayOfWeek', (q) => q.eq('dayOfWeek', hour.dayOfWeek))
          .unique();

        if (existing) {
          await ctx.db.patch(existing._id, {
            startTime: hour.startTime,
            endTime: hour.endTime,
            isOpen: hour.isOpen,
          });
          return { ...existing, ...hour };
        } else {
          const id = await ctx.db.insert('workingHours', hour);
          return { _id: id, ...hour };
        }
      })
    );

    return results;
  },
});

// ============================================
// NON-WORKING DAYS
// ============================================

export const getNonWorkingDays = query({
  args: {
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const year = args.year ?? new Date().getFullYear();
    const startDate = new Date(year, 0, 1).getTime();
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999).getTime();

    const nonWorkingDays = await ctx.db
      .query('nonWorkingDays')
      .withIndex('by_date')
      .filter((q) =>
        q.and(
          q.gte(q.field('date'), startDate),
          q.lte(q.field('date'), endDate)
        )
      )
      .collect();

    return nonWorkingDays;
  },
});

export const createNonWorkingDay = mutation({
  args: {
    date: v.number(), // Unix timestamp
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx);

    const id = await ctx.db.insert('nonWorkingDays', {
      date: args.date,
      reason: args.reason,
    });

    return await ctx.db.get(id);
  },
});

export const deleteNonWorkingDay = mutation({
  args: {
    id: v.id('nonWorkingDays'),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ============================================
// SERVICE TYPES
// ============================================

export const getServiceTypes = query({
  args: {},
  handler: async (ctx) => {
    const serviceTypes = await ctx.db
      .query('serviceTypes')
      .withIndex('by_sortOrder')
      .collect();

    return serviceTypes;
  },
});

export const createServiceType = mutation({
  args: {
    name: v.string(),
    durationMinutes: v.number(),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx);

    const id = await ctx.db.insert('serviceTypes', {
      name: args.name,
      durationMinutes: args.durationMinutes,
      description: args.description,
      isActive: args.isActive ?? true,
      sortOrder: args.sortOrder ?? 0,
    });

    return await ctx.db.get(id);
  },
});

export const updateServiceType = mutation({
  args: {
    id: v.id('serviceTypes'),
    name: v.optional(v.string()),
    durationMinutes: v.optional(v.number()),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx);

    const { id, ...updates } = args;

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    await ctx.db.patch(id, filteredUpdates);
    return await ctx.db.get(id);
  },
});

export const deleteServiceType = mutation({
  args: {
    id: v.id('serviceTypes'),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
