import { z } from 'zod';

type TFn = (key: string) => string;

export function createRegisterSchema(t: TFn) {
  return z
    .object({
      firstName: z.string().min(2, t('auth.validation.firstNameMin')),
      lastName: z.string().min(2, t('auth.validation.lastNameMin')),
      email: z.string().email(t('auth.validation.emailInvalid')),
      password: z.string().min(8, t('auth.validation.passwordMin')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.validation.passwordsMismatch'),
      path: ['confirmPassword'],
    });
}

export function createLoginSchema(t: TFn) {
  return z.object({
    email: z.string().email(t('auth.validation.emailInvalid')),
    password: z.string().min(1, t('auth.validation.passwordRequired')),
  });
}

export type RegisterFormSchemaInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormSchemaInputs = {
  email: string;
  password: string;
};
