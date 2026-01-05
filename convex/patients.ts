import { v } from 'convex/values';

import { mutation } from './_generated/server';

export const createPatient = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    authId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patientId = await ctx.db.insert('patients', {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      authId: args.authId,
      isMain: true,
    });

    return await ctx.db.get(patientId);
  },
});
