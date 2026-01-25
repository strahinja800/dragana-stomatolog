import { z } from 'zod';

export const createMedicalRecordSchema = z.object({
  appointmentId: z.string(),
  patientId: z.string(),
  tooth: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string(),
  notes: z.string().optional(),
});

export const updateMedicalRecordSchema = z.object({
  id: z.string(),
  tooth: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateMedicalRecordInput = z.infer<
  typeof createMedicalRecordSchema
>;
export type UpdateMedicalRecordInput = z.infer<
  typeof updateMedicalRecordSchema
>;
