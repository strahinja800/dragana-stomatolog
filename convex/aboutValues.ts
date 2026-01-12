import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

/**
 * Vraća sve aktivne vrednosti za prikaz na About stranici
 */
export const getActiveAboutValues = query({
  args: {},
  handler: async (ctx) => {
    const values = await ctx.db
      .query('aboutValues')
      .withIndex('by_isActive_sortOrder', (q) => q.eq('isActive', true))
      .collect();

    return values;
  },
});

/**
 * Vraća sve vrednosti (admin panel)
 */
export const getAllAboutValues = query({
  args: {},
  handler: async (ctx) => {
    const values = await ctx.db
      .query('aboutValues')
      .withIndex('by_sortOrder')
      .collect();

    return values;
  },
});

/**
 * Kreira novu About vrednost
 */
export const createAboutValue = mutation({
  args: {
    icon: v.string(), // npr "Heart", "Award", "Users"
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
        .query('aboutValues')
        .withIndex('by_sortOrder')
        .order('desc')
        .first();
      sortOrder = last ? last.sortOrder + 1 : 1;
    }

    const id = await ctx.db.insert('aboutValues', {
      icon: args.icon.trim(),
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
 * Ažurira About vrednost
 */
export const updateAboutValue = mutation({
  args: {
    id: v.id('aboutValues'),
    icon: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error('About value not found');

    await ctx.db.patch(args.id, {
      ...(args.icon !== undefined ? { icon: args.icon.trim() } : {}),
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
 * Briše About vrednost
 */
export const deleteAboutValue = mutation({
  args: {
    id: v.id('aboutValues'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Promena redosleda (drag & drop u admin panelu)
 */
export const reorderAboutValues = mutation({
  args: {
    idsInOrder: v.array(v.id('aboutValues')),
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
