import type { RouterOutputs } from '@/trpc/root-router';

/**
 * Nepregledani termin koji stiže iz appointment.getUnseen upita.
 * Tip se izvodi iz routera da ne može da se raziđe sa onim što backend vraća.
 */
export type UnseenAppointment =
  RouterOutputs['appointment']['getUnseen'][number];
