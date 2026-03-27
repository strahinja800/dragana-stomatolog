'use client';

import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Clock, User } from '@/constants/icons';
import { cn } from '@/lib/utils';
import { APPOINTMENT_STATUS_CONFIG } from '@/module/appointment/constants/appointment-status-config';
import type { AppointmentStatusInput } from '@/module/appointment/types/appointment-schemas';
import { useTRPC } from '@/trpc/client';

export function DashboardTodaysSchedule() {
  const trpc = useTRPC();
  const { data: appointments } = useSuspenseQuery(
    trpc.appointment.getToday.queryOptions()
  );

  return (
    <Card className="border-border/50 py-0 shadow-sm">
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
              const status = appointment.status as AppointmentStatusInput;
              const statusConfig = APPOINTMENT_STATUS_CONFIG[status];
              const patientName = appointment.patient
                ? `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim()
                : 'Nepoznat';

              return (
                <li key={appointment.id}>
                  <Link
                    href={`/admin/patients/${appointment.patient?.id}`}
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
                        className={cn(
                          'text-xs font-medium',
                          statusConfig.className
                        )}
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
