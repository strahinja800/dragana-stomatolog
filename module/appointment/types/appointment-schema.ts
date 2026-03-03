import * as z from 'zod';

// Public schemas (for booking form)
export const getAvailableSlotsSchema = z.object({
  date: z.coerce.date(),
});

export const createAppointmentSchema = z.object({
  name: z.string().min(1, 'Ime je obavezno'),
  email: z.string().email('Unesite validnu email adresu'),
  phone: z.string().min(1, 'Broj telefona je obavezan'),
  date: z.coerce.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
  symptoms: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

// Admin schemas
export const getAppointmentsSchema = z.object({
  status: z
    .enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'])
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.number().min(1).max(100).optional().default(50),
  offset: z.number().min(0).optional().default(0),
});

export const confirmAppointmentSchema = z.object({
  id: z.string(),
  serviceTypeId: z.string(),
  notes: z.string().optional(),
});

export const rejectAppointmentSchema = z.object({
  id: z.string(),
  reason: z.string().min(1, 'Razlog odbijanja je obavezan'),
});

export const rescheduleAppointmentSchema = z.object({
  id: z.string(),
  newDate: z.coerce.date(),
  newTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
});

export type ConfirmAppointmentInput = z.infer<typeof confirmAppointmentSchema>;
export type RejectAppointmentInput = z.infer<typeof rejectAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<
  typeof rescheduleAppointmentSchema
>;
