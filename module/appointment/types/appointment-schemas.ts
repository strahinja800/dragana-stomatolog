import { z } from 'zod';

export const appointmentStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
  'NO_SHOW',
]);

export type AppointmentStatusInput = z.infer<typeof appointmentStatusSchema>;

// Public: Create appointment
export const createAppointmentSchema = z.object({
  name: z.string().min(1, 'Ime je obavezno'),
  phone: z.string().min(1, 'Telefon je obavezan'),
  date: z.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
  symptoms: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

// Admin: Create appointment for patient
export const createAppointmentForPatientSchema = z.object({
  patientId: z.string(),
  date: z.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
  symptoms: z.string().optional(),
});

export type CreateAppointmentForPatientInput = z.infer<
  typeof createAppointmentForPatientSchema
>;

// Admin: Get all appointments
export const getAllAppointmentsSchema = z.object({
  status: appointmentStatusSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().positive().optional().default(50),
  offset: z.number().nonnegative().optional().default(0),
});

export type GetAllAppointmentsInput = z.infer<typeof getAllAppointmentsSchema>;

// Admin: Confirm appointment
export const confirmAppointmentSchema = z.object({
  id: z.string(),
  serviceTypeId: z.string(),
  notes: z.string().optional(),
});

export type ConfirmAppointmentInput = z.infer<typeof confirmAppointmentSchema>;

// Admin: Reject appointment
export const rejectAppointmentSchema = z.object({
  id: z.string(),
  reason: z.string().min(1, 'Razlog je obavezan'),
});

export type RejectAppointmentInput = z.infer<typeof rejectAppointmentSchema>;

// Admin: Reschedule appointment
export const rescheduleAppointmentSchema = z.object({
  id: z.string(),
  newDate: z.date(),
  newTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
});

export type RescheduleAppointmentInput = z.infer<
  typeof rescheduleAppointmentSchema
>;

// Get time slots
export const getTimeSlotsSchema = z.object({
  date: z.date(),
});

export type GetTimeSlotsInput = z.infer<typeof getTimeSlotsSchema>;
