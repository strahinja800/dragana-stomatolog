import * as z from 'zod';

// Working Hours schemas
export const workingHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
  isOpen: z.boolean(),
});

export const upsertWorkingHoursSchema = z.array(workingHoursSchema);

export type WorkingHoursInput = z.infer<typeof workingHoursSchema>;

// Non-Working Day schemas
export const createNonWorkingDaySchema = z.object({
  date: z.coerce.date(),
  reason: z.string().optional(),
});

export const deleteNonWorkingDaySchema = z.object({
  id: z.string(),
});

export type CreateNonWorkingDayInput = z.infer<
  typeof createNonWorkingDaySchema
>;

// Service Type schemas
export const createServiceTypeSchema = z.object({
  name: z.string().min(1, 'Naziv je obavezan'),
  durationMinutes: z.number().min(5).max(480),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const updateServiceTypeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Naziv je obavezan').optional(),
  durationMinutes: z.number().min(15).max(480).optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const deleteServiceTypeSchema = z.object({
  id: z.string(),
});

export type CreateServiceTypeInput = z.infer<typeof createServiceTypeSchema>;
export type UpdateServiceTypeInput = z.infer<typeof updateServiceTypeSchema>;

// Query schemas
export const getNonWorkingDaysSchema = z.object({
  year: z.number().optional(),
});
