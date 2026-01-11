import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

/**
 * Vraća sve medical records za određeni appointment
 */
export const getMedicalRecordsByAppointmentId = query({
  args: { appointmentId: v.id('appointments') },
  handler: async (ctx, args) => {
    const medicalRecords = await ctx.db
      .query('medicalRecords')
      .withIndex('by_appointmentId', (q) =>
        q.eq('appointmentId', args.appointmentId)
      )
      .collect();

    return medicalRecords;
  },
});

/**
 * Vraća sve medical records za pacijenta (preko svih termina)
 */
export const getMedicalRecordsByPatientId = query({
  args: { patientId: v.id('patients') },
  handler: async (ctx, args) => {
    // 1. Pronađi sve termine pacijenta
    const appointments = await ctx.db
      .query('appointments')
      .withIndex('by_patientId', (q) => q.eq('patientId', args.patientId))
      .collect();

    // 2. Za svaki termin pronađi medical records
    const allRecords = await Promise.all(
      appointments.map(async (appointment) => {
        const records = await ctx.db
          .query('medicalRecords')
          .withIndex('by_appointmentId', (q) =>
            q.eq('appointmentId', appointment._id)
          )
          .collect();

        // Dodaj appointment info svakom zapisu
        return records.map((record) => ({
          ...record,
          appointmentDate: appointment.startTime,
          appointmentStatus: appointment.status,
        }));
      })
    );

    // 3. Flatten i sortiraj po datumu (najnoviji prvo)
    return allRecords.flat().sort((a, b) => b.appointmentDate - a.appointmentDate);
  },
});

/**
 * Kreira novi medical record za appointment
 */
export const createMedicalRecord = mutation({
  args: {
    appointmentId: v.id('appointments'),
    tooth: v.optional(v.string()),
    diagnosis: v.optional(v.string()),
    treatment: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const recordId = await ctx.db.insert('medicalRecords', {
      appointmentId: args.appointmentId,
      tooth: args.tooth,
      diagnosis: args.diagnosis,
      treatment: args.treatment,
      notes: args.notes,
    });

    return await ctx.db.get(recordId);
  },
});

/**
 * Briše medical record
 */
export const deleteMedicalRecord = mutation({
  args: {
    recordId: v.id('medicalRecords'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.recordId);
  },
});
