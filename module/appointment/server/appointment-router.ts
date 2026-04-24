import React from 'react';

import { TRPCError } from '@trpc/server';
import crypto from 'crypto';
import { addHours, addMinutes, endOfDay, startOfDay } from 'date-fns';
import { z } from 'zod';

import AdminNewAppointment, {
  subject as adminNewAppointmentSubject,
} from '@/emails/admin-new-appointment';
import AppointmentBookingReceived, {
  subject as bookingReceivedSubject,
} from '@/emails/appointment-booking-received';
import AppointmentConfirmed, {
  subject as appointmentConfirmedSubject,
} from '@/emails/appointment-confirmed';
import AppointmentRejected, {
  subject as appointmentRejectedSubject,
} from '@/emails/appointment-rejected';
import AppointmentTimeProposal, {
  subject as appointmentTimeProposalSubject,
} from '@/emails/appointment-time-proposal';
import { sendEmail } from '@/lib/email/resend-client';
import {
  emitAppointmentCreated,
  emitAppointmentSlotChanged,
} from '@/lib/events';
import { Prisma } from '@/lib/generated/prisma/client';
import {
  formatLocalTime,
  getCurrentLocalTimeMinutes,
  getLocalDayOfWeek,
  isLocalToday,
  parseLocalTime,
} from '@/lib/timezone';
import {
  bookAppointmentSchema,
  confirmAppointmentSchema,
  createAppointmentForPatientSchema,
  createAppointmentSchema,
  getAllAppointmentsSchema,
  getTimeSlotsSchema,
  proposeTimeSchema,
  rejectAppointmentSchema,
  rescheduleAppointmentSchema,
} from '@/module/appointment/types/appointment-schemas';
import { resolvePatient } from '@/module/patient/server/patient-service';
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/trpc/init';

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

      let patient;
      try {
        patient = await ctx.prisma.patient.create({
          data: {
            firstName,
            lastName,
            email: input.email,
            phone: input.phone,
            isMain: false,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          const metaStr = JSON.stringify(error.meta ?? '').toLowerCase();
          const isEmail = metaStr.includes('email');
          throw new TRPCError({
            code: 'CONFLICT',
            message: isEmail
              ? 'Pacijent sa ovom email adresom već postoji'
              : 'Pacijent sa ovim brojem telefona već postoji',
          });
        }
        throw error;
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

      const patientName = `${firstName} ${lastName}`.trim();

      // Email to patient
      const emailResult = await sendEmail({
        to: input.email,
        subject: bookingReceivedSubject,
        react: React.createElement(AppointmentBookingReceived, {
          patientName,
          startTime,
        }),
      });

      if (!emailResult.success) {
        console.error('[appointment.create] Booking received email failed', {
          appointmentId: appointment.id,
          reason: emailResult.message,
        });
      }

      // Email to admin
      const clinicEmail = process.env.CLINIC_EMAIL;
      if (clinicEmail) {
        const adminEmailResult = await sendEmail({
          to: clinicEmail,
          subject: adminNewAppointmentSubject,
          react: React.createElement(AdminNewAppointment, {
            patientName,
            startTime,
            phone: input.phone,
            symptoms: input.symptoms ?? null,
          }),
        });

        if (!adminEmailResult.success) {
          console.error(
            '[appointment.create] Admin notification email failed',
            {
              appointmentId: appointment.id,
              reason: adminEmailResult.message,
            }
          );
        }
      }

      // SSE notification to admin dashboard
      emitAppointmentCreated({
        appointmentId: appointment.id,
        patientName,
        serviceName: null,
        startTime: startTime.toISOString(),
        phone: input.phone,
        email: input.email,
        symptoms: input.symptoms ?? null,
        createdAt: appointment.createdAt,
      });

      emitAppointmentSlotChanged();
      return appointment;
    }),

  /**
   * Briše termin
   */
  delete: adminProcedure
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
  // PROTECTED MUTATIONS (logged-in patients)
  // ============================================

  book: protectedProcedure
    .input(bookAppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      const startTime = parseLocalTime(input.date, input.time);
      const endTime = addMinutes(startTime, DEFAULT_SLOT_DURATION);

      const appointment = await ctx.prisma.$transaction(async (tx) => {
        const existingAppointment = await tx.appointment.findFirst({
          where: {
            startTime: { gte: startTime, lt: endTime },
            status: { in: ['CONFIRMED', 'PENDING'] },
          },
        });

        if (existingAppointment) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Ovaj termin je već zauzet',
          });
        }

        const patient = await resolvePatient(
          tx,
          ctx.session.user,
          input.profile
        );

        return tx.appointment.create({
          data: {
            patientId: patient.id,
            startTime,
            endTime,
            email: patient.email ?? ctx.session.user.email,
            phone: patient.phone,
            symptoms: input.symptoms,
            status: 'PENDING',
            isExternal: true,
            reminderSent: false,
          },
          include: { patient: true },
        });
      });

      const patientName =
        `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim();

      const emailResult = await sendEmail({
        to: appointment.email ?? ctx.session.user.email,
        subject: bookingReceivedSubject,
        react: React.createElement(AppointmentBookingReceived, {
          patientName,
          startTime,
        }),
      });

      if (!emailResult.success) {
        console.error('[appointment.book] Booking received email failed', {
          appointmentId: appointment.id,
          reason: emailResult.message,
        });
      }

      const clinicEmail = process.env.CLINIC_EMAIL;
      if (clinicEmail) {
        const adminEmailResult = await sendEmail({
          to: clinicEmail,
          subject: adminNewAppointmentSubject,
          react: React.createElement(AdminNewAppointment, {
            patientName,
            startTime,
            phone: appointment.phone ?? null,
            symptoms: input.symptoms ?? null,
          }),
        });

        if (!adminEmailResult.success) {
          console.error('[appointment.book] Admin notification email failed', {
            appointmentId: appointment.id,
            reason: adminEmailResult.message,
          });
        }
      }

      emitAppointmentCreated({
        appointmentId: appointment.id,
        patientName,
        serviceName: null,
        startTime: startTime.toISOString(),
        email: appointment.email ?? ctx.session.user.email,
        phone: appointment.phone ?? 'N/A',
        symptoms: input.symptoms ?? null,
        createdAt: appointment.createdAt,
      });

      emitAppointmentSlotChanged();
      return appointment;
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

  getUnseen: adminProcedure.query(async ({ ctx }) => {
    const appointments = await ctx.prisma.appointment.findMany({
      where: { status: 'PENDING', adminSeen: false },
      include: { patient: true, serviceType: true },
      orderBy: { createdAt: 'asc' },
    });

    return appointments.map((a) => ({
      appointmentId: a.id,
      patientName: `${a.patient.firstName} ${a.patient.lastName}`,
      serviceName: a.serviceType?.name ?? null,
      startTime: a.startTime.toISOString(),
      phone: a.phone ?? '',
      email: a.email ?? '',
      symptoms: a.symptoms ?? null,
      timestamp: a.createdAt.getTime(),
    }));
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
        const patientName =
          `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim();

        const emailResult = await sendEmail({
          to: appointment.email,
          subject: appointmentConfirmedSubject,
          react: React.createElement(AppointmentConfirmed, {
            patientName,
            startTime: appointment.startTime,
            serviceName: null,
          }),
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
        const patientName =
          `${updated.patient.firstName} ${updated.patient.lastName}`.trim();

        const emailResult = await sendEmail({
          to: confirmationEmail,
          subject: appointmentConfirmedSubject,
          react: React.createElement(AppointmentConfirmed, {
            patientName,
            startTime: updated.startTime,
            serviceName: updated.serviceType?.name ?? null,
          }),
        });

        if (!emailResult.success) {
          console.error('[appointment.confirm] Confirmation email failed', {
            appointmentId: updated.id,
            reason: emailResult.message,
          });
        }
      }

      emitAppointmentSlotChanged();
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

      const rejectionEmail = updated.email ?? updated.patient.email;

      if (rejectionEmail) {
        const patientName =
          `${updated.patient.firstName} ${updated.patient.lastName}`.trim();

        const emailResult = await sendEmail({
          to: rejectionEmail,
          subject: appointmentRejectedSubject,
          react: React.createElement(AppointmentRejected, {
            patientName,
            startTime: updated.startTime,
            reason: input.reason ?? null,
          }),
        });

        if (!emailResult.success) {
          console.error('[appointment.reject] Rejection email failed', {
            appointmentId: updated.id,
            reason: emailResult.message,
          });
        }
      }
      emitAppointmentSlotChanged();
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

  /**
   * Predlaže pacijentu novi termin i šalje email sa accept/reject linkovima
   */
  proposeTime: adminProcedure
    .input(proposeTimeSchema)
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.prisma.appointment.findUnique({
        where: { id: input.id },
        include: { patient: true, serviceType: true },
      });

      if (!appointment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Termin nije pronađen',
        });
      }

      const patientEmail = appointment.email ?? appointment.patient.email;

      if (!patientEmail) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Pacijent nema email adresu',
        });
      }

      const duration =
        appointment.serviceType?.durationMinutes ?? DEFAULT_SLOT_DURATION;
      const proposedStartTime = parseLocalTime(input.newDate, input.newTime);
      const proposedEndTime = addMinutes(proposedStartTime, duration);

      const conflict = await ctx.prisma.appointment.findFirst({
        where: {
          status: { in: ['CONFIRMED', 'PENDING'] },
          id: { not: input.id },
          OR: [
            {
              // Overlap with existing scheduled appointment times
              startTime: { lt: proposedEndTime },
              endTime: { gt: proposedStartTime },
            },
            {
              // Overlap with other pending proposed times
              proposedStartTime: { lt: proposedEndTime },
              proposedEndTime: { gt: proposedStartTime },
            },
          ],
        },
      });

      if (conflict) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Ovaj termin je već zauzet',
        });
      }

      const identifier = `appointment-proposal:${input.id}`;
      const token = crypto.randomBytes(16).toString('hex');

      await ctx.prisma.verification.deleteMany({ where: { identifier } });
      await ctx.prisma.verification.create({
        data: {
          identifier,
          value: token,
          expiresAt: addHours(new Date(), 72),
        },
      });

      await ctx.prisma.appointment.update({
        where: { id: input.id },
        data: { proposedStartTime, proposedEndTime },
      });

      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
      const acceptUrl = `${baseUrl}/api/appointment/response?token=${token}&action=accept`;
      const rejectUrl = `${baseUrl}/api/appointment/response?token=${token}&action=reject`;

      const patientName =
        `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim();

      const emailResult = await sendEmail({
        to: patientEmail,
        subject: appointmentTimeProposalSubject,
        react: React.createElement(AppointmentTimeProposal, {
          patientName,
          proposedStartTime,
          acceptUrl,
          rejectUrl,
        }),
      });

      if (!emailResult.success) {
        console.error('[appointment.proposeTime] Email failed', {
          appointmentId: input.id,
          reason: emailResult.message,
        });
      }

      return { success: true };
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
        status: 'CONFIRMED',
      },
      include: { patient: true, serviceType: true },
      orderBy: { startTime: 'asc' },
    });
  }),

  //  Seen feature for admin dashboard notifications
  markAsSeen: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.appointment.updateMany({
        where: { id: input.id },
        data: { adminSeen: true, adminSeenAt: new Date() },
      });

      if (result.count === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Termin nije pronađen.',
        });
      }
      return { success: true };
    }),
});
