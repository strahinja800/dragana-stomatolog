'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { CalendarClock, Clock, Phone, User } from 'lucide-react';

import { SortableHeader } from '@/components/shared/table/sortable-header';
import { Badge } from '@/components/ui/badge';
import { type Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

import { AppointmentTableRowActions } from './appointment-table-row-actions';

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

export const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: 'Na čekanju',
    className:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  CONFIRMED: {
    label: 'Potvrđen',
    className:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  },
  CANCELLED: {
    label: 'Odbijen',
    className:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  COMPLETED: {
    label: 'Završen',
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  NO_SHOW: {
    label: 'Nije došao',
    className:
      'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
};

export type Appointment = {
  _id: Id<'appointments'>;
  startTime: number;
  endTime: number;
  phone?: string | null;
  symptoms?: string | null;
  status: AppointmentStatus;
  rejectionReason?: string | null;
  patient: {
    _id: Id<'patients'>;
    firstName: string;
    lastName: string;
    phone?: string | null;
  } | null;
  serviceType: {
    _id: Id<'serviceTypes'>;
    name: string;
    durationMinutes: number;
  } | null;
};

export interface AppointmentTableMeta {
  onConfirm?: (appointment: Appointment) => void;
  onReject?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
}

export const columns: ColumnDef<Appointment>[] = [
  {
    id: 'patient',
    accessorFn: (row) =>
      row.patient
        ? `${row.patient.firstName} ${row.patient.lastName || ''}`.trim()
        : 'Nepoznat',
    header: ({ column }) => <SortableHeader column={column} label="Pacijent" />,
    cell: ({ row }) => {
      const appointment = row.original;
      const patientName = appointment.patient
        ? `${appointment.patient.firstName} ${appointment.patient.lastName || ''}`.trim()
        : 'Nepoznat';

      return (
        <div className="flex items-center gap-3 ml-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{patientName}</p>
            {appointment.serviceType && (
              <p className="truncate text-xs text-muted-foreground">
                {appointment.serviceType.name}
              </p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: 'phone',
    accessorFn: (row) => row.phone || row.patient?.phone || '',
    header: 'Telefon',
    cell: ({ row }) => {
      const appointment = row.original;
      const phone = appointment.phone || appointment.patient?.phone || '—';

      return (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Phone className="size-3.5" />
          <span className="text-sm">{phone}</span>
        </div>
      );
    },
  },
  {
    id: 'dateTime',
    accessorKey: 'startTime',
    header: ({ column }) => (
      <SortableHeader column={column} label="Datum i vreme" />
    ),
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div className="space-y-0.5 ml-5">
          <div className="flex items-center gap-1.5 font-medium">
            <CalendarClock className="size-3.5 text-muted-foreground" />
            <span>
              {format(new Date(appointment.startTime), 'd. MMM yyyy.', {
                locale: sr,
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            <span>
              {format(new Date(appointment.startTime), 'HH:mm')} -{' '}
              {format(new Date(appointment.endTime), 'HH:mm')}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'symptoms',
    header: 'Simptomi',
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <div>
          <p className="max-w-[200px] truncate text-sm text-muted-foreground">
            {appointment.symptoms || '—'}
          </p>
          {appointment.rejectionReason && (
            <p className="mt-0.5 max-w-[200px] truncate text-xs text-red-600 dark:text-red-400">
              Razlog: {appointment.rejectionReason}
            </p>
          )}
        </div>
      );
    },
    meta: {
      className: 'hidden lg:table-cell',
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as AppointmentStatus;
      const statusConfig = STATUS_CONFIG[status];

      return (
        <Badge
          variant="outline"
          className={cn(
            'font-medium transition-colors',
            statusConfig.className
          )}
        >
          {statusConfig.label}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const appointment = row.original;
      const meta = table.options.meta as AppointmentTableMeta | undefined;

      return (
        <AppointmentTableRowActions
          appointment={appointment}
          onConfirm={meta?.onConfirm}
          onReject={meta?.onReject}
          onReschedule={meta?.onReschedule}
        />
      );
    },
  },
];
