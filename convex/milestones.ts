import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

/**
 * Vraća sve aktivne milestone za About stranicu
 */
export const getActiveMilestones = query({
  args: {},
  handler: async (ctx) => {
    const milestones = await ctx.db
      .query('milestones')
      .withIndex('by_isActive_sortOrder', (q) => q.eq('isActive', true))
      .collect();

    return milestones;
  },
});

/**
 * Vraća sve milestone (admin panel)
 */
export const getAllMilestones = query({
  args: {},
  handler: async (ctx) => {
    const milestones = await ctx.db
      .query('milestones')
      .withIndex('by_sortOrder')
      .collect();

    return milestones;
  },
});

/**
 * Kreira novi milestone
 */
export const createMilestone = mutation({
  args: {
    year: v.string(), // "2009", "2024"
    title: v.string(),
    description: v.string(),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let sortOrder = args.sortOrder;
    if (sortOrder === undefined) {
      const last = await ctx.db
        .query('milestones')
        .withIndex('by_sortOrder')
        .order('desc')
        .first();
      sortOrder = last ? last.sortOrder + 1 : 1;
    }

    const id = await ctx.db.insert('milestones', {
      year: args.year.trim(),
      title: args.title.trim(),
      description: args.description.trim(),
      sortOrder,
      isActive: args.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(id);
  },
});

/**
 * Ažurira milestone
 */
export const updateMilestone = mutation({
  args: {
    id: v.id('milestones'),
    year: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error('Milestone not found');

    await ctx.db.patch(args.id, {
      ...(args.year !== undefined ? { year: args.year.trim() } : {}),
      ...(args.title !== undefined ? { title: args.title.trim() } : {}),
      ...(args.description !== undefined
        ? { description: args.description.trim() }
        : {}),
      ...(args.sortOrder !== undefined ? { sortOrder: args.sortOrder } : {}),
      ...(args.isActive !== undefined ? { isActive: args.isActive } : {}),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.id);
  },
});

/**
 * Briše milestone
 */
export const deleteMilestone = mutation({
  args: {
    id: v.id('milestones'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Promena redosleda (timeline reorder)
 */
export const reorderMilestones = mutation({
  args: {
    idsInOrder: v.array(v.id('milestones')),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    for (let i = 0; i < args.idsInOrder.length; i++) {
      await ctx.db.patch(args.idsInOrder[i], {
        sortOrder: i + 1,
        updatedAt: now,
      });
    }
  },
});
