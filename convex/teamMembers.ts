import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const getActiveTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('teamMembers')
      .withIndex('by_isActive_sortOrder', (q) => q.eq('isActive', true))
      .collect();
  },
});

export const getAllTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('teamMembers').withIndex('by_sortOrder').collect();
  },
});

export const createTeamMember = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    specialty: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageStorageId: v.optional(v.id('_storage')),
    imageAlt: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let sortOrder = args.sortOrder;
    if (sortOrder === undefined) {
      const last = await ctx.db
        .query('teamMembers')
        .withIndex('by_sortOrder')
        .order('desc')
        .first();
      sortOrder = last ? last.sortOrder + 1 : 1;
    }

    const id = await ctx.db.insert('teamMembers', {
      name: args.name.trim(),
      role: args.role.trim(),
      specialty: args.specialty?.trim(),
      bio: args.bio?.trim(),
      imageStorageId: args.imageStorageId,
      imageAlt: args.imageAlt?.trim(),
      sortOrder,
      isActive: args.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(id);
  },
});

export const updateTeamMember = mutation({
  args: {
    id: v.id('teamMembers'),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    specialty: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageStorageId: v.optional(v.id('_storage')),
    imageAlt: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error('Team member not found');

    await ctx.db.patch(args.id, {
      ...(args.name !== undefined ? { name: args.name.trim() } : {}),
      ...(args.role !== undefined ? { role: args.role.trim() } : {}),
      ...(args.specialty !== undefined
        ? { specialty: args.specialty?.trim() }
        : {}),
      ...(args.bio !== undefined ? { bio: args.bio?.trim() } : {}),
      ...(args.imageStorageId !== undefined
        ? { imageStorageId: args.imageStorageId }
        : {}),
      ...(args.imageAlt !== undefined ? { imageAlt: args.imageAlt?.trim() } : {}),
      ...(args.sortOrder !== undefined ? { sortOrder: args.sortOrder } : {}),
      ...(args.isActive !== undefined ? { isActive: args.isActive } : {}),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.id);
  },
});

export const deleteTeamMember = mutation({
  args: { id: v.id('teamMembers') },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.id);
    if (!member) return;

    if (member.imageStorageId) {
      await ctx.storage.delete(member.imageStorageId);
    }

    await ctx.db.delete(args.id);
  },
});

export const reorderTeamMembers = mutation({
  args: { idsInOrder: v.array(v.id('teamMembers')) },
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


export const getActiveTeamMembersWithImages = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db
      .query("teamMembers")
      .withIndex("by_isActive_sortOrder", (q) => q.eq("isActive", true))
      .collect();

    return await Promise.all(
      members.map(async (m) => ({
        ...m,
        imageUrl: m.imageStorageId ? await ctx.storage.getUrl(m.imageStorageId) : null,
      }))
    );
  },
});
