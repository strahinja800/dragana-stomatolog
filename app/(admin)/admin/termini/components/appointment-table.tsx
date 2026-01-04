'use client';

import { useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import {
  CalendarClock,
  Check,
  Clock,
  MoreHorizontal,
  Phone,
  RefreshCw,
  User,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

import { ConfirmDialog } from './confirm-dialog';
import { RejectDialog } from './reject-dialog';
import { RescheduleDialog } from './reschedule-dialog';

type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW';

interface AppointmentTableProps {
  statusFilter?: AppointmentStatus;
}

const STATUS_CONFIG: Record<
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

type Appointment = {
  id: string;
  startTime: Date;
  endTime: Date;
  phone: string | null;
  symptoms: string | null;
  status: AppointmentStatus;
  rejectionReason: string | null;
  patient: {
    id: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
  } | null;
  serviceType: {
    id: string;
    name: string;
    durationMinutes: number;
  } | null;
};

export function AppointmentTable({ statusFilter }: AppointmentTableProps) {
  const trpc = useTRPC();

  const [confirmAppointment, setConfirmAppointment] =
    useState<Appointment | null>(null);
  const [rejectAppointment, setRejectAppointment] =
    useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] =
    useState<Appointment | null>(null);

  const { data } = useSuspenseQuery(
    trpc.appointment.getAllAppointments.queryOptions({
      status: statusFilter,
    })
  );

  const appointments = (data as { appointments: Appointment[] }).appointments;

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
          <CalendarClock className="size-7 text-muted-foreground" />
        </div>
        <p className="font-medium text-muted-foreground">Nema termina</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground/70">
          {statusFilter === 'PENDING'
            ? 'Trenutno nema zahteva na čekanju'
            : statusFilter === 'CONFIRMED'
              ? 'Nema potvrđenih termina'
              : statusFilter === 'CANCELLED'
                ? 'Nema odbijenih termina'
                : 'Nema zakazanih termina'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px]">Pacijent</TableHead>
              <TableHead className="w-[130px]">Telefon</TableHead>
              <TableHead className="w-[180px]">Datum i vreme</TableHead>
              <TableHead className="hidden w-[200px] lg:table-cell">
                Simptomi
              </TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[80px] text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => {
              const statusConfig = STATUS_CONFIG[appointment.status];
              const patientName = appointment.patient
                ? `${appointment.patient.firstName} ${appointment.patient.lastName || ''}`.trim()
                : 'Nepoznat';

              return (
                <TableRow
                  key={appointment.id}
                  className={cn(
                    'group transition-colors',
                    appointment.status === 'PENDING' &&
                      'bg-amber-50/50 dark:bg-amber-950/10'
                  )}
                >
                  {/* Patient */}
                  <TableCell>
                    <div className="flex items-center gap-3">
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
                  </TableCell>

                  {/* Phone */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="size-3.5" />
                      <span className="text-sm">
                        {appointment.phone || appointment.patient?.phone || '—'}
                      </span>
                    </div>
                  </TableCell>

                  {/* Date & Time */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-medium">
                        <CalendarClock className="size-3.5 text-muted-foreground" />
                        <span>
                          {format(
                            new Date(appointment.startTime),
                            'd. MMM yyyy.',
                            { locale: sr }
                          )}
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
                  </TableCell>

                  {/* Symptoms */}
                  <TableCell className="hidden lg:table-cell">
                    <p className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {appointment.symptoms || '—'}
                    </p>
                    {appointment.rejectionReason && (
                      <p className="mt-0.5 max-w-[200px] truncate text-xs text-red-600 dark:text-red-400">
                        Razlog: {appointment.rejectionReason}
                      </p>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'font-medium transition-colors',
                        statusConfig.className
                      )}
                    >
                      {statusConfig.label}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    {appointment.status === 'PENDING' ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => setConfirmAppointment(appointment)}
                            className="text-emerald-600 focus:text-emerald-600 dark:text-emerald-400"
                          >
                            <Check className="mr-2 size-4" />
                            Potvrdi termin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setRescheduleAppointment(appointment)
                            }
                          >
                            <RefreshCw className="mr-2 size-4" />
                            Predloži drugo vreme
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setRejectAppointment(appointment)}
                            className="text-destructive focus:text-destructive"
                          >
                            <X className="mr-2 size-4" />
                            Odbij termin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              setRescheduleAppointment(appointment)
                            }
                          >
                            <RefreshCw className="mr-2 size-4" />
                            Promeni vreme
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        appointment={confirmAppointment}
        onClose={() => setConfirmAppointment(null)}
      />
      <RejectDialog
        appointment={rejectAppointment}
        onClose={() => setRejectAppointment(null)}
      />
      <RescheduleDialog
        appointment={rescheduleAppointment}
        onClose={() => setRescheduleAppointment(null)}
      />
    </>
  );
}
