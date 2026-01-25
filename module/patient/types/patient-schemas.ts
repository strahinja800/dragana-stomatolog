import { z } from 'zod';

export const genderSchema = z.enum(['MALE', 'FEMALE']);

export type GenderInput = z.infer<typeof genderSchema>;

export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'Ime je obavezno'),
  lastName: z.string().min(1, 'Prezime je obavezno'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: genderSchema.optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  notes: z.string().optional(),
  userId: z.string().optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;

export const updatePatientSchema = createPatientSchema.partial().extend({
  id: z.string(),
});

export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;

export const getPatientByIdSchema = z.object({
  id: z.string(),
});

export type GetPatientByIdInput = z.infer<typeof getPatientByIdSchema>;

export const searchPatientsSchema = z.object({
  query: z.string().optional(),
  limit: z.number().positive().optional().default(50),
  offset: z.number().nonnegative().optional().default(0),
});

export type SearchPatientsInput = z.infer<typeof searchPatientsSchema>;
