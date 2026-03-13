'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Clock, User } from '@/constants/icons';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Na čekanju',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  CONFIRMED: {
    label: 'Potvrđen',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  },
  COMPLETED: {
    label: 'Završen',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  CANCELLED: {
    label: 'Odbijen',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  NO_SHOW: {
    label: 'Nije došao',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
};

export function DashboardTodaysSchedule() {
  const trpc = useTRPC();
  const { data: appointments } = useSuspenseQuery(
    trpc.appointment.getToday.queryOptions()
  );

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <CalendarClock className="size-5 text-primary" />
          Današnji raspored
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {appointments.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted-foreground">
            Nema zakazanih termina za danas.
          </p>
        ) : (
          <ul className="divide-y divide-border/50">
            {appointments.map((appointment) => {
              const status = appointment.status as AppointmentStatus;
              const statusConfig = STATUS_CONFIG[status];
              const patientName = appointment.patient
                ? `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim()
                : 'Nepoznat';

              return (
                <li
                  key={appointment.id}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{patientName}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {appointment.serviceType?.name ?? '—'}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="size-3.5" />
                      <span>
                        {format(new Date(appointment.startTime), 'HH:mm')} –{' '}
                        {format(new Date(appointment.endTime), 'HH:mm')}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn('text-xs font-medium', statusConfig.className)}
                    >
                      {statusConfig.label}
                    </Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
