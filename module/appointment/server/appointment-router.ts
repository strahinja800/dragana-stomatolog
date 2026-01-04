import prisma from '@/lib/db';
import {
  confirmAppointmentSchema,
  createAppointmentSchema,
  getAppointmentsSchema,
  getAvailableSlotsSchema,
  rejectAppointmentSchema,
  rescheduleAppointmentSchema,
} from '@/module/appointment/types/appointment-schema';
import { adminProcedure, baseProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';

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

function parseTimeToDate(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export const appointmentRouter = createTRPCRouter({
  // ============================================
  // PUBLIC PROCEDURES
  // ============================================

  getAvailableSlots: baseProcedure
    .input(getAvailableSlotsSchema)
    .query(async ({ input }) => {
      const { date } = input;

      // Normalize date to start of day
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);

      // 1. Check if it's a non-working day
      const nonWorkingDay = await prisma.nonWorkingDay.findFirst({
        where: {
          date: targetDate,
        },
      });

      if (nonWorkingDay) {
        return { slots: [], reason: nonWorkingDay.reason || 'Neradni dan' };
      }

      // 2. Get working hours for this day of week
      const dayOfWeek = targetDate.getDay();
      const workingHours = await prisma.workingHours.findUnique({
        where: { dayOfWeek },
      });

      if (!workingHours || !workingHours.isOpen) {
        return { slots: [], reason: 'Zatvoreno' };
      }

      // 3. Generate all possible slots
      const allSlots = generateTimeSlots(
        workingHours.startTime,
        workingHours.endTime,
        DEFAULT_SLOT_DURATION
      );

      // 4. Get confirmed appointments for this date
      const startOfDay = new Date(targetDate);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const bookedAppointments = await prisma.appointment.findMany({
        where: {
          startTime: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            in: ['CONFIRMED', 'PENDING'],
          },
        },
        select: {
          startTime: true,
          endTime: true,
        },
      });

      // 5. Filter out booked slots
      const availableSlots = allSlots.filter((slot) => {
        const slotStart = parseTimeToDate(targetDate, slot);
        const slotEnd = new Date(
          slotStart.getTime() + DEFAULT_SLOT_DURATION * 60 * 1000
        );

        return !bookedAppointments.some((appointment) => {
          const apptStart = new Date(appointment.startTime);
          const apptEnd = new Date(appointment.endTime);

          // Check for overlap
          return slotStart < apptEnd && slotEnd > apptStart;
        });
      });

      return { slots: availableSlots, reason: null };
    }),

  createAppointment: baseProcedure
    .input(createAppointmentSchema)
    .mutation(async ({ input }) => {
      const { name, phone, date, time, symptoms } = input;

      // Parse name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(' ') || '';

      // Calculate start and end time
      const startTime = parseTimeToDate(date, time);
      const endTime = new Date(
        startTime.getTime() + DEFAULT_SLOT_DURATION * 60 * 1000
      );

      // Check if slot is still available
      const existingAppointment = await prisma.appointment.findFirst({
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

      // Create or find patient
      let patient = await prisma.patient.findFirst({
        where: { phone },
      });

      if (!patient) {
        patient = await prisma.patient.create({
          data: {
            firstName,
            lastName,
            phone,
          },
        });
      }

      // Create appointment
      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          startTime,
          endTime,
          phone,
          symptoms,
          status: 'PENDING',
          isExternal: true,
        },
      });

      return appointment;
    }),

  // ============================================
  // ADMIN PROCEDURES
  // ============================================

  getPendingAppointments: adminProcedure.query(async () => {
    const appointments = await prisma.appointment.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        patient: true,
        serviceType: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return appointments;
  }),

  getAllAppointments: adminProcedure
    .input(getAppointmentsSchema)
    .query(async ({ input }) => {
      const { status, startDate, endDate, limit, offset } = input;

      const where: Record<string, unknown> = {};

      if (status) {
        where.status = status;
      }

      if (startDate || endDate) {
        where.startTime = {};
        if (startDate) {
          (where.startTime as Record<string, Date>).gte = startDate;
        }
        if (endDate) {
          (where.startTime as Record<string, Date>).lte = endDate;
        }
      }

      const [appointments, total] = await Promise.all([
        prisma.appointment.findMany({
          where,
          include: {
            patient: true,
            serviceType: true,
            dentist: true,
          },
          orderBy: { startTime: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.appointment.count({ where }),
      ]);

      return { appointments, total };
    }),

  confirmAppointment: adminProcedure
    .input(confirmAppointmentSchema)
    .mutation(async ({ input }) => {
      const { id, serviceTypeId, notes } = input;

      // Get service type to update end time
      const serviceType = await prisma.serviceType.findUnique({
        where: { id: serviceTypeId },
      });

      if (!serviceType) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tip usluge nije pronađen',
        });
      }

      const appointment = await prisma.appointment.findUnique({
        where: { id },
      });

      if (!appointment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Termin nije pronađen',
        });
      }

      // Recalculate end time based on service type duration
      const newEndTime = new Date(
        appointment.startTime.getTime() +
          serviceType.durationMinutes * 60 * 1000
      );

      const updated = await prisma.appointment.update({
        where: { id },
        data: {
          status: 'CONFIRMED',
          serviceTypeId,
          endTime: newEndTime,
          notes: notes || appointment.notes,
        },
        include: {
          patient: true,
          serviceType: true,
        },
      });

      return updated;
    }),

  rejectAppointment: adminProcedure
    .input(rejectAppointmentSchema)
    .mutation(async ({ input }) => {
      const { id, reason } = input;

      const updated = await prisma.appointment.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          rejectionReason: reason,
        },
      });

      return updated;
    }),

  rescheduleAppointment: adminProcedure
    .input(rescheduleAppointmentSchema)
    .mutation(async ({ input }) => {
      const { id, newDate, newTime } = input;

      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: { serviceType: true },
      });

      if (!appointment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Termin nije pronađen',
        });
      }

      const duration =
        appointment.serviceType?.durationMinutes || DEFAULT_SLOT_DURATION;
      const newStartTime = parseTimeToDate(newDate, newTime);
      const newEndTime = new Date(
        newStartTime.getTime() + duration * 60 * 1000
      );

      const updated = await prisma.appointment.update({
        where: { id },
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
});
