import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { authComponent, createAuth } from './auth';

// Get current user's role
export const getCurrentUserRole = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;
    return user.role ?? 'patient';
  },
});

// Set user role (admin only) - uses Better Auth admin API
export const setUserRole = mutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal('admin'), v.literal('patient')),
  },
  handler: async (ctx, args) => {
    // Check if caller is admin
    const currentUser = await authComponent.getAuthUser(ctx);
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized - Admin only');
    }

    // Use Better Auth admin API to set role
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    await auth.api.setRole({
      body: {
        userId: args.userId,
        role: args.role as 'admin' | 'user',
      },
      headers,
    });

    return { success: true };
  },
});

// List all users (admin only) - uses Better Auth admin API
export const listUsers = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.safeGetAuthUser(ctx);
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized - Admin only');
    }

    // Use Better Auth admin API to list users
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    const response = await auth.api.listUsers({
      query: {
        limit: args.limit ?? 50,
        offset: args.offset ?? 0,
      },
      headers,
    });

    return response.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role ?? 'patient',
      createdAt: user.createdAt,
    }));
  },
});
