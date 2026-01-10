import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import {
  formatLocalTime,
  getCurrentLocalTimeMinutes,
  getLocalDayEnd,
  getLocalDayOfWeek,
  getLocalDayStart,
  isLocalToday,
  parseLocalTime,
} from './lib/timezone';

const DEFAULT_SLOT_DURATION = 30; // minutes

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

// ============================================
// PUBLIC QUERIES
// ============================================

/**
 * Vraća neradne dane za kalendar.
 * - closedDaysOfWeek: dani u nedelji koji su uvek zatvoreni (0=Ned, 6=Sub)
 * - disabledDates: specifični datumi koji su neradni (praznici, godišnji, itd.)
 */
export const getNonWorkingDays = query({
  args: {},
  handler: async (ctx) => {
    const today = getLocalDayStart(Date.now());

    // 1. Zatvoreni dani u nedelji
    const workingHoursRaw = await ctx.db.query('workingHours').collect();
    const closedDaysOfWeek = Array.from({ length: 7 }, (_, dayOfWeek) => {
      const existing = workingHoursRaw.find((h) => h.dayOfWeek === dayOfWeek);
      const isOpen = existing?.isOpen ?? (dayOfWeek !== 0 && dayOfWeek !== 6);
      return isOpen ? null : dayOfWeek;
    }).filter((day): day is number => day !== null);

    // 2. Specifični neradni datumi
    const nonWorkingDaysRaw = await ctx.db
      .query('nonWorkingDays')
      .withIndex('by_date')
      .filter((q) => q.gte(q.field('date'), today.getTime()))
      .collect();

    const disabledDates = nonWorkingDaysRaw.map((nwd) => nwd.date);

    return {
      closedDaysOfWeek,
      disabledDates,
    };
  },
});

/**
 * Vraća time slotove za odabrani datum sa statusom dostupnosti.
 * Uključuje logiku za neradne dane i prošle termine.
 */
export const getTimeSlotsForDate = query({
  args: {
    date: v.number(), // Unix timestamp (početak dana)
  },
  handler: async (ctx, args): Promise<TimeSlot[]> => {
    const dayOfWeek = getLocalDayOfWeek(args.date);

    // 1. Dohvati working hours za taj dan
    const workingHoursRaw = await ctx.db.query('workingHours').collect();
    const dayHours = workingHoursRaw.find((h) => h.dayOfWeek === dayOfWeek) ?? {
      dayOfWeek,
      startTime: '08:00',
      endTime: '17:00',
      isOpen: dayOfWeek !== 0 && dayOfWeek !== 6,
    };

    // Ako je neradni dan, vrati prazan niz
    if (!dayHours.isOpen) {
      return [];
    }

    // 2. Proveri da li je non-working day
    const dayStart = getLocalDayStart(args.date);
    const dayEnd = getLocalDayEnd(args.date);

    const nonWorkingDay = await ctx.db
      .query('nonWorkingDays')
      .withIndex('by_date')
      .filter((q) =>
        q.and(
          q.gte(q.field('date'), dayStart.getTime()),
          q.lte(q.field('date'), dayEnd.getTime())
        )
      )
      .first();

    if (nonWorkingDay) {
      return [];
    }

    // 3. Generiši sve slotove za taj dan
    const slots: TimeSlot[] = [];
    const [startHour, startMin] = dayHours.startTime.split(':').map(Number);
    const [endHour, endMin] = dayHours.endTime.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    // 4. Dohvati zauzete termine za taj dan
    const bookedAppointments = await ctx.db
      .query('appointments')
      .withIndex('by_startTime')
      .filter((q) =>
        q.and(
          q.gte(q.field('startTime'), dayStart.getTime()),
          q.lte(q.field('startTime'), dayEnd.getTime()),
          q.or(
            q.eq(q.field('status'), 'CONFIRMED'),
            q.eq(q.field('status'), 'PENDING')
          )
        )
      )
      .collect();

    const bookedTimes = new Set(
      bookedAppointments.map((appt) => formatLocalTime(appt.startTime))
    );

    // 5. Proveri da li je danas - za filtriranje prošlih termina
    const isTodaySelected = isLocalToday(args.date);
    const currentTimeMinutes = getCurrentLocalTimeMinutes();

    // 6. Generiši slotove sa statusom
    while (currentMinutes + DEFAULT_SLOT_DURATION <= endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const mins = currentMinutes % 60;
      const time = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

      const isBooked = bookedTimes.has(time);
      const isPast = isTodaySelected && currentMinutes <= currentTimeMinutes;

      slots.push({
        time,
        isAvailable: !isBooked && !isPast,
      });

      currentMinutes += DEFAULT_SLOT_DURATION;
    }

    return slots;
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
    const startTime = parseLocalTime(args.date, args.time);
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

    const newStartTime = parseLocalTime(args.newDate, args.newTime);
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
