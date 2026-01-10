import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

const DEFAULT_SLOT_DURATION = 30; // minutes
const LOOK_AHEAD_DAYS = 60;

function parseTimeToTimestamp(dateTimestamp: number, time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date(dateTimestamp);
  d.setUTCHours(hours, minutes, 0, 0);
  return d.getTime();
}

// ============================================
// PUBLIC QUERIES
// ============================================

/**
 * Vraća sve podatke potrebne za booking formu.
 * Backend računa sve - FE samo prikazuje.
 */
export const getBookingData = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + LOOK_AHEAD_DAYS);

    // 1. Dohvati working hours (sa defaultima)
    const workingHoursRaw = await ctx.db.query('workingHours').collect();
    const workingHoursMap = Array.from({ length: 7 }, (_, dayOfWeek) => {
      const existing = workingHoursRaw.find((h) => h.dayOfWeek === dayOfWeek);
      return (
        existing ?? {
          dayOfWeek,
          startTime: '08:00',
          endTime: '17:00',
          isOpen: dayOfWeek !== 0 && dayOfWeek !== 6,
        }
      );
    });

    // Zatvoreni dani u nedelji (0=Ned, 6=Sub)
    const closedDaysOfWeek = workingHoursMap
      .filter((wh) => !wh.isOpen)
      .map((wh) => wh.dayOfWeek);

    // Radno vreme za svaki dan (0-6)
    const workingHours = workingHoursMap.map((wh) => ({
      dayOfWeek: wh.dayOfWeek,
      startTime: wh.startTime,
      endTime: wh.endTime,
    }));

    // 2. Dohvati sve non-working days (od danas pa nadalje)
    const nonWorkingDaysRaw = await ctx.db
      .query('nonWorkingDays')
      .withIndex('by_date')
      .filter((q) => q.gte(q.field('date'), today.getTime()))
      .collect();

    const disabledDates = nonWorkingDaysRaw.map((nwd) => nwd.date);

    // 3. Dohvati sve zakazane termine (CONFIRMED/PENDING) za narednih 60 dana
    const bookedAppointments = await ctx.db
      .query('appointments')
      .withIndex('by_startTime')
      .filter((q) =>
        q.and(
          q.gte(q.field('startTime'), today.getTime()),
          q.lte(q.field('startTime'), endDate.getTime()),
          q.or(
            q.eq(q.field('status'), 'CONFIRMED'),
            q.eq(q.field('status'), 'PENDING')
          )
        )
      )
      .collect();

    // 4. Grupiši termine po datumu i pretvori u bookedSlots
    // Vraćamo samo startTime timestamp - FE će formatirati prema lokalnom vremenu
    const bookedSlots = bookedAppointments.map((appt) => appt.startTime);

    return {
      closedDaysOfWeek,
      disabledDates,
      workingHours,
      bookedSlots,
    };
  },
});

// ============================================
// PUBLIC MUTATIONS
// ============================================

export const createAppointment = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    date: v.number(), // Unix timestamp
    time: v.string(),
    symptoms: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Parse name into first and last name
    const nameParts = args.name.trim().split(' ');
    const firstName = nameParts[0] || args.name;
    const lastName = nameParts.slice(1).join(' ') || '';

    // Calculate start and end time
    const startTime = parseTimeToTimestamp(args.date, args.time);
    const endTime = startTime + DEFAULT_SLOT_DURATION * 60 * 1000;

    // Check if slot is still available
    const existingAppointment = await ctx.db
      .query('appointments')
      .withIndex('by_startTime')
      .filter((q) =>
        q.and(
          q.gte(q.field('startTime'), startTime),
          q.lt(q.field('startTime'), endTime),
          q.or(
            q.eq(q.field('status'), 'CONFIRMED'),
            q.eq(q.field('status'), 'PENDING')
          )
        )
      )
      .first();

    if (existingAppointment) {
      throw new Error('Ovaj termin je već zauzet');
    }

    // Create or find patient by phone
    let patient = await ctx.db
      .query('patients')
      .withIndex('by_phone', (q) => q.eq('phone', args.phone))
      .first();

    if (!patient) {
      const patientId = await ctx.db.insert('patients', {
        firstName,
        lastName,
        phone: args.phone,
        isMain: false,
      });
      patient = await ctx.db.get(patientId);
    }

    // Create appointment
    const appointmentId = await ctx.db.insert('appointments', {
      patientId: patient!._id,
      startTime,
      endTime,
      phone: args.phone,
      symptoms: args.symptoms,
      status: 'PENDING',
      isExternal: true,
      reminderSent: false,
    });

    return await ctx.db.get(appointmentId);
  },
});

// ============================================
// ADMIN QUERIES
// ============================================

export const getPendingAppointments = query({
  args: {},
  handler: async (ctx) => {
    // await requireAdmin(ctx);

    const appointments = await ctx.db
      .query('appointments')
      .withIndex('by_status', (q) => q.eq('status', 'PENDING'))
      .collect();

    // Sort by startTime
    appointments.sort((a, b) => a.startTime - b.startTime);

    // Enrich with patient and service type data
    return await Promise.all(
      appointments.map(async (appt) => ({
        ...appt,
        patient: await ctx.db.get(appt.patientId),
        serviceType: appt.serviceTypeId
          ? await ctx.db.get(appt.serviceTypeId)
          : null,
      }))
    );
  },
});

export const getAllAppointments = query({
  args: {
    status: v.optional(
      v.union(
        v.literal('PENDING'),
        v.literal('CONFIRMED'),
        v.literal('CANCELLED'),
        v.literal('COMPLETED'),
        v.literal('NO_SHOW')
      )
    ),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx);

    // Get all appointments (filter by status if provided)
    let appointments = args.status
      ? await ctx.db
          .query('appointments')
          .withIndex('by_status', (q) => q.eq('status', args.status!))
          .collect()
      : await ctx.db.query('appointments').collect();

    // Filter by date range
    if (args.startDate) {
      appointments = appointments.filter((a) => a.startTime >= args.startDate!);
    }
    if (args.endDate) {
      appointments = appointments.filter((a) => a.startTime <= args.endDate!);
    }

    // Sort by startTime descending
    appointments.sort((a, b) => b.startTime - a.startTime);

    const total = appointments.length;

    // Pagination
    const offset = args.offset ?? 0;
    const limit = args.limit ?? 50;
    appointments = appointments.slice(offset, offset + limit);

    // Enrich with related data
    const enriched = await Promise.all(
      appointments.map(async (appt) => ({
        ...appt,
        patient: await ctx.db.get(appt.patientId),
        serviceType: appt.serviceTypeId
          ? await ctx.db.get(appt.serviceTypeId)
          : null,
        dentist: appt.dentistId ? await ctx.db.get(appt.dentistId) : null,
      }))
    );

    return { appointments: enriched, total };
  },
});

// ============================================
// ADMIN MUTATIONS
// ============================================

export const confirmAppointment = mutation({
  args: {
    id: v.id('appointments'),
    serviceTypeId: v.id('serviceTypes'),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx);

    const serviceType = await ctx.db.get(args.serviceTypeId);
    if (!serviceType) {
      throw new Error('Tip usluge nije pronađen');
    }

    const appointment = await ctx.db.get(args.id);
    if (!appointment) {
      throw new Error('Termin nije pronađen');
    }

    // Recalculate end time based on service type duration
    const newEndTime =
      appointment.startTime + serviceType.durationMinutes * 60 * 1000;

    await ctx.db.patch(args.id, {
      status: 'CONFIRMED',
      serviceTypeId: args.serviceTypeId,
      endTime: newEndTime,
      notes: args.notes || appointment.notes,
    });

    const updated = await ctx.db.get(args.id);
    return {
      ...updated,
      patient: await ctx.db.get(updated!.patientId),
      serviceType: await ctx.db.get(args.serviceTypeId),
    };
  },
});

export const rejectAppointment = mutation({
  args: {
    id: v.id('appointments'),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx);

    await ctx.db.patch(args.id, {
      status: 'CANCELLED',
      rejectionReason: args.reason,
    });

    return await ctx.db.get(args.id);
  },
});

export const rescheduleAppointment = mutation({
  args: {
    id: v.id('appointments'),
    newDate: v.number(),
    newTime: v.string(),
  },
  handler: async (ctx, args) => {
    // await requireAdmin(ctx);

    const appointment = await ctx.db.get(args.id);
    if (!appointment) {
      throw new Error('Termin nije pronađen');
    }

    let duration = DEFAULT_SLOT_DURATION;
    if (appointment.serviceTypeId) {
      const serviceType = await ctx.db.get(appointment.serviceTypeId);
      if (serviceType) {
        duration = serviceType.durationMinutes;
      }
    }

    const newStartTime = parseTimeToTimestamp(args.newDate, args.newTime);
    const newEndTime = newStartTime + duration * 60 * 1000;

    await ctx.db.patch(args.id, {
      startTime: newStartTime,
      endTime: newEndTime,
    });

    const updated = await ctx.db.get(args.id);
    return {
      ...updated,
      patient: await ctx.db.get(updated!.patientId),
      serviceType: updated!.serviceTypeId
        ? await ctx.db.get(updated!.serviceTypeId)
        : null,
    };
  },
});
