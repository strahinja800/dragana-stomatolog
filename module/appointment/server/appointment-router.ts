import { TRPCError } from '@trpc/server';
import { addMinutes, endOfDay, startOfDay } from 'date-fns';
import { z } from 'zod';

import { sendEmail } from '@/lib/email/resend-client';
import {
  formatLocalTime,
  getCurrentLocalTimeMinutes,
  getLocalDayOfWeek,
  isLocalToday,
  parseLocalTime,
} from '@/lib/timezone';
import {
  getBookingConfirmedEmail,
  getBookingReceivedEmail,
} from '@/module/appointment/server/appointment-email-templates';
import {
  confirmAppointmentSchema,
  createAppointmentForPatientSchema,
  createAppointmentSchema,
  getAllAppointmentsSchema,
  getTimeSlotsSchema,
  rejectAppointmentSchema,
  rescheduleAppointmentSchema,
} from '@/module/appointment/types/appointment-schemas';
import { adminProcedure, createTRPCRouter, publicProcedure } from '@/trpc/init';

const DEFAULT_SLOT_DURATION = 30; // minutes

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export const appointmentRouter = createTRPCRouter({
  // ============================================
  // PUBLIC QUERIES
  // ============================================

  /**
   * Vraća neradne dane za kalendar.
   * - closedDaysOfWeek: dani u nedelji koji su uvek zatvoreni (0=Ned, 6=Sub)
   * - disabledDates: specifični datumi koji su neradni (praznici, godišnji, itd.)
   */
  getNonWorkingDays: publicProcedure.query(async ({ ctx }) => {
    const today = startOfDay(new Date());

    // 1. Zatvoreni dani u nedelji
    const workingHours = await ctx.prisma.workingHour.findMany();
    const closedDaysOfWeek = Array.from({ length: 7 }, (_, dayOfWeek) => {
      const existing = workingHours.find((h) => h.dayOfWeek === dayOfWeek);
      const isOpen = existing?.isOpen ?? (dayOfWeek !== 0 && dayOfWeek !== 6);
      return isOpen ? null : dayOfWeek;
    }).filter((day): day is number => day !== null);

    // 2. Specifični neradni datumi
    const nonWorkingDays = await ctx.prisma.nonWorkingDay.findMany({
      where: {
        date: {
          gte: today,
        },
      },
    });

    const disabledDates = nonWorkingDays.map((nwd) => nwd.date.getTime());

    return {
      closedDaysOfWeek,
      disabledDates,
    };
  }),

  /**
   * Vraća time slotove za odabrani datum sa statusom dostupnosti.
   */
  getTimeSlotsForDate: publicProcedure
    .input(getTimeSlotsSchema)
    .query(async ({ ctx, input }): Promise<TimeSlot[]> => {
      const dayOfWeek = getLocalDayOfWeek(input.date.getTime());

      // 1. Dohvati working hours za taj dan
      const workingHours = await ctx.prisma.workingHour.findMany();
      const dayHours = workingHours.find((h) => h.dayOfWeek === dayOfWeek) ?? {
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
      const dayStart = startOfDay(input.date);
      const dayEnd = endOfDay(input.date);

      const nonWorkingDay = await ctx.prisma.nonWorkingDay.findFirst({
        where: {
          date: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

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
      const bookedAppointments = await ctx.prisma.appointment.findMany({
        where: {
          startTime: {
            gte: dayStart,
            lte: dayEnd,
          },
          status: {
            in: ['CONFIRMED', 'PENDING'],
          },
        },
      });

      const bookedTimes = new Set(
        bookedAppointments.map((appt) => formatLocalTime(appt.startTime))
      );

      // 5. Proveri da li je danas - za filtriranje prošlih termina
      const isTodaySelected = isLocalToday(input.date);
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
    }),

  // ============================================
  // PUBLIC MUTATIONS
  // ============================================

  /**
   * Kreira novi termin (public booking)
   */
  create: publicProcedure
    .input(createAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      // Parse name into first and last name
      const nameParts = input.name.trim().split(' ');
      const firstName = nameParts[0] || input.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      // Calculate start and end time
      const startTime = parseLocalTime(input.date, input.time);
      const endTime = addMinutes(startTime, DEFAULT_SLOT_DURATION);

      // Check if slot is still available
      const existingAppointment = await ctx.prisma.appointment.findFirst({
        where: {
          startTime: {
            gte: startTime,
            lt: endTime,
          },
          status: {
            in: ['CONFIRMED', 'PENDING'],
          },
        },
      });

      if (existingAppointment) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Ovaj termin je već zauzet',
        });
      }

      // Create or find patient by phone
      let patient = await ctx.prisma.patient.findFirst({
        where: { phone: input.phone },
      });

      if (!patient) {
        patient = await ctx.prisma.patient.create({
          data: {
            firstName,
            lastName,
            email: input.email,
            phone: input.phone,
            isMain: false,
          },
        });
      } else if (!patient.email) {
        patient = await ctx.prisma.patient.update({
          where: { id: patient.id },
          data: { email: input.email },
        });
      }

      // Create appointment
      const appointment = await ctx.prisma.appointment.create({
        data: {
          patientId: patient.id,
          startTime,
          endTime,
          email: input.email,
          phone: input.phone,
          symptoms: input.symptoms,
          status: 'PENDING',
          isExternal: true,
          reminderSent: false,
        },
        include: {
          patient: true,
        },
      });

      const receivedEmail = getBookingReceivedEmail({
        patientName: `${firstName} ${lastName}`.trim(),
        startTime,
      });

      const emailResult = await sendEmail({
        to: input.email,
        subject: receivedEmail.subject,
        html: receivedEmail.html,
        text: receivedEmail.text,
      });

      if (!emailResult.success) {
        console.error('[appointment.create] Booking received email failed', {
          appointmentId: appointment.id,
          reason: emailResult.message,
        });
      }

      return appointment;
    }),

  /**
   * Briše termin
   */
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.prisma.appointment.findUnique({
        where: { id: input.id },
      });

      if (!appointment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Termin ne postoji',
        });
      }

      // MedicalRecords are automatically deleted via onDelete: Cascade in schema
      await ctx.prisma.appointment.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // ============================================
  // ADMIN QUERIES
  // ============================================

  /**
   * Vraća sve termine sa statusom PENDING
   */
  getPending: adminProcedure.query(async ({ ctx }) => {
    const appointments = await ctx.prisma.appointment.findMany({
      where: { status: 'PENDING' },
      include: {
        patient: true,
        serviceType: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return appointments;
  }),

  /**
   * Vraća sve termine sa filterima i paginacijom
   */
  getAll: adminProcedure
    .input(getAllAppointmentsSchema)
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input.status && { status: input.status }),
        ...(input.startDate && { startTime: { gte: input.startDate } }),
        ...(input.endDate && { startTime: { lte: input.endDate } }),
      };

      const [appointments, total] = await Promise.all([
        ctx.prisma.appointment.findMany({
          where,
          include: {
            patient: true,
            serviceType: true,
            dentist: true,
          },
          orderBy: { startTime: 'desc' },
          skip: input.offset,
          take: input.limit,
        }),
        ctx.prisma.appointment.count({ where }),
      ]);

      return { appointments, total };
    }),

  // ============================================
  // ADMIN MUTATIONS
  // ============================================

  /**
   * Kreira termin za postojećeg pacijenta (admin)
   */
  createForPatient: adminProcedure
    .input(createAppointmentForPatientSchema)
    .mutation(async ({ ctx, input }) => {
      const startTime = parseLocalTime(input.date, input.time);
      const endTime = addMinutes(startTime, DEFAULT_SLOT_DURATION);

      // Check if slot is available
      const existingAppointment = await ctx.prisma.appointment.findFirst({
        where: {
          startTime: {
            gte: startTime,
            lt: endTime,
          },
          status: {
            in: ['CONFIRMED', 'PENDING'],
          },
        },
      });

      if (existingAppointment) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Ovaj termin je već zauzet',
        });
      }

      const patient = await ctx.prisma.patient.findUnique({
        where: { id: input.patientId },
      });

      if (!patient) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Pacijent ne postoji',
        });
      }

      const appointment = await ctx.prisma.appointment.create({
        data: {
          patientId: patient.id,
          startTime,
          endTime,
          email: patient.email ?? undefined,
          phone: patient.phone,
          symptoms: input.symptoms,
          status: 'CONFIRMED',
          isExternal: false,
          reminderSent: false,
        },
        include: {
          patient: true,
        },
      });

      if (appointment.email) {
        const confirmedEmail = getBookingConfirmedEmail({
          patientName:
            `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim(),
          startTime: appointment.startTime,
          serviceName: null,
        });

        const emailResult = await sendEmail({
          to: appointment.email,
          subject: confirmedEmail.subject,
          html: confirmedEmail.html,
          text: confirmedEmail.text,
        });

        if (!emailResult.success) {
          console.error(
            '[appointment.createForPatient] Confirmation email failed',
            {
              appointmentId: appointment.id,
              reason: emailResult.message,
            }
          );
        }
      }

      return appointment;
    }),

  /**
   * Potvrđuje termin i dodeljuje tip usluge
   */
  confirm: adminProcedure
    .input(confirmAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      const serviceType = await ctx.prisma.serviceType.findUnique({
        where: { id: input.serviceTypeId },
      });

      if (!serviceType) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tip usluge nije pronađen',
        });
      }

      const appointment = await ctx.prisma.appointment.findUnique({
        where: { id: input.id },
      });

      if (!appointment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Termin nije pronađen',
        });
      }

      // Recalculate end time based on service type duration
      const newEndTime = addMinutes(
        appointment.startTime,
        serviceType.durationMinutes
      );

      const updated = await ctx.prisma.appointment.update({
        where: { id: input.id },
        data: {
          status: 'CONFIRMED',
          serviceTypeId: input.serviceTypeId,
          endTime: newEndTime,
          notes: input.notes || appointment.notes,
        },
        include: {
          patient: true,
          serviceType: true,
        },
      });

      const confirmationEmail = updated.email ?? updated.patient.email;

      if (confirmationEmail) {
        const confirmedEmail = getBookingConfirmedEmail({
          patientName:
            `${updated.patient.firstName} ${updated.patient.lastName}`.trim(),
          startTime: updated.startTime,
          serviceName: updated.serviceType?.name,
        });

        const emailResult = await sendEmail({
          to: confirmationEmail,
          subject: confirmedEmail.subject,
          html: confirmedEmail.html,
          text: confirmedEmail.text,
        });

        if (!emailResult.success) {
          console.error('[appointment.confirm] Confirmation email failed', {
            appointmentId: updated.id,
            reason: emailResult.message,
          });
        }
      }

      return updated;
    }),

  /**
   * Odbija termin
   */
  reject: adminProcedure
    .input(rejectAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.prisma.appointment.update({
        where: { id: input.id },
        data: {
          status: 'CANCELLED',
          rejectionReason: input.reason,
        },
        include: {
          patient: true,
        },
      });

      return updated;
    }),

  /**
   * Pomera termin na novi datum/vreme
   */
  reschedule: adminProcedure
    .input(rescheduleAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.prisma.appointment.findUnique({
        where: { id: input.id },
        include: { serviceType: true },
      });

      if (!appointment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Termin nije pronađen',
        });
      }

      const duration =
        appointment.serviceType?.durationMinutes ?? DEFAULT_SLOT_DURATION;

      const newStartTime = parseLocalTime(input.newDate, input.newTime);
      const newEndTime = addMinutes(newStartTime, duration);

      const updated = await ctx.prisma.appointment.update({
        where: { id: input.id },
        data: {
          startTime: newStartTime,
          endTime: newEndTime,
        },
        include: {
          patient: true,
          serviceType: true,
        },
      });

      return updated;
    }),

  //  Danasnji termini za admin dashboard
  getToday: adminProcedure.query(({ ctx }) => {
    const now = new Date();
    return ctx.prisma.appointment.findMany({
      where: {
        startTime: {
          gte: startOfDay(now),
          lte: endOfDay(now),
        },
      },
      include: { patient: true, serviceType: true },
      orderBy: { startTime: 'asc' },
    });
  }),
});
