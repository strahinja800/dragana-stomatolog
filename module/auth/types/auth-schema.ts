import { z } from 'zod';
export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Ime mora imati najmanje 2 karaktera'),
    lastName: z.string().min(2, 'Prezime mora imati najmanje 2 karaktera'),
    email: z.string().email('Unesite validnu email adresu'),
    password: z.string().min(8, 'Lozinka mora imati najmanje 8 karaktera'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmPassword'],
  });

export type RegisterFormSchemaInputs = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Unesite validnu email adresu'),
  password: z.string().min(1, 'Lozinka je obavezna'),
});

export type LoginFormSchemaInputs = z.infer<typeof loginSchema>;
