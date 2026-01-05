import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

const DEFAULT_SLOT_DURATION = 30; // minutes

function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number
): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes + durationMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const mins = currentMinutes % 60;
    slots.push(
      `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    );
    currentMinutes += durationMinutes;
  }

  return slots;
}

function parseTimeToTimestamp(dateTimestamp: number, time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const d = new Date(dateTimestamp);
  d.setUTCHours(hours, minutes, 0, 0);
  return d.getTime();
}

// ============================================
// PUBLIC QUERIES
// ============================================

export const getAvailableSlots = query({
  args: {
    date: v.number(), // Unix timestamp
  },
  handler: async (ctx, args) => {
    // Add 12 hours to avoid timezone issues (noon is safe from day boundary shifts)
    const noonDate = new Date(args.date + 12 * 60 * 60 * 1000);
    const dayOfWeek = noonDate.getUTCDay();

    // Normalize to noon UTC for database queries
    const targetDate = new Date(args.date);
    targetDate.setUTCHours(12, 0, 0, 0);
    const dateTimestamp = targetDate.getTime();

    // 1. Check if it's a non-working day
    const nonWorkingDay = await ctx.db
      .query('nonWorkingDays')
      .withIndex('by_date', (q) => q.eq('date', dateTimestamp))
      .unique();

    if (nonWorkingDay) {
      return { slots: [], reason: nonWorkingDay.reason || 'Neradni dan' };
    }

    // 2. Get working hours for this day of week (with defaults)
    let workingHours = await ctx.db
      .query('workingHours')
      .withIndex('by_dayOfWeek', (q) => q.eq('dayOfWeek', dayOfWeek))
      .unique();

    // Use defaults if not found (same logic as getWorkingHours in settings.ts)
    if (!workingHours) {
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      if (isWeekend) {
        return { slots: [], reason: 'Zatvoreno' };
      }
      // Default working hours for weekdays
      workingHours = {
        _id: `default-${dayOfWeek}` as never,
        _creationTime: Date.now(),
        dayOfWeek,
        startTime: '08:00',
        endTime: '17:00',
        isOpen: true,
      };
    }

    if (!workingHours.isOpen) {
      return { slots: [], reason: 'Zatvoreno' };
    }

    // 3. Generate all possible slots
    const allSlots = generateTimeSlots(
      workingHours.startTime,
      workingHours.endTime,
      DEFAULT_SLOT_DURATION
    );

    // 4. Get confirmed/pending appointments for this date
    const startOfDay = dateTimestamp;
    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const bookedAppointments = await ctx.db
      .query('appointments')
      .withIndex('by_startTime')
      .filter((q) =>
        q.and(
          q.gte(q.field('startTime'), startOfDay),
          q.lte(q.field('startTime'), endOfDay.getTime()),
          q.or(
            q.eq(q.field('status'), 'CONFIRMED'),
            q.eq(q.field('status'), 'PENDING')
          )
        )
      )
      .collect();

    // 5. Filter out booked slots
    const availableSlots = allSlots.filter((slot) => {
      const slotStart = parseTimeToTimestamp(dateTimestamp, slot);
      const slotEnd = slotStart + DEFAULT_SLOT_DURATION * 60 * 1000;

      return !bookedAppointments.some((appt) => {
        return slotStart < appt.endTime && slotEnd > appt.startTime;
      });
    });

    return { slots: availableSlots, reason: null };
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
