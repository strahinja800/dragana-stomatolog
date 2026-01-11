import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

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

export const getAllPatients = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('patients').collect();
  },
});

export const getPatientById = query({
  args: { id: v.id('patients') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getPatientWithAppointments = query({
  args: { id: v.id('patients') },
  handler: async (ctx, args) => {
    const patient = await ctx.db.get(args.id);
    if (!patient) return null;

    const appointments = await ctx.db
      .query('appointments')
      .withIndex('by_patientId', (q) => q.eq('patientId', args.id))
      .order('desc')
      .collect();

    return {
      patient,
      appointments,
    };
  },
});
