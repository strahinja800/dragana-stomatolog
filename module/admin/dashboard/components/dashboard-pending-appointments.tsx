'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { enUS, sr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, ExternalLink, User, X } from '@/constants/icons';
import { ConfirmDialog } from '@/module/admin/termini/components/confirm-dialog';
import { RejectDialog } from '@/module/admin/termini/components/reject-dialog';
import { useTRPC } from '@/trpc/client';

type PendingAppointment = {
  id: string;
  startTime: Date;
  patient: { firstName: string; lastName: string } | null;
};

export function DashboardPendingAppointments() {
  const t = useTranslations('admin.dashboard');
  const locale = useLocale();
  const dateLocale = locale === 'sr' ? sr : enUS;
  const trpc = useTRPC();
  const { data: pendingAppointments } = useSuspenseQuery(
    trpc.appointment.getPending.queryOptions()
  );

  const [confirming, setConfirming] = useState<PendingAppointment | null>(null);
  const [rejecting, setRejecting] = useState<PendingAppointment | null>(null);

  return (
    <>
      <Card className="border-border/50 py-0 shadow-sm">
        <CardHeader className="border-b bg-muted/30 px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="size-5 text-amber-500" />
            {t('pendingAppointments')}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground"
              asChild
            >
              <Link href="/admin/termini">
                <ExternalLink className="size-3.5" />
                {t('allAppointments')}
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {pendingAppointments.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              {t('noPendingAppointments')}
            </p>
          ) : (
            <ul className="divide-y divide-border/50">
              {pendingAppointments.map((appointment) => {
                const patientName = appointment.patient
                  ? `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim()
                  : t('unknown');

                return (
                  <li
                    key={appointment.id}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                      <User className="size-4 text-amber-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{patientName}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {appointment.symptoms ?? t('unknown')} ·{' '}
                        {format(new Date(appointment.startTime), 'd. MMM', {
                          locale: dateLocale,
                        })}{' '}
                        · {format(new Date(appointment.startTime), 'HH:mm')}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="size-8 p-0 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950"
                        onClick={() => setConfirming(appointment)}
                      >
                        <Check className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="size-8 p-0 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                        onClick={() => setRejecting(appointment)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        appointment={confirming}
        onClose={() => setConfirming(null)}
      />
      <RejectDialog
        appointment={rejecting}
        onClose={() => setRejecting(null)}
      />
    </>
  );
}
