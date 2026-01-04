import { z } from 'zod';

export const afterRegisterPatientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  userId: z.string(),
  email: z.email(),
});
