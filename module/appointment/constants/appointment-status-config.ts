import type { AppointmentStatusInput } from '@/module/appointment/types/appointment-schemas';

export const APPOINTMENT_STATUS_CONFIG: Record<
  AppointmentStatusInput,
  { labelKey: string; className: string }
> = {
  PENDING: {
    labelKey: 'appointmentStatus.PENDING',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  CONFIRMED: {
    labelKey: 'appointmentStatus.CONFIRMED',
    className:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  },
  COMPLETED: {
    labelKey: 'appointmentStatus.COMPLETED',
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  CANCELLED: {
    labelKey: 'appointmentStatus.CANCELLED',
    className:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  NO_SHOW: {
    labelKey: 'appointmentStatus.NO_SHOW',
    className:
      'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
};
