import { z } from 'zod';

// ============================================
// WORKING HOURS
// ============================================

export const workingHourSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
  isOpen: z.boolean(),
});

export type WorkingHourInput = z.infer<typeof workingHourSchema>;

export const upsertWorkingHoursSchema = z.object({
  hours: z.array(workingHourSchema),
});

export type UpsertWorkingHoursInput = z.infer<typeof upsertWorkingHoursSchema>;

// ============================================
// NON-WORKING DAYS
// ============================================

export const getNonWorkingDaysSchema = z.object({
  year: z.number().optional(),
});

export type GetNonWorkingDaysInput = z.infer<typeof getNonWorkingDaysSchema>;

export const createNonWorkingDaySchema = z.object({
  date: z.date(),
  reason: z.string().optional(),
});

export type CreateNonWorkingDayInput = z.infer<
  typeof createNonWorkingDaySchema
>;

export const deleteNonWorkingDaySchema = z.object({
  id: z.string(),
});

export type DeleteNonWorkingDayInput = z.infer<
  typeof deleteNonWorkingDaySchema
>;

// ============================================
// SERVICE TYPES
// ============================================

export const createServiceTypeSchema = z.object({
  name: z.string().min(1, 'Naziv je obavezan'),
  durationMinutes: z.number().positive('Trajanje mora biti pozitivan broj'),
  description: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().optional().default(0),
});

export type CreateServiceTypeInput = z.infer<typeof createServiceTypeSchema>;

export const updateServiceTypeSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  durationMinutes: z.number().positive().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export type UpdateServiceTypeInput = z.infer<typeof updateServiceTypeSchema>;

export const deleteServiceTypeSchema = z.object({
  id: z.string(),
});

export type DeleteServiceTypeInput = z.infer<typeof deleteServiceTypeSchema>;
