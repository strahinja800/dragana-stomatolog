import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { gender } from './schema';

export const createPatient = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    gender: v.optional(gender),
    authId: v.optional(v.string()),
    isMain: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const patientId = await ctx.db.insert('patients', {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      phone: args.phone,
      dateOfBirth: args.dateOfBirth,
      gender: args.gender,
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

export const deletePatient = mutation({
  args: {
    patientId: v.id('patients'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.patientId);
  },
});
